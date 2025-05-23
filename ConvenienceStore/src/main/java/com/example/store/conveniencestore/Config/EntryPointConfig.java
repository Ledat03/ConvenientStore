package com.example.store.conveniencestore.Config;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.example.store.conveniencestore.Domain.RestRestponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class EntryPointConfig implements AuthenticationEntryPoint {

    private final AuthenticationEntryPoint delegate = new BearerTokenAuthenticationEntryPoint();
    private final ObjectMapper mapper;

    public EntryPointConfig(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        this.delegate.commence(request, response, authException);
        response.setContentType("application/json;charset=UTF-8");
        RestRestponse<Object> restRestponse = new RestRestponse<>();
        restRestponse.setStatusCode(401);
        restRestponse.setError(
                authException.getCause() != null ? authException.getCause().getMessage() : authException.getMessage());
        restRestponse.setMessage("Token không hợp lệ");
        mapper.writeValue(response.getWriter(), restRestponse);
    }
}