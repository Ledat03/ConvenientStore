package com.example.store.conveniencestore.Domain;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "Products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long productId;
    private String productName;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String productDescription;
    private String origin;
    private String ingredient;
    private String howToUse;
    private String preserve;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;
    private String sku;
    private Boolean isActive;
    private String status;
    private String image;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subCategory_id")
    private SubCategory subCategory;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    @OneToMany(mappedBy = "product")
    private List<ProductVariant> productVariant;
    @OneToMany(mappedBy = "product")
    private List<CartDetail> cartDetails;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
