package com.example.store.conveniencestore.Util.ErrorHandle;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.example.store.conveniencestore.Domain.RestRestponse;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalException extends Exception {

    @ExceptionHandler(value = { UsernameNotFoundException.class, BadCredentialsException.class })
    public ResponseEntity<RestRestponse<Object>> handleLoginError(Exception ex) {
        RestRestponse<Object> restRestponse = new RestRestponse<>();
        restRestponse.setStatusCode(HttpStatus.BAD_REQUEST.value());
        restRestponse.setMessage("Tài khoản hoặc mật khẩu không đúng !");
        restRestponse.setError(ex.getMessage());
        return ResponseEntity.status(400).body(restRestponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestRestponse<Object>> handleValidationException(
            MethodArgumentNotValidException e) {
        RestRestponse<Object> restResponse = new RestRestponse<>();
        BindingResult bindingResult = e.getBindingResult();
        restResponse.setStatusCode(HttpStatus.BAD_REQUEST.value());
        List<String> errors = new ArrayList<>();
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            errors.add(fieldError.getDefaultMessage());
        }
        restResponse.setMessage(errors.size() > 1 ? errors : errors.get(0));
        restResponse.setError(e.getBody().getTitle());
        return ResponseEntity.status(restResponse.getStatusCode()).body(restResponse);
    }
    @ExceptionHandler(CartException.class)
    public ResponseEntity<Object> handleQuantityExceedStock(CartException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
