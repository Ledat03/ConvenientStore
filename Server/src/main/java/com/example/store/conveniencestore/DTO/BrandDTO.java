package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.Brand;
import lombok.Data;

@Data
public class BrandDTO {
    private long brandId;
    private String brandName;
    public static BrandDTO convertBrandToBrandDTO(Brand brand) {
        BrandDTO brandDTO = new BrandDTO();
        brandDTO.setBrandId(brand.getBrandId());
        brandDTO.setBrandName(brand.getBrandName());
        return brandDTO;
    }
}

