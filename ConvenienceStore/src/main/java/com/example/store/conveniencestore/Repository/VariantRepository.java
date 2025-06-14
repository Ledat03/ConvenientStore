package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariantRepository extends JpaRepository<ProductVariant,Long> {

    ProductVariant save(ProductVariant productVariant);
    ProductVariant findByVariantId(long id);
    List<ProductVariant> findByProduct_ProductId(long productProductId);
    void delete(ProductVariant productVariant);
    void deleteAllByProduct(Product product);
}
