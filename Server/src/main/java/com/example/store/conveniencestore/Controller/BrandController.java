package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.BrandDTO;
import com.example.store.conveniencestore.Domain.Brand;
import com.example.store.conveniencestore.Domain.RestResponse;
import com.example.store.conveniencestore.Domain.SubCategory;
import com.example.store.conveniencestore.Service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("brand")
@RequiredArgsConstructor
public class BrandController {
    private final ProductService productService;

    @GetMapping("view")
    public ResponseEntity<Object> viewBrand() {
        return new ResponseEntity<>(productService.viewBrand(), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Object> addBrand(@RequestBody BrandDTO brandDTO) {
        RestResponse<String> restResponse = productService.handleAddBrand(brandDTO);
        return new ResponseEntity<>(restResponse, HttpStatus.valueOf(restResponse.getStatusCode()));
    }

    @PutMapping("update")
    public ResponseEntity<Object> updateBrand(@RequestBody BrandDTO brandDTO) {
        RestResponse<String> restResponse = productService.handleUpdateBrand(brandDTO);
        return new  ResponseEntity<>(restResponse, HttpStatus.valueOf(restResponse.getStatusCode()));
    }
    @DeleteMapping("delete")
    public ResponseEntity<Object> deleteBrand(@RequestParam("brand") long brandId) {
       RestResponse<String> restResponse = productService.handleDeleteBrand(brandId);
        return new ResponseEntity<>(restResponse, HttpStatus.valueOf(restResponse.getStatusCode()));
    }
}
