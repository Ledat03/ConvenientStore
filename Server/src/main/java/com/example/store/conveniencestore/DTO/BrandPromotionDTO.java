package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.Brand;
import com.example.store.conveniencestore.Domain.Promotion;
import com.example.store.conveniencestore.Domain.PromotionBrand;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BrandPromotionDTO {
    private long id;
    private String brand;
    BrandPromotionDTO(){}
    public BrandPromotionDTO(PromotionBrand promotionBrand){
        this.setId(promotionBrand.getBrand().getBrandId());
        this.setBrand(promotionBrand.getBrand().getBrandName());
    }
}
