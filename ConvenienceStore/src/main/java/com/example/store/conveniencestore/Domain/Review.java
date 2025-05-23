package com.example.store.conveniencestore.Domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
}
