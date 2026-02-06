package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.ProductDTO;
import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Service.ProductService;
import com.example.store.conveniencestore.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
public class MainController {

    private final UserService userService;
    private final ProductService productService;

    public MainController(UserService userService, ProductService productService) {
        this.userService = userService;
        this.productService = productService;
    }

    private String getTime(LocalDateTime localDateTime) {
        String formattedTime = localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return formattedTime;
    }

    @GetMapping("/")
    public ResponseEntity<Object> index() {
        List<Product> productList = productService.getProducts();
        List<ProductDTO> productDTOs = productList.stream().map(ProductDTO::new).toList();
        return ResponseEntity.ok(productDTOs);
    }
}
