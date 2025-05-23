package com.example.store.conveniencestore.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UploadFile {

    @PostMapping(name = "/api/upload" ,consumes = "multipart/form-data")
    public ResponseEntity<Object> UploadFile() {
        return ResponseEntity.ok().build();
    }
}
