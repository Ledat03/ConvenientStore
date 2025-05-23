package com.example.store.conveniencestore.DTO;


import lombok.Data;

@Data
public class UserDTO {
    private long id;
    private String username;
    private String email;
    private String passwordHash;
    private String firstName;
    private String lastName;
    private String phone;
    private String role;
    private String address;
}
