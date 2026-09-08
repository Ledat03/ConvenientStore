package com.example.store.conveniencestore.DTO;


import com.example.store.conveniencestore.Domain.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {
    private long id;
    @NotBlank
    private String username;
    @NotBlank(message = "Email mustn't blank")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",message = "Wrong email format !")
    private String email;
    private String passwordHash;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    @Size(min = 10,max = 10,message = ("Wrong format of phone number !"))
    private String phone;
    @NotBlank
    private String role;
    @NotBlank
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
