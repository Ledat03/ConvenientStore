package com.example.store.conveniencestore.DTO;

import lombok.Data;

@Data
public class OrderItemDTO {
    private long productId;
    private long variantId;
    private long quantity;
    private long unitPrice;
}
