package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.DiscountScope;
import com.example.store.conveniencestore.Service.PromotionService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("promotion")
public class PromotionController {
    private final PromotionService promotionService;

    public PromotionController( PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    public PromotionDTO convertPromotionToDTO(Promotion promotion) {
        PromotionDTO promotionDTO = new PromotionDTO();
        promotionDTO.setId(promotion.getCouponId());
        promotionDTO.setName(promotion.getName());
        promotionDTO.setCode(promotion.getCode());
        promotionDTO.setDescription(promotion.getDescription());
        promotionDTO.setType(promotion.getType());
        promotionDTO.setScope(promotion.getScope());
        promotionDTO.setDiscountValue(promotion.getDiscountValue());
        promotionDTO.setMaxDiscount(promotion.getMaxDiscount());
        promotionDTO.setMinOrderValue(promotion.getMinOrderValue());
        promotionDTO.setUsageLimit(promotion.getUsageLimit());
        promotionDTO.setStartDate(promotion.getStartDate());
        promotionDTO.setEndDate(promotion.getEndDate());
        promotionDTO.setActive(promotion.isActive());
        if(promotion.getPromotionBrands() != null && !promotion.getPromotionBrands().isEmpty()) {
            List<BrandPromotionDTO> brandPromotionDTOs = promotion.getPromotionBrands().stream().map(this::convertBrandPromotionToDTO).toList();
            promotionDTO.setPromotionBrand(brandPromotionDTOs);
        }else if(promotion.getPromotionProducts() != null && !promotion.getPromotionProducts().isEmpty()) {
            List<ProductPromotionDTO> promotionDTOs = promotion.getPromotionProducts().stream().map(this::convertPPromotionToDTO).toList();
            promotionDTO.setPromotionProducts(promotionDTOs);
        }else if(promotion.getCouponCategories() != null && !promotion.getCouponCategories().isEmpty()) {
            List<CategoryPromotionDTO> promotionDTOs = promotion.getCouponCategories().stream().map(this::convertCategoryPromotionToDTO).toList();
            promotionDTO.setPromotionCategories(promotionDTOs);
        }else if(promotion.getPromotionSubCates() != null && !promotion.getPromotionSubCates().isEmpty()) {
            List<SubCategoryPromotionDTO> promotionDTOs = promotion.getPromotionSubCates().stream().map(this::convertSubCatePromotionToDTO).toList();
            promotionDTO.setPromotionSubCategory(promotionDTOs);
        }
        return promotionDTO;
    }

    public ProductPromotionDTO convertPPromotionToDTO(PromotionProduct promotionProduct) {
        ProductPromotionDTO promotionDTO = new ProductPromotionDTO();
        promotionDTO.setProductId(promotionProduct.getId());
        promotionDTO.setProductName(promotionProduct.getProduct().getProductName());
        return promotionDTO;
    }
    public BrandPromotionDTO convertBrandPromotionToDTO(PromotionBrand promotionBrand) {
        BrandPromotionDTO promotionDTO = new BrandPromotionDTO();
        promotionDTO.setId(promotionBrand.getId());
        promotionDTO.setBrand(promotionBrand.getBrand().getBrandName());
        return promotionDTO;
    }
    public CategoryPromotionDTO convertCategoryPromotionToDTO(PromotionCategory promotionCategory) {
        CategoryPromotionDTO promotionDTO = new CategoryPromotionDTO();
        promotionDTO.setCategoryId(promotionCategory.getId());
        promotionDTO.setCategoryName(promotionCategory.getCategory().getCategoryName());
        return promotionDTO;
    }
    public SubCategoryPromotionDTO convertSubCatePromotionToDTO(PromotionSubCate promotionSubCate) {
        SubCategoryPromotionDTO promotionDTO = new SubCategoryPromotionDTO();
        promotionDTO.setSubCategoryId(promotionSubCate.getId());
        promotionDTO.setSubCategoryName(promotionSubCate.getSubCategory().getSubCategoryName());
        return promotionDTO;
    }
    @PostMapping("/add")
    public ResponseEntity<Object> addNewPromotion(@RequestBody PromotionDTO promotion) {
        if(promotion.getScope() == DiscountScope.ALL) {
            Promotion savePromotion = promotionService.savePromotion(promotion);
            return ResponseEntity.ok(savePromotion);
        }else{
            Promotion savePromotion = promotionService.saveVariantPromotion(promotion);
            return ResponseEntity.ok(savePromotion);
        }
    }

    @GetMapping("/view")
    public ResponseEntity<Object> viewPromotion() {
        List<Promotion> promotions = promotionService.findAll();
        List<PromotionDTO> promotionDTOs = promotions.stream().map(this::convertPromotionToDTO).toList();
        return ResponseEntity.ok(promotionDTOs);
    }
}
