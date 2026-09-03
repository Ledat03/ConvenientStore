package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.InventoryImportDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImportDetailRepository extends JpaRepository<InventoryImportDetail ,Long> {
    InventoryImportDetail save(InventoryImportDetail inventoryImportDetail);
}
