package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Service.ProductService;
import com.example.store.conveniencestore.Service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    public ProductDTO convertProductToProductDTO(Product product) {
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
        List<ProductVariantDTO> temp = product.getProductVariant().stream().map(ProductVariantDTO::new).toList();
        productDTO.setProductVariant(temp);
        return productDTO;
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
            return ResponseEntity.ok("Information has been saved successfully!");
        }

        return ResponseEntity.badRequest().body("Something went wrong!");
    }

    @GetMapping("/view")
    public ResponseEntity<Object> viewInventory() {
        List<InventoryImport> inventoryImports = productService.findAllInventoryImports();
        List<ResInventDTO> resInventDTOS = inventoryImports.stream().map(ResInventDTO::new).toList();
        return ResponseEntity.ok(resInventDTOS);
    }

    @PutMapping("/update")
    public ResponseEntity<Object> updateInventory(@RequestBody InventDTO inventDTO) {
        if (inventDTO != null) {
            InventoryImport inventoryImport = productService.findInventoryImportById(inventDTO.getImportId());
            if (inventoryImport != null) {
                for (InventoryImportDetail oldDetail : inventoryImport.getInventoryImportDetails()) {
                    ProductVariant variant = oldDetail.getVariant();
                    if (variant != null) {
                        variant.setStock(variant.getStock() - oldDetail.getQuantity());
                        productService.saveVariant(variant);
                    }
                }
                inventoryImport.setImportCode(inventDTO.getImportCode());
                inventoryImport.setImportNote(inventDTO.getImportNote());
                inventoryImport.setImportDate(LocalDateTime.now());
                inventoryImport.setUser(userService.findById(inventDTO.getUserId()));

                List<InventoryImportDetail> details = new ArrayList<>();
                for (InventDetailDTO dto : inventDTO.getInventoryImportDetails()) {
                    InventoryImportDetail detail = convertDTOToEntity(dto, inventoryImport);

                    ProductVariant variant = detail.getVariant();
                    if (variant != null) {
                        variant.setStock(detail.getQuantity());
                        productService.saveVariant(variant);
                    }

                    details.add(detail);
                }
                inventoryImport.getInventoryImportDetails().clear();
                inventoryImport.getInventoryImportDetails().addAll(details);
                productService.saveInventoryImport(inventoryImport);

                return ResponseEntity.ok("Update succesfully!");
            }
        }
        return ResponseEntity.ok("Something went wrong!");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Object> deleteInventory(@RequestParam("id") long id) {
        InventoryImport inventoryImport = productService.findInventoryImportById(id);

        if (inventoryImport != null) {
            for (InventoryImportDetail detail : inventoryImport.getInventoryImportDetails()) {
                ProductVariant variant = detail.getVariant();
                if (variant.getStock() < detail.getQuantity()) {
                    return ResponseEntity.badRequest().body("Cant't delete because quantity is lower than stock!");
                }
                if (variant != null) {
                    variant.setStock(variant.getStock() - detail.getQuantity());
                    productService.saveVariant(variant);
                }
            }

            productService.deleteInventoryImport(inventoryImport);
            return ResponseEntity.ok("Delete succesfully! !");
        }
        return ResponseEntity.badRequest().body("Can't find inventory!");
    }
    @GetMapping("/filter")
    public  ResponseEntity<PageRestsponse<List<ResInventDTO>>> getIIByFilter(@RequestParam(value = "code",required = false) String code,
                                                       @RequestParam(value = "days",required = false,defaultValue = "0") int days,
                                                       @RequestParam(value = "page",defaultValue = "0") int page){
        Pageable  pageable = PageRequest.of(page,5);
        Page<InventoryImport> data = productService.getIIByFilter(code,days,pageable);
        List<ResInventDTO> resInventDTOS = data.stream().map(ResInventDTO::new).toList();
        PageRestsponse pageRestsponse = new PageRestsponse(resInventDTOS,data.getTotalElements());
        return ResponseEntity.ok(pageRestsponse);
    }
}
