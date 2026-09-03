package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.DTO.AdvFilter;
import com.example.store.conveniencestore.DTO.FilterData;
import com.example.store.conveniencestore.DTO.ManageProductDTO;
import com.example.store.conveniencestore.DTO.ProductDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.DiscountScope;
import com.example.store.conveniencestore.Repository.*;
import com.example.store.conveniencestore.Util.Specification.ProductSpec;
import com.fasterxml.jackson.annotation.JsonView;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import com.example.store.conveniencestore.View.ViewsConfig;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final SubCategoryRepository subCategoryRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final VariantRepository variantRepository;
    private final BrandRepository brandRepository;
    private final ImportRepository importRepository;
    private final ImportDetailRepository importDetailRepository;
    private final PromotionRepository promotionRepository;


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
    public long countProduct(){
        return productRepository.count();
    }
    @Transactional
    public void deleteAllByProduct(Product product) {
        variantRepository.deleteAllByProduct(product);
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
     public Page<InventoryImport> getIIByFilter(String code,int days,Pageable pageable){
        if(days != 0 ){
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime past = now.minusDays(days);
            return importRepository.getInvByCodeAndDate(code,now,past,pageable);
        }
        return importRepository.getInvByCodeAndDate(code,null,null,pageable);
     }
     public Page<Product> getProductByPromotion(String code,Pageable pageable){
        Promotion promotion = promotionRepository.findByCode(code);
        if(promotion != null){
            if(promotion.getScope().equals(DiscountScope.PRODUCT)){
                return productRepository.findProductsByPromotionCode(promotion.getCode(),pageable);
            }else if(promotion.getScope().equals(DiscountScope.BRAND)){
                return productRepository.getProductsByCateAndSubCateAndPromoAndName(null,null,null,DiscountScope.BRAND,pageable);
            }else if (promotion.getScope().equals(DiscountScope.CATEGORY)){
                return productRepository.getProductsByCateAndSubCateAndPromoAndName(null,String.valueOf(DiscountScope.CATEGORY),null,null,pageable);
            }else if (promotion.getScope().equals(DiscountScope.SUBCATEGORY)){
                return productRepository.getProductsByCateAndSubCateAndPromoAndName(null,null, String.valueOf(DiscountScope.SUBCATEGORY),null,pageable);
            }else {
                return productRepository.getProductsByCateAndSubCateAndPromoAndName(null,null,null,null,pageable);
            }
        }
        return productRepository.getProductsByCateAndSubCateAndPromoAndName(null,null,null,null,pageable);
     }
    public Page<ProductVariant> getProductByAdvFilter(AdvFilter advFilter,Pageable pageable){
        Specification<ProductVariant> specs = Specification.where(null);
        if(advFilter.getCategory() != null){
            specs = specs.and(ProductSpec.inCategory(advFilter.getCategory()));
        }
        if(advFilter.getName() != null){
            specs = specs.and(ProductSpec.hasProductName(advFilter.getName()));
        }
        if(advFilter.getSubCate() != null){
            specs = specs.and(ProductSpec.hasSubCategory(advFilter.getSubCate()));
        }
        if(advFilter.getSale() != null){
            specs = specs.and(ProductSpec.equalSalePrice(advFilter.getSale()));
        }
        if(advFilter.getUnit() != null){
            specs = specs.and(ProductSpec.inUnit(advFilter.getUnit()));
        }
        if(advFilter.getPriceRange() != null && !advFilter.getPriceRange().isEmpty()){
           specs = specs.and(ProductSpec.betweenPrice(advFilter.getPriceRange()));
        }
        if(advFilter.getBrand() != null){
            specs = specs.and(ProductSpec.inBrand(advFilter.getBrand()));
        }
        if(advFilter.getSubCategory() != null){
            specs = specs.and(ProductSpec.inSubCategory(advFilter.getSubCategory()));
        }
        return variantRepository.findAll(specs,pageable);
    }
    public FilterData getFilterData(AdvFilter advFilter){
        FilterData filterData  = new FilterData();
        List<String> calUnits = variantRepository.facetUnit(advFilter.getCategory(), advFilter.getSubCate(), advFilter.getName());
        List<String> brands = productRepository.facetUnitBrand(advFilter.getCategory(), advFilter.getSubCate(),advFilter.getName());
        List<String> subCategories = productRepository.facetUnitSubCategory(advFilter.getCategory(), advFilter.getName());
        filterData.setBrand(brands);
        filterData.setUnit(calUnits);
        filterData.setSubCategory(subCategories);
        return filterData;
    }

    public Page<ProductVariant> getNewProducts(String type ,Pageable pageable){
        Specification<ProductVariant> spec = Specification.where(ProductSpec.newProduct());
        spec = spec.and(ProductSpec.outOfStock());
        if(type != null){
            if( type.equals("new")) {
                return variantRepository.findAll(spec, pageable);
            }else {
                return variantRepository.findBestSeller(pageable);
            }
        }
        return null;
    }
    public Page<ProductVariant> getRelatedProducts(Product product){
        Pageable pageable = PageRequest.of(0,10);
        Specification<ProductVariant> spec = Specification.where(ProductSpec.hasCategory(product.getCategory().getCategoryName()));
        spec = spec.and(ProductSpec.outOfStock());
        return variantRepository.findAll(spec, pageable);
    }
}
