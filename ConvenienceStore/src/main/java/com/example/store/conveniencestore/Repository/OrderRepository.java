package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Order;
import com.example.store.conveniencestore.EnumType.DeliveryStatus;
import com.example.store.conveniencestore.EnumType.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_Id(long userId);
    List<Order> findAll();
    Order findById(long orderId);
    void deleteById(long id);
    Order save(Order order);
    @Query("Select o from Order o where (:username IS NULL OR LOWER(o.user.username) LIKE LOWER(CONCAT('%',:username,'%'))) AND (:startDate IS NULL OR o.delivery.delivery_date < :startDate) AND (:endDate IS NULL OR  o.delivery.delivery_date >= :endDate) AND (:paymentStatus IS NULL OR :paymentStatus = o.payment.paymentStatus) AND (:delivery_status IS NULL OR o.delivery.delivery_status = :delivery_status)")
    Page<Order> getOrdersByNameAndDateAndStateAndPaymentStatus(@Param("username") String username, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, @Param("delivery_status") DeliveryStatus delivery_status, @Param("paymentStatus") TransactionStatus paymentStatus, Pageable pageable);
}
