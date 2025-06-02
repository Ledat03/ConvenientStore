package com.example.store.conveniencestore.Domain;

import com.example.store.conveniencestore.EnumType.PromotionType;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "Promotions")
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "promotion_code", unique = true, nullable = false)
    private String promotion_code;

    @Enumerated(EnumType.STRING)
    @Column(name = "promotion_type", nullable = false)
    private PromotionType promotionType;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discount_value;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime start_date;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime end_date;

    @Column(name = "min_order_value", precision = 10, scale = 2)
    private BigDecimal min_order_value;

    @Column(name = "max_discount_amount", precision = 10, scale = 2)
    private BigDecimal max_discount_amount;

    @Column(name = "is_active", nullable = false)
    private Boolean is_active = true;

    @Column(name = "usage_limit")
    private Integer usage_limit;

    @Column(name = "current_usage", columnDefinition = "INT DEFAULT 0")
    private Integer current_usage = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
