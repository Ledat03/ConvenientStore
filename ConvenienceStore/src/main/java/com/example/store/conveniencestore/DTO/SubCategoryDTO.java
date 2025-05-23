package com.example.store.conveniencestore.DTO;

import lombok.Data;

import java.util.List;

@Data
public class SubCategoryDTO {
    private long id;
    private String subCategoryName;
    private List<ProductDTO> product;
}