package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.DTO.Request.AdvFilter;
import com.example.store.conveniencestore.DTO.Request.ProductRqDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Service.CloudinaryService;
import com.example.store.conveniencestore.Service.ProductService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("product")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping("/view/subCategories")
    public ResponseEntity<List<SubCategory>> getSubCategories() {
        List<SubCategory> listOfCate = productService.findAll();
        return ResponseEntity.ok(listOfCate);
    }

    @GetMapping("/view/categories")
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> listOfCate = productService.findAllCategories();
        return ResponseEntity.ok(listOfCate);
    }
    @GetMapping("/count_product")
    public ResponseEntity<Long> countProduct(){
        long totalProduct = productService.countProduct();
        return ResponseEntity.ok(totalProduct);
    }
    @PostMapping("/add")
    public ResponseEntity<?> addNewProduct(@ModelAttribute ProductRqDTO productRqDTO) throws IOException {
            RestResponse<String> restResponse = productService.handleAddProduct(productRqDTO);
            return new ResponseEntity<>(restResponse, HttpStatusCode.valueOf(restResponse.getStatusCode()));
    }

    @GetMapping("/all_products")
    public ResponseEntity<Object> getAllProducts() {
        List<Product> products = productService.getProducts();
        List<ProductDTO> productDTOs = products.stream().map(ProductDTO::new).toList();
        return ResponseEntity.ok().body(productDTOs);
    }
    @PostMapping("/view/multi_filter")
    public ResponseEntity<?> getProductsByMultiFilter(@RequestBody AdvFilter advFilter){
        Pageable pageable = PageRequest.of(advFilter.getPage(),8);
        Page<ProductVariant> data = productService.getProductByAdvFilter(advFilter,pageable);
        List<ProductFormat> dto = data.stream().map(ProductFormat::new).toList();
        PageResponse<List<ProductFormat>> response = new PageResponse<>(dto, data.getTotalElements());
        return ResponseEntity.ok(response);
    }
    @PostMapping("/view/filter")
    public ResponseEntity<?> getFilterData(@RequestBody AdvFilter advFilter){
        FilterData data = productService.getFilterData(advFilter);
        return  ResponseEntity.ok(data);
    }
    @GetMapping("/view")
    public ResponseEntity<?> ViewProduct(ManageProductDTO manageProductDTO){
        PageResponse<List<ProductDTO>> response = productService.handleViewProduct(manageProductDTO);
            return ResponseEntity.ok(response);
        }
    @GetMapping("/view/spec_product")
    public ResponseEntity<?> getBestSeller(
            @RequestParam("type") String type,
            @RequestParam("page") int page) {
        Pageable pageable = PageRequest.of(page,8);
        PageResponse<List<ProductFormat>> resData = new PageResponse<>();
        List<ProductFormat> response;
        if(type != null){
            Page<ProductVariant> data = productService.getNewProducts(type,pageable);
            if(data != null){
            response = data.stream().map(ProductFormat::new).toList();
            resData.setData(response);
            resData.setTotalItems(data.getTotalElements());
            }
        }
        return ResponseEntity.ok(resData);
    }
    @GetMapping("/view/related_product")
    public ResponseEntity<?> getRelatedProducts(@RequestParam long id) {
        Product product = productService.findProductById(id);
        Page<ProductVariant> data = productService.getRelatedProducts(product);
        List<ProductFormat> formatData = data.stream().map(ProductFormat::new).toList();
        PageResponse<List<ProductFormat>> res = new PageResponse<>(formatData, data.getTotalElements());
        return ResponseEntity.ok(res);
    }
    @GetMapping("/view/product-info/{id}")
    public ResponseEntity<ProductDTO> getProductInfo(@PathVariable long id) {
        Product product = productService.findProductById(id);
        ProductDTO response = new ProductDTO(product);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<Object> UpdateProduct(@RequestBody ProductDTO productDTO) {
        RestResponse<Object> restResponse = productService.handleUpdateProduct(productDTO);
        return new ResponseEntity<>( restResponse, HttpStatusCode.valueOf(restResponse.getStatusCode()));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteProduct(@PathVariable long id) {
       RestResponse<String> restResponse = productService.handleDeleteProduct(id);
        return new ResponseEntity<>(restResponse, HttpStatusCode.valueOf(restResponse.getStatusCode()));
    }
}
