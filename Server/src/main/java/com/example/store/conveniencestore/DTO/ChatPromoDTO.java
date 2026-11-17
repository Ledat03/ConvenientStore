package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.Promotion;
import com.example.store.conveniencestore.EnumType.DiscountScope;
import com.example.store.conveniencestore.EnumType.PromotionType;

import java.time.LocalDateTime;

public record ChatPromoDTO(
        Long id,
        String code,
        String name,
        String description,
        PromotionType type,
        DiscountScope scope,
        Long discountValue,
        Long maxDiscount,
        Long minOrderValue,
        LocalDateTime startDate,
        LocalDateTime endDate
) {
    public static ChatPromoDTO from(Promotion promotion) {
        return new ChatPromoDTO(
                promotion.getCouponId(),
                promotion.getCode(),
                promotion.getName(),
                promotion.getDescription(),
                promotion.getType(),
                promotion.getScope(),
                promotion.getDiscountValue(),
                promotion.getMaxDiscount(),
                promotion.getMinOrderValue(),
                promotion.getStartDate(),
                promotion.getEndDate()
        );
    }
}