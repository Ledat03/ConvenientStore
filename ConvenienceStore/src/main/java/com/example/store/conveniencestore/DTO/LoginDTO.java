package com.example.store.conveniencestore.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {
    @NotBlank(message = "Trường thông tin không được để trống")
    private String username;
    @NotBlank(message = "Trường thông tin không được để trống")
    private String password;
}
