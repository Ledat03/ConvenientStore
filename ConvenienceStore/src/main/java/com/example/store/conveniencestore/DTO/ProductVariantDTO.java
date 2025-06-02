package com.example.store.conveniencestore.DTO;

import jakarta.persistence.ElementCollection;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@Data
public class ProductVariantDTO {
    private long id;
    private Double price;
    private Double salePrice;
    private long stock;
    private String calUnit;
    private long productId;
    private List<String> productImage;
}
