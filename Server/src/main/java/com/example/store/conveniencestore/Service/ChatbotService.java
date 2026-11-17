package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.DTO.AIIntentDTO;
import com.example.store.conveniencestore.DTO.Response.ChatProductResponse;
import com.example.store.conveniencestore.DTO.Response.ChatPromotionResponse;
import com.example.store.conveniencestore.DTO.Request.AIProductRes;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.QuestionType;
import com.example.store.conveniencestore.Repository.*;
import com.example.store.conveniencestore.Util.Specification.ProductSpec;
import com.example.store.conveniencestore.Util.Specification.PromotionSpec;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatbotService {
    private final AIService aiService;
    private final VariantRepository variantRepository;
    private final ChatKnowledgeService chatKnowledgeService;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final PromotionRepository promotionRepository;
    public RestResponse<?> classifyAndHandleRequest(String message){
        Pageable pageable = PageRequest.of(0,5);
        AIIntentDTO aiIntentDTO = aiService.exactRequest(message);
        if(aiIntentDTO == null) throw new IllegalArgumentException("Data is undefined !");
        if (aiIntentDTO.needsClarification()) return RestResponse.ok(201,aiIntentDTO.clarificationQuestion());
        if(aiIntentDTO.intent().equals(QuestionType.SEARCH_PRODUCTS) || aiIntentDTO.intent().equals(QuestionType.PRODUCT_ADVICE)){
            Specification<ProductVariant> spec =  Specification.where(ProductSpec.hasProductName(aiIntentDTO.keyword()));
            spec = spec.and(ProductSpec.betweenPrice(List.of(aiIntentDTO.minPrice() == null ? 0 : aiIntentDTO.minPrice(),aiIntentDTO.maxPrice() == null ? 10_000_000 : aiIntentDTO.maxPrice())));
            if(aiIntentDTO.inStockOnly()) spec =  spec.and(ProductSpec.outOfStock());
            if(!aiIntentDTO.brand().isBlank()) spec =  spec.and(ProductSpec.inBrand(List.of(aiIntentDTO.brand())));
            Page<ProductVariant> productVariants = variantRepository.findAll(spec,pageable);
            List<AIProductRes> aiProductRes = productVariants.getContent().stream().map(AIProductRes::convertToProdRes).toList();
            String response = aiService.generateProductReply(message,aiProductRes);
            ChatProductResponse cpr = new ChatProductResponse(response,aiProductRes);
            return RestResponse.ok(200,cpr);
        }
        if(aiIntentDTO.intent().equals(QuestionType.PROMOTION_INQUIRY)){
            Specification<Promotion> specification = Specification.where(PromotionSpec.specPromotion()).and(PromotionSpec.specUsageAvailable());
            if(!aiIntentDTO.brand().isBlank()){
                Brand brand = brandRepository.findByBrandName(aiIntentDTO.brand().toUpperCase());
                if(brand != null) specification = specification.and(PromotionSpec.specBrandPromotion(brand));
            }
            if(!aiIntentDTO.keyword().isBlank()){
                List<Long> productIds = productRepository.findByProductsName(aiIntentDTO.keyword());
                if(productIds != null) {
                    specification = specification.and(PromotionSpec.specOnListProduct(productIds));
                }
            }
            if(aiIntentDTO.categoryId() != null){
                specification = specification.and(PromotionSpec.specCatePromotion(aiIntentDTO.categoryId()));
            }
            if(aiIntentDTO.subCategoryId() != null){
                specification = specification.and(PromotionSpec.specSubCatePromotion(aiIntentDTO.subCategoryId()));
            }
            if(aiIntentDTO.promotionScope() != null){
                specification = specification.and(PromotionSpec.specPromotionScope(aiIntentDTO.promotionScope()));
            }
            if(aiIntentDTO.promotionType() != null){
                specification = specification.and(PromotionSpec.specPromotionType(aiIntentDTO.promotionType()));
            }
            Page<Promotion> promotions = promotionRepository.findAll(specification,pageable);
            List<Promotion> promotionList = promotions.getContent();
            ChatPromotionResponse chatPromotionResponse = aiService.generatePromotionReply(message,promotionList);
            return RestResponse.ok(200,aiIntentDTO);
        }
        if(aiIntentDTO.intent().equals(QuestionType.TERM_SERVICE)){
            return handleTermsRequest(aiIntentDTO.keyword());
        }
        if(aiIntentDTO.intent().equals(QuestionType.GENERAL_SUPPORT)){
            return handleSupportRequest(aiIntentDTO.keyword());
        }
        if(aiIntentDTO.intent().equals(QuestionType.UNKNOWN)){
            return RestResponse.ok(
                    200,
                    "Tôi chưa có hướng dẫn cụ thể cho vấn đề này. " +
                            "Bạn có thể mô tả rõ hơn thao tác đang gặp khó khăn " +
                            "để tôi xác định nội dung hỗ trợ phù hợp không?"
            );
        }
        return RestResponse.ok(
                200,
                "Tôi chưa có hướng dẫn cụ thể cho vấn đề này. " +
                        "Bạn có thể mô tả rõ hơn thao tác đang gặp khó khăn " +
                        "để tôi xác định nội dung hỗ trợ phù hợp không?"
        );
    }
    private RestResponse<String> handleTermsRequest(String keyword) {

        return chatKnowledgeService
                .findArticle("TERM_SERVICE", keyword)
                .filter(article ->
                        article.answer() != null &&
                                !article.answer().isBlank()
                )
                .map(article ->
                        RestResponse.ok(200, article.answer())
                )
                .orElseGet(() ->
                        RestResponse.ok(
                                200,
                                "Hiện tại tôi chưa có thông tin chính sách " +
                                        "đã được xác nhận cho nội dung bạn hỏi. " +
                                        "Bạn vui lòng liên hệ bộ phận hỗ trợ " +
                                        "của ConvenientStore để được giải đáp chính xác."
                        )
                );
    }

    private RestResponse<String> handleSupportRequest(String keyword) {

        return chatKnowledgeService
                .findArticle("GENERAL_SUPPORT", keyword)
                .filter(article ->
                        article.answer() != null &&
                                !article.answer().isBlank()
                )
                .map(article ->
                        RestResponse.ok(200, article.answer())
                )
                .orElseGet(() ->
                        RestResponse.ok(
                                200,
                                "Tôi chưa có hướng dẫn cụ thể cho vấn đề này. " +
                                        "Bạn có thể mô tả rõ hơn thao tác đang gặp khó khăn " +
                                        "để tôi xác định nội dung hỗ trợ phù hợp không?"
                        )
                );
    }
}
