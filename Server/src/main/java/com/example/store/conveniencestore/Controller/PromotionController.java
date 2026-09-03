package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.DiscountScope;
import com.example.store.conveniencestore.Service.PromotionService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("promotion")
public class PromotionController {
    private final PromotionService promotionService;

    public PromotionController( PromotionService promotionService) {
        this.promotionService = promotionService;
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
        List<Promotion> checkOutDated = promotionService.findAll();
        LocalDateTime now = LocalDateTime.now();
        for(Promotion promotion : checkOutDated) {
            if(promotion.getEndDate().isBefore(now)){
                promotionService.changeState(promotion);
            }
        }
        List<Promotion> promotions = promotionService.findAll();
        List<PromotionDTO> promotionDTOs = promotions.stream().map(PromotionDTO::new).toList();
        return ResponseEntity.ok(promotionDTOs);
    }
    @PutMapping("/update")
    public ResponseEntity<Object> updatePromotion(@RequestBody PromotionDTO promotionDTO) {
        Promotion promotion = promotionService.findPromotionById(promotionDTO.getId());
        if(promotionDTO.getScope() == DiscountScope.ALL) {
            Promotion savePromotion = promotionService.savePromotion(promotionDTO);
            return ResponseEntity.ok("Update Successfully ");
        }else{
            Promotion savePromotion = promotionService.updateVariantPromotion(promotionDTO);
            return ResponseEntity.ok("Save Successfully ");
        }
    }
    @DeleteMapping("/delete")
    public ResponseEntity<Object> deletePromotion(@RequestParam("id") long id) {
        Promotion promotion = promotionService.findPromotionById(id);
        if(promotion != null) {
            promotionService.deletePromotion(id);
            return ResponseEntity.ok("Delete Promotion Successfully !");
        }
        return ResponseEntity.notFound().build();
    }
}
