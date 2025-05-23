package com.example.store.conveniencestore.Domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "ShoppingSessions")
public class ShoppingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
}
