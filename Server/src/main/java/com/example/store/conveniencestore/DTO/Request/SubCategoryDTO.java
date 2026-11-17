package com.example.store.conveniencestore.DTO.Request;

import com.example.store.conveniencestore.Domain.SubCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryDTO {
    private Long subCategoryId;
    private String subCategoryName;

    public static SubCategoryDTO convertSubcateData(SubCategory subCategory){
        SubCategoryDTO subCategoryDTO =new SubCategoryDTO();
        subCategoryDTO.setSubCategoryId(subCategory.getId());
        subCategoryDTO.setSubCategoryName(subCategory.getSubCategoryName());
        return subCategoryDTO;
    }
}
