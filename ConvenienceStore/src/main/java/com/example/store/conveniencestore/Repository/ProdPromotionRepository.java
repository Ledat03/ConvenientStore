package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Promotion;
import com.example.store.conveniencestore.Domain.PromotionProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdPromotionRepository extends JpaRepository<PromotionProduct, Long> {
    PromotionProduct findById(long id);
    void deleteAllByPromotion_CouponId(long promotionCouponId);
    PromotionProduct save(PromotionProduct promotionProduct);
}
