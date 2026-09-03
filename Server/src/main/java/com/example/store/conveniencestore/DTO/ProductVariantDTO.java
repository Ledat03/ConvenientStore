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
}
