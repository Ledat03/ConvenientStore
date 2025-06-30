package com.example.store.conveniencestore.Util.Specification;

import com.example.store.conveniencestore.Domain.*;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;


public class ProductSpec {
    public static Specification<Product> productSpecification(String name) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Product_.PRODUCT_NAME), "%" + name + "%");
        };
    }

}
