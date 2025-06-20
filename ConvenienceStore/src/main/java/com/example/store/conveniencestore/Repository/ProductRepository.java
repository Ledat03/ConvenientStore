package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Category;
import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product save(Product product);
    List<Product> findAll();
    Product findById(long id);
    void deleteById(Long id);
    List<Product> findByCategory_CategoryName(String categoryCategoryName);
    List<Product> findBySubCategory_SubCategoryName(String subCategorySubCategoryName);
    List<Product> findByBrand_BrandName(String brandName);
    Product findByProductName(String productName);
}
