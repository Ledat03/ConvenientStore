    package com.example.store.conveniencestore.Domain;

import lombok.Data;

@Data
    public class RestRestponse<T> {
        private T data;
        private Object message;
        private int statusCode;
        private String Error;
        
    }