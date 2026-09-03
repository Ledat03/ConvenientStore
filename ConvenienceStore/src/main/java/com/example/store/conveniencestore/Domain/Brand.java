package com.example.store.conveniencestore.Domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "brand")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long brandId;
    private String brandName;
}
