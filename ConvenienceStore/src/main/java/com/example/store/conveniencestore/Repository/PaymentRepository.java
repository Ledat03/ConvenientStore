package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findById(long id);
    Payment save(Payment payment);
}
