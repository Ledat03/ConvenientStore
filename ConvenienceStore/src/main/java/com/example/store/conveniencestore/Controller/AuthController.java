package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.LoginDTO;
import com.example.store.conveniencestore.DTO.ResLoginDTO;
import com.example.store.conveniencestore.DTO.UserDTO;
import com.example.store.conveniencestore.Domain.RestRestponse;
import com.example.store.conveniencestore.Domain.Role;
import com.example.store.conveniencestore.Domain.User;
import com.example.store.conveniencestore.Service.UserService;
import com.example.store.conveniencestore.Util.SecurityToken;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("api/check")
public class AuthController {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityToken securityToken;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    @Value("${store.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public User convertUserDTOToUser(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        String Hash = passwordEncoder.encode(userDTO.getPasswordHash());
        user.setPasswordHash(Hash);
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setAddress(userDTO.getAddress());
        user.setPhone(userDTO.getPhone());
        Role role = userService.findByName(userDTO.getRole());
        user.setRole(role);
        user.setCreatedBy("user");
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setUpdatedBy("user");
        return user;
    }


    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityToken securityToken,
                          UserService userService, PasswordEncoder passwordEncoder) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityToken = securityToken;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<Object> signUp(@RequestBody UserDTO user) {
        User CheckExist = userService.findByEmail(user.getEmail());
        if (CheckExist != null && user.getEmail().equals(CheckExist.getEmail())) {
            RestRestponse<Object> ErrorRestRestponse = new RestRestponse<>();
            ErrorRestRestponse.setMessage("Tài khoản đã tồn tại !");
            ErrorRestRestponse.setError("Email is conflict");
            ErrorRestRestponse.setStatusCode(HttpStatus.valueOf(400).value());
            return ResponseEntity.ok().body(ErrorRestRestponse);
        }
        User newUser = convertUserDTOToUser(user);
        userService.save(newUser);
        return ResponseEntity.ok().body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody LoginDTO loginDTO) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginDTO.getUsername(),
                loginDTO.getPassword());
        Authentication auth = authenticationManagerBuilder.getObject().authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(auth);
        User user = userService.findByEmail(loginDTO.getUsername());
        ResLoginDTO resLoginDTO = new ResLoginDTO();
        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(user.getId(), loginDTO.getUsername(), user.getUsername(),user.getRole().getName());
        resLoginDTO.setUser(userLogin);
        String AuthToken = securityToken.createAccessToken(user.getEmail(),userLogin);
        resLoginDTO.setAccessToken(AuthToken);
        String refreshToken = securityToken.createRefreshToken(user.getEmail(), resLoginDTO);
        userService.updateUserToken(refreshToken,user.getEmail());
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", refreshToken).httpOnly(true).maxAge(refreshTokenExpiration).path("/").build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(resLoginDTO);
    }

    @GetMapping("/auth")
    public ResponseEntity<ResLoginDTO.UserLogin> auth() {
        String Email = SecurityToken.getCurrentUserLogin().isPresent() ? SecurityToken.getCurrentUserLogin().get() : "";
        User user = userService.findByEmail(Email);
        ResLoginDTO.UserLogin resLoginDTO = new ResLoginDTO.UserLogin();
        if (user != null) {
            resLoginDTO.setId(user.getId());
            resLoginDTO.setUsername(user.getEmail());
            resLoginDTO.setName(user.getUsername());
        }
        return ResponseEntity.ok().body(resLoginDTO);
    }
    @GetMapping("/auth/refresh")
    public ResponseEntity<ResLoginDTO> refreshToken(@CookieValue(name = "refreshToken" ) String refreshToken) {
        Jwt decodedToken = this.securityToken.checkRefreshToken(refreshToken);
        String Email = decodedToken.getSubject();
        User user  = userService.findByRefreshTokenAndEmail(refreshToken, Email);
        ResLoginDTO resLoginDTO = new ResLoginDTO();
        if(user == null){
            System.out.println("Không tìm thấy người dùng !");
        }
        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(user.getId(), user.getEmail(), user.getUsername(),user.getRole().getName());
        resLoginDTO.setUser(userLogin);
        String AuthToken = securityToken.createAccessToken(user.getEmail(), userLogin);
        resLoginDTO.setAccessToken(AuthToken);
        String newRefreshToken = securityToken.createRefreshToken(user.getEmail(), resLoginDTO);
        userService.updateUserToken(newRefreshToken,user.getEmail());
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", newRefreshToken).httpOnly(true).maxAge(refreshTokenExpiration).path("/").build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(resLoginDTO);
    }
    @GetMapping("/logout")
    public ResponseEntity<Void> logout() {
       String email = SecurityToken.getCurrentUserLogin().isPresent() ? SecurityToken.getCurrentUserLogin().get() : "";
       userService.updateUserToken(null,email);
       ResponseCookie responseCookie = ResponseCookie.from("refreshToken" , null).httpOnly(true).secure(true).maxAge(0).path("/").build();
        return ResponseEntity.status(201).header(HttpHeaders.SET_COOKIE, responseCookie.toString()).build();
    }
}