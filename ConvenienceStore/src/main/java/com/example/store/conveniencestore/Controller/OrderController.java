package com.example.store.conveniencestore.Controller;
import com.example.store.conveniencestore.DTO.OrderDTO;
import com.example.store.conveniencestore.DTO.OrderItemDTO;
import com.example.store.conveniencestore.DTO.TransactionDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.DeliveryStatus;
import com.example.store.conveniencestore.EnumType.PaymentMethod;
import com.example.store.conveniencestore.EnumType.TransactionStatus;
import com.example.store.conveniencestore.Service.OrderService;
import com.example.store.conveniencestore.Service.ProductService;
import com.example.store.conveniencestore.Service.UserService;
import com.example.store.conveniencestore.Service.VNPayService;
import com.example.store.conveniencestore.VNPay.Config;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("order")
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;
    private final ProductService productService;
    private final VNPayService vnPayService;
    public OrderController( VNPayService vnPayService, OrderService orderService, UserService userService, ProductService productService) {
        this.orderService = orderService;
        this.userService = userService;
        this.productService = productService;
        this.vnPayService = vnPayService;
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
        payment.setTransactionId(Config.getRandomNumber(8));
        payment.setCreatedAt(LocalDateTime.now());
        return orderService.save(payment);
    }
    @PostMapping("/add")
    public ResponseEntity<Object> addOrder(@RequestBody OrderDTO orderDTO, HttpServletRequest request) throws UnsupportedEncodingException {
        if (orderDTO.getPaymentMethod().equals("COD")) {
            Order order = createOrder(orderDTO);
            User user = userService.findById(orderDTO.getUserId());
            Delivery delivery = createDelivery(orderDTO, order);
            for (OrderItemDTO orderItemDTO : orderDTO.getItems()) {
                createOrderItem(order, orderItemDTO);
            }

            Payment payment = createPayment(order, orderDTO);
            order.setDelivery(delivery);
            order.setPayment(payment);
            orderService.save(order);
            userService.deleteAllCartDetail(user.getCart());
            return ResponseEntity.accepted().body("Đang xác nhận đơn hàng");
        } else if (orderDTO.getPaymentMethod().equals("E_WALLET")) {
            Order order = createOrder(orderDTO);
            User user = userService.findById(orderDTO.getUserId());
            Delivery delivery = createDelivery(orderDTO, order);
            for (OrderItemDTO orderItemDTO : orderDTO.getItems()) {
                createOrderItem(order, orderItemDTO);
            }
            Payment payment = createPayment(order, orderDTO);
            order.setDelivery(delivery);
            order.setPayment(payment);
            orderService.save(order);
            userService.deleteAllCartDetail(user.getCart());
            String PaymentURL = vnPayService.createPaymentURL(request, payment,delivery,user);
            return ResponseEntity.ok(PaymentURL);
        }
        return ResponseEntity.accepted().build();
        }
    @GetMapping("/vnpay_jsp/vnpay_return")
    public void handleVNPayReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        TransactionDTO transactionDTO = new TransactionDTO();
        transactionDTO.setVnp_Amount(request.getParameter("vnp_Amount"));
        transactionDTO.setVnp_BankCode(request.getParameter("vnp_BankCode"));
        transactionDTO.setVnp_BankTranNo(request.getParameter("vnp_BankTranNo"));
        transactionDTO.setVnp_CardType(request.getParameter("vnp_CardType"));
        transactionDTO.setVnp_OrderInfo(request.getParameter("vnp_OrderInfo"));
        transactionDTO.setVnp_PayDate(request.getParameter("vnp_PayDate"));
        transactionDTO.setVnp_ResponseCode(request.getParameter("vnp_ResponseCode"));
        transactionDTO.setVnp_TmnCode(request.getParameter("vnp_TmnCode"));
        transactionDTO.setVnp_TransactionNo(request.getParameter("vnp_TransactionNo"));
        transactionDTO.setVnp_TransactionStatus(request.getParameter("vnp_TransactionStatus"));
        transactionDTO.setVnp_TxnRef(request.getParameter("vnp_TxnRef"));
        transactionDTO.setVnp_SecureHash(request.getParameter("vnp_SecureHash"));
        String redirectUrl = "http://localhost:3000/ordercheck";
        Payment payment = orderService.findbyTransactionId(transactionDTO.getVnp_TxnRef());
        if (payment != null && transactionDTO.getVnp_TransactionStatus().equals("00") && transactionDTO.getVnp_ResponseCode().equals("00") ) {
                    payment.setPaymentStatus(TransactionStatus.SUCCESS);
                    payment.setPaymentDate(LocalDateTime.now());
                    Order order = payment.getOrder();
                    order.setPayment(payment);
                    orderService.save(order);
                    orderService.save(payment);
                    redirectUrl += "?status=success&orderId=" + order.getId() + "&txnRef=" + transactionDTO.getVnp_ResponseCode();
        } else {
                    payment.setPaymentStatus(TransactionStatus.FAILED);
                    orderService.save(payment);
                    redirectUrl += "?status=failed&error=" + transactionDTO.getVnp_ResponseCode();
                }
        response.sendRedirect(redirectUrl);
            }
        }

