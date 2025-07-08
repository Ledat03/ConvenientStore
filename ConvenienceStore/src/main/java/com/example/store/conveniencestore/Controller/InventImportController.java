package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Service.ProductService;
import com.example.store.conveniencestore.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("import")
public class InventImportController {
    private final UserService userService;
    private final ProductService productService;

    public InventImportController(UserService userService, ProductService productService) {
        this.userService = userService;
        this.productService = productService;
    }

    private String getTime(LocalDateTime localDateTime) {
        String formattedTime = localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return formattedTime;
    }

    private ProductDTO convertProductToProductDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductId(product.getProductId());
        productDTO.setProductName(product.getProductName());
        productDTO.setProductDescription(product.getProductDescription());
        productDTO.setHowToUse(product.getHowToUse());
        productDTO.setPreserve(product.getPreserve());
        productDTO.setOrigin(product.getOrigin());
        productDTO.setCategory(product.getCategory().getCategoryName());
        productDTO.setSubCategory(product.getSubCategory().getSubCategoryName());
        productDTO.setIngredient(product.getIngredient());
        productDTO.setUpdateAt(getTime(product.getUpdatedAt()));
        productDTO.setImage(product.getImage());
        productDTO.setStatus(product.getStatus());
        productDTO.setIsActive(Boolean.toString(product.getIsActive()));
        productDTO.setBrand(product.getBrand().getBrandName());
        productDTO.setSku(product.getSku());
        List<ProductVariantDTO> temp = product.getProductVariant().stream().map(this::convertVariantToDTO).toList();
        productDTO.setProductVariant(temp);
        return productDTO;
    }

    public ProductVariantDTO convertVariantToDTO(ProductVariant product) {
        ProductVariantDTO productVariantDTO = new ProductVariantDTO();
        productVariantDTO.setId(product.getVariantId());
        productVariantDTO.setProductId(product.getProduct().getProductId());
        productVariantDTO.setProductImage(product.getProductImage());
        productVariantDTO.setStock(product.getStock());
        productVariantDTO.setPrice(product.getPrice());
        productVariantDTO.setSalePrice(product.getSalePrice());
        productVariantDTO.setCalUnit(product.getCalUnit());
        productVariantDTO.setSkuCode(product.getSkuCode());
        productVariantDTO.setIsActive(product.getIsActive());
        return productVariantDTO;
    }

    public InventoryImportDetail convertDTOToEntity(InventDetailDTO inventDetailDTO, InventoryImport inventoryImport) {
        InventoryImportDetail detail = new InventoryImportDetail();
        Product product = productService.findProductById(inventDetailDTO.getProductId());
        ProductVariant variant = productService.findProductVariantById(inventDetailDTO.getVariantId());
        variant.setStock(variant.getStock() + inventDetailDTO.getQuantity());
        productService.saveVariant(variant);
        detail.setProduct(product);
        detail.setVariant(variant);
        detail.setQuantity(inventDetailDTO.getQuantity());
        detail.setCost_price(inventDetailDTO.getCost_price());
        detail.setTotal_cost(inventDetailDTO.getTotal_cost());
        detail.setInventImport(inventoryImport);
        return detail;
    }

    public ResInventDTO convertEntityToResDTO(InventoryImport inventoryImport) {
        ResInventDTO resInventDTO = new ResInventDTO();
        List<ResDetailDTO> resDetailDTOS = inventoryImport.getInventoryImportDetails().stream().map(this::convertEntityToResDetailDTO).toList();
        resInventDTO.setInventoryImportDetails(resDetailDTOS);
        resInventDTO.setImportId(inventoryImport.getImportId());
        resInventDTO.setImportCode(inventoryImport.getImportCode());
        resInventDTO.setImportNote(inventoryImport.getImportNote());
        resInventDTO.setImportDate(inventoryImport.getImportDate());
        resInventDTO.setUsername(inventoryImport.getUser().getUsername());
        return resInventDTO;
    }

    public ResDetailDTO convertEntityToResDetailDTO(InventoryImportDetail inventoryImportDetail) {
        ResDetailDTO resDetailDTO = new ResDetailDTO();
        resDetailDTO.setProduct(convertProductToProductDTO(inventoryImportDetail.getProduct()));
        resDetailDTO.setVariant(convertVariantToDTO(inventoryImportDetail.getVariant()));
        resDetailDTO.setQuantity(inventoryImportDetail.getQuantity());
        resDetailDTO.setCost_price(inventoryImportDetail.getCost_price());
        resDetailDTO.setTotal_cost(inventoryImportDetail.getTotal_cost());
        return resDetailDTO;
    }

    @PostMapping("/add")
    public ResponseEntity<Object> addInventory(@RequestBody InventDTO inventDTO) {
        if (inventDTO != null) {
            User user = userService.findById(inventDTO.getUserId());
            InventoryImport inventoryImport = new InventoryImport();
            inventoryImport.setImportCode(inventDTO.getImportCode());
            inventoryImport.setImportNote(inventDTO.getImportNote());
            inventoryImport.setImportDate(LocalDateTime.now());
            inventoryImport.setUser(user);
            List<InventoryImportDetail> details = new ArrayList<>();
            for (InventDetailDTO dto : inventDTO.getInventoryImportDetails()) {
                InventoryImportDetail detail = convertDTOToEntity(dto, inventoryImport);
                details.add(detail);
            }
            inventoryImport.setInventoryImportDetails(details);
            productService.saveInventoryImport(inventoryImport);
            return ResponseEntity.ok("Lưu thành công");
        }

        return ResponseEntity.badRequest().body("Không thể lưu");
    }

    @GetMapping("/view")
    public ResponseEntity<Object> viewInventory() {
        List<InventoryImport> inventoryImports = productService.findAllInventoryImports();
        List<ResInventDTO> resInventDTOS = inventoryImports.stream().map(this::convertEntityToResDTO).toList();
        return ResponseEntity.ok(resInventDTOS);
    }

    @PutMapping("/update")
    public ResponseEntity<Object> updateInventory(@RequestBody InventDTO inventDTO) {
        if (inventDTO != null) {
            InventoryImport inventoryImport = productService.findInventoryImportById(inventDTO.getImportId());
            if (inventoryImport != null) {
                inventoryImport.setImportCode(inventDTO.getImportCode());
                inventoryImport.setImportNote(inventDTO.getImportNote());
                inventoryImport.setImportDate(LocalDateTime.now());
                inventoryImport.setUser(userService.findById(inventDTO.getUserId()));
                List<InventoryImportDetail> details = new ArrayList<>();
                for (InventDetailDTO dto : inventDTO.getInventoryImportDetails()) {
                    InventoryImportDetail detail = convertDTOToEntity(dto, inventoryImport);
                    details.add(detail);
                }
                inventoryImport.getInventoryImportDetails().clear();
                inventoryImport.getInventoryImportDetails().addAll(details);
                productService.saveInventoryImport(inventoryImport);
                return ResponseEntity.ok("Sửa thành công");
            }
        }
        return ResponseEntity.ok("Sửa thất bại");
    }
    @DeleteMapping("/delete")
    public ResponseEntity<Object> deleteInventory(@RequestParam("id") long id) {
        InventoryImport inventoryImport = productService.findInventoryImportById(id);
        if (inventoryImport != null) {
            productService.deleteInventoryImport(inventoryImport);
            return ResponseEntity.ok("Xóa thông tin thành công !");
        }
        return ResponseEntity.badRequest().build();
    }
}