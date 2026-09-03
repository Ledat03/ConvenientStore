package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.DeliveryStatus;
import com.example.store.conveniencestore.EnumType.TransactionStatus;
import com.example.store.conveniencestore.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final DeliveryRepository deliveryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final VariantRepository variantRepository;
    private final PaymentRepository paymentRepository;

    public Delivery getDeliveryById(Long deliveryId) {
        return deliveryRepository.findByDeliveryId(deliveryId);
    }
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }
    public Delivery saveDelivery(Delivery delivery) {
        return deliveryRepository.save(delivery);
    }
    public OrderItem saveOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }
    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }
    public Payment findbyTransactionId(String transactionId) {
        return  paymentRepository.findByTransactionId(transactionId);
    }
    public List<Order> findAll() {
        return orderRepository.findAll();
    }
    public Payment findbyPaymentId(long paymentId) {
        return paymentRepository.findById(paymentId);
    }
    public List<Order> findAllByUserId(long id) {
        return orderRepository.findByUser_Id(id);
    }
    public Order findbyOrderId(long orderId) {
        return orderRepository.findById(orderId);
    }
    public void deleteOrder(Order order) {
        orderRepository.deleteById(order.getId());
    }
    public Page<Order> getOrdersByFilter(String name , LocalDateTime now,LocalDateTime past, DeliveryStatus deliveryStatus, TransactionStatus paymentStatus, Pageable pageable) {
           return orderRepository.getOrdersByNameAndDateAndStateAndPaymentStatus(name,now,past,deliveryStatus,paymentStatus,pageable);
    }
}
