package com.example.store.conveniencestore.Domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "Product_Variants")
public class ProductVariant {
    @Id
    private String productVariantId;
    private double price;
    private double salePrice;
    private String status;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productId")
    private Product product;
    @ElementCollection
    private List<String> productImage;
}
