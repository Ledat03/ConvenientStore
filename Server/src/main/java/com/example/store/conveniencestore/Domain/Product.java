package com.example.store.conveniencestore.Domain;

import com.example.store.conveniencestore.DTO.ProductDTO;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
@Data
@Table(name = "Products")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long productId;
    private String productName;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String productDescription;
    private String origin;
    private String ingredient;
    private String howToUse;
    private String preserve;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;
    private String sku;
    private Boolean isActive;
    private String status;
    private String image;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subCategory_id")
    private SubCategory subCategory;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonManagedReference
    private Category category;
    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ProductVariant> productVariant;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static Product convertProductDTOToProduct(ProductDTO productDTO,Product  product,Brand brand,Category category,SubCategory subCategory,LocalDateTime localDateTime) {
        product.setProductName(productDTO.getProductName());
        product.setProductDescription(productDTO.getProductDescription());
        product.setHowToUse(productDTO.getHowToUse());
        product.setPreserve(productDTO.getPreserve());
        product.setOrigin(productDTO.getOrigin());
        product.setCategory(category);
        product.setSubCategory(subCategory);
        product.setIngredient(productDTO.getIngredient());
        product.setBrand(brand);
        product.setStatus(productDTO.getStatus());
        product.setIsActive(Boolean.parseBoolean(productDTO.getIsActive()));
        product.setSku(productDTO.getSku());
        product.setImage(productDTO.getImage() == null ? product.getImage() : "");
        product.setUpdatedAt(localDateTime);
        product.setCreatedAt(product.getCreatedAt());
        return product;
    }
}
