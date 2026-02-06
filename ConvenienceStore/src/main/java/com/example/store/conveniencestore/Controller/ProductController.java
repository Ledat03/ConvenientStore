package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.ProductDTO;
import com.example.store.conveniencestore.DTO.ManageProductDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.DiscountScope;
import com.example.store.conveniencestore.Service.CloudinaryService;
import com.example.store.conveniencestore.Service.ProductService;
import com.example.store.conveniencestore.Service.PromotionService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("product")
public class ProductController {

    private final ProductService productService;
    private final CloudinaryService cloudinaryService;
    private final PromotionService promotionService;

    public ProductController(ProductService productService, CloudinaryService cloudinaryService, PromotionService promotionService) {
        this.productService = productService;
        this.cloudinaryService = cloudinaryService;
        this.promotionService = promotionService;
    }

    private SubCategory convertSubCategoryDTOToMain(String subCategoryDTO) {
        return productService.findBySubCategoryName(subCategoryDTO);
    }

    private Category convertCategoryDTOtoMain(String subcategory) {
        SubCategory subCategory = productService.findBySubCategoryName(subcategory);
        Category category = productService.findCategoriesByCategory_id(subCategory.getCategory().getCategory_id());
        return category;
    }

    private String getTime(LocalDateTime localDateTime) {
        String formattedTime = localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return formattedTime;
    }

    private LocalDateTime getLocalDateTime() {
        Instant instant = Instant.now();
        LocalDateTime ldt = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
        return ldt;
    }

    private Product convertProductDTOToProduct(ProductDTO productDTO) {
        Product product = productService.findProductById(productDTO.getProductId());
        Brand brand = productService.findBrandbyBrandName(productDTO.getBrand());
        product.setProductName(productDTO.getProductName());
        product.setProductDescription(productDTO.getProductDescription());
        product.setHowToUse(productDTO.getHowToUse());
        product.setPreserve(productDTO.getPreserve());
        product.setOrigin(productDTO.getOrigin());
        product.setCategory(convertCategoryDTOtoMain(productDTO.getSubCategory()));
        product.setSubCategory(convertSubCategoryDTOToMain(productDTO.getSubCategory()));
        product.setIngredient(productDTO.getIngredient());
        product.setBrand(brand);
        product.setStatus(productDTO.getStatus());
        product.setIsActive(Boolean.parseBoolean(productDTO.getIsActive()));
        product.setSku(productDTO.getSku());
        product.setImage(productDTO.getImage() == null ? product.getImage() : "");
        product.setUpdatedAt(getLocalDateTime());
        product.setCreatedAt(product.getCreatedAt());
        return product;
    }

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

    @PostMapping("/add")
    public ResponseEntity<Object> addNewProduct(@RequestParam(value = "productName", required = false) String productName,
            @RequestParam(value = "productDescription", required = false) String productDescription,
            @RequestParam(value = "howToUse", required = false) String howToUse,
            @RequestParam(value = "preserve", required = false) String preserve,
            @RequestParam(value = "origin", required = false) String origin,
            @RequestParam(value = "brand", required = false) String brand,
            @RequestParam(value = "ingredient", required = false) String ingredient,
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "isActive", required = false) String isActive,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "subCategory", required = false) String subCategory) {
        try {
            Product product = new Product();
            product.setProductName(productName);
            product.setProductDescription(productDescription);
            product.setHowToUse(howToUse);
            product.setPreserve(preserve);
            product.setOrigin(origin);
            product.setIngredient(ingredient);
            product.setSku(sku);
            product.setIsActive(Boolean.parseBoolean(isActive));
            product.setStatus(status);
            Brand brandName = productService.findBrandbyBrandName(brand);
            product.setBrand(brandName);
            SubCategory subCate = productService.findBySubCategoryName(subCategory);
            product.setSubCategory(subCate);
            product.setCategory(productService.findCategoriesByCategory_id(subCate.getCategory().getCategory_id()));
            product.setUpdatedAt(getLocalDateTime());
            product.setCreatedAt(getLocalDateTime());
            if (image != null) {
                try {
                    CloudinaryService.UploadResult uploadResult = cloudinaryService.uploadImage(image, "previewproduct");
                    String ImageURL = uploadResult.getUrl();
                    System.out.println("Uploaded image url: " + uploadResult.getPublicId() + uploadResult.getUrl() + uploadResult.getFileSize());
                    product.setImage(ImageURL);
                    productService.save(product);
                } catch (Exception e) {
                    throw e;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        ProductDTO productDTO = new ProductDTO();
        return ResponseEntity.ok(productDTO);
    }

    @GetMapping("/all_products")
    public ResponseEntity<Object> getAllProducts() {
        List<Product> products = productService.getProducts();
        List<ProductDTO> productDTOs = products.stream().map(ProductDTO::new).toList();
        return ResponseEntity.ok().body(productDTOs);
    }

        @GetMapping("/view")
        public ResponseEntity<?> ViewProduct(ManageProductDTO manageProductDTO){
        PageRestsponse<List<ProductDTO>> response = new PageRestsponse<>();
                if(manageProductDTO.getName() != null || manageProductDTO.getStatus() != null || manageProductDTO.getState() != null) {
                    try {
                        Pageable pageable = PageRequest.of(Integer.parseInt(manageProductDTO.getPage()), 8);
                        Page<Product> prodData = productService.getProductWithNameAndStatusAndState(manageProductDTO, pageable);
                        List<ProductDTO> resData = prodData.stream().map(ProductDTO::new).toList();
                        response.setData(resData);
                        response.setTotalItems(prodData.getTotalElements());
                        return ResponseEntity.ok(response);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
            Pageable pageable = PageRequest.of(Integer.parseInt(manageProductDTO.getPage()),8);
            Page<Product> ListProducts = productService.findAllProducts(pageable);
            List<ProductDTO> products = ListProducts.stream().map(ProductDTO::new).toList();
            response.setData(products);
            response.setTotalItems(ListProducts.getTotalElements());
            return ResponseEntity.ok(response);
        }

    @GetMapping("/view/product-info/{id}")
    public ResponseEntity<Product> getProductInfo(@PathVariable long id) {
        Product product = productService.findProductById(id);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/update")
    public ResponseEntity<Object> UpdateProduct(@RequestBody ProductDTO productDTO) {
        if (productDTO != null) {
            Product product = convertProductDTOToProduct(productDTO);
            productService.save(product);
        }
        return ResponseEntity.ok(productDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteProduct(@PathVariable Long id) {
        String Notice = "";
        Product product = productService.findProductById(id);
        try {
            if (product != null) {
                List<ProductVariant> productVariants = productService.findProductVariantsByProductId(id);
                if (!productVariants.isEmpty()) {
                    List<String> ImageURLs;
                    for (ProductVariant productVariant : productVariants) {
                        ImageURLs = productVariant.getProductImage();
                        for (String imageURL : ImageURLs) {
                            cloudinaryService.deleteImage(cloudinaryService.extractPublicIdFromCloudinaryUrl(imageURL));
                            System.out.println("Deleted image url: " + imageURL);
                        }
                    }
                    productService.deleteAllByProduct(product);
                    Notice = "Product deleted successfully";
                }
            }
            if ( product != null && product.getImage() != null) {
                cloudinaryService.deleteImage(cloudinaryService.extractPublicIdFromCloudinaryUrl(product.getImage()));
                System.out.println("Deleted image url: " + product.getImage());
            }

            productService.deleteProduct(id);
        } catch (Exception e) {
            throw new Error(e.getMessage());
        }
        return ResponseEntity.ok(Notice);
    }
}
