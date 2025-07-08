package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_Id(long userId);
    List<Order> findAll();
    Order findById(long orderId);
    void deleteById(long id);
    Order save(Order order);
}
