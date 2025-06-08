package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.ProductVariant;
import com.example.store.conveniencestore.Domain.SubCategory;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

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
}
