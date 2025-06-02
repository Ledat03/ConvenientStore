package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product save(Product product);
    List<Product> findAll();
    Product findById(long id);
    void deleteById(Long id);
}
