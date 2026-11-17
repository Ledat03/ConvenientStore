package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.Domain.OtpManagement;
import com.example.store.conveniencestore.Domain.RestResponse;
import com.example.store.conveniencestore.Domain.User;
import com.example.store.conveniencestore.EnumType.VerifyType;
import com.example.store.conveniencestore.Repository.OtpRepository;
import com.example.store.conveniencestore.Util.KeyGenerator.OtpHash;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final GmailService gmailService;
    private final UserService userService;
    private final OtpRepository otpRepository;
    private final SecureRandom secureRandom;
    private final OtpHash otpHash;

    @Transactional
    public RestResponse<Object> sendOtpPassword(String gmail) {
        User checkUser = userService.findByEmail(gmail);
        if(checkUser == null){
            return RestResponse.error(404,"Email is unavailable");
        }
        OtpManagement otpManagement = otpRepository.findByEmailAndVerifyType(gmail, VerifyType.FORGOT_PASSWORD_VERIFICATION);
        RestResponse<Object> restResponse = new RestResponse<>();
        String otpNumber = String.valueOf(secureRandom.nextLong(1000000));
        String hashCode = otpHash.generateHash(gmail,otpNumber);
        gmailService.sendCodeResetPassword(gmail,otpNumber);
        if(otpManagement == null) {
            OtpManagement newOtpManagement = OtpManagement.otpCreate(gmail, hashCode, VerifyType.FORGOT_PASSWORD_VERIFICATION);
            otpRepository.save(newOtpManagement);
            restResponse.setStatusCode(201);
            restResponse.setMessage("OTP has been sent");
            restResponse.setResponseData("OTP created");
            return restResponse;
        }else{
            otpManagement.setAttempts(5);
            otpManagement.setCreatedAt(Instant.now());
            otpManagement.setExpiresAt(Instant.now().plusSeconds(60));
            otpManagement.setHashToken(hashCode);
            otpRepository.save(otpManagement);
            restResponse.setStatusCode(201);
            restResponse.setMessage("OTP has been sent");
            restResponse.setResponseData("OTP renewed");
            return restResponse;
        }
    }
    @Transactional
    public RestResponse<Object> sendOtpRegister(String gmail) {
        User user = userService.findByEmail(gmail);
        if(user != null) return RestResponse.error(409,"Email has already existed");
        OtpManagement otpManagement = otpRepository.findByEmailAndVerifyType(gmail, VerifyType.EMAIL_VERIFICATION);
        if(otpManagement != null && (otpManagement.getAttempts() != 0 && otpManagement.getExpiresAt().isAfter(Instant.now()))) return RestResponse.ok(204,"");
        RestResponse<Object> restResponse = new RestResponse<>();
        String otpNumber = String.valueOf(secureRandom.nextLong(1000000));
        String hashCode = otpHash.generateHash(gmail,otpNumber);
        gmailService.sendCodeRegister(gmail,otpNumber);
        if(otpManagement != null && (otpManagement.getAttempts() == 0 || otpManagement.getExpiresAt().isBefore(Instant.now()))){
            otpManagement.setHashToken(hashCode);
            otpManagement.setAttempts(5);
            otpManagement.setCreatedAt(Instant.now());
            otpManagement.setExpiresAt(Instant.now().plusSeconds(60));
            otpRepository.save(otpManagement);
            restResponse.setStatusCode(201);
            restResponse.setMessage("OTP has been sent");
            restResponse.setResponseData("OTP signup renewed");
            return restResponse;
        }
        OtpManagement newOtpManagement = OtpManagement.otpCreate(gmail, hashCode, VerifyType.EMAIL_VERIFICATION);
        otpRepository.save(newOtpManagement);
        restResponse.setStatusCode(201);
        restResponse.setMessage("OTP has been sent");
        restResponse.setResponseData("OTP signup created");
        return restResponse;

    }
    @Transactional
    public RestResponse<Object> verifyRegisterToken(String gmail, String otpToken) {
        RestResponse<Object> restResponse = new RestResponse<>();
        OtpManagement otpManagement = otpRepository.findByEmailAndVerifyType(gmail, VerifyType.EMAIL_VERIFICATION);
        String hashCode = otpHash.generateHash(gmail,otpToken);
        Instant instant = Instant.now();
        if(otpManagement.getExpiresAt().isBefore(instant) || otpManagement.getAttempts() == 0) return RestResponse.error(410,"Your code are disabled ! renew it");
        if(otpManagement.getHashToken().equalsIgnoreCase(hashCode)) {
            otpManagement.setHashToken("");
            otpManagement.setConsumedAt(instant);
            otpRepository.save(otpManagement);
            restResponse.setStatusCode(200);
            restResponse.setMessage("Verification was successful");
            restResponse.setResponseData("Successfully verified");
            return restResponse;
        }else{
            otpManagement.setAttempts(otpManagement.getAttempts() - 1);
            return RestResponse.error(404, "OTP wasn't correct");
        }
    }
    @Transactional
    public RestResponse<Object> verifyPasswordToken(String gmail, String otpToken) {
        RestResponse<Object> restResponse = new RestResponse<>();
        OtpManagement otpManagement = otpRepository.findByEmailAndVerifyType(gmail, VerifyType.FORGOT_PASSWORD_VERIFICATION);
        String hashCode = otpHash.generateHash(gmail,otpToken);
        Instant instant = Instant.now();
        if(otpManagement.getExpiresAt().isBefore(instant) || otpManagement.getAttempts() == 0) return RestResponse.error(410,"Your code are disabled ! renew it");
        if(otpManagement.getHashToken().equalsIgnoreCase(hashCode)) {
            otpManagement.setHashToken("");
            otpManagement.setConsumedAt(instant);
            otpRepository.save(otpManagement);
            restResponse.setStatusCode(200);
            restResponse.setMessage("Verification was successful");
            restResponse.setResponseData("Successfully verified");
            return restResponse;
        }else{
            otpManagement.setAttempts(otpManagement.getAttempts() - 1);
            return RestResponse.error(404, "OTP wasn't correct");
        }
    }
}
