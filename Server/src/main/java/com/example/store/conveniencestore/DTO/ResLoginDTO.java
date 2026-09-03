package com.example.store.conveniencestore.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResLoginDTO {
    private String accessToken;
    private long id;
    private String username;
    private String name;
    private String role;
}
