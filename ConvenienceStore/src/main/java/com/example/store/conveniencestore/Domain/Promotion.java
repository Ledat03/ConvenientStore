package com.example.store.conveniencestore.Domain;

import com.example.store.conveniencestore.EnumType.DiscountScope;
import com.example.store.conveniencestore.EnumType.PromotionType;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long couponId;
    private String code;
    private String name;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    @Enumerated(EnumType.STRING)
    private PromotionType type;
    @Enumerated(EnumType.STRING)
    private DiscountScope scope;
    private long discountValue;
    private long maxDiscount;
    private long minOrderValue;
    private int usageLimit;
    private int usedCount;
    private int userUsageLimit;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<PromotionProduct> promotionProducts;

    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<PromotionCategory> couponCategories;

    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<PromotionSubCate> promotionSubCates;

    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<PromotionBrand> promotionBrands;

    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<PromotionUser> promotionUsers;
}
