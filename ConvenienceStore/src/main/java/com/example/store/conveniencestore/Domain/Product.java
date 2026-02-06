package com.example.store.conveniencestore.Domain;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import javax.swing.text.View;

import com.example.store.conveniencestore.View.ViewsConfig;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;

@Entity
@Data
@Table(name = "Products")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
    @JsonManagedReference
    private Category category;
    @OneToMany(mappedBy = "product")
    @JsonManagedReference
    private List<ProductVariant> productVariant;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
