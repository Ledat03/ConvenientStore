package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.LoginDTO;
import com.example.store.conveniencestore.Domain.RestRestponse;
import com.example.store.conveniencestore.Domain.User;
import com.example.store.conveniencestore.Service.UserService;
import com.example.store.conveniencestore.Util.SecurityToken;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/check")
public class AuthController {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityToken securityToken;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityToken securityToken,
            UserService userService, PasswordEncoder passwordEncoder) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityToken = securityToken;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<RestRestponse<Object>> signUp(@RequestBody User user) {
        User CheckExist = userService.findByEmail(user.getEmail());
        if (CheckExist != null && user.getEmail().equals(CheckExist.getEmail())) {
            RestRestponse<Object> ErrorRestRestponse = new RestRestponse<>();
            ErrorRestRestponse.setMessage("Tài khoản đã tồn tại !");
            ErrorRestRestponse.setError("Email is conflict");
            ErrorRestRestponse.setStatusCode(HttpStatus.valueOf(400).value());
            return ResponseEntity.ok().body(ErrorRestRestponse);
        }
        RestRestponse<Object> restRestponse = new RestRestponse<>();
        restRestponse.setMessage("Đăng kí thành công !");
        restRestponse.setStatusCode(HttpStatus.valueOf(200).value());
        String HashPassword = passwordEncoder.encode(user.getPasswordHash());
        user.setPasswordHash(HashPassword);
        userService.save(user);
        restRestponse.setData(user);
        return ResponseEntity.ok().body(restRestponse);
    }

    @PostMapping("/login")
    public ResponseEntity<RestRestponse<Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginDTO.getUsername(),
                loginDTO.getPassword());
        Authentication auth = authenticationManagerBuilder.getObject().authenticate(token);
        String AuthToken = securityToken.createToken(auth);
        RestRestponse<Object> AuthSuccess = new RestRestponse<>();
        AuthSuccess.setStatusCode(200);
        AuthSuccess.setData(AuthToken);
        AuthSuccess.setMessage("Verified");
        return ResponseEntity.ok().body(AuthSuccess);
    }
}
