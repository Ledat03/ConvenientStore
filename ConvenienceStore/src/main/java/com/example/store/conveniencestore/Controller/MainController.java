package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.ProductDTO;
import com.example.store.conveniencestore.DTO.ProductVariantDTO;
import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.ProductVariant;
import com.example.store.conveniencestore.Domain.User;
import com.example.store.conveniencestore.Service.ProductService;
import com.example.store.conveniencestore.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
public class MainController {

    private final UserService userService;
    private final ProductService productService;
    public MainController(UserService userService,  ProductService productService) {
        this.userService = userService;
        this.productService = productService;
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
    @GetMapping("/")
    public ResponseEntity<Object> index() {
        List<Product> productList = productService.findAllProducts();
        List<ProductDTO> productDTOs =  productList.stream().map(this::convertProductToProductDTO).toList();
        return ResponseEntity.ok(productDTOs);
    }
}
