package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.Delivery;
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
    public ResDeliveryDTO(){}
    public ResDeliveryDTO(Delivery delivery){
        this.setDeliveryId(delivery.getDeliveryId());
        this.setDeliveryMethod(delivery.getDelivery_method());
        this.setDeliveryDate(delivery.getDelivery_date());
        this.setDeliveryFee(delivery.getDelivery_fee());
        this.setDeliveryStatus(delivery.getDelivery_status());
        this.setTrackingNumber(delivery.getTracking_number());
        this.setDeliveredTime(delivery.getDelivered_at());
        this.setReceiverName(delivery.getReceiver_name());
        this.setReceiverPhone(delivery.getReceiver_phone());
        this.setDeliveryAddress(delivery.getDelivery_address());
    }
}
