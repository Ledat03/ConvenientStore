package com.example.store.conveniencestore.DTO;

import jakarta.persistence.ElementCollection;

import java.util.List;

public class ProductVariantDTO {
    private String productVariantId;
    private double price;
    private double salePrice;
    private String status;
    @ElementCollection
    private List<String> productImage;
}
