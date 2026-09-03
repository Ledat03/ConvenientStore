package com.example.store.conveniencestore.DTO;

import lombok.Data;

@Data
public class CartDetailDTO {
    private long cartDetailId;
    private long quantity;
    private ProductDTO product;
    private ProductVariantDTO productVariant;
}
