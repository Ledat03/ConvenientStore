package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.User;
import lombok.Data;

import java.util.List;

@Data
public class ResOrderDTO {
    private long orderId;
    private UserDTO user;
    private Double totalPrice;
    private List<ResOrderItemDTO> orderItemDTOs;
    private ResDeliveryDTO delivery;
    private PaymentDTO payment;

}
