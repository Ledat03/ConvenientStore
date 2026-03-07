package com.example.store.conveniencestore.DTO;

import lombok.Data;

import java.util.List;
@Data
public class FilterData {
    private List<String> brand;
    private List<String> unit;
    private List<String> subCategory;
}
