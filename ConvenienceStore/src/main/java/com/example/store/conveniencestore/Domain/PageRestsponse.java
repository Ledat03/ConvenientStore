package com.example.store.conveniencestore.Domain;

import lombok.Data;

@Data
public class PageRestsponse<T> {
    private T data;
    private long totalItems;
}
