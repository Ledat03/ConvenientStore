package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.EnumType.DiscountScope;
import com.example.store.conveniencestore.EnumType.PromotionType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PromotionDTO {
    private long id;
    private String code;
    private String name;
    private String description;
    private PromotionType type;
    private DiscountScope scope;
    private long discountValue;
    private long maxDiscount;
    private long minOrderValue;
    private int usageLimit;
    private int userUsageLimit;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<ProductPromotionDTO> promotionProducts;
    private List<CategoryPromotionDTO> promotionCategories;
    private List<SubCategoryPromotionDTO> promotionSubCategory;
    private List<BrandPromotionDTO> promotionBrand;

}
