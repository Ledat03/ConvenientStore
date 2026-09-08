package com.example.store.conveniencestore.DTO;

import jakarta.persistence.ElementCollection;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import com.example.store.conveniencestore.Domain.ProductVariant;

import java.util.List;

@Data
public class ProductVariantDTO {

    private long id;
    private Double price;
    private Double salePrice;
    private long stock;
    private String calUnit;
    private String isActive;
    private String skuCode;
    private long productId;
    private List<String> productImage;
    public  ProductVariantDTO() {}
    public ProductVariantDTO(ProductVariant productVariant) {
        this.id = productVariant.getVariantId();
        this.price = productVariant.getPrice();
        this.salePrice = productVariant.getSalePrice();
        this.stock = productVariant.getStock();
        this.calUnit = productVariant.getCalUnit();
        this.isActive = productVariant.getIsActive();
        this.skuCode = productVariant.getSkuCode();
        this.productId = productVariant.getProduct().getProductId();
        this.productImage = productVariant.getProductImage();
    }

    public static ProductVariantDTO convertPVToDTO(ProductVariant productVariant) {
        ProductVariantDTO productVariantDTO = new ProductVariantDTO();
        productVariantDTO.setId(productVariant.getVariantId());
        productVariantDTO.setProductId(productVariant.getVariantId());
        productVariantDTO.setPrice(productVariant.getPrice());
        productVariantDTO.setSalePrice(productVariant.getSalePrice());
        productVariantDTO.setCalUnit(productVariant.getCalUnit());
        productVariantDTO.setSkuCode(productVariant.getSkuCode());
        productVariantDTO.setProductImage(productVariant.getProductImage());
        return productVariantDTO;
    }
    public static ProductVariantDTO convertPVToResDTO(ProductVariant product) {
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
}
