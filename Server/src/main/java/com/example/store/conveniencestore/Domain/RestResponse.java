    package com.example.store.conveniencestore.Domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RestResponse<T> {
    private T responseData;
    private Object message;
    private int statusCode;
    private String Error;

    public static <T> RestResponse<T> ok(int statusCode ,T data) {
        RestResponse<T> r = new RestResponse<>();
        r.setStatusCode(statusCode);
        r.setResponseData(data);
        r.setMessage("Success");
        return r;
    }

    public static <T> RestResponse<T> error(int code, String message) {
        RestResponse<T> r = new RestResponse<>();
        r.setStatusCode(code);
        r.setMessage(message);
        r.setError(message);
        return r;
    }
    }