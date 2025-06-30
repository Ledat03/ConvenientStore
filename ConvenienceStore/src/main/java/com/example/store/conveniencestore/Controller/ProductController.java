package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.CategoryDTO;
import com.example.store.conveniencestore.DTO.ProductDTO;
import com.example.store.conveniencestore.DTO.ProductVariantDTO;
import com.example.store.conveniencestore.DTO.SubCategoryDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.DiscountScope;
import com.example.store.conveniencestore.Service.CloudinaryService;
import com.example.store.conveniencestore.Service.ProductService;
import com.example.store.conveniencestore.Service.PromotionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
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
    private CategoryDTO convertCategoryToDTO(Category category) {
        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setCategoryId(category.getCategory_id());
        categoryDTO.setCategoryName(category.getCategoryName());
        List<SubCategoryDTO> subCategoryDTOList = category.getSubCategories().stream().map(this::convertSubCategoryToDTO).toList();
        categoryDTO.setSubCategories(subCategoryDTOList);
        return categoryDTO;
    }
    private String getTime(LocalDateTime localDateTime) {
        String formattedTime = localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return formattedTime;
    }
    private LocalDateTime getLocalDateTime(){
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
       product.setImage(productDTO.getImage() == null ? product.getImage() : "" );
       product.setUpdatedAt(getLocalDateTime());
       product.setCreatedAt(product.getCreatedAt());
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
        productDTO.setUpdateAt(getTime(product.getUpdatedAt()));
        productDTO.setImage(product.getImage());
        productDTO.setStatus(product.getStatus());
        productDTO.setIsActive(Boolean.toString(product.getIsActive()));
        productDTO.setBrand(product.getBrand().getBrandName());
        productDTO.setSku(product.getSku());
        List<ProductVariantDTO> temp = product.getProductVariant().stream().map(this::convertVariantToDTO).toList();
        productDTO.setProductVariant(temp);
        return productDTO;
    }
    public ProductVariantDTO convertVariantToDTO(ProductVariant product) {
        ProductVariantDTO productVariantDTO = new ProductVariantDTO();
        productVariantDTO.setId(product.getVariantId());
        productVariantDTO.setProductId(product.getProduct().getProductId());
        productVariantDTO.setProductImage(product.getProductImage());
        productVariantDTO.setStock(product.getStock());
        productVariantDTO.setPrice(product.getPrice());
        productVariantDTO.setSalePrice(product.getSalePrice());
        productVariantDTO.setCalUnit(product.getCalUnit());
        productVariantDTO.setSkuCode(product.getSkuCode());
        productVariantDTO.setIsActive(product.getIsActive());
        return productVariantDTO;
    }


    @GetMapping("/view/subCategories")
    public ResponseEntity<List<SubCategoryDTO>> getSubCategories() {
        List<SubCategory> listOfCate = productService.findAll();
        List<SubCategoryDTO> listOfCateDTO = listOfCate.stream().map(this::convertSubCategoryToDTO).toList();
        return ResponseEntity.ok(listOfCateDTO);
    }

    @GetMapping("/view/categories")
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        List<Category> listOfCate = productService.findAllCategories();
        List<CategoryDTO> listOfCateDTO = listOfCate.stream().map(this::convertCategoryToDTO).toList();
        return ResponseEntity.ok(listOfCateDTO);
    }

    @PostMapping("/add")
    public ResponseEntity<Object> addNewProduct(@RequestParam(value = "productName" , required = false) String productName,
                                                @RequestParam(value = "productDescription",required = false) String productDescription,
                                                @RequestParam(value = "howToUse",required = false) String howToUse,
                                                @RequestParam(value = "preserve",required = false) String preserve,
                                                @RequestParam(value = "origin",required = false) String origin,
                                                @RequestParam(value = "brand",required = false) String brand,
                                                @RequestParam(value = "ingredient",required = false) String ingredient,
                                                @RequestParam(value = "sku",required = false) String sku,
                                                @RequestParam(value = "isActive",required = false) String isActive,
                                                @RequestParam(value = "status",required = false) String status,
                                                @RequestParam(value = "image",required = false) MultipartFile image ,
                                                @RequestParam(value = "subCategory",required = false) String subCategory) {
        try{
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
        if(image != null){
            try{
               CloudinaryService.UploadResult uploadResult = cloudinaryService.uploadImage(image,"previewproduct");
                String ImageURL = uploadResult.getUrl();
                System.out.println("Uploaded image url: " + uploadResult.getPublicId() + uploadResult.getUrl() + uploadResult.getFileSize());
                product.setImage(ImageURL);
                productService.save(product);
            }catch (Exception e){
                throw  e;
            }
        }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        ProductDTO productDTO = new ProductDTO();
        return ResponseEntity.ok(productDTO);
    }
    @GetMapping("/view")
    public ResponseEntity<Object> ViewProduct(@RequestParam(value = "category" , required = false) String category,
                                              @RequestParam(value = "subCategory",required = false) String subCategory,
                                              @RequestParam(value = "code",required = false) String code,
                                              @RequestParam(value = "name" ,required = false) String name) {
        if(subCategory != null){
            List<Product> productList = productService.findAllProductsBySubCategory(subCategory);
            List<ProductDTO> ListProductDTO = productList.stream().map(this::convertProductToProductDTO).toList();
            return ResponseEntity.ok(ListProductDTO);
        }else if(subCategory == null && category != null){
            List<Product> ListProducts = productService.findAllProductsByCategory(category);
            List<ProductDTO> ListProductDTO = ListProducts.stream().map(this::convertProductToProductDTO).toList();
            return ResponseEntity.ok(ListProductDTO);
        }
        if(code != null){
            Promotion promotion = promotionService.findPromotionByCode(code);
            List<Product> productList = new ArrayList<>();
            if(promotion.getScope() == DiscountScope.CATEGORY){
                for (PromotionCategory promotionCategory : promotion.getCouponCategories()){
                    List<Product> products  = productService.findAllProductsByCategory(promotionCategory.getCategory().getCategoryName());
                    productList.addAll(products);
                }
                List<ProductDTO> ListProductDTO = productList.stream().map(this::convertProductToProductDTO).toList();
                return ResponseEntity.ok(ListProductDTO);
            }else if(promotion.getScope() == DiscountScope.BRAND){
                for (PromotionBrand promotionBrand : promotion.getPromotionBrands()){
                    List<Product> products  = productService.findAllProductsByBrand(promotionBrand.getBrand().getBrandName());
                    productList.addAll(products);
                }
                List<ProductDTO> ListProductDTO = productList.stream().map(this::convertProductToProductDTO).toList();
                return ResponseEntity.ok(ListProductDTO);
            }else if(promotion.getScope() == DiscountScope.PRODUCT){
                for (PromotionProduct promotionProduct: promotion.getPromotionProducts()){
                    Product products  = productService.findProductByProductName(promotionProduct.getProduct().getProductName());
                    productList.add(products);
                }
                List<ProductDTO> ListProductDTO = productList.stream().map(this::convertProductToProductDTO).toList();
                return ResponseEntity.ok(ListProductDTO);
            }
        }
        if(name != null){
            List<Product> products = productService.findAllProductsBySpec(name);
            if(products.size() > 0){
                List<ProductDTO> productDTOS = products.stream().map(this::convertProductToProductDTO).toList();
                return ResponseEntity.ok(productDTOS);
            }else{
                return ResponseEntity.ofNullable("Product not found");
            }

        }
        List<Product> ListProducts = productService.findAllProducts();
        List<ProductDTO> ListProductDTO = ListProducts.stream().map(this::convertProductToProductDTO).toList();
        return ResponseEntity.ok(ListProductDTO);
    }
    @GetMapping("/view/product-info/{id}")
    public ResponseEntity<ProductDTO> getProductInfo(@PathVariable long id) {
        Product product = productService.findProductById(id);
        ProductDTO productDTO = convertProductToProductDTO(product);
        return ResponseEntity.ok(productDTO);
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
        Product product = productService.findProductById(id);
        try {
            if(product != null) {
                List<ProductVariant> productVariants = productService.findProductVariantsByProductId(id);
                if (!productVariants.isEmpty()){
                    List<String> ImageURLs;
                    for(ProductVariant productVariant : productVariants) {
                        ImageURLs = productVariant.getProductImage();
                        for(String imageURL : ImageURLs) {
                            cloudinaryService.deleteImage(cloudinaryService.extractPublicIdFromCloudinaryUrl(imageURL));
                            System.out.println("Deleted image url: " + imageURL);
                        }
                    }
                    productService.deleteAllByProduct(product);
                    Notice = "Product deleted successfully";
                }
            }
            if(product.getImage() != null) {
                cloudinaryService.deleteImage(cloudinaryService.extractPublicIdFromCloudinaryUrl(product.getImage()));
                System.out.println("Deleted image url: " + product.getImage());
            }

            productService.deleteProduct(id);
            } catch (Exception e){
                throw new Error(e.getMessage());
            }
        return ResponseEntity.ok(Notice);
    }
}
