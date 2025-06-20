package com.example.store.conveniencestore.Util.Specification;

import com.example.store.conveniencestore.Domain.Category;
import com.example.store.conveniencestore.Domain.Category_;
import com.example.store.conveniencestore.Domain.PromotionCategory;
import com.example.store.conveniencestore.Domain.PromotionCategory_;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class PromotionSpec {
    public static Specification<PromotionCategory> promotionCategorySpecification(String category) {
        return (root, query, criteriaBuilder) -> {
            Join<PromotionCategory, Category> joinTable = root.join(PromotionCategory_.CATEGORY);
            return criteriaBuilder.equal(joinTable.get(Category_.CATEGORY_NAME), category);
        };
    }

}
