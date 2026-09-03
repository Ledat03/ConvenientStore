package com.example.store.conveniencestore.DTO;

import java.util.ArrayList;

import com.example.store.conveniencestore.Domain.ProductVariant;
import com.example.store.conveniencestore.Domain.SubCategory;
import com.example.store.conveniencestore.DTO.ProductVariantDTO;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

import com.example.store.conveniencestore.Domain.Product;

@Data
public class ProductDTO {

    private long productId;
    private String productName;
    private String productDescription;
    private String origin;
    private String ingredient;
    private String howToUse;
    private String preserve;
    private String category;
    private String subCategory;
    private String updateAt;
    private String image;
    private String sku;
    private String brand;
    private String isActive;
    private String status;
    private List<ProductVariantDTO> productVariant;

    public ProductDTO() {
    }

    public ProductDTO(Product product) {
        this.productId = product.getProductId();
        this.productName = product.getProductName();
        this.productDescription = product.getProductDescription();
        this.origin = product.getOrigin();
        this.ingredient = product.getIngredient();
        this.howToUse = product.getHowToUse();
        this.preserve = product.getPreserve();
        this.category = product.getCategory().getCategoryName();
        this.subCategory = product.getSubCategory().getSubCategoryName();
        this.updateAt = product.getUpdatedAt().toString();
        this.image = product.getImage();
        this.sku = product.getSku();
        this.brand = product.getBrand().getBrandName();
        this.isActive = product.getIsActive().toString();
        this.status = product.getStatus();
        this.productVariant = product.getProductVariant().stream().map(ProductVariantDTO::new).toList();

    }
}
