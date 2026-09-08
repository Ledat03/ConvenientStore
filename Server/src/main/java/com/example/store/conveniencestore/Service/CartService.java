package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.DTO.CartDTO;
import com.example.store.conveniencestore.DTO.CartDetailDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.smartcardio.CardException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final VariantRepository variantRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public RestResponse<String> AddNewProductToCart(long userId, long productId, long variantId, int quantity) throws CardException {
        Cart userCart = cartRepository.findByUser_Id(userId);
        CartDetail cartItem = cartDetailRepository.findByProduct_ProductIdAndCartIdAndProductVariant_VariantId(productId,userCart.getId(),variantId);
        ProductVariant productVariant = variantRepository.findByVariantId(variantId);
        if (productVariant.getStock() < quantity) {
            throw new CardException("Mặt hàng này tạm thời đã hết !");
        }else if (cartItem != null && productVariant.getStock() < cartItem.getQuantity() + quantity) {
            throw new CardException("Mặt hàng này tạm thời đã hết");
        }

        if(userCart != null) {
            CartDetail newCartDetail = cartDetailRepository.findByProduct_ProductIdAndCartIdAndProductVariant_VariantId( productId,userCart.getId(),variantId);
            if (newCartDetail != null && quantity == 1) {
                newCartDetail.setQuantity(newCartDetail.getQuantity() + 1);
                userCart.setSumQuantity(userCart.getSumQuantity()+1);
                cartDetailRepository.save(newCartDetail);
                cartRepository.save(userCart);
                return  RestResponse.ok(200,"Tăng số lượng thành công !");
            }
            if (newCartDetail != null && quantity != 1 ) {
                userCart.setSumQuantity(userCart.getSumQuantity()+quantity);
                newCartDetail.setQuantity(newCartDetail.getQuantity() + quantity);
                cartDetailRepository.save(newCartDetail);
                cartRepository.save(userCart);
                return RestResponse.ok(200,"Tăng nhiều thành công !");
            }
            if (newCartDetail == null && quantity != 1) {
                CartDetail cartDetail = new CartDetail();
                userCart.setSumQuantity(userCart.getSumQuantity()+quantity);
                cartDetail.setProduct(productRepository.findById(productId));
                cartDetail.setProductVariant(variantRepository.findByVariantId(variantId));
                cartDetail.setQuantity(quantity);
                cartDetail.setCart(userCart);
                cartDetailRepository.save(cartDetail);
                cartRepository.save(userCart);
                return RestResponse.ok(201,"Tạo & Thêm nhiều cùng lúc thành công !");
            }
            if (newCartDetail == null && quantity == 1) {
                newCartDetail = new CartDetail();
                newCartDetail.setProduct(productRepository.findById(productId));
                newCartDetail.setProductVariant(variantRepository.findByVariantId(variantId));
                newCartDetail.setQuantity(1);
                newCartDetail.setCart(userCart);
                userCart.setSumQuantity(userCart.getSumQuantity()+1);
                cartDetailRepository.save(newCartDetail);
                return RestResponse.ok(200,"Thêm vào giỏ hàng thành công !");
            }
        }
        if(userCart == null){
            if(quantity == 1) {
                Cart newCart = new Cart();
                CartDetail newCartDetail = new CartDetail();
                newCart.setUser(userRepository.findById(userId));
                newCartDetail.setProduct(productRepository.findById(productId));
                newCartDetail.setProductVariant(variantRepository.findByVariantId(variantId));
                newCartDetail.setCart(newCart);
                newCartDetail.setQuantity(1);
                newCart.setSumQuantity(1);
                cartRepository.save(newCart);
                cartDetailRepository.save(newCartDetail);
                return RestResponse.ok(201,"Tạo mới giỏ hàng và thêm thành công !");
            }
            if (quantity != 1) {
                Cart newCart = new Cart();
                CartDetail newCartDetail = new CartDetail();
                newCart.setUser(userRepository.findById(userId));
                newCartDetail.setProduct(productRepository.findById(productId));
                newCartDetail.setProductVariant(variantRepository.findByVariantId(variantId));
                newCartDetail.setCart(newCart);
                newCartDetail.setQuantity(quantity);
                newCart.setSumQuantity(quantity);
                cartRepository.save(newCart);
                cartDetailRepository.save(newCartDetail);
                return  RestResponse.ok(201,"Tạo mới giỏ hàng và thêm nhiều thành công !");
            }
        }
        return RestResponse.error(400,"Something went wrong !");
    }
    public Cart getUserCart(long userId) {
        return cartRepository.findByUser_Id(userId);

    }
    @Transactional
    public void deleteCartDetail(long CartDetailId) {
        CartDetail cartDetail = cartDetailRepository.findById(CartDetailId);
        Cart cart = cartRepository.findByDetails(cartDetail);
        if(cartDetail != null && cart != null) {
            cart.setSumQuantity(cart.getSumQuantity() - cartDetail.getQuantity());
            cartDetailRepository.deleteById(CartDetailId);
            cartRepository.save(cart);
        }
    }
    public void deleteAllCartDetail(Cart cart) {
        cartDetailRepository.deleteAllByCart(cart);
    }


    public Cart getOrCreateUserCart(long userId) {
        Cart cart = cartRepository.findByUser_Id(userId);
        if (cart == null) {
            cart = new Cart();
            User user = userRepository.findById(userId);
            cart.setUser(user);
            cart.setSumQuantity(0);
            cart = cartRepository.save(cart);

        }
        return cart;
    }

    public CartDetail findCartDetailById(long CartDetailId) {
        return cartDetailRepository.findById(CartDetailId);
    }

    public RestResponse<Object> handleViewCart(long userId){
        Cart cart = getUserCart(userId);
        if (cart == null) {
            Cart newCart = getOrCreateUserCart(userId);
            CartDTO cartDTO = new CartDTO();
            cartDTO.setCartId(newCart.getId());
            cartDTO.setUserId(newCart.getUser().getId());
            cartDTO.setSumQuantity(0);
            List<CartDetailDTO> list  = new ArrayList<>();
            cartDTO.setCartDetailList(list);
            return RestResponse.ok(201,"Creating new cart successfully !");
        }
        CartDTO cartDTO = CartDTO.convertCartToDTO(cart);
        return RestResponse.ok(200,cartDTO);
    }
    @Transactional
    public RestResponse<Object> handleDeleteCard(long cartDetailId) {
        CartDetail cartDetail = findCartDetailById(cartDetailId);
        if (cartDetail == null) {
            return RestResponse.error(400,"Cart detail id not found !");
        }
        deleteCartDetail(cartDetailId);
        return RestResponse.ok(204,"Delete cart successfully !");
    }
}
