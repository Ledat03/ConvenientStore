package com.example.store.conveniencestore.Domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
@Entity
@Data
@Table(name = "Categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long category_id;
    private String categoryName;
    @OneToMany(mappedBy = "category")
    private List<SubCategory> subCategories;
    @OneToMany(mappedBy = "category")
    private List<Product> products;

}
