package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.ProductDTO;
import com.example.store.conveniencestore.DTO.SubCategoryDTO;
import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.SubCategory;
import com.example.store.conveniencestore.Service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("product")
public class ProductController {
    private final ProductService productService;

    private SubCategoryDTO convertSubCategoryToDTO(SubCategory subCategory) {
        SubCategoryDTO subCategoryDTO = new SubCategoryDTO();
        subCategoryDTO.setId(subCategory.getId());
        subCategoryDTO.setSubCategoryName(subCategory.getSubCategoryName());
        return subCategoryDTO;
    }
    private SubCategory convertSubCategoryDTOToMain(String subCategoryDTO) {
        return productService.findBySubCategoryName(subCategoryDTO);
    }
    private Product convertProductDTOToProduct(ProductDTO productDTO) {
        Product product = new Product();
       product.setProductName(productDTO.getProductName());
       product.setProductDescription(productDTO.getProductDescription());
       product.setHowToUse(productDTO.getHowToUse());
       product.setPreserve(productDTO.getPreserve());
       product.setOrigin(productDTO.getOrigin());
       product.setSubCategory(convertSubCategoryDTOToMain(productDTO.getSubCategory()));
       product.setIngredient(productDTO.getIngredient());
        return product;
    }

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/view/subCategories")
    public ResponseEntity<List<SubCategoryDTO>> getSubCategories() {
        List<SubCategory> listOfCate = productService.findAll();
        List<SubCategoryDTO> listOfCateDTO = listOfCate.stream().map(this::convertSubCategoryToDTO).toList();
        return ResponseEntity.ok(listOfCateDTO);
    }
    @PostMapping("/add")
    public ResponseEntity<Object> addNewProduct(@RequestBody ProductDTO productDTO) {
        Product product = convertProductDTOToProduct(productDTO);
        try{
            productService.save(product);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(productDTO);
    }
}
