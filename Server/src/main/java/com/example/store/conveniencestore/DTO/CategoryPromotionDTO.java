package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.PromotionCategory;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CategoryPromotionDTO {
    private long categoryId;
    private String categoryName;
    public CategoryPromotionDTO(PromotionCategory promotionCategory){
        this.setCategoryId(promotionCategory.getCategory().getCategory_id());
        this.setCategoryName(promotionCategory.getCategory().getCategoryName());
    }
}
