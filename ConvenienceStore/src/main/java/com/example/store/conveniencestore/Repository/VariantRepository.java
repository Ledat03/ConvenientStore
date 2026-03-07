package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.ProductVariant;
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
public interface VariantRepository extends JpaRepository<ProductVariant,Long>, JpaSpecificationExecutor<ProductVariant> {

    ProductVariant save(ProductVariant productVariant);
    ProductVariant findByVariantId(long id);
    List<ProductVariant> findByProduct_ProductId(long productProductId);
    void delete(ProductVariant productVariant);
    void deleteAllByProduct(Product product);
    Page<ProductVariant> findAll(Specification<ProductVariant> spec, Pageable pageable);
    @Query("SELECT pv.calUnit FROM ProductVariant pv JOIN pv.product p JOIN p.brand b JOIN p.category c WHERE (:category IS NULL OR c.categoryName = :category) AND (:subCategory IS NULL OR p.subCategory.subCategoryName = :subCategory) AND (:productName IS NULL OR LOWER(p.productName) like LOWER(CONCAT('%' , :productName , '%'))) GROUP BY pv.calUnit")
    List<String> facetUnit(
            @Param("category") String category,
            @Param("subCategory") String subCategory,
            @Param("productName") String productName
    );
    @Query("SELECT pv FROM ProductVariant pv INNER JOIN pv.orderItems oi GROUP BY pv.variantId ORDER BY SUM(oi.quantity) DESC ")
    Page<ProductVariant> findBestSeller(Pageable pageable);
}
