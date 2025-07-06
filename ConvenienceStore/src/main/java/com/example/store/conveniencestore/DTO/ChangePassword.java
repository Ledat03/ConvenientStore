package com.example.store.conveniencestore.DTO;

import lombok.Data;

@Data
public class ChangePassword {
    private long id;
    private String currentPassword;
    private String password;
}
