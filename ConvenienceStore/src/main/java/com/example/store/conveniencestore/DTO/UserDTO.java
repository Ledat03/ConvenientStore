package com.example.store.conveniencestore.DTO;


import com.example.store.conveniencestore.Domain.User;
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
   public UserDTO(){}
   public UserDTO(User user){
        this.setId(user.getId());
        this.setEmail(user.getEmail());
        this.setFirstName(user.getFirstName());
        this.setLastName(user.getLastName());
        this.setUsername(user.getUsername());
        this.setAddress(user.getAddress());
        this.setPhone(user.getPhone());
        this.setRole(user.getRole().getName());
    }
}
