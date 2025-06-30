package com.example.store.conveniencestore.DTO;

import lombok.Data;

@Data
public class ResOrderItemDTO {
    private long orderItemId;
    private long quantity;
    private double totalPrice;
    private ProductDTO product;
    private ProductVariantDTO productVariant;
}
