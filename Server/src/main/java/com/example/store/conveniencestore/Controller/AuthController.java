package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.Request.LoginDTO;
import com.example.store.conveniencestore.DTO.Response.ResLoginDTO;
import com.example.store.conveniencestore.DTO.UserDTO;
import com.example.store.conveniencestore.Domain.RePassword;
import com.example.store.conveniencestore.Domain.RestResponse;
import com.example.store.conveniencestore.Domain.User;
import com.example.store.conveniencestore.EnumType.VerifyType;
import com.example.store.conveniencestore.Service.GmailService;
import com.example.store.conveniencestore.Service.OtpService;
import com.example.store.conveniencestore.Service.UserService;
import com.example.store.conveniencestore.Util.SecurityToken;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("api/check")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityToken securityToken;
    private final UserService userService;
    private final OtpService otpService;
    @Value("${store.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

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
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", refreshToken).maxAge(refreshTokenExpiration).sameSite("None").secure(true).httpOnly(true).path("/").build();
        RestResponse<ResLoginDTO> restResponse = new RestResponse<>();
        restResponse.setStatusCode(200);
        restResponse.setError("");
        restResponse.setResponseData(userLogin);
        restResponse.setMessage("Log in successfully");
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(restResponse);
    }



    @PostMapping("/auth/refresh")
    public ResponseEntity<Object> refreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
            if(cookies != null) {
                Optional<String> refreshToken = Arrays.stream(cookies).filter(cookie -> cookie.getName().equals("refreshToken")).findFirst().map(Cookie::getValue);
                if (refreshToken.isPresent()) {
                    Jwt refreshTokenJwt = securityToken.checkRefreshToken(refreshToken.get());
                    String email = refreshTokenJwt.getSubject();
                    User user = userService.findByEmail(email);
                    if (refreshToken.get().equals(user.getRefreshToken())) {
                        if (refreshTokenJwt.getExpiresAt() != null && refreshTokenJwt.getExpiresAt().isAfter(Instant.now())) {
                            ResLoginDTO res = new ResLoginDTO("", user.getId(), user.getEmail(), user.getUsername(), user.getRole().getName());
                            String accessToken = securityToken.createAccessToken(res);
                            String newRefreshToken = securityToken.createRefreshToken(email, res);
                            res.setAccessToken(accessToken);
                            user.setRefreshToken(newRefreshToken);
                            userService.save(user);
                            ResponseCookie responseCookie = ResponseCookie.from("refreshToken", newRefreshToken).maxAge(refreshTokenExpiration).sameSite("None").secure(true).httpOnly(true).path("/").build();
                            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(res);
                        }
                    }
                }
            }
        return ResponseEntity.status(403).body("Unauthenticated");
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestParam("id") long id) {
        String email = userService.findById(id).getEmail();
        System.out.println(email);
        userService.updateUserToken(null, email);
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", "").secure(true).maxAge(0).path("/").build();
        return ResponseEntity.status(201).header(HttpHeaders.SET_COOKIE, responseCookie.toString()).build();
    }

    @PostMapping("/forgot")
    public ResponseEntity<Object> forgotPassword(@RequestParam String gmail) {
        RestResponse<Object> restResponse = otpService.sendOtpPassword(gmail);
        return new ResponseEntity<>(restResponse, HttpStatusCode.valueOf(restResponse.getStatusCode()));
    }
    @PostMapping("/verify/forgot")
    public ResponseEntity<Object> verifyPasswordOtp(@RequestParam String gmail, @RequestParam String code) {
        RestResponse<Object> restResponse = otpService.verifyPasswordToken(gmail, code);
        return new ResponseEntity<>(restResponse,HttpStatusCode.valueOf(restResponse.getStatusCode()));
    }
    @PostMapping("/register-number")
    public ResponseEntity<Object> sendRegisterOtp(@RequestParam String gmail) {
        RestResponse<Object> restResponse = otpService.sendOtpRegister(gmail);
        return new ResponseEntity<>(restResponse, HttpStatusCode.valueOf(restResponse.getStatusCode()));
    }
    @PostMapping("/verify/register")
    public ResponseEntity<Object> verifyRegisterOtp(@RequestParam String gmail, @RequestParam String code) {
        RestResponse<Object> restResponse = otpService.verifyRegisterToken(gmail, code);
        return new ResponseEntity<>(restResponse,HttpStatusCode.valueOf(restResponse.getStatusCode()));
    }
    @PutMapping("/update-password")
    public ResponseEntity<Object> updateNewPassword(@RequestBody RePassword rePassword) {
        RestResponse<Object> restResponse = userService.updatePassword(rePassword.email(), rePassword.password());
        return new ResponseEntity<>(restResponse,HttpStatusCode.valueOf(restResponse.getStatusCode()));
    }
    @PostMapping("/renew-otp")
    public ResponseEntity<Object> renewOtp(@RequestParam String gmail,@RequestParam String type) {
        RestResponse<Object> restResponse ;
        if(VerifyType.EMAIL_VERIFICATION.toString().equals(type)){
            restResponse = otpService.sendOtpRegister(gmail);
        }else {
            restResponse = otpService.sendOtpPassword(gmail);
        }
        return new ResponseEntity<>(restResponse, HttpStatusCode.valueOf(restResponse.getStatusCode()));
    }
}
