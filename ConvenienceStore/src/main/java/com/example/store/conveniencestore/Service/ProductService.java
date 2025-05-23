package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.SubCategory;
import com.example.store.conveniencestore.Repository.ProductRepository;
import com.example.store.conveniencestore.Repository.SubCategoryRepositoty;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final SubCategoryRepositoty subCategoryRepositoty;
    private final ProductRepository productRepository;
    public ProductService(SubCategoryRepositoty subCategoryRepositoty, ProductRepository productRepository) {
        this.subCategoryRepositoty = subCategoryRepositoty;
        this.productRepository = productRepository;
    }

    public List<SubCategory> findAll() {
        return subCategoryRepositoty.findAll();
    }

    public SubCategory findBySubCategoryName(String subCategoryName) {
        return subCategoryRepositoty.findBySubCategoryName(subCategoryName);
    }
    @Transactional
    public void save(Product product) {
        productRepository.save(product);
    }
}
