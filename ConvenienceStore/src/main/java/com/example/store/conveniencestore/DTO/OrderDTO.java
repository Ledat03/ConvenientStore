package com.example.store.conveniencestore.DTO;

import jakarta.persistence.Column;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrderDTO {
    private long userId;
    private String receiverName;
    private String receiverAddress;
    private String deliveryPhone;
    private String deliveryMethod;
    private String paymentMethod;
    private String payTotal;
    private long promotionId;
    private List<OrderItemDTO> items;
}
