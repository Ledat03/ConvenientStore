package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_Id(long userId);
    List<Order> findAll();
    Order findById(long orderId);
    void deleteById(long id);
    Order save(Order order);
    @Query("Select o from Order o where (:username IS NULL OR o.user.username = :username) AND (:startDate IS NULL OR : o.delivery.delivery_date >= :startDate) AND (:endDate IS NULL OR : o.delivery.delivery_date < :endDate) AND (:paymentStatus IS NULL OR :paymentStatus = o.payment.paymentMethod)")
    Page<Order> getOrdersByNameAndDateAndStateAndPaymentStatus(@Param("username") String username,@Param("startDate") Date startDate,@Param("endDate") Date endDate,@Param("delivery_status") String delivery_status,@Param("paymentStatus") String paymentStatus);
}
