package com.example.store.conveniencestore.Domain;

import com.example.store.conveniencestore.DTO.UserDTO;
import com.example.store.conveniencestore.Service.UserService;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;

@Entity
@Data
@Table(name = "Users")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @NotBlank
    @Size(min = 3, max = 100,message = ("Username needs to have at least 3 char and maximum to 20 char"))
    private String username;
    @NotBlank(message = "Email mustn't blank")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",message = "Wrong email format !")
    @Column(unique = true)
    private String email;
    @NotBlank
    private String passwordHash;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    @Size(min = 10,max = 10,message = ("Wrong format of phone number !"))
    @Column(unique = true)
    private String phone;
    @NotBlank
    private String address;
    @NotNull
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String refreshToken;
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;
    @OneToOne(fetch = FetchType.EAGER,mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Cart cart;
    public static User convertUserDTOToUser(UserDTO userDTO, UserService userService, PasswordEncoder passwordEncoder,Role role) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setEmail(userDTO.getEmail());
        User TempUser = userService.findById(userDTO.getId());
        if(userDTO.getPasswordHash() != null) {
            user.setPasswordHash(passwordEncoder.encode(userDTO.getPasswordHash()));
        }else{
            user.setPasswordHash(TempUser.getPasswordHash());
        }
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setUsername(userDTO.getUsername());
        user.setAddress(userDTO.getAddress());
        user.setPhone(userDTO.getPhone());
        user.setRole(role);
        user.setCreatedAt(TempUser.getCreatedAt());
        user.setCreatedBy(TempUser.getCreatedBy());
        user.setUpdatedAt(Instant.now());
        user.setUpdatedBy("admin");
        user.setRefreshToken(user.getRefreshToken());
        return user;
    }
    public static User convertUserDTOToUser(UserDTO userDTO, UserService userService, PasswordEncoder passwordEncoder) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        String Hash = passwordEncoder.encode(userDTO.getPasswordHash());
        user.setPasswordHash(Hash);
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setAddress(userDTO.getAddress());
        user.setPhone(userDTO.getPhone());
        Role role = userService.findByName(userDTO.getRole());
        user.setRole(role);
        user.setCreatedBy("user");
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setUpdatedBy("user");
        return user;
    }
}
