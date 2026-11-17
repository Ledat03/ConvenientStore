package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.OtpManagement;
import com.example.store.conveniencestore.EnumType.VerifyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;

public interface OtpRepository extends JpaRepository<OtpManagement, Long> {
    @Query("SELECT o FROM OtpManagement o WHERE o.email = :email AND o.verifyType = :verifyType")
    OtpManagement findByEmailAndVerifyType(@Param("email") String email,@Param("verifyType") VerifyType verifyType);
    OtpManagement save(@NonNull OtpManagement otpManagement);
}
