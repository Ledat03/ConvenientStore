
package com.example.store.conveniencestore.Util.Specification;

import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.DiscountScope;
import com.example.store.conveniencestore.EnumType.PromotionType;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.List;

public final class PromotionSpec {

    private PromotionSpec() {
    }

    public static Specification<Promotion> specPromotion() {
        return (root, query, cb) ->
                cb.isTrue(root.get(Promotion_.ACTIVE));
    }

    public static Specification<Promotion> specPromotionType(
            PromotionType promotionType
    ) {

        return (root, query, cb) ->
                cb.equal(
                        root.get(Promotion_.TYPE),
                        promotionType
                );
    }

    public static Specification<Promotion> specOnListProduct(List<Long> productIds){
        return (root, query, criteriaBuilder) -> {
            Join<PromotionProduct,Promotion> join = root.join("promotion", JoinType.LEFT);
            return join.get("productId").in(productIds);
        };
    }

    public static Specification<Promotion> specPromotionScope(
            DiscountScope discountScope
    ) {

        return (root, query, cb) ->
                cb.equal(
                        root.get(Promotion_.SCOPE),
                        discountScope
                );
    }

    public static Specification<Promotion> specBrandPromotion(
            Brand brand
    ) {
        return specBrandPromotion(brand.getBrandId());
    }

    public static Specification<Promotion> specBrandPromotion(
            Long brandId
    ) {
        return (root, query, cb) -> {

            Subquery<Long> subquery =
                    query.subquery(Long.class);

            Root<PromotionBrand> pb =
                    subquery.from(PromotionBrand.class);

            subquery.select(pb.get("id"));

            subquery.where(
                    cb.equal(
                            pb.get("promotion").get("couponId"),
                            root.get(Promotion_.COUPON_ID)
                    ),
                    cb.equal(
                            pb.get("brand").get("brandId"),
                            brandId
                    )
            );

            return cb.exists(subquery);
        };
    }

    public static Specification<Promotion> specSubCatePromotion(
            Long subCategoryId
    ) {
        return (root, query, cb) -> {

            Subquery<Long> subquery =
                    query.subquery(Long.class);

            Root<PromotionSubCate> ps =
                    subquery.from(PromotionSubCate.class);

            subquery.select(ps.get("id"));

            subquery.where(
                    cb.equal(
                            ps.get("promotion").get("couponId"),
                            root.get(Promotion_.COUPON_ID)
                    ),
                    cb.equal(
                            ps.get("subCategory").get("id"),
                            subCategoryId
                    )
            );

            return cb.exists(subquery);
        };
    }

    public static Specification<Promotion> specCatePromotion(
            Long categoryId
    ) {
        return (root, query, cb) -> {

            Subquery<Long> subquery =
                    query.subquery(Long.class);

            Root<PromotionCategory> pc =
                    subquery.from(PromotionCategory.class);

            subquery.select(pc.get("id"));

            subquery.where(
                    cb.equal(
                            pc.get("promotion").get("couponId"),
                            root.get(Promotion_.COUPON_ID)
                    ),
                    cb.equal(
                            pc.get("category").get("category_id"),
                            categoryId
                    )
            );

            return cb.exists(subquery);
        };
    }

    public static Specification<Promotion> specProductPromotion(
            Long productId
    ) {

        return (root, query, cb) -> {

            Subquery<Long> subquery =
                    query.subquery(Long.class);

            Root<PromotionProduct> pp =
                    subquery.from(PromotionProduct.class);

            subquery.select(pp.get("id"));

            subquery.where(
                    cb.equal(
                            pp.get("promotion").get("couponId"),
                            root.get(Promotion_.COUPON_ID)
                    ),
                    cb.equal(
                            pp.get("product").get("productId"),
                            productId
                    )
            );

            return cb.exists(subquery);
        };
    }

    public static Specification<Promotion> specValidDate(
            LocalDateTime now
    ) {

        return (root, query, cb) ->
                cb.and(
                        cb.lessThanOrEqualTo(
                                root.get(Promotion_.START_DATE),
                                now
                        ),
                        cb.greaterThanOrEqualTo(
                                root.get(Promotion_.END_DATE),
                                now
                        )
                );
    }

    public static Specification<Promotion> specUsageAvailable() {
        return (root, query, cb) ->
                cb.lessThan(
                        root.get(Promotion_.USED_COUNT),
                        root.get(Promotion_.USAGE_LIMIT)
                );
    }

    public static Specification<Promotion> specAvailable(
            LocalDateTime now
    ) {
        return Specification
                .where(specPromotion())
                .and(specValidDate(now))
                .and(specUsageAvailable());
    }

    public static Specification<Promotion> specAllPromotion() {
        return specPromotionScope(DiscountScope.ALL);
    }

    public static Specification<Promotion> specApplicableToProduct(
            Long productId,
            Long brandId,
            Long categoryId,
            Long subCategoryId
    ) {

        Specification<Promotion> applicable =
                specAllPromotion()
                        .or(
                                specPromotionScope(DiscountScope.PRODUCT)
                                        .and(specProductPromotion(productId))
                        );

        if (brandId != null) {
            applicable = applicable.or(
                    specPromotionScope(DiscountScope.BRAND)
                            .and(specBrandPromotion(brandId))
            );
        }

        if (categoryId != null) {
            applicable = applicable.or(
                    specPromotionScope(DiscountScope.CATEGORY)
                            .and(specCatePromotion(categoryId))
            );
        }

        if (subCategoryId != null) {
            applicable = applicable.or(
                    specPromotionScope(DiscountScope.SUBCATEGORY)
                            .and(specSubCatePromotion(subCategoryId))
            );
        }

        return applicable;
    }
}
