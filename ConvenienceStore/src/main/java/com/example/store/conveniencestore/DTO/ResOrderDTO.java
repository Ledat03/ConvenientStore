package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.Order;
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
    public ResOrderDTO(){}
    public ResOrderDTO(Order order){
        this.setOrderId(order.getId());
        this.setUser(new UserDTO(order.getUser()));
        this.setTotalPrice(order.getTotal());
        this.setDelivery(new ResDeliveryDTO(order.getDelivery()));
        List<ResOrderItemDTO> resOrderItemDTOs = order.getOrderDetails().stream().map(ResOrderItemDTO::new).toList();
        this.setOrderItemDTOs(resOrderItemDTOs);
        this.setPayment(new PaymentDTO(order.getPayment()));
    }
}
