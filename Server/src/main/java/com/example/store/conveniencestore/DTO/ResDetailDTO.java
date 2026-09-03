package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.InventoryImportDetail;
import com.example.store.conveniencestore.Domain.Product;
import com.example.store.conveniencestore.Domain.ProductVariant;
import lombok.Data;

@Data
public class ResDetailDTO {
    private ProductDTO product;
    private ProductVariantDTO variant;
    private long quantity;
    private double  cost_price;
    private double total_cost;
    public ResDetailDTO(){}
    public ResDetailDTO(InventoryImportDetail inventoryImportDetail){
        this.setProduct(new ProductDTO(inventoryImportDetail.getProduct()));
        this.setVariant(new ProductVariantDTO(inventoryImportDetail.getVariant()));
        this.setQuantity(inventoryImportDetail.getQuantity());
        this.setCost_price(inventoryImportDetail.getCost_price());
        this.setTotal_cost(inventoryImportDetail.getTotal_cost());
    }
}
