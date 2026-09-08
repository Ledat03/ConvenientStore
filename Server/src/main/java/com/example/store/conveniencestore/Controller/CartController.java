package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.DTO.Request.ReqCartDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Service.CartService;
import com.example.store.conveniencestore.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.smartcardio.CardException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addProductToCart(@RequestBody ReqCartDTO cartDTO) throws CardException {
        if (cartDTO != null) {
            RestResponse<String> result = cartService.AddNewProductToCart(
                    cartDTO.getUserId(),
                    cartDTO.getProductId(),
                    cartDTO.getVariantId(),
                    cartDTO.getQuantity()
            );
            return new ResponseEntity<>(result, HttpStatusCode.valueOf( result.getStatusCode()));

        }
       return new ResponseEntity<>("Something went wrong !",HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/view")
    public ResponseEntity<Object> viewCart(@RequestParam long userId) {
        RestResponse<Object> restResponse = cartService.handleViewCart(userId);
        return new ResponseEntity<>(restResponse, HttpStatus.valueOf(restResponse.getStatusCode()));
    }
    @DeleteMapping("/delete")
    public ResponseEntity<Object> removeProductFromCart(@RequestParam long cartDetailId) {
       RestResponse<Object> restResponse = cartService.handleDeleteCard(cartDetailId);
        return new ResponseEntity<>(restResponse, HttpStatus.valueOf(restResponse.getStatusCode()));
    }
}
