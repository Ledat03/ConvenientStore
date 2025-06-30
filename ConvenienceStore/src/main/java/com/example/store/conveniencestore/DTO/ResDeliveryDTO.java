package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.EnumType.DeliveryStatus;
import lombok.Data;

import java.util.Date;

@Data
public class ResDeliveryDTO {
    private long deliveryId;
    private String receiverName;
    private String receiverPhone;
    private DeliveryStatus deliveryStatus;
    private Date deliveryDate;
    private Date deliveredTime;
    private String deliveryMethod;
    private String trackingNumber;
    private Double deliveryFee;
    private String deliveryAddress;
}
