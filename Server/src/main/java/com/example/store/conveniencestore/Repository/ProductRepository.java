package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.DTO.ManageProductDTO;
import com.example.store.conveniencestore.Domain.Category;
import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.SubCategory;
import com.example.store.conveniencestore.EnumType.DiscountScope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> , JpaSpecificationExecutor<Product> {
    Product save(Product product);
    Page<Product> findAll(Pageable pageable);
    @Query("SELECT p from Product p")
    List<Product> getAllProduct();
    @Query("Select p from Product p where " + " (:name IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%' , :name , '%'))) " + " and ( :isActive IS NULL OR p.isActive = :isActive ) and ( :status IS NULL OR p.status = :status) ")
    Page<Product> getProductsWithNameAndStatusAndState(@Param("name")String name,@Param("isActive") Boolean isActive,@Param("status") String status,Pageable pageable);
    @Query("Select p from Product p where " + " (:productName IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%' , :productName , '%'))) " + " and ( :categoryName IS NULL OR p.category.categoryName = :categoryName) and ( :subCategoryName IS NULL OR p.subCategory.subCategoryName = :subCategoryName)  and ( :brandName IS NULL OR LOWER(p.brand.brandName) = LOWER(:brandName)) ")
    Page<Product> getProductsByCateAndSubCateAndPromoAndName(@Param("productName")String productName, @Param("categoryName") String categoryName, @Param("subCategoryName") String subCategoryName, @Param("brandName") DiscountScope brandName, Pageable pageable);
    @Query("SELECT p FROM Product p JOIN PromotionProduct pp ON pp.product = p JOIN pp.promotion promo WHERE promo.code = :couponCode")
    Page<Product> findProductsByPromotionCode(@Param("couponCode") String couponCode, Pageable pageable);
    @Query("SELECT p FROM Product p JOIN p.productVariant pv ON p.productId = pv.product.productId WHERE (:salePrice IS NULL OR pv.salePrice != :salePrice) AND (:brand IS NULL OR p.brand.brandName IN :brand) AND (:subCategory IS NULL OR p.subCategory.subCategoryName IN :subCategory) AND (:calUnit IS NULL OR pv.calUnit IN :calUnit)")
    Page<Product> findProductsByAdvancedFilter(@Param("salePrice") Integer salePrice,@Param("brand") List<String> brand,@Param("subCategory")List<String> subCategory,@Param("calUnit") List<String> calUnit, Pageable pageable);
    @Query("SELECT p.subCategory.subCategoryName FROM Product p WHERE (:category IS NULL OR p.category.categoryName = :category) AND (:productName IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%',:productName,'%'))) GROUP BY p.subCategory.subCategoryName")
    List<String> facetUnitSubCategory(@Param("category") String category,
                           @Param("productName") String productName);
    @Query("SELECT p.brand.brandName FROM Product p WHERE (:category IS NULL OR p.category.categoryName = :category) AND (:subCategory IS NULL OR p.subCategory.subCategoryName = :subCategory) AND (:productName IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%',:productName,'%'))) GROUP BY p.brand.brandName")
    List<String> facetUnitBrand(@Param("category") String category,
                                @Param("subCategory") String subCategory,
                                @Param("productName") String productName);
    Product findById(long id);
    void deleteById(Long id);
    List<Product> findByCategory_CategoryName(String categoryCategoryName);
    List<Product> findBySubCategory_SubCategoryName(String subCategorySubCategoryName);
    List<Product> findByBrand_BrandName(String brandName);
    Product findByProductName(String productName);
    Page<Product> findAll(Specification<Product> spec,Pageable pageable);
}
