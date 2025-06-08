package com.example.store.conveniencestore.Domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "Product_Variants")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long variantId;
    private double price;
    private double salePrice;
    private long stock;
    private String calUnit;
    private String skuCode;
    private String isActive;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private Product product;
    @ElementCollection
    private List<String> productImage;
}
