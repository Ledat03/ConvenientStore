package com.example.store.conveniencestore.Domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class InventoryImportDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long importDetailId;
    private long quantity;
    private Double cost_price;
    private Double total_cost;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invent_import_id")
    private InventoryImport InventImport;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;
}
