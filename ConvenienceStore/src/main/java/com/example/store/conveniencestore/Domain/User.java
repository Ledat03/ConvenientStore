package com.example.store.conveniencestore.Domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Entity
@Data
@Table(name = "Users")
public class    User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String username;
    private String email;
    private String passwordHash;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String refreshToken;
   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "role_id")
   @JsonManagedReference
    private Role role;
   @OneToOne(mappedBy = "user")
   private Cart cart;
}
