package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.PromotionProduct;
import lombok.Data;

@Data
public class ProductPromotionDTO {
    private long productId;
    private String productName;
    ProductPromotionDTO(){}
    public ProductPromotionDTO(PromotionProduct promotionProduct){
            ProductPromotionDTO promotionDTO = new ProductPromotionDTO();
            promotionDTO.setProductId(promotionProduct.getProduct().getProductId());
            promotionDTO.setProductName(promotionProduct.getProduct().getProductName());
        }
    }

