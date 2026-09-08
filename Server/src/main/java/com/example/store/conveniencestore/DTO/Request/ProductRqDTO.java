package com.example.store.conveniencestore.DTO.Request;

import lombok.Data;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
@Data
public class ProductRqDTO {
    private String productName;
    private String productDescription;
    private String howToUse;
    private String preserve;
    private String origin;
    private String brand;
    private String ingredient;
    private String sku;
    private String isActive;
    private String status;
    private MultipartFile image;
    private String subCategory;
}
