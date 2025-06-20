package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Service.ProductService;
import com.example.store.conveniencestore.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final UserService userService;
    private final ProductService productService;

    public CartController(UserService userService, ProductService productService) {
        this.userService = userService;
        this.productService = productService;
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
        productVariantDTO.setId(productVariant.getVariantId());
        productVariantDTO.setProductId(productVariant.getVariantId());
        productVariantDTO.setPrice(productVariant.getPrice());
        productVariantDTO.setSalePrice(productVariant.getSalePrice());
        productVariantDTO.setCalUnit(productVariant.getCalUnit());
        productVariantDTO.setSkuCode(productVariant.getSkuCode());
        productVariantDTO.setProductImage(productVariant.getProductImage());
        return productVariantDTO;   
    }
    public ProductDTO convertToDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductId(product.getProductId());
        productDTO.setProductName(product.getProductName());
        productDTO.setCategory(product.getCategory().getCategoryName());
        productDTO.setSubCategory(product.getSubCategory().getSubCategoryName());
        productDTO.setImage(product.getImage());
        productDTO.setSku(product.getSku());
        productDTO.setBrand(product.getBrand().getBrandName());
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
    public ResponseEntity<Object> viewCart(@RequestParam long userId) {
        Cart cart = userService.getUserCart(userId);
        if (cart == null) {
            Cart newCart = userService.getOrCreateUserCart(userId);
            CartDTO cartDTO = new CartDTO();
            cartDTO.setCartId(newCart.getId());
            cartDTO.setUserId(newCart.getUser().getId());
            cartDTO.setSumQuantity(0);
            List<CartDetailDTO> list  = new ArrayList<>();
            cartDTO.setCartDetailList(list);
            return ResponseEntity.status(200).body("Tạo mới giỏ hàng thành công !");
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
