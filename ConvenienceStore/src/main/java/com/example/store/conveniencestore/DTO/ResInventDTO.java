package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.InventoryImport;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
@Data
public class ResInventDTO {
    private long importId;
    private String importCode;
    private String importNote;
    private String username;
    private LocalDateTime importDate;
    private List<ResDetailDTO> inventoryImportDetails;
    public ResInventDTO(){}
    public ResInventDTO(InventoryImport inventoryImport){
        List<ResDetailDTO> resDetailDTOS = inventoryImport.getInventoryImportDetails().stream().map(ResDetailDTO::new).toList();
        this.setInventoryImportDetails(resDetailDTOS);
        this.setImportId(inventoryImport.getImportId());
        this.setImportCode(inventoryImport.getImportCode());
        this.setImportNote(inventoryImport.getImportNote());
        this.setImportDate(inventoryImport.getImportDate());
        this.setUsername(inventoryImport.getUser().getUsername());
    }
}
