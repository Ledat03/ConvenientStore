package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.CartDetail;
import lombok.Data;

@Data
public class CartDetailDTO {
    private long cartDetailId;
    private long quantity;
    private ProductDTO product;
    private ProductVariantDTO productVariant;

    public static CartDetailDTO convertCDToDTO(CartDetail cartDetail) {
        CartDetailDTO cartDetailDTO = new CartDetailDTO();
        cartDetailDTO.setCartDetailId(cartDetail.getId());
        cartDetailDTO.setQuantity(cartDetail.getQuantity());
        cartDetailDTO.setProduct(ProductDTO.convertProductToDTO(cartDetail.getProduct()));
        cartDetailDTO.setProductVariant(ProductVariantDTO.convertPVToDTO(cartDetail.getProductVariant()));
        return cartDetailDTO;
    }
}
