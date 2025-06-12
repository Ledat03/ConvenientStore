package com.example.store.conveniencestore.DTO;

import lombok.Data;

@Data
public class ReqCartDTO {
    private long userId;
    private long productId;
    private long variantId;
    private int quantity;
}
