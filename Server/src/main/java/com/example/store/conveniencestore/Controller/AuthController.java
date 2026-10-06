package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.Request.LoginDTO;
import com.example.store.conveniencestore.DTO.Response.ResLoginDTO;
import com.example.store.conveniencestore.DTO.UserDTO;
import com.example.store.conveniencestore.Domain.RestResponse;
import com.example.store.conveniencestore.Domain.User;
import com.example.store.conveniencestore.Service.GmailService;
import com.example.store.conveniencestore.Service.UserService;
import com.example.store.conveniencestore.Util.SecurityToken;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
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
import java.util.Random;

@RestController
@RequestMapping("api/check")
public class AuthController {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityToken securityToken;
    private final UserService userService;
    private final GmailService gmailService;
    private final PasswordEncoder passwordEncoder;
    @Value("${store.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityToken securityToken,
            UserService userService, PasswordEncoder passwordEncoder, GmailService gmailService) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityToken = securityToken;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.gmailService = gmailService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Object> signUp(@Valid @RequestBody UserDTO user){
       RestResponse<User> restResponse=  userService.handleSignUp(user);
       return new ResponseEntity<>(restResponse,HttpStatus.valueOf(restResponse.getStatusCode()));
    }

    @PostMapping("/login")
    public ResponseEntity<RestResponse<ResLoginDTO>> login(@Valid @RequestBody LoginDTO loginDTO) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());
        Authentication auth = authenticationManagerBuilder.getObject().authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(auth);
        User user = userService.findByEmail(loginDTO.getUsername());
        ResLoginDTO userLogin = new ResLoginDTO("",user.getId(), loginDTO.getUsername(), user.getUsername(), user.getRole().getName());
        String AuthToken = securityToken.createAccessToken(userLogin);
        userLogin.setAccessToken(AuthToken);
        String refreshToken = securityToken.createRefreshToken(user.getEmail(), userLogin);
        userService.updateUserToken(refreshToken, user.getEmail());
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", refreshToken).maxAge(refreshTokenExpiration).path("/").build();
        RestResponse<ResLoginDTO> restResponse = new RestResponse<>();
        restResponse.setStatusCode(200);
        restResponse.setError("");
        restResponse.setResponseData(userLogin);
        restResponse.setMessage("Log in successful");
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(restResponse);
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<Object> refreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String refreshToken = "";
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
            if(!refreshToken.isBlank()) {
            Jwt refreshTokenJwt = securityToken.checkRefreshToken(refreshToken);
            String email = refreshTokenJwt.getSubject();
            User user = userService.findByEmail(email);
            if(refreshToken.equals(user.getRefreshToken())) {
                if(refreshTokenJwt.getExpiresAt() != null && refreshTokenJwt.getExpiresAt().isAfter(Instant.now())) {
                    ResLoginDTO res = new ResLoginDTO("",user.getId(), user.getUsername(), user.getEmail(), user.getRole().getName());
                    String accessToken = securityToken.createAccessToken(res);
                    String newRefreshToken = securityToken.createRefreshToken(email,res);
                    res.setAccessToken(accessToken);
                    user.setRefreshToken(newRefreshToken);
                    userService.save(user);
                    ResponseCookie responseCookie = ResponseCookie.from("refreshToken",newRefreshToken).maxAge(refreshTokenExpiration).httpOnly(true).path("/").build();
                    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,responseCookie.toString()).body(res);
                }
            }
            }
        return ResponseEntity.status(403).body("Unauthenticated");
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout() {
        String email = SecurityToken.getCurrentUserLogin().isPresent() ? SecurityToken.getCurrentUserLogin().get() : "";
        userService.updateUserToken(null, email);
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", null).secure(true).maxAge(0).path("/").build();
        return ResponseEntity.status(201).header(HttpHeaders.SET_COOKIE, responseCookie.toString()).build();
    }

    @PostMapping("/forgot")
    public ResponseEntity<Object> forgotPassword(@RequestParam String email) {
        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        try {
            Random random = new Random();
            long number = random.nextLong(90000) + 10000;
            String code = String.valueOf(number);
            gmailService.sendCodeResetPassword(email, code);
            return ResponseEntity.ok().body(code);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
