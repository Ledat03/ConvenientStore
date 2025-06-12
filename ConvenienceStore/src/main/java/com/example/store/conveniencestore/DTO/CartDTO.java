package com.example.store.conveniencestore.DTO;

import lombok.Data;

import java.util.List;

@Data
public class CartDTO {
    private long cartId;
    private long userId;
    private long sumQuantity;
    private List<CartDetailDTO> cartDetailList;
}
