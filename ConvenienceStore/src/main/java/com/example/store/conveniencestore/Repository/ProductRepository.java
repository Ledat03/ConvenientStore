package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.DTO.ManageProductDTO;
import com.example.store.conveniencestore.Domain.Category;
import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.SubCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product save(Product product);
    Page<Product> findAll(Pageable pageable);
    @Query("SELECT p from Product p")
    List<Product> getAllProduct();
    @Query("Select p from Product p where " + " (:name IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%' , :name , '%'))) " + " and ( :isActive IS NULL OR p.isActive = :isActive ) and ( :status IS NULL OR p.status = :status) ")
    Page<Product> getProductsWithNameAndStatusAndState(@Param("name")String name,@Param("isActive") Boolean isActive,@Param("status") String status,Pageable pageable);
    Product findById(long id);
    void deleteById(Long id);
    List<Product> findByCategory_CategoryName(String categoryCategoryName);
    List<Product> findBySubCategory_SubCategoryName(String subCategorySubCategoryName);
    List<Product> findByBrand_BrandName(String brandName);
    Product findByProductName(String productName);
    List<Product> findAll(Specification<Product> spec);
}
