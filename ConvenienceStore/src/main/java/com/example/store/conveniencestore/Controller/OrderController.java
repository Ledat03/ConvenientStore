package com.example.store.conveniencestore.Controller;


import com.example.store.conveniencestore.DTO.OrderDTO;
import com.example.store.conveniencestore.DTO.OrderItemDTO;
import com.example.store.conveniencestore.Domain.Delivery;
import com.example.store.conveniencestore.Domain.Order;
import com.example.store.conveniencestore.Domain.OrderItem;
import com.example.store.conveniencestore.Domain.Payment;
import com.example.store.conveniencestore.EnumType.DeliveryStatus;
import com.example.store.conveniencestore.EnumType.PaymentMethod;
import com.example.store.conveniencestore.EnumType.TransactionStatus;
import com.example.store.conveniencestore.Service.OrderService;
import com.example.store.conveniencestore.Service.ProductService;
import com.example.store.conveniencestore.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

@RestController
@RequestMapping("order")
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;
    private final ProductService productService;
    public OrderController( OrderService orderService, UserService userService, ProductService productService) {
        this.orderService = orderService;
        this.userService = userService;
        this.productService = productService;
    }

    public Order createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setUser(userService.findById(orderDTO.getUserId()));
        order.setTotal(Double.parseDouble(orderDTO.getPayTotal()));
        return orderService.save(order);
    }
    public Delivery createDelivery(OrderDTO orderDTO, Order order) {
        Delivery delivery = new Delivery();
        delivery.setUser(order.getUser());
        delivery.setOrder(order);
        delivery.setDelivery_address(orderDTO.getReceiverAddress());
        delivery.setReceiver_name(orderDTO.getReceiverName());
        delivery.setReceiver_phone(orderDTO.getDeliveryPhone());
        delivery.setDelivery_status(DeliveryStatus.PENDING);
        delivery.setDelivery_method(orderDTO.getDeliveryMethod());
        delivery.setCreated_at(Date.from(Instant.now()));
        return orderService.save(delivery);
    }
    public OrderItem createOrderItem(Order order,OrderItemDTO orderItemDTO) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(productService.findProductById(orderItemDTO.getProductId()));
        orderItem.setQuantity(orderItemDTO.getQuantity());
        orderItem.setTotalPrice(Double.parseDouble(String.valueOf(orderItemDTO.getQuantity())) * orderItemDTO.getUnitPrice());
        orderItem.setProductVariant(productService.findProductVariantById(orderItemDTO.getVariantId()));

        return orderService.save(orderItem);
    }
    public Payment createPayment(Order order,OrderDTO orderDTO) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(PaymentMethod.valueOf(orderDTO.getPaymentMethod()));
        BigDecimal total = BigDecimal.valueOf(Long.parseLong(orderDTO.getPayTotal()));
        payment.setAmount(total);
        payment.setPaymentStatus(TransactionStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        return orderService.save(payment);
    }
    @PostMapping("/add")
    public ResponseEntity<Object> addOrder(@RequestBody OrderDTO orderDTO) {
        if(orderDTO !=null && orderDTO.getPaymentMethod().equals("COD")) {
           Order order = createOrder(orderDTO);
           Delivery delivery = createDelivery(orderDTO, order);
           for(OrderItemDTO orderItemDTO : orderDTO.getItems()){
               createOrderItem(order,orderItemDTO);
           }
           Payment payment = createPayment(order,orderDTO);
           order.setDelivery(delivery);
           order.setPayment(payment);
           orderService.save(order);
           return ResponseEntity.accepted().body("Đang xác nhận đơn hàng");
        }
        return ResponseEntity.ok("Đơn Hàng thanh toán bằng VNPAY");
    }
}
