package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.PromotionSubCate;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubPromoRepository extends JpaRepository<PromotionSubCate, Long> {
    PromotionSubCate findById(long id);
    @NonNull
    PromotionSubCate save(@NonNull PromotionSubCate promotionSubCate);
}
