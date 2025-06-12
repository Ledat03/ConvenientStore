package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.Domain.Cart;
import com.example.store.conveniencestore.Domain.CartDetail;
import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.ProductVariant;
import com.example.store.conveniencestore.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartOrderController {
    private final UserService userService;

    public CartOrderController( UserService userService) {
        this.userService = userService;
    }

    public CartDetailDTO convertToDTO(CartDetail cartDetail) {
        CartDetailDTO cartDetailDTO = new CartDetailDTO();
        cartDetailDTO.setCartDetailId(cartDetail.getId());
        cartDetailDTO.setQuantity(cartDetail.getQuantity());
        cartDetailDTO.setProduct(convertToDTO(cartDetail.getProduct()));
        cartDetailDTO.setProductVariant(convertToDTO(cartDetail.getProductVariant()));
        return cartDetailDTO;
    }

    public ProductVariantDTO convertToDTO(ProductVariant productVariant) {
        ProductVariantDTO productVariantDTO = new ProductVariantDTO();
        productVariantDTO.setProductId(productVariant.getVariantId());
        productVariantDTO.setPrice(productVariant.getPrice());
        productVariantDTO.setSalePrice(productVariant.getSalePrice());
        productVariantDTO.setCalUnit(productVariant.getCalUnit());
        productVariantDTO.setSkuCode(productVariant.getSkuCode());
        productVariantDTO.setProductId(productVariant.getVariantId());
        productVariantDTO.setProductImage(productVariant.getProductImage());
        return productVariantDTO;   
    }
    public ProductDTO convertToDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductId(product.getProductId());
        productDTO.setProductName(product.getProductName());
        productDTO.setCategory(productDTO.getCategory());
        productDTO.setSubCategory(productDTO.getSubCategory());
        productDTO.setImage(product.getImage());
        productDTO.setSku(product.getSku());
        productDTO.setBrand(product.getBrand());
        return productDTO;
    }

    public CartDTO convertCartToDTO(Cart cart) {
        CartDTO cartDTO = new CartDTO();
        cartDTO.setCartId(cart.getId());
        cartDTO.setUserId(cart.getUser().getId());
        cartDTO.setSumQuantity(cart.getSumQuantity());
        List<CartDetailDTO> list = cart.getDetails().stream().map(this::convertToDTO).toList();
        cartDTO.setCartDetailList(list);
        return cartDTO;
    }

    @PostMapping("/add")
    public ResponseEntity<Object> addProductToCart(@RequestBody ReqCartDTO cartDTO) {
        String confirm = userService.AddNewProductToCart(cartDTO.getUserId(), cartDTO.getProductId(),cartDTO.getVariantId(),cartDTO.getQuantity());
        return ResponseEntity.ok().body(confirm);
    }

    @GetMapping("/view")
    public ResponseEntity<Object> viewCart(@RequestParam String userId) {
        Cart cart = userService.getUserCart(Long.parseLong(userId));
        if (cart == null) {
            return ResponseEntity.status(404).body("No cart found");
        }
        CartDTO cartDTO = convertCartToDTO(cart);
        return ResponseEntity.ok().body(cartDTO);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<Object> removeProductFromCart(@RequestParam long cartDetailId) {
        CartDetail cartDetail = userService.findCartDetailById(cartDetailId);
        if (cartDetail == null) {
            return ResponseEntity.notFound().build();
        }
        userService.deleteCartDetail(cartDetailId);
        return ResponseEntity.ok().body("Đã xóa thành công cartDetail " + cartDetailId);
    }
}
