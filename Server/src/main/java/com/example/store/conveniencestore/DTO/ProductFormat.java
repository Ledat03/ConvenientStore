package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.ProductVariant;
import lombok.Data;

import java.util.List;

@Data
public class ProductFormat {
    private long id;
    private Double price;
    private Double salePrice;
    private long stock;
    private String calUnit;
    private String isActive;
    private String skuCode;
    private long productId;
    private String productName;
    private String brand;
    private String subCategory;
    private Boolean isValid;
    private String status;
    private String image;
    private List<String> productImage;
    public ProductFormat(){}
    public ProductFormat(ProductVariant productVariant){
        this.id = productVariant.getVariantId();
        this.price = productVariant.getPrice();
        this.salePrice = productVariant.getSalePrice();
        this.stock = productVariant.getStock();
        this.calUnit = productVariant.getCalUnit();
        this.isActive = productVariant.getIsActive();
        this.skuCode = productVariant.getSkuCode();
        this.productId = productVariant.getProduct().getProductId();
        this.productImage = productVariant.getProductImage();
        this.brand = productVariant.getProduct().getBrand().getBrandName();
        this.subCategory = productVariant.getProduct().getSubCategory().getSubCategoryName();
        this.productName = productVariant.getProduct().getProductName();
        this.isValid = productVariant.getProduct().getIsActive();
        this.status = productVariant.getProduct().getStatus();
        this.image = productVariant.getProduct().getImage();
    }
}
