package com.example.store.conveniencestore.DTO;

import lombok.Data;

import java.util.List;
@Data
public class CategoryDTO {
    private long categoryId;
    private String categoryName;
    private List<SubCategoryDTO> subCategories;

    // Getters, setters
}