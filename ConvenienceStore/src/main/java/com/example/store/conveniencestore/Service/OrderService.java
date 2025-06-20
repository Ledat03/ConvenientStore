package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.Domain.Delivery;
import com.example.store.conveniencestore.Domain.Order;
import com.example.store.conveniencestore.Domain.OrderItem;
import com.example.store.conveniencestore.Domain.Payment;
import com.example.store.conveniencestore.Repository.*;
import org.springframework.stereotype.Service;

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

    public Order save(Order order) {
        return orderRepository.save(order);
    }
    public Delivery save(Delivery delivery) {
        return deliveryRepository.save(delivery);
    }
    public OrderItem save(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }
    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }
}
