package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.Promotion;
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
    private List<UserPromotionDTO> promotionUser;
    PromotionDTO(){}
    public PromotionDTO(Promotion promotion){
        this.setId(promotion.getCouponId());
        this.setName(promotion.getName());
        this.setCode(promotion.getCode());
        this.setDescription(promotion.getDescription());
        this.setType(promotion.getType());
        this.setScope(promotion.getScope());
        this.setDiscountValue(promotion.getDiscountValue());
        this.setMaxDiscount(promotion.getMaxDiscount());
        this.setMinOrderValue(promotion.getMinOrderValue());
        this.setUsageLimit(promotion.getUsageLimit());
        this.setStartDate(promotion.getStartDate());
        this.setEndDate(promotion.getEndDate());
        this.setActive(promotion.isActive());
        if(promotion.getPromotionBrands() != null && !promotion.getPromotionBrands().isEmpty()) {
            List<BrandPromotionDTO> brandPromotionDTOs = promotion.getPromotionBrands().stream().map(BrandPromotionDTO::new).toList();
            this.setPromotionBrand(brandPromotionDTOs);
        }else if(promotion.getPromotionProducts() != null && !promotion.getPromotionProducts().isEmpty()) {
            List<ProductPromotionDTO> promotionDTOs = promotion.getPromotionProducts().stream().map(ProductPromotionDTO::new).toList();
            this.setPromotionProducts(promotionDTOs);
        }else if(promotion.getCouponCategories() != null && !promotion.getCouponCategories().isEmpty()) {
            List<CategoryPromotionDTO> promotionDTOs = promotion.getCouponCategories().stream().map(CategoryPromotionDTO::new).toList();
            this.setPromotionCategories(promotionDTOs);
        }else if(promotion.getPromotionSubCates() != null && !promotion.getPromotionSubCates().isEmpty()) {
            List<SubCategoryPromotionDTO> promotionDTOs = promotion.getPromotionSubCates().stream().map(SubCategoryPromotionDTO::new).toList();
            this.setPromotionSubCategory(promotionDTOs);
        }
        if(promotion.getPromotionUsers() != null && !promotion.getPromotionUsers().isEmpty()) {
            List<UserPromotionDTO> promotionDTOs = promotion.getPromotionUsers().stream().map(UserPromotionDTO::new).toList();
            this.setPromotionUser(promotionDTOs);
        }
    }
}
