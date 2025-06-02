package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.CategoryDTO;
import com.example.store.conveniencestore.DTO.ProductDTO;
import com.example.store.conveniencestore.DTO.SubCategoryDTO;
import com.example.store.conveniencestore.Domain.Category;
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
    private Category convertCategoryDTOtoMain(String subcategory) {
        SubCategory subCategory = productService.findBySubCategoryName(subcategory);
        Category category = productService.findCategoriesByCategory_id(subCategory.getCategory().getCategory_id());
        return category;
    }
    private Product convertProductDTOToProduct(ProductDTO productDTO) {
       Product product = new Product();
       product.setProductId(productDTO.getProductId());
       product.setProductName(productDTO.getProductName());
       product.setProductDescription(productDTO.getProductDescription());
       product.setHowToUse(productDTO.getHowToUse());
       product.setPreserve(productDTO.getPreserve());
       product.setOrigin(productDTO.getOrigin());
       product.setCategory(convertCategoryDTOtoMain(productDTO.getSubCategory()));
       product.setSubCategory(convertSubCategoryDTOToMain(productDTO.getSubCategory()));
       product.setIngredient(productDTO.getIngredient());
       return product;
    }
    private ProductDTO convertProductToProductDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductId(product.getProductId());
        productDTO.setProductName(product.getProductName());
        productDTO.setProductDescription(product.getProductDescription());
        productDTO.setHowToUse(product.getHowToUse());
        productDTO.setPreserve(product.getPreserve());
        productDTO.setOrigin(product.getOrigin());
        productDTO.setCategory(product.getCategory().getCategoryName());
        productDTO.setSubCategory(product.getSubCategory().getSubCategoryName());
        productDTO.setIngredient(product.getIngredient());
        return productDTO;
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
    @GetMapping("/view")
    public ResponseEntity<Object> ViewProduct(){
         List<Product> ListProducts = productService.findAllProducts();
        List<ProductDTO> ListProductDTO = ListProducts.stream().map(this::convertProductToProductDTO).toList();
        return ResponseEntity.ok(ListProductDTO);
    }
    @PutMapping("/update")
    public ResponseEntity<Object> UpdateProduct(@RequestBody ProductDTO productDTO) {
        if(productDTO !=null) {
            Product product = convertProductDTOToProduct(productDTO);
            productService.save(product);
        }
        return ResponseEntity.ok(productDTO);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteProduct(@PathVariable Long id)  {
        String Notice = "";
        try {
            if(productService.findProductById(id) != null) {
                productService.deleteProduct(id);
                Notice = "Product deleted successfully";
            }
            } catch (Exception e){
                throw new Error(e.getMessage());
            }
        return ResponseEntity.ok(Notice);
    }
}
