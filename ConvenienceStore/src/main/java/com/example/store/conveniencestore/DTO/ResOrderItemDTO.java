package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.OrderItem;
import lombok.Data;

@Data
public class ResOrderItemDTO {
    private long orderItemId;
    private long quantity;
    private double totalPrice;
    private ProductDTO product;
    private ProductVariantDTO productVariant;
    public ResOrderItemDTO(){}
    public ResOrderItemDTO(OrderItem orderItem){
        this.setOrderItemId(orderItem.getId());
        this.setQuantity(orderItem.getQuantity());
        this.setTotalPrice(orderItem.getTotalPrice());
        this.setProduct(new ProductDTO(orderItem.getProduct()));
        this.setProductVariant(new ProductVariantDTO(orderItem.getProductVariant()));
    }
}
