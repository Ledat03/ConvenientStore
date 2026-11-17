package com.example.store.conveniencestore.DTO.Request;

import com.example.store.conveniencestore.Domain.Category;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor

public class CategoryDTO {
    private Long categoryId;
    private String categoryName;
    private List<SubCategoryDTO> subCategories;

    public static CategoryDTO convertCategory(Category category){
        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setCategoryId(category.getCategory_id());
        categoryDTO.setCategoryName(category.getCategoryName());
        List<SubCategoryDTO> subCategoryDTOs = category.getSubCategories().stream().map(SubCategoryDTO::convertSubcateData).toList();
        categoryDTO.setSubCategories(subCategoryDTOs);
        return categoryDTO;
    }
}
