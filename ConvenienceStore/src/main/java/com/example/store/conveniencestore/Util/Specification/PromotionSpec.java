package com.example.store.conveniencestore.Util.Specification;

import com.example.store.conveniencestore.Domain.Promotion;
import com.example.store.conveniencestore.Domain.Promotion_;
import org.springframework.data.jpa.domain.Specification;

public class PromotionSpec {
    public static Specification<Promotion> specPromotion(){
        return (root,query,cb) -> cb.equal(root.get(Promotion_.ACTIVE),true);
    }
}
