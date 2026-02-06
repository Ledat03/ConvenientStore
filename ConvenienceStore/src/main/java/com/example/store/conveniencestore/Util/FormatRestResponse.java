//package com.example.store.conveniencestore.Util;
//
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.http.server.ServerHttpRequest;
//import org.springframework.http.server.ServerHttpResponse;
//import org.springframework.http.server.ServletServerHttpResponse;
//import org.springframework.validation.FieldError;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//import org.springframework.core.MethodParameter;
//import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
//
//import com.example.store.conveniencestore.Domain.Restsponse;
//
//import jakarta.servlet.http.HttpServletResponse;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestControllerAdvice
//public class FormatRestResponse implements ResponseBodyAdvice {
//
//    @Override
//    public boolean supports(MethodParameter returnType, Class converterType) {
//        return true;
//    }
//
//    @Override
//    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
//            Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
//
//        HttpServletResponse serverHttpResponse = ((ServletServerHttpResponse) response).getServletResponse();
//        if (body instanceof String) {
//            return body;
//        }
//        int getStatus = serverHttpResponse.getStatus();
//            Restsponse<Object> restResponse = new Restsponse<>() ;
//            if (getStatus >= 400) {
//
//                restResponse.setMessage("Lỗi");
//                restResponse.setError("lỗi");
//                restResponse.setStatusCode(getStatus);
//            } else {
//                restResponse.setData(body);
//                restResponse.setMessage("OK");
//                restResponse.setStatusCode(getStatus);
//                restResponse.setError(null);
//            }
//
//        return restResponse;
//    }
//
//}
