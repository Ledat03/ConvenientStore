package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Order getById(Long id);
    List<Order> findAll();
    Order save(Order order);
}
