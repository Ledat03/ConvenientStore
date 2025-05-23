package com.example.store.conveniencestore.Domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "Products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long productId;
    private String productName;
    private String productDescription;
    private String origin;
    private String ingredient;
    private String howToUse;
    private String preserve;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subCategoryId")
    private SubCategory subCategory;
    @OneToMany(mappedBy = "product")
    private List<ProductVariant> productVariant;

}
