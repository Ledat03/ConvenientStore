package com.example.store.conveniencestore.Domain;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
public class InventoryImport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long importId;
    private String importCode;
    private LocalDateTime importDate;
    private String importNote;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonManagedReference
    private User user;
    @OneToMany(mappedBy = "InventImport", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<InventoryImportDetail> inventoryImportDetails;
}
