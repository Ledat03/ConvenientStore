package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubCategoryRepositoty extends JpaRepository<SubCategory, Long> {

    List<SubCategory> findAll();
    SubCategory findBySubCategoryName(String subCategoryName);
}
