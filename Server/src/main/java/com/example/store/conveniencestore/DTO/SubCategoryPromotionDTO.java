package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.PromotionSubCate;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SubCategoryPromotionDTO {
    private long subCategoryId;
    private String subCategoryName;
    public SubCategoryPromotionDTO(PromotionSubCate promotionSubCate){
        this.setSubCategoryId(promotionSubCate.getId());
        this.setSubCategoryName(promotionSubCate.getSubCategory().getSubCategoryName());
    }
}
