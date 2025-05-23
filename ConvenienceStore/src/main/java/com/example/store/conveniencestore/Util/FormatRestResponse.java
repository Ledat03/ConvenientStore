package com.example.store.conveniencestore.Util;

import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.core.MethodParameter;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.example.store.conveniencestore.Domain.RestRestponse;

import jakarta.servlet.http.HttpServletResponse;

@RestControllerAdvice
public class FormatRestResponse implements ResponseBodyAdvice {

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
            Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {

        HttpServletResponse serverHttpResponse = ((ServletServerHttpResponse) response).getServletResponse();
        if (body instanceof String) {
            return body;
        }
        int getStatus = serverHttpResponse.getStatus();
        RestRestponse<Object> restResponse = new RestRestponse<Object>();
        restResponse.setStatusCode(getStatus);
        if (getStatus >= 400) {
            return body;
        } else {
            restResponse.setData(body);
            restResponse.setMessage("OK");
            restResponse.setStatusCode(200);
        }
        return restResponse;
    }
}
