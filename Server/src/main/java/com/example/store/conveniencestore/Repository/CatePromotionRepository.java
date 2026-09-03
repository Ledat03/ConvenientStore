package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Promotion;
import com.example.store.conveniencestore.Domain.PromotionCategory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CatePromotionRepository extends JpaRepository<PromotionCategory,Long> {
    PromotionCategory findById(long id);
    List<PromotionCategory> findAll(Specification<PromotionCategory> spec);
    PromotionCategory save(PromotionCategory promotionCategory);
    void deleteAllByPromotion_CouponId(long id);
}
