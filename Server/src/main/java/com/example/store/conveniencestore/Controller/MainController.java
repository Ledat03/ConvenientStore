package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.ProductDTO;
import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Service.ProductService;
import com.example.store.conveniencestore.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class MainController {

    private final ProductService productService;

    @GetMapping("/")
    public ResponseEntity<Object> index() {
        List<Product> productList = productService.getProducts();
        List<ProductDTO> productDTOs = productList.stream().map(ProductDTO::new).toList();
        return ResponseEntity.ok(productDTOs);
    }
}
