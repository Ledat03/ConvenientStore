package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.Domain.User;
import com.example.store.conveniencestore.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

    private final UserService userService;
    private final PasswordEncoder bCryptPasswordEncoder;

    public MainController(UserService userService, PasswordEncoder bCryptPasswordEncoder) {
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @GetMapping("/")
    public ResponseEntity<User> index(@RequestBody User user) {

        return ResponseEntity.ok(user);
    }
}
