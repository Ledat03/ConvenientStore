package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.PromotionUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPromoRepository extends JpaRepository<PromotionUser, Long> {
    PromotionUser findById(long id);
    PromotionUser save(PromotionUser promotionUser);
}
