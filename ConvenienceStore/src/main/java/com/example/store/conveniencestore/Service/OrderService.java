package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.Domain.Delivery;
import com.example.store.conveniencestore.Domain.Order;
import com.example.store.conveniencestore.Domain.OrderItem;
import com.example.store.conveniencestore.Domain.Payment;
import com.example.store.conveniencestore.Repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final DeliveryRepository deliveryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final VariantRepository variantRepository;
    private final PaymentRepository paymentRepository;
    public OrderService( OrderItemRepository orderItemRepository,PaymentRepository paymentRepository , OrderRepository orderRepository, DeliveryRepository deliveryRepository, ProductRepository productRepository, UserRepository userRepository, VariantRepository variantRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.deliveryRepository = deliveryRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.variantRepository = variantRepository;
        this.paymentRepository = paymentRepository;
    }
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
}
