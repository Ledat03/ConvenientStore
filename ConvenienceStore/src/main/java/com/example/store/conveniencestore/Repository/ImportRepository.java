package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.DTO.ProductDTO;
import com.example.store.conveniencestore.DTO.ProductVariantDTO;
import com.example.store.conveniencestore.Domain.InventoryImport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ImportRepository extends JpaRepository<InventoryImport, Long> {
    List<InventoryImport> findAll();
    InventoryImport findById(long id);
    InventoryImport save(InventoryImport inventoryImport);
    void delete(InventoryImport inventoryImport);
    @Query("SELECT i FROM InventoryImport i WHERE (:importCode IS NULL OR LOWER(i.importCode) LIKE LOWER(CONCAT('%',:importCode,'%'))) AND (:now IS NULL OR i.importDate < :now) AND (:past IS NULL OR i.importDate >= :past)")
    Page<InventoryImport> getInvByCodeAndDate(@Param("importCode") String importCode,@Param("now") LocalDateTime now ,@Param("past") LocalDateTime past, Pageable pageable);
}
