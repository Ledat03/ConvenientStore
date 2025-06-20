package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.PromotionBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandPromoRepository extends JpaRepository<PromotionBrand,Long> {
        PromotionBrand save(PromotionBrand promotionBrand);
}
