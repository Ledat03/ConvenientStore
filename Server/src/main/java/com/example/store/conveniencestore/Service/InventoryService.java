package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.DTO.InventDTO;
import com.example.store.conveniencestore.DTO.InventDetailDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Repository.ImportDetailRepository;
import com.example.store.conveniencestore.Repository.ImportRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final ImportRepository  importRepository;
    private final ProductService productService;
    private final UserService userService;
    private final ImportDetailRepository importDetailRepository;
    @Transactional
    public InventoryImport saveInventoryImport(InventoryImport inventoryImport) {
        return importRepository.save(inventoryImport);
    }

    public InventoryImportDetail saveImportDetail(InventoryImportDetail inventoryImportDetail) {
        return importDetailRepository.save(inventoryImportDetail);
    }

    public void deleteInventoryImport(InventoryImport inventoryImport) {
        importRepository.delete(inventoryImport);
    }

    public List<InventoryImport> findAllInventoryImports() {
        return importRepository.findAll();
    }

    public InventoryImport findInventoryImportById(long id) {
        return importRepository.findById(id);
    }

    @Transactional
    public InventoryImportDetail convertDTOToEntity(InventDetailDTO inventDetailDTO, InventoryImport inventoryImport) {
        InventoryImportDetail detail = new InventoryImportDetail();
        Product product = productService.findProductById(inventDetailDTO.getProductId());
        ProductVariant variant = productService.findProductVariantById(inventDetailDTO.getVariantId());
        variant.setStock(variant.getStock() + inventDetailDTO.getQuantity());
        productService.saveVariant(variant);
        detail.setProduct(product);
        detail.setVariant(variant);
        detail.setQuantity(inventDetailDTO.getQuantity());
        detail.setCost_price(inventDetailDTO.getCost_price());
        detail.setTotal_cost(inventDetailDTO.getTotal_cost());
        detail.setInventImport(inventoryImport);
        return detail;
    }

    @Transactional
    public RestResponse<String> handleAddInventory(Optional<InventDTO> inventDTO) {
        if (inventDTO.isPresent()) {
            User user = userService.findById(inventDTO.get().getUserId());
            InventoryImport inventoryImport = new InventoryImport();
            inventoryImport.setImportCode(inventDTO.get().getImportCode());
            inventoryImport.setImportNote(inventDTO.get().getImportNote());
            inventoryImport.setImportDate(LocalDateTime.now());
            inventoryImport.setUser(user);
            List<InventoryImportDetail> details = new ArrayList<>();
            for (InventDetailDTO dto : inventDTO.get().getInventoryImportDetails()) {
                InventoryImportDetail detail = convertDTOToEntity(dto, inventoryImport);
                details.add(detail);
            }
            inventoryImport.setInventoryImportDetails(details);
            saveInventoryImport(inventoryImport);
            return RestResponse.ok(201,"Information has been saved successfully!");
        }

        return RestResponse.error(400,"Something went wrong!");
    }
    @Transactional
    public RestResponse<String> handleUpdateInventory(Optional<InventDTO> inventDTO) {
        if (inventDTO.isPresent()) {
            InventoryImport inventoryImport = findInventoryImportById(inventDTO.get().getImportId());
            if (inventoryImport != null) {
                for (InventoryImportDetail oldDetail : inventoryImport.getInventoryImportDetails()) {
                    ProductVariant variant = oldDetail.getVariant();
                    if (variant != null) {
                        variant.setStock(variant.getStock() - oldDetail.getQuantity());
                        productService.saveVariant(variant);
                    }
                }

                inventoryImport.setImportCode(inventDTO.get().getImportCode());
                inventoryImport.setImportNote(inventDTO.get().getImportNote());
                inventoryImport.setImportDate(LocalDateTime.now());
                inventoryImport.setUser(userService.findById(inventDTO.get().getUserId()));

                List<InventoryImportDetail> details = new ArrayList<>();
                for (InventDetailDTO dto : inventDTO.get().getInventoryImportDetails()) {
                    InventoryImportDetail detail = convertDTOToEntity(dto, inventoryImport);

                    ProductVariant variant = detail.getVariant();
                    if (variant != null) {
                        variant.setStock(detail.getQuantity());
                        productService.saveVariant(variant);
                    }
                    details.add(detail);
                }
                inventoryImport.getInventoryImportDetails().clear();
                inventoryImport.getInventoryImportDetails().addAll(details);
                saveInventoryImport(inventoryImport);

                return RestResponse.ok(200,"Update successfully!");
            }
        }
        return RestResponse.error(400,"Something went wrong!");
    }
    @Transactional
    public RestResponse<String> handleDeleteInventory(long id) {
        InventoryImport inventoryImport = findInventoryImportById(id);
        if (inventoryImport != null) {
            for (InventoryImportDetail detail : inventoryImport.getInventoryImportDetails()) {
                ProductVariant variant = detail.getVariant();
                if (variant != null) {
                    variant.setStock(variant.getStock() - detail.getQuantity());
                    productService.saveVariant(variant);
                }
                if (variant != null && variant.getStock() < detail.getQuantity()) {
                    return RestResponse.error(400,"Can't delete because quantity is lower than stock!");
                }

            }
            deleteInventoryImport(inventoryImport);
            return RestResponse.ok(204,"Delete successfully!");
        }
        return RestResponse.error(400,"Something went wrong!");
    }
}
