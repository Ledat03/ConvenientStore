package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Repository.*;
import com.example.store.conveniencestore.Util.Specification.ProductSpec;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final ProductService productService;
    private final ProdPromotionRepository prodPromotionRepository;
    private final SubPromoRepository subPromoRepository;
    private final CatePromotionRepository catePromotionRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final BrandPromoRepository brandPromoRepository;
    public PromotionService(SubCategoryRepository subCategoryRepository ,
                            PromotionRepository promotionRepository,
                            ProdPromotionRepository prodPromotionRepository,
                            SubPromoRepository subPromoRepository,
                            CatePromotionRepository catePromotionRepository,
                            BrandPromoRepository brandPromoRepository,
                            ProductService productService) {
        this.promotionRepository = promotionRepository;
        this.prodPromotionRepository = prodPromotionRepository;
        this.subPromoRepository = subPromoRepository;
        this.catePromotionRepository = catePromotionRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.productService = productService;
        this.brandPromoRepository = brandPromoRepository;
    }

    public List<Promotion> findAll() {
        return promotionRepository.findAll();
    }
    @Transactional
    public Promotion savePromotion(PromotionDTO promotionDTO) {
        Promotion promotion = promotionRepository.findByCouponId(promotionDTO.getId());
        if(promotion == null) {
            Promotion newPromotion = new Promotion();
            newPromotion.setName(promotionDTO.getName());
            newPromotion.setCode(promotionDTO.getCode());
            newPromotion.setDescription(promotionDTO.getDescription());
            newPromotion.setType(promotionDTO.getType());
            newPromotion.setScope(promotionDTO.getScope());
            newPromotion.setDiscountValue(promotionDTO.getDiscountValue());
            newPromotion.setMaxDiscount(promotionDTO.getMaxDiscount());
            newPromotion.setMinOrderValue(promotionDTO.getMinOrderValue());
            newPromotion.setUsageLimit(promotionDTO.getUsageLimit());
            newPromotion.setUserUsageLimit(promotionDTO.getUserUsageLimit());
            newPromotion.setStartDate(promotionDTO.getStartDate());;
            newPromotion.setEndDate(promotionDTO.getEndDate());
            newPromotion.setActive(promotionDTO.isActive());
            newPromotion.setCreatedAt(promotionDTO.getCreatedAt());
            newPromotion.setUpdatedAt(promotionDTO.getUpdatedAt());
            return promotionRepository.save(newPromotion);
        }
        promotion.setName(promotionDTO.getName());
        promotion.setCode(promotionDTO.getCode());
        promotion.setDescription(promotionDTO.getDescription());
        promotion.setType(promotionDTO.getType());
        promotion.setScope(promotionDTO.getScope());
        promotion.setDiscountValue(promotionDTO.getDiscountValue());
        promotion.setMaxDiscount(promotionDTO.getMaxDiscount());
        promotion.setMinOrderValue(promotionDTO.getMinOrderValue());
        promotion.setUsageLimit(promotionDTO.getUsageLimit());
        promotion.setUserUsageLimit(promotionDTO.getUserUsageLimit());
        promotion.setStartDate(promotionDTO.getStartDate());;
        promotion.setEndDate(promotionDTO.getEndDate());
        promotion.setActive(promotionDTO.isActive());
        promotion.setCreatedAt(promotionDTO.getCreatedAt());
        promotion.setUpdatedAt(promotionDTO.getUpdatedAt());
        deleteAllCatePromotion(promotion.getCouponId());
        deleteAllBrandPromotion(promotion.getCouponId());
        deleteAllProdPromotion(promotion.getCouponId());
        return promotion;
    }
    public Promotion saveVariantPromotion(PromotionDTO promotionDTO) {
        Promotion promotion = new Promotion();
        promotion.setName(promotionDTO.getName());
        promotion.setCode(promotionDTO.getCode());
        promotion.setDescription(promotionDTO.getDescription());
        promotion.setType(promotionDTO.getType());
        promotion.setScope(promotionDTO.getScope());
        promotion.setDiscountValue(promotionDTO.getDiscountValue());
        promotion.setMaxDiscount(promotionDTO.getMaxDiscount());
        promotion.setMinOrderValue(promotionDTO.getMinOrderValue());
        promotion.setUsageLimit(promotionDTO.getUsageLimit());
        promotion.setUserUsageLimit(promotionDTO.getUserUsageLimit());
        promotion.setStartDate(promotionDTO.getStartDate());;
        promotion.setEndDate(promotionDTO.getEndDate());
        promotion.setActive(promotionDTO.isActive());
        promotion.setCreatedAt(promotionDTO.getCreatedAt());
        promotion.setUpdatedAt(promotionDTO.getUpdatedAt());
        promotionRepository.save(promotion);
        if(promotionDTO.getPromotionCategories() != null && !promotionDTO.getPromotionCategories().isEmpty()) {
            for(CategoryPromotionDTO categoryPromotionDTO : promotionDTO.getPromotionCategories()) {
                PromotionCategory promotionCategory = new PromotionCategory();
                Category category = productService.findCategoriesByCategory_id(categoryPromotionDTO.getCategoryId());
                Promotion promo = promotionRepository.findByCode(promotionDTO.getCode());
                promotionCategory.setCategory(category);
                promotionCategory.setPromotion(promo);
                promotionCategory.setCreatedAt(promotionDTO.getCreatedAt());
                catePromotionRepository.save(promotionCategory);
            }
        }
        if(promotionDTO.getPromotionBrand() != null && !promotionDTO.getPromotionBrand().isEmpty()) {
            for(BrandPromotionDTO brandPromotionDTO : promotionDTO.getPromotionBrand()) {
                PromotionBrand promotionBrand = new PromotionBrand();
                Brand tempBrand = productService.findBrandById(brandPromotionDTO.getId());
                Promotion promo = promotionRepository.findByCode(promotionDTO.getCode());
                promotionBrand.setBrand(tempBrand);
                promotionBrand.setPromotion(promo);
                promotionBrand.setCreatedAt(promotionDTO.getCreatedAt());
                brandPromoRepository.save(promotionBrand);
            }
        }
        if(promotionDTO.getPromotionProducts() != null && !promotionDTO.getPromotionProducts().isEmpty()) {
            for(ProductPromotionDTO productPromotionDTO : promotionDTO.getPromotionProducts()) {
                PromotionProduct promotionProduct = new PromotionProduct();
                Product product = productService.findProductById(productPromotionDTO.getProductId());
                Promotion promo = promotionRepository.findByCode(promotionDTO.getCode());
                promotionProduct.setProduct(product);
                promotionProduct.setPromotion(promo);
                promotionProduct.setCreatedAt(promotionDTO.getCreatedAt());
                prodPromotionRepository.save(promotionProduct);
            }
        }
        if(promotionDTO.getPromotionSubCategory() != null && !promotionDTO.getPromotionSubCategory().isEmpty()) {
            for(SubCategoryPromotionDTO subCategoryPromotionDTO : promotionDTO.getPromotionSubCategory()) {
                PromotionSubCate promotionSubCate = new PromotionSubCate();
                SubCategory subCategory = subCategoryRepository.findById(subCategoryPromotionDTO.getSubCategoryId());
                Promotion promo = promotionRepository.findByCode(promotionDTO.getCode());
                promotionSubCate.setSubCategory(subCategory);
                promotionSubCate.setPromotion(promo);
                promotionSubCate.setCreatedAt(promotionDTO.getCreatedAt());
                subCategoryRepository.save(subCategory);
            }
        }
        return promotion;
    }
    @Transactional
    public Promotion updateVariantPromotion(PromotionDTO promotionDTO) {
        Promotion promotion = promotionRepository.findByCouponId(promotionDTO.getId());
        if(promotion != null) {
            promotion.setName(promotionDTO.getName());
            promotion.setCode(promotionDTO.getCode());
            promotion.setDescription(promotionDTO.getDescription());
            promotion.setType(promotionDTO.getType());
            promotion.setScope(promotionDTO.getScope());
            promotion.setDiscountValue(promotionDTO.getDiscountValue());
            promotion.setMaxDiscount(promotionDTO.getMaxDiscount());
            promotion.setMinOrderValue(promotionDTO.getMinOrderValue());
            promotion.setUsageLimit(promotionDTO.getUsageLimit());
            promotion.setUserUsageLimit(promotionDTO.getUserUsageLimit());
            promotion.setStartDate(promotionDTO.getStartDate());;
            promotion.setEndDate(promotionDTO.getEndDate());
            promotion.setActive(promotionDTO.isActive());
            promotion.setCreatedAt(promotionDTO.getCreatedAt());
            promotion.setUpdatedAt(promotionDTO.getUpdatedAt());
            deleteAllCatePromotion(promotion.getCouponId());
            deleteAllBrandPromotion(promotion.getCouponId());
            deleteAllProdPromotion(promotion.getCouponId());
            promotionRepository.save(promotion);
            if(promotionDTO.getPromotionCategories() != null && !promotionDTO.getPromotionCategories().isEmpty()) {
                for(CategoryPromotionDTO categoryPromotionDTO : promotionDTO.getPromotionCategories()) {
                    PromotionCategory promotionCategory = new PromotionCategory();
                    Category category = productService.findCategoriesByCategory_id(categoryPromotionDTO.getCategoryId());
                    Promotion promo = promotionRepository.findByCouponId(promotionDTO.getId());
                    promotionCategory.setCategory(category);
                    promotionCategory.setPromotion(promo);
                    promotionCategory.setCreatedAt(promotionDTO.getCreatedAt());
                    catePromotionRepository.save(promotionCategory);
                }
            }
            if(promotionDTO.getPromotionBrand() != null && !promotionDTO.getPromotionBrand().isEmpty()) {
                for(BrandPromotionDTO brandPromotionDTO : promotionDTO.getPromotionBrand()) {
                    PromotionBrand promotionBrand = new PromotionBrand();
                    Brand tempBrand = productService.findBrandById(brandPromotionDTO.getId());
                    Promotion promo = promotionRepository.findByCouponId(promotionDTO.getId());
                    promotionBrand.setBrand(tempBrand);
                    promotionBrand.setPromotion(promo);
                    promotionBrand.setCreatedAt(promotionDTO.getCreatedAt());
                    brandPromoRepository.save(promotionBrand);
                }
            }
            if(promotionDTO.getPromotionProducts() != null && !promotionDTO.getPromotionProducts().isEmpty()) {
                for(ProductPromotionDTO productPromotionDTO : promotionDTO.getPromotionProducts()) {
                        PromotionProduct promotionProduct = new PromotionProduct();
                        Product product = productService.findProductById(productPromotionDTO.getProductId());
                        Promotion promo = promotionRepository.findByCouponId(promotionDTO.getId());
                        promotionProduct.setProduct(product);
                        promotionProduct.setPromotion(promo);
                        promotionProduct.setCreatedAt(promotionDTO.getCreatedAt());
                        prodPromotionRepository.save(promotionProduct);
                }
            }
            if(promotionDTO.getPromotionSubCategory() != null && !promotionDTO.getPromotionSubCategory().isEmpty()) {
                for (SubCategoryPromotionDTO subCategoryPromotionDTO : promotionDTO.getPromotionSubCategory()) {
                    PromotionSubCate promotionSubCate = new PromotionSubCate();
                    SubCategory subCategory = subCategoryRepository.findById(subCategoryPromotionDTO.getSubCategoryId());
                    Promotion promo = promotionRepository.findByCouponId(promotionDTO.getId());
                    promotionSubCate.setSubCategory(subCategory);
                    promotionSubCate.setPromotion(promo);
                    promotionSubCate.setCreatedAt(promotionDTO.getCreatedAt());
                    subCategoryRepository.save(subCategory);
                }
            }
        }
        return promotion;
    }
    public PromotionProduct savePromotionProduct(PromotionProduct promotionProduct) {
        return prodPromotionRepository.save(promotionProduct);
    }
    public PromotionSubCate savePromotionSubCate(PromotionSubCate promotionSubCate) {
            return subPromoRepository.save(promotionSubCate);
    }
    public PromotionCategory savePromotionCategory(PromotionCategory promotionCategory) {
        return catePromotionRepository.save(promotionCategory);
    }
    public PromotionCategory findPromotionCategoryById(long id) {
        return catePromotionRepository.findById(id);
    }
    public Promotion findPromotionByCode(String code) {
        return promotionRepository.findByCode(code);
    }
    public Promotion findPromotionByCategoryPromo(PromotionCategory promotionCategory) {
        return promotionRepository.findByCouponCategories(promotionCategory);
    }
    public Promotion findPromotionById(long id) {
        return  promotionRepository.findByCouponId(id);
    }
    public void deleteAllProdPromotion(long promotion) {
        prodPromotionRepository.deleteAllByPromotion_CouponId(promotion);
    }
    @Transactional
    public void deletePromotion(long promotionId) {
        promotionRepository.deleteById(promotionId);
    }
    public void deleteAllBrandPromotion(long promotion) {
        brandPromoRepository.deleteAllByPromotion_CouponId(promotion);
    }
    public void deleteAllCatePromotion(long promotion) {
        catePromotionRepository.deleteAllByPromotion_CouponId(promotion);
    }
}
