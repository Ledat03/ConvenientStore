package com.example.store.conveniencestore.Domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String address_name;
}
