package com.example.store.conveniencestore.DTO.Request;

import com.example.store.conveniencestore.Domain.ProductVariant;
import lombok.Data;;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class AIProductRes {
    private long productId;
    private long variantId;
    private String productName;
    private String brand;
    private double price;
    private double salePrice;
    private long stock;
    private String image;
    private String calUnit;

    public static AIProductRes convertToProdRes(ProductVariant productVariant){
        AIProductRes aiProductRes = new AIProductRes();
        aiProductRes.setImage(productVariant.getProduct().getImage());
        aiProductRes.setProductId(productVariant.getProduct().getProductId());
        aiProductRes.setVariantId(productVariant.getVariantId());
        aiProductRes.setProductName(productVariant.getProduct().getProductName());
        aiProductRes.setBrand(productVariant.getProduct().getBrand().getBrandName());
        aiProductRes.setPrice(productVariant.getPrice());
        aiProductRes.setSalePrice(productVariant.getSalePrice());
        aiProductRes.setStock(productVariant.getStock());
        aiProductRes.setCalUnit(productVariant.getCalUnit());
        return aiProductRes;
    }
}
