package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.Domain.Category;
import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.ProductVariant;
import com.example.store.conveniencestore.Domain.SubCategory;
import com.example.store.conveniencestore.Repository.CategoryRepository;
import com.example.store.conveniencestore.Repository.ProductRepository;
import com.example.store.conveniencestore.Repository.SubCategoryRepositoty;
import com.example.store.conveniencestore.Repository.VariantRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final SubCategoryRepositoty subCategoryRepositoty;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final VariantRepository variantRepository;
    public ProductService(SubCategoryRepositoty subCategoryRepositoty, ProductRepository productRepository, CategoryRepository categoryRepository, VariantRepository variantRepository) {
        this.subCategoryRepositoty = subCategoryRepositoty;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.variantRepository = variantRepository;
    }

    public Category findCategoriesByCategory_id(long id) {
        return categoryRepository.findById(id);
    }
    public List<SubCategory> findAll() {
        return subCategoryRepositoty.findAll();
    }

    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }
    public SubCategory findBySubCategoryName(String subCategoryName) {
        return subCategoryRepositoty.findBySubCategoryName(subCategoryName);
    }
    @Transactional
    public void save(Product product) {
        productRepository.save(product);
    }
    @Transactional
    public void deleteProduct(long id) {
        productRepository.deleteById(id);
    }
    public Product findProductById(long id) {
        return productRepository.findById(id);
    }
    @Transactional
    public ProductVariant saveVariant(ProductVariant productVariant) {
        return variantRepository.save(productVariant);
    }

    public ProductVariant findProductVariantById(long id) {
        return variantRepository.findByVariantId(id);
    }
    @Transactional
    public void deleteVariant(ProductVariant productVariant) {
        variantRepository.delete(productVariant);
    }

    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }
    public List<ProductVariant> findProductVariantsByProductId(long productId) {
        return variantRepository.findByProduct_ProductId(productId);
    }
    @Transactional
    public void deleteAllByProduct(Product product) {
        variantRepository.deleteAllByProduct(product);
    }
}
