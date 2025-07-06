package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.BrandDTO;
import com.example.store.conveniencestore.Domain.Brand;
import com.example.store.conveniencestore.Domain.SubCategory;
import com.example.store.conveniencestore.Service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("brand")
public class BrandController {
    private final ProductService productService;
    public BrandController(ProductService productService) {
        this.productService = productService;
    }
    public BrandDTO convertBrandToBrandDTO(Brand brand) {
        BrandDTO brandDTO = new BrandDTO();
        brandDTO.setBrandId(brand.getBrandId());
        brandDTO.setBrandName(brand.getBrandName());
        return brandDTO;
    }
    @GetMapping("view")
    public ResponseEntity<Object> viewBrand() {
        List<Brand> brandList = productService.findAllBrands();
        List<BrandDTO> brandDTOs =  brandList.stream().map(this::convertBrandToBrandDTO).toList();
        return ResponseEntity.ok(brandDTOs);
    }

    @PostMapping("/add")
    public ResponseEntity<Object> addBrand(@RequestBody BrandDTO brandDTO) {
        Brand checkBrand  = productService.findBrandbyBrandName(brandDTO.getBrandName());
        if(checkBrand != null) {
            return ResponseEntity.status(400).body("Nhãn hàng đã tồn tại !");
        }
        Brand brand = new Brand();
        String brandName = brandDTO.getBrandName().toUpperCase();
        brand.setBrandName(brandName);
        productService.addBrand(brand);
        return ResponseEntity.ok("Success" + brand.getBrandName());
    }

    @PutMapping("update")
    public ResponseEntity<Object> updateBrand(@RequestBody BrandDTO brandDTO) {
        Brand brand = productService.findBrandById(brandDTO.getBrandId());
        brand.setBrandName(brandDTO.getBrandName());
        productService.addBrand(brand);
        return ResponseEntity.ok("Success");
    }
    @DeleteMapping("delete")
    public ResponseEntity<Object> deleteBrand(@RequestParam("brand") long brandId) {
        Brand brand = productService.findBrandById(brandId);
        productService.deleteBrand(brandId);
        return ResponseEntity.ok("Success");
    }
}
