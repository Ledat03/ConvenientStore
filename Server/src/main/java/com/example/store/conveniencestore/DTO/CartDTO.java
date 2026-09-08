package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.Cart;
import lombok.Data;

import java.util.List;

@Data
public class CartDTO {
    private long cartId;
    private long userId;
    private long sumQuantity;
    private List<CartDetailDTO> cartDetailList;

    public static CartDTO convertCartToDTO(Cart cart) {
        CartDTO cartDTO = new CartDTO();
        cartDTO.setCartId(cart.getId());
        cartDTO.setUserId(cart.getUser().getId());
        cartDTO.setSumQuantity(cart.getSumQuantity());
        List<CartDetailDTO> list = cart.getDetails().stream().map(CartDetailDTO::convertCDToDTO).toList();
        cartDTO.setCartDetailList(list);
        return cartDTO;
    }
}
