package com.example.store.conveniencestore.Domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "CartItems")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
}
