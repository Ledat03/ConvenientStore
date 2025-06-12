package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.ProductDTO;
import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.User;
import com.example.store.conveniencestore.Service.ProductService;
import com.example.store.conveniencestore.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/main")
public class MainController {

    private final UserService userService;
    private final ProductService productService;
    public MainController(UserService userService,  ProductService productService) {
        this.userService = userService;
        this.productService = productService;
    }

    @GetMapping("/")
    public ResponseEntity<Object> index() {
        List<Product> productList = productService.findAllProducts();
        return ResponseEntity.ok(productList);
    }
}
