package com.example.store.conveniencestore.Domain;

import com.example.store.conveniencestore.EnumType.VerifyType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Data
@Table(name = "otpmanagements", uniqueConstraints = @UniqueConstraint(columnNames = {"email","verifyType"}))
@NoArgsConstructor
@AllArgsConstructor

public class OtpManagement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long otpId;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String hashToken;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerifyType verifyType;
    @Column(nullable = false)
    private int attempts;
    @Column(nullable = false)
    private Instant expiresAt;
    @Column(nullable = false)
    private Instant createdAt;
    private Instant consumedAt;
    public static OtpManagement otpCreate(String email, String hashToken, VerifyType verifyType) {
        OtpManagement otpManagement = new OtpManagement();
        otpManagement.email = email;
        otpManagement.hashToken = hashToken;
        otpManagement.verifyType = verifyType;
        otpManagement.attempts = 5;
        otpManagement.expiresAt = Instant.now().plusSeconds(60);
        otpManagement.createdAt = Instant.now();
        return otpManagement;
    }
}
