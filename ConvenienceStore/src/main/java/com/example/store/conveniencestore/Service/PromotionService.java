package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Repository.*;
import com.example.store.conveniencestore.Util.Specification.ProductSpec;
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

    public Promotion savePromotion(PromotionDTO promotionDTO) {
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
        return promotionRepository.save(promotion);
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
}
