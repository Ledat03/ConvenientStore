package com.example.store.conveniencestore.Util.KeyGenerator;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Component
public class OtpHash {
    @Value("${key.otp}")
    private String otpKey;


    public String generateHash(String gmail,String otp)  {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec sks = new SecretKeySpec(otpKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(sks);
            String combineData = gmail+ ":" + otp;
            byte[] digest = mac.doFinal(combineData.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }


    }
}
