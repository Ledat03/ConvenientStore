package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.ProductDTO;
import com.example.store.conveniencestore.DTO.ProductVariantDTO;
import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.ProductVariant;
import com.example.store.conveniencestore.Service.CloudinaryService;
import com.example.store.conveniencestore.Service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.store.conveniencestore.Service.CloudinaryService.UploadResult;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("variant")
@RequiredArgsConstructor
public class VariantController {
    private final CloudinaryService CloudinaryService;
    private final ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<Object> addVariant(@RequestParam(value = "price") String price ,
                                             @RequestParam(value = "productId") String productId,
                                             @RequestParam(value = "salePrice") String salePrice ,
                                             @RequestParam(value = "stock") String stock ,
                                             @RequestParam(value = "calUnit") String calUnit,
                                             @RequestParam(value = "skuCode" , required = false) String sku,
                                             @RequestParam(value = "isActive" , required = false) String isActive ,
                                             @RequestParam(value = "productImage") List<MultipartFile> Images ) throws IOException {
        List<UploadResult> uploadResults = CloudinaryService.uploadMultipleImages(Images , "variant");
        ProductVariant productVariant = new ProductVariant();
        List<String> ImageURL = new ArrayList<>();
        for(UploadResult uploadResult : uploadResults) {
            ImageURL.add(uploadResult.getUrl());
            System.out.print(uploadResult.getFileSize() + " " + uploadResult.getUrl() + " " + uploadResult.getPublicId());
        }
         productVariant.setPrice(Double.parseDouble(price));
         productVariant.setSalePrice(Double.parseDouble(salePrice));
         productVariant.setStock(Integer.parseInt(stock));
         productVariant.setProduct(productService.findProductById(Long.parseLong(productId)));
         productVariant.setCalUnit(calUnit);
         productVariant.setIsActive(isActive);
         productVariant.setSkuCode(sku);
         productVariant.setProductImage(ImageURL);
         productService.saveVariant(productVariant);
         ProductVariantDTO productVariantDTO = ProductVariantDTO.convertPVToResDTO(productVariant);
        return ResponseEntity.ok(productVariantDTO);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<Object> getVariant(@PathVariable long id) {
        Product product = productService.findProductById(id);
        List<ProductVariant> productVariant = product.getProductVariant();
        List<ProductVariantDTO> variantDTOList = productVariant.stream().map(ProductVariantDTO::convertPVToResDTO).toList();
        return ResponseEntity.ok(variantDTOList);
    }

    @PutMapping("/update")
    public ResponseEntity<Object> updateVariant(@RequestParam(value = "variantId" , required = false) String Id ,
                                                @RequestParam(value = "price" , required = false) String price ,
                                                @RequestParam(value = "productId" , required = false) String productId,
                                                @RequestParam(value = "salePrice" , required = false) String salePrice ,
                                                @RequestParam(value = "stock" , required = false) String stock ,
                                                @RequestParam(value = "calUnit" , required = false) String calUnit,
                                                @RequestParam(value = "skuCode" , required = false) String sku,
                                                @RequestParam(value = "isActive" , required = false) String isActive ,
                                                @RequestParam(value = "productImage" , required = false) List<MultipartFile> Images) throws IOException{
        ProductVariant productVariant = productService.findProductVariantById(Long.parseLong(Id));
        ProductVariantDTO productVariantDTO;
        if( productVariant != null) {
            List<String> ImageURL = productVariant.getProductImage();
            if( Images != null) {
                List<UploadResult> uploadResults = CloudinaryService.uploadMultipleImages(Images, "variant");
                for (UploadResult uploadResult : uploadResults) {
                    ImageURL.add(uploadResult.getUrl());
                    System.out.print(uploadResult.getFileSize() + " " + uploadResult.getUrl() + " " + uploadResult.getPublicId());
                }
            }
            productVariant.setPrice(!price.isEmpty() ? Double.parseDouble(price) : productVariant.getPrice());
            productVariant.setSalePrice(!salePrice.isEmpty() ? Double.parseDouble(salePrice) : productVariant.getSalePrice());
            productVariant.setStock(!stock.isEmpty() ? Integer.parseInt(stock) : productVariant.getStock());
            productVariant.setProduct(productService.findProductById(Long.parseLong(productId)));
            productVariant.setCalUnit(!calUnit.isEmpty() ? calUnit : productVariant.getCalUnit());
            productVariant.setSkuCode(!sku.isEmpty() ? sku : productVariant.getSkuCode());
            productVariant.setIsActive(!isActive.isEmpty() ? isActive : productVariant.getIsActive());
            productVariant.setProductImage(ImageURL);
            productService.saveVariant(productVariant);
            productVariantDTO = ProductVariantDTO.convertPVToResDTO(productVariant);
        }else {
            return ResponseEntity.ofNullable("Variant not found");
        }
        return ResponseEntity.ok(productVariantDTO);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteVariant(@PathVariable long id) {
        try {
            ProductVariant productVariant = productService.findProductVariantById(id);
            if (productVariant == null) {
                return ResponseEntity.notFound().build();
            }
            List<String> imagesURL = productVariant.getProductImage();
            if (imagesURL != null && !imagesURL.isEmpty()) {
                List<String> publicIds = new ArrayList<>();
                for (String url : imagesURL) {
                    String publicId = CloudinaryService.extractPublicIdFromCloudinaryUrl(url);
                    if (publicId != null) {
                        publicIds.add(publicId);
                        System.out.println("Extracted publicId: " + publicId + " from URL: " + url);
                    } else {
                        System.err.println("Failed to extract publicId from URL: " + url);
                    }
                }
                for (String publicId : publicIds) {
                    boolean deleted = CloudinaryService.deleteImage(publicId);
                }
            }
            productService.deleteVariant(productVariant);
            return ResponseEntity.ok("Delete Variant Successfully !");
        } catch (Exception e) {
            System.err.println("Error deleting variant: " + e.getMessage());
            return ResponseEntity.status(500).body("Can't delete the images !");
        }
    }


}
