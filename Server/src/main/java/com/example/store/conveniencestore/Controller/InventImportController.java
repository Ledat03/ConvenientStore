package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.DTO.Response.ResInventDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Service.InventoryService;
import com.example.store.conveniencestore.Service.ProductService;
import com.example.store.conveniencestore.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("import")
@RequiredArgsConstructor
public class InventImportController {

    private final UserService userService;
    private final ProductService productService;
    private final InventoryService inventoryService;

    private String getTime(LocalDateTime localDateTime) {
        return localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }



    @PostMapping("/add")
    public ResponseEntity<Object> addInventory(@RequestBody Optional<InventDTO> inventDTO) {
        RestResponse<String> restResponse = inventoryService.handleAddInventory(inventDTO);
        return new ResponseEntity<>(restResponse, HttpStatus.valueOf(restResponse.getStatusCode()));
    }

    @GetMapping("/view")
    public ResponseEntity<Object> viewInventory() {
        List<InventoryImport> inventoryImports = inventoryService.findAllInventoryImports();
        List<ResInventDTO> resInventDTOS = inventoryImports.stream().map(ResInventDTO::new).toList();
        return ResponseEntity.ok(resInventDTOS);
    }

    @PutMapping("/update")
    public ResponseEntity<Object> updateInventory(@RequestBody Optional<InventDTO> inventDTO) {
      RestResponse<String> restResponse = inventoryService.handleUpdateInventory(inventDTO);
        return ResponseEntity.ok("Something went wrong!");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Object> deleteInventory(@RequestParam("id") long id) {
        RestResponse<String> restResponse = inventoryService.handleDeleteInventory(id);
        return new ResponseEntity<>(restResponse, HttpStatus.valueOf(restResponse.getStatusCode()));
    }
    @GetMapping("/filter")
    public  ResponseEntity<PageResponse<List<ResInventDTO>>> getIIByFilter(@RequestParam(value = "code",required = false) String code,
                                                       @RequestParam(value = "days",required = false,defaultValue = "0") int days,
                                                       @RequestParam(value = "page",defaultValue = "0") int page){
        Pageable  pageable = PageRequest.of(page,8);
        Page<InventoryImport> data = productService.getIIByFilter(code,days,pageable);
        List<ResInventDTO> resInventDTOS = data.stream().map(ResInventDTO::new).toList();
        PageResponse<List<ResInventDTO>> pageResponse = new PageResponse<>(resInventDTOS,data.getTotalElements());
        return ResponseEntity.ok(pageResponse);
    }
}
