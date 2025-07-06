package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.ProductVariant;
import lombok.Data;

@Data
public class ResDetailDTO {
    private ProductDTO product;
    private ProductVariantDTO variant;
    private long quantity;
    private double  cost_price;
    private double total_cost;
}
