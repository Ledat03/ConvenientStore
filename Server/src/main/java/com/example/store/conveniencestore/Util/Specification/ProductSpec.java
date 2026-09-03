package com.example.store.conveniencestore.Util.Specification;

import com.example.store.conveniencestore.DTO.AdvFilter;
import com.example.store.conveniencestore.Domain.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public class ProductSpec {

    public static Specification<Product> productSpecification(String name) {
        return (root, query, criteriaBuilder) -> {
            {
                if (name == null || name.isEmpty()) {
                    return criteriaBuilder.conjunction();
                }
                return criteriaBuilder.like(root.get(Product_.PRODUCT_NAME), "%" + name + "%");
            }
        };
    }
    public static Specification<ProductVariant> hasProductName(String name){
        return (root, query, cb) -> {

            if(name == null || name.isEmpty())
                return null;

            Join<ProductVariant, Product> productJoin =
                    root.join("product", JoinType.LEFT);

            return cb.like(
                    cb.lower(productJoin.get("productName")),
                    "%" + name.toLowerCase() + "%"
            );
        };
    }
    public static Specification<ProductVariant> inCategory(String category){
        return (root, query, cb) -> {

            if(category == null || category.isEmpty())
                return null;

            Join<ProductVariant, Product> productJoin =
                    root.join("product", JoinType.LEFT);

            Join<Product, Category> categoryJoin =
                    productJoin.join("category", JoinType.LEFT);

            return cb.equal(
                    cb.lower(categoryJoin.get("categoryName")),
                    category.toLowerCase()
            );
        };
    }
    public static Specification<ProductVariant> hasSubCategory(String subCategory){
        return (root, query, cb) -> {

            if(subCategory == null || subCategory.isEmpty())
                return null;

            Join<ProductVariant, Product> productJoin =
                    root.join("product", JoinType.LEFT);

            Join<Product, SubCategory> categoryJoin =
                    productJoin.join("subCategory", JoinType.LEFT);

            return cb.equal(
                    cb.lower(categoryJoin.get(SubCategory_.SUB_CATEGORY_NAME)),
                    subCategory.toLowerCase()
            );
        };
    }
    public static Specification<ProductVariant> hasCategory(String category){
        return (root, query, cb) -> {

            if(category == null || category.isEmpty())
                return null;

            Join<ProductVariant, Product> productJoin =
                    root.join("product", JoinType.LEFT);

            Join<Product, Category> categoryJoin =
                    productJoin.join("category", JoinType.LEFT);

            return cb.equal(
                    cb.lower(categoryJoin.get(Category_.CATEGORY_NAME)),
                    category.toLowerCase()
            );
        };
    }
    public static Specification<ProductVariant> inSubCategory(String subCate){
        return (root, query, cb) -> {

            if(subCate == null || subCate.isEmpty())
                return null;

            Join<ProductVariant, Product> productJoin =
                    root.join("product", JoinType.LEFT);

            Join<Product, SubCategory> subJoin =
                    productJoin.join("subCategory", JoinType.LEFT);

            return cb.equal(
                    cb.lower(subJoin.get("subCategoryName")),
                    subCate.toLowerCase()
            );
        };
    }

    public static Specification<ProductVariant> equalSalePrice(Double salePrice){
        return (root,query,cb) ->{
            query.distinct(true);
            Join<Product,ProductVariant> variantJoin = root.join("productVariant");
            return cb.notEqual(variantJoin.get(ProductVariant_.SALE_PRICE),salePrice);
        };
    }
    public static Specification<ProductVariant> inUnit(List<String> unit){
        return (root,query,cb) ->{
            query.distinct(true);
            return cb.in(root.get(ProductVariant_.CAL_UNIT)).value(unit);
        };
    }
    public static Specification<ProductVariant> inSubCategory(List<String> subCategory){
        return (root,query,cb) ->{
            query.distinct(true);
            Join<ProductVariant, Product> productJoin = root.join("product", JoinType.LEFT);
            Join<Product, SubCategory> subJoin = productJoin.join("subCategory", JoinType.LEFT);

            return subJoin.get("subCategoryName").in(subCategory);
        };
    }
    public static Specification<ProductVariant> minPrice(Double priceRange){
        return (root,query,cb) ->{
            query.distinct(true);
            Join<Product,ProductVariant> variantJoin = root.join("productVariant");
            return cb.ge(variantJoin.get(ProductVariant_.PRICE),priceRange);
        };
    }
    public static Specification<ProductVariant> maxPrice(Double priceRange){
        return (root,query,cb) ->{
            query.distinct(true);
            Join<Product,ProductVariant> variantJoin = root.join("productVariant");
            return cb.le(variantJoin.get(ProductVariant_.PRICE),priceRange);
        };
    }
    public static Specification<ProductVariant> inBrand(List<String> brands){
        return (root,query,cb) ->{
            query.distinct(true);
            Join<ProductVariant, Product> productJoin = root.join("product", JoinType.LEFT);
            Join<Product, Brand> brandJoin = productJoin.join("brand", JoinType.LEFT);

            return brandJoin.get("brandName").in(brands);
        };
    }
    public static Specification<ProductVariant> betweenPrice(List<Double> priceRange){
        return (root,query,cb) ->{
            return cb.between(root.get(ProductVariant_.PRICE),priceRange.get(0),priceRange.get(1));
        };
    }
    public static Specification<ProductVariant> newProduct(){
        return (root,query,cb) -> {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime past = now.minusDays(7);
            return cb.between(root.get("product").get(Product_.CREATED_AT),past,now);
        };
    }
    public static Specification<ProductVariant> outOfStock(){
        return (root,query,cb) ->{
            return cb.notEqual(root.get(ProductVariant_.STOCK),0);
        };
    }
}
