package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Brand;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Brand findByBrandName(String brandName);
    Brand findById(long id);
    @Transactional
    Brand save(Brand brand);
    List<Brand> findAll();
    @Transactional
    void deleteById(long id);
}
