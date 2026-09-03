package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    OrderItem getById(Long id);
    OrderItem save(OrderItem orderItem);
}
