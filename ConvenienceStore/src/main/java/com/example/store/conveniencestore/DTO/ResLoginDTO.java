package com.example.store.conveniencestore.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ResLoginDTO {
    private String accessToken;
    private UserLogin user;
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserLogin{
        private long id;
        @NotBlank(message = "Trường thông tin không được để trống")
        private String username;
        @NotBlank(message = "Trường thông tin không được để trống")
        private String name;
        private String role;
    }
}
