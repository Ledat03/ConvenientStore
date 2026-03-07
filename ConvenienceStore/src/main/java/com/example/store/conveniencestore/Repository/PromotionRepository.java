package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Category;
import com.example.store.conveniencestore.Domain.Promotion;
import com.example.store.conveniencestore.Domain.PromotionCategory;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion,Long>, JpaSpecificationExecutor<Promotion> {
    Promotion findByCouponId(long couponId);
    Promotion findByCode(String code);
    Promotion findByCouponCategories(PromotionCategory couponCategory);
    void deleteByCouponId(long couponId);
    List<Promotion> findAll(Specification<Promotion> specification);
    @Transactional
    Promotion save(Promotion promotion);
}
