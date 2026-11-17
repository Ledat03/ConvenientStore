package com.example.store.conveniencestore.DTO.Response;

import com.example.store.conveniencestore.DTO.ChatPromoDTO;

import java.util.List;

public record ChatPromotionResponse(String reply,
                                    List<ChatPromoDTO> promotions) {
}
