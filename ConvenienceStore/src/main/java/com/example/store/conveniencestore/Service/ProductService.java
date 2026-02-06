package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.DTO.ManageProductDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Repository.*;
import com.example.store.conveniencestore.Util.Specification.ProductSpec;
import com.fasterxml.jackson.annotation.JsonView;

import jakarta.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

import com.example.store.conveniencestore.View.ViewsConfig;

@Service
public class ProductService {

    private final SubCategoryRepository subCategoryRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final VariantRepository variantRepository;
    private final BrandRepository brandRepository;
    private final ImportRepository importRepository;
    private final ImportDetailRepository importDetailRepository;

    public ProductService(SubCategoryRepository subCategoryRepository, ProductRepository productRepository, CategoryRepository categoryRepository, VariantRepository variantRepository, BrandRepository brandRepository, ImportRepository importRepository, ImportDetailRepository importDetailRepository) {
        this.subCategoryRepository = subCategoryRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.variantRepository = variantRepository;
        this.brandRepository = brandRepository;
        this.importRepository = importRepository;
        this.importDetailRepository = importDetailRepository;
    }

    public Category findCategoriesByCategory_id(long id) {
        return categoryRepository.findById(id);
    }

    public List<SubCategory> findAll() {
        return subCategoryRepository.findAll();
    }

    public Page<Product> findAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    public List<Product> getProducts() {
        return productRepository.getAllProduct();
    }

    public SubCategory findBySubCategoryName(String subCategoryName) {
        return subCategoryRepository.findBySubCategoryName(subCategoryName);
    }

    public List<Product> findAllProductsByBrand(String brandName) {
        return productRepository.findByBrand_BrandName(brandName);
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

    public List<Product> findAllProductsByCategory(String category) {
        return productRepository.findByCategory_CategoryName(category);
    }

    public List<Product> findAllProductsBySubCategory(String subCategory) {
        return productRepository.findBySubCategory_SubCategoryName(subCategory);
    }

    public Product findProductByProductName(String productName) {
        return productRepository.findByProductName(productName);
    }

    public List<Product> findAllProductsBySpec(String name) {
        return productRepository.findAll(ProductSpec.productSpecification(name));
    }

    public Brand findBrandbyBrandName(String brandName) {
        return brandRepository.findByBrandName(brandName);
    }

    public List<Brand> findAllBrands() {
        return brandRepository.findAll();
    }

    public Brand findBrandById(long id) {
        return brandRepository.findById(id);
    }

    public Brand addBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    public void deleteBrand(long id) {
        brandRepository.deleteById(id);
    }

    @Transactional
    public InventoryImport saveInventoryImport(InventoryImport inventoryImport) {
        return importRepository.save(inventoryImport);
    }

    public InventoryImportDetail saveImportDetail(InventoryImportDetail inventoryImportDetail) {
        return importDetailRepository.save(inventoryImportDetail);
    }

    public void deleteInventoryImport(InventoryImport inventoryImport) {
        importRepository.delete(inventoryImport);
    }

    public List<InventoryImport> findAllInventoryImports() {
        return importRepository.findAll();
    }

    public InventoryImport findInventoryImportById(long id) {
        return importRepository.findById(id);
    }

    public Page<Product> getProductWithNameAndStatusAndState(ManageProductDTO  manageProductDTO,Pageable pageable){
        if(manageProductDTO.getStatus() == null){
            return productRepository.getProductsWithNameAndStatusAndState(manageProductDTO.getName(), null, manageProductDTO.getState(), pageable);
        }
            return productRepository.getProductsWithNameAndStatusAndState(manageProductDTO.getName(), Boolean.valueOf(manageProductDTO.getStatus()), manageProductDTO.getState(), pageable);
        }
}
