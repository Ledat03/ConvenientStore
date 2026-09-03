package com.example.store.conveniencestore.DTO;

import lombok.Data;

@Data
public class InventDetailDTO {
    private long productId;
    private long variantId;
    private long quantity;
    private double  cost_price;
    private double total_cost;
}
