package com.example.store.conveniencestore.DTO;

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
}
