package com.example.store.conveniencestore.Util.ErrorHandle;

import com.example.store.conveniencestore.Domain.RestRestponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolation(
            ConstraintViolationException ex) {
        List<String> resErrors = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage).toList();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resErrors);
    }
}
