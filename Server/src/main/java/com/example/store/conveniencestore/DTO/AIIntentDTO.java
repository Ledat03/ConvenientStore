package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.EnumType.DiscountScope;
import com.example.store.conveniencestore.EnumType.PromotionType;
import com.example.store.conveniencestore.EnumType.QuestionType;

public record AIIntentDTO(
        QuestionType intent,
        String keyword,
        String brand,
        Long categoryId,
        Long subCategoryId,
        Double minPrice,
        Double maxPrice,
        Boolean inStockOnly,
        Boolean needsClarification,
        String clarificationQuestion,
        PromotionType promotionType,
        DiscountScope promotionScope
) {}
