package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.DTO.ProductDTO;
import com.example.store.conveniencestore.DTO.ProductVariantDTO;
import com.example.store.conveniencestore.Domain.InventoryImport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImportRepository extends JpaRepository<InventoryImport, Long> {
    List<InventoryImport> findAll();
    InventoryImport findById(long id);
    InventoryImport save(InventoryImport inventoryImport);
}
