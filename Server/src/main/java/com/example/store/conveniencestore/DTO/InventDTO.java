package com.example.store.conveniencestore.DTO;
import lombok.Data;

import java.util.List;
@Data
public class InventDTO {
    private long importId;
    private String importCode;
    private String importNote;
    private long userId;
    private List<InventDetailDTO> inventoryImportDetails;
}
