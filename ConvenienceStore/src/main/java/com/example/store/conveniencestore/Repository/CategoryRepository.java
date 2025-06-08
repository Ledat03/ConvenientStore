package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository  extends JpaRepository<Category, Long> {
    Category findById(long id);
    List<Category> findAll();
}
