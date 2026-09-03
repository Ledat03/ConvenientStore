package com.example.store.conveniencestore.Domain;

import com.example.store.conveniencestore.EnumType.DeliveryStatus;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
@Data
@Table(name = "Deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long deliveryId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "delivery_address", columnDefinition = "TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String delivery_address;

    @Column(name = "receiver_name", columnDefinition = "VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String receiver_name;

    @Column(name = "receiver_phone", columnDefinition = "VARCHAR(15)")
    private String receiver_phone;

    @Column(name = "delivery_status")
    @Enumerated(EnumType.STRING)
    private DeliveryStatus delivery_status;

    @Column(name = "delivery_method", columnDefinition = "VARCHAR(50)")
    private String delivery_method;

    @Column(name = "tracking_number", columnDefinition = "VARCHAR(50)")
    private String tracking_number;

    @Column(name = "delivery_date", columnDefinition = "DATE")
    private Date delivery_date;

    @Column(name = "delivered_at", columnDefinition = "DATETIME")
    private Date delivered_at;

    @Column(name = "delivery_fee", columnDefinition = "DECIMAL(10,2) DEFAULT 0.00")
    private Double delivery_fee;

    @Column(name = "created_at", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private Date created_at;

    @Column(name = "updated_at", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private Date updated_at;
}
