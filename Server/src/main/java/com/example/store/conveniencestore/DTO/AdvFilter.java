package com.example.store.conveniencestore.DTO;

import lombok.Data;

import java.util.List;
@Data
public class AdvFilter {
    private String category;
    private String promotion;
    private String subCate;
    private String name;
    private Double sale;
    private List<String> unit;
    private List<String> subCategory;
    private List<Double> priceRange;
    private List<String> brand;
    private int page;
}
