package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.Payment;
import com.example.store.conveniencestore.EnumType.PaymentMethod;
import com.example.store.conveniencestore.EnumType.TransactionStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class PaymentDTO {
    private long paymentId;
    private PaymentMethod paymentMethod;
    private BigDecimal paymentAmount;
    private LocalDateTime paymentDate;
    private String transactionId;
    private TransactionStatus paymentStatus;
    private LocalDateTime createTime;
    public PaymentDTO(){}
    public PaymentDTO(Payment payment){
        this.setPaymentId(payment.getId());
        this.setPaymentMethod(payment.getPaymentMethod());
        this.setPaymentAmount(payment.getAmount());
        this.setPaymentDate(payment.getPaymentDate());
        this.setTransactionId(payment.getTransactionId());
        this.setPaymentStatus(payment.getPaymentStatus());
        this.setCreateTime(payment.getCreatedAt());
    }
}
