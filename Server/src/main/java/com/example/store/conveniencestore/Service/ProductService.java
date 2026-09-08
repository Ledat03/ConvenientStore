package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.DTO.Request.AdvFilter;
import com.example.store.conveniencestore.DTO.Request.ProductRqDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.DiscountScope;
import com.example.store.conveniencestore.Repository.*;
import com.example.store.conveniencestore.Util.Specification.ProductSpec;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final SubCategoryRepository subCategoryRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final VariantRepository variantRepository;
    private final BrandRepository brandRepository;
    private final ImportRepository importRepository;
    private final PromotionRepository promotionRepository;
    private final CloudinaryService cloudinaryService;
    private LocalDateTime getLocalDateTime() {
        Instant instant = Instant.now();
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
    }

    public Category findCategoriesByCategory_id(long id) {
        return categoryRepository.findById(id);
    }

    public List<SubCategory> findAll() {
        return subCategoryRepository.findAll();
    }

    public Page<Product> findAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    public List<Product> getProducts() {
        return productRepository.getAllProduct();
    }

    public SubCategory findBySubCategoryName(String subCategoryName) {
        return subCategoryRepository.findBySubCategoryName(subCategoryName);
    }

    public List<Product> findAllProductsByBrand(String brandName) {
        return productRepository.findByBrand_BrandName(brandName);
    }

    @Transactional
    public void save(Product product) {
        productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(long id) {
        productRepository.deleteById(id);
    }

    public Product findProductById(long id) {
        return productRepository.findById(id);
    }

    @Transactional
    public ProductVariant saveVariant(ProductVariant productVariant) {
        return variantRepository.save(productVariant);
    }

    public ProductVariant findProductVariantById(long id) {
        return variantRepository.findByVariantId(id);
    }

    @Transactional
    public void deleteVariant(ProductVariant productVariant) {
        variantRepository.delete(productVariant);
    }

    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

    public List<ProductVariant> findProductVariantsByProductId(long productId) {
        return variantRepository.findByProduct_ProductId(productId);
    }
    public long countProduct(){
        return productRepository.count();
    }
    @Transactional
    public void deleteAllByProduct(Product product) {
        variantRepository.deleteAllByProduct(product);
    }

    public Brand findBrandbyBrandName(String brandName) {
        return brandRepository.findByBrandName(brandName);
    }

    public List<Brand> findAllBrands() {
        return brandRepository.findAll();
    }

    public Brand findBrandById(long id) {
        return brandRepository.findById(id);
    }


    public Brand addBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    @Transactional
    public RestResponse<String> handleAddProduct(ProductRqDTO productRqDTO) throws IOException {
        if (productRqDTO.getBrand() == null || productRqDTO.getBrand().isBlank()) {
            return RestResponse.error(400,"Brand field is required");
        }
        if (productRqDTO.getSubCategory() == null || productRqDTO.getSubCategory().isBlank()) {
            return RestResponse.error(400,"SubCategory field is required");
        }
        Brand brandEntity = findBrandbyBrandName(productRqDTO.getBrand().trim());
        if (brandEntity == null) {
            return RestResponse.error(400,"Brand isn't exist !: " + productRqDTO.getBrand());
        }
        SubCategory subCate = findBySubCategoryName(productRqDTO.getSubCategory().trim());
        if (subCate == null) {
            return RestResponse.error(400,"Subcategory isn't exist !: " + productRqDTO.getSubCategory());
        }
        Product product = new Product();
        product.setProductName(productRqDTO.getProductName().trim());
        product.setProductDescription(productRqDTO.getProductDescription().trim());
        product.setHowToUse(productRqDTO.getHowToUse().trim());
        product.setPreserve(productRqDTO.getPreserve().trim());
        product.setOrigin(productRqDTO.getOrigin().trim());
        product.setIngredient(productRqDTO.getIngredient().trim());
        product.setSku(productRqDTO.getSku().trim());
        product.setIsActive(Boolean.parseBoolean(productRqDTO.getIsActive().trim()));
        product.setStatus(productRqDTO.getStatus().trim());
        product.setBrand(brandEntity);
        product.setSubCategory(subCate);
        product.setCategory(subCate.getCategory());
        product.setCreatedAt(getLocalDateTime());
        product.setUpdatedAt(getLocalDateTime());

        if (productRqDTO.getImage() != null && !productRqDTO.getImage().isEmpty()) {
            CloudinaryService.UploadResult uploadResult = cloudinaryService.uploadImage(productRqDTO.getImage(), "previewproduct");
            product.setImage(uploadResult.getUrl());
        }
        save(product);
        return RestResponse.ok(201,"Data has already saved ! ");
    }
    @Transactional
    public RestResponse<String> handleDeleteProduct(long id) {
        Product product = findProductById(id);
        if (product != null) {
            List<ProductVariant> productVariants = findProductVariantsByProductId(id);
            if (!productVariants.isEmpty()) {
                List<String> ImageURLs;
                for (ProductVariant productVariant : productVariants) {
                    ImageURLs = productVariant.getProductImage();
                    for (String imageURL : ImageURLs) {
                        cloudinaryService.deleteImage(cloudinaryService.extractPublicIdFromCloudinaryUrl(imageURL));
                        System.out.println("Deleted image url: " + imageURL);
                    }
                }
                deleteAllByProduct(product);
            }
        }
        if ( product != null && product.getImage() != null) {
            cloudinaryService.deleteImage(cloudinaryService.extractPublicIdFromCloudinaryUrl(product.getImage()));
            System.out.println("Deleted image url: " + product.getImage());
        }
        deleteProduct(id);
        return  RestResponse.ok(204, "Product deleted successfully");
    }
    public PageResponse<List<ProductDTO>> handleViewProduct(ManageProductDTO manageProductDTO) {
        PageResponse<List<ProductDTO>> response = new PageResponse<>();
        if(manageProductDTO.getName() != null || manageProductDTO.getStatus() != null || manageProductDTO.getState() != null) {
                Pageable pageable = PageRequest.of(Integer.parseInt(manageProductDTO.getPage()), 8);
                Page<Product> prodData = getProductWithNameAndStatusAndState(manageProductDTO, pageable);
                List<ProductDTO> resData = prodData.stream().map(ProductDTO::new).toList();
                response.setData(resData);
                response.setTotalItems(prodData.getTotalElements());
                return response;
        }
        Pageable pageable = PageRequest.of(Integer.parseInt(manageProductDTO.getPage()),8);
        Page<Product> ListProducts = findAllProducts(pageable);
        List<ProductDTO> products = ListProducts.stream().map(ProductDTO::new).toList();
        response.setData(products);
        response.setTotalItems(ListProducts.getTotalElements());
        return response;
    }
    @Transactional
    public RestResponse<Object> handleUpdateProduct(ProductDTO productDTO) {
        if (productDTO != null) {
            Product product = findProductById(productDTO.getProductId());
            Brand brand = findBrandbyBrandName(productDTO.getBrand());
            SubCategory subCategory = findBySubCategoryName(productDTO.getSubCategory());
            Category category = findCategoriesByCategory_id(subCategory.getCategory().getCategory_id());
            LocalDateTime ldt = getLocalDateTime();
            Product updatedProduct = Product.convertProductDTOToProduct(productDTO,product,brand,category,subCategory,ldt);
            save(updatedProduct);
            return RestResponse.ok(200,productDTO);
        }
        return RestResponse.error(400, "Product not found !");
    }
    public RestResponse<String> handleAddBrand(BrandDTO brandDTO) {
        Brand checkBrand  = findBrandbyBrandName(brandDTO.getBrandName());
        if(checkBrand != null) {
            return RestResponse.error(400,"Brand already exists !");
        }
        Brand brand = new Brand();
        String brandName = brandDTO.getBrandName().toUpperCase().trim();
        brand.setBrandName(brandName);
        addBrand(brand);
        return RestResponse.ok(200,"Brand has been successfully added !");
    }

    public RestResponse<String> handleUpdateBrand(BrandDTO brandDTO) {
        Brand brand = findBrandById(brandDTO.getBrandId());
        brand.setBrandName(brandDTO.getBrandName());
        addBrand(brand);
        return RestResponse.ok(200,"Brand has been successfully updated !");
    }

    public RestResponse<String> handleDeleteBrand(long id) {
        Brand brand = findBrandById(id);
        if(brand == null) {
            return RestResponse.error(400,"Brand doesn't exists !");
        }
        deleteBrand(brand.getBrandId());
        return RestResponse.ok(200,"Brand has been successfully deleted !");
    }

    public void deleteBrand(long id) {
        brandRepository.deleteById(id);
    }

    public Page<Product> getProductWithNameAndStatusAndState(ManageProductDTO  manageProductDTO,Pageable pageable){
        if(manageProductDTO.getStatus() == null){
            return productRepository.getProductsWithNameAndStatusAndState(manageProductDTO.getName(), null, manageProductDTO.getState(), pageable);
        }
            return productRepository.getProductsWithNameAndStatusAndState(manageProductDTO.getName(), Boolean.valueOf(manageProductDTO.getStatus()), manageProductDTO.getState(), pageable);
        }
     public Page<InventoryImport> getIIByFilter(String code,int days,Pageable pageable){
        if(days != 0 ){
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime past = now.minusDays(days);
            return importRepository.getInvByCodeAndDate(code,now,past,pageable);
        }
        return importRepository.getInvByCodeAndDate(code,null,null,pageable);
     }
     public Page<Product> getProductByPromotion(String code,Pageable pageable){
        Promotion promotion = promotionRepository.findByCode(code);
        if(promotion != null){
            if(promotion.getScope().equals(DiscountScope.PRODUCT)){
                return productRepository.findProductsByPromotionCode(promotion.getCode(),pageable);
            }else if(promotion.getScope().equals(DiscountScope.BRAND)){
                return productRepository.getProductsByCateAndSubCateAndPromoAndName(null,null,null,DiscountScope.BRAND,pageable);
            }else if (promotion.getScope().equals(DiscountScope.CATEGORY)){
                return productRepository.getProductsByCateAndSubCateAndPromoAndName(null,String.valueOf(DiscountScope.CATEGORY),null,null,pageable);
            }else if (promotion.getScope().equals(DiscountScope.SUBCATEGORY)){
                return productRepository.getProductsByCateAndSubCateAndPromoAndName(null,null, String.valueOf(DiscountScope.SUBCATEGORY),null,pageable);
            }else {
                return productRepository.getProductsByCateAndSubCateAndPromoAndName(null,null,null,null,pageable);
            }
        }
        return productRepository.getProductsByCateAndSubCateAndPromoAndName(null,null,null,null,pageable);
     }
    public Page<ProductVariant> getProductByAdvFilter(AdvFilter advFilter,Pageable pageable){
        Specification<ProductVariant> specs = Specification.where(null);
        if(advFilter.getCategory() != null){
            specs = specs.and(ProductSpec.inCategory(advFilter.getCategory()));
        }
        if(advFilter.getName() != null){
            specs = specs.and(ProductSpec.hasProductName(advFilter.getName()));
        }
        if(advFilter.getSubCate() != null){
            specs = specs.and(ProductSpec.hasSubCategory(advFilter.getSubCate()));
        }
        if(advFilter.getSale() != null){
            specs = specs.and(ProductSpec.equalSalePrice(advFilter.getSale()));
        }
        if(advFilter.getUnit() != null){
            specs = specs.and(ProductSpec.inUnit(advFilter.getUnit()));
        }
        if(advFilter.getPriceRange() != null && !advFilter.getPriceRange().isEmpty()){
           specs = specs.and(ProductSpec.betweenPrice(advFilter.getPriceRange()));
        }
        if(advFilter.getBrand() != null){
            specs = specs.and(ProductSpec.inBrand(advFilter.getBrand()));
        }
        if(advFilter.getSubCategory() != null){
            specs = specs.and(ProductSpec.inSubCategory(advFilter.getSubCategory()));
        }
        return variantRepository.findAll(specs,pageable);
    }
    public FilterData getFilterData(AdvFilter advFilter){
        FilterData filterData  = new FilterData();
        List<String> calUnits = variantRepository.facetUnit(advFilter.getCategory(), advFilter.getSubCate(), advFilter.getName());
        List<String> brands = productRepository.facetUnitBrand(advFilter.getCategory(), advFilter.getSubCate(),advFilter.getName());
        List<String> subCategories = productRepository.facetUnitSubCategory(advFilter.getCategory(), advFilter.getName());
        filterData.setBrand(brands);
        filterData.setUnit(calUnits);
        filterData.setSubCategory(subCategories);
        return filterData;
    }

    public Page<ProductVariant> getNewProducts(String type ,Pageable pageable){
        Specification<ProductVariant> spec = Specification.where(ProductSpec.newProduct());
        spec = spec.and(ProductSpec.outOfStock());
        if(type != null){
            if( type.equals("new")) {
                return variantRepository.findAll(spec, pageable);
            }else {
                return variantRepository.findBestSeller(pageable);
            }
        }
        return null;
    }
    public Page<ProductVariant> getRelatedProducts(Product product){
        Pageable pageable = PageRequest.of(0,10);
        Specification<ProductVariant> spec = Specification.where(ProductSpec.hasCategory(product.getCategory().getCategoryName()));
        spec = spec.and(ProductSpec.outOfStock());
        return variantRepository.findAll(spec, pageable);
    }
    public RestResponse<List<BrandDTO>> viewBrand(){
        List<Brand> brandList = findAllBrands();
        List<BrandDTO> brandDTOs =  brandList.stream().map(BrandDTO::convertBrandToBrandDTO).toList();
        return RestResponse.ok(200,brandDTOs);
    }
}
