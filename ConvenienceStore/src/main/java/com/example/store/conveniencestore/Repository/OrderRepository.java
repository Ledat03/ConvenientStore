package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
