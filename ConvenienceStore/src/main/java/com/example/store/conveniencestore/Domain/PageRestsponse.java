package com.example.store.conveniencestore.Domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageRestsponse<T> {
    private T data;
    private long totalItems;
}
