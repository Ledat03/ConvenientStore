package com.example.store.conveniencestore.DTO.Response;

import com.example.store.conveniencestore.DTO.Request.AIProductRes;

import java.util.List;

public record ChatProductResponse(String message, List<AIProductRes> productRes) {
}
