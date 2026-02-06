package com.example.store.conveniencestore.Controller;
import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.DeliveryStatus;
import com.example.store.conveniencestore.EnumType.PaymentMethod;
import com.example.store.conveniencestore.EnumType.TransactionStatus;
import com.example.store.conveniencestore.Service.*;
import com.example.store.conveniencestore.VNPay.Config;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("order")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final ProductService productService;
    private final VNPayService vnPayService;
    private final GmailService gmailService;
    private final PromotionService promotionService;
    public OrderController(PromotionService promotionService, VNPayService vnPayService, UserService userService, ProductService productService, GmailService gmailService,OrderService orderService) {
        this.orderService = orderService;
        this.userService = userService;
        this.productService = productService;
        this.vnPayService = vnPayService;
        this.gmailService = gmailService;
        this.promotionService = promotionService;
    }
   String getTime(LocalDateTime localDateTime) {
        String formattedTime = localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return formattedTime;
    }

    public Order createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setUser(userService.findById(orderDTO.getUserId()));
        order.setTotal(Double.parseDouble(orderDTO.getPayTotal()));
        return orderService.saveOrder(order);
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
        return orderService.saveDelivery(delivery);
    }
    public OrderItem createOrderItem(Order order,OrderItemDTO orderItemDTO) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(productService.findProductById(orderItemDTO.getProductId()));
        orderItem.setQuantity(orderItemDTO.getQuantity());
        orderItem.setTotalPrice(Double.parseDouble(String.valueOf(orderItemDTO.getQuantity())) * orderItemDTO.getUnitPrice());
        orderItem.setProductVariant(productService.findProductVariantById(orderItemDTO.getVariantId()));
        return orderService.saveOrderItem(orderItem);
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
        return orderService.savePayment(payment);
    }
    public PromotionUser createPromotionUser(User user,Promotion promotion) {
        PromotionUser promotionUser = new PromotionUser();
        promotionUser.setCreatedAt(LocalDateTime.now());
        promotionUser.setPromotion(promotion);
        promotionUser.setUser(user);
        return promotionService.savePromotionUserUsage(promotionUser);
    }
    @PostMapping("/add")
    public ResponseEntity<Object> addOrder(@RequestBody OrderDTO orderDTO, HttpServletRequest request) throws UnsupportedEncodingException, MessagingException {
        if (orderDTO.getPaymentMethod().equals("COD")) {
            Order order = createOrder(orderDTO);
            User user = userService.findById(orderDTO.getUserId());
            Delivery delivery = createDelivery(orderDTO, order);
            if(orderDTO.getPromotionId() != 0){
                Promotion promotion = promotionService.findPromotionById(orderDTO.getPromotionId());
                promotion.setUsageLimit(promotion.getUsageLimit() - 1);
                promotionService.savePromo(promotion);
                PromotionUser promotionUser = createPromotionUser(user,promotion);
            }
            List<OrderItem> orderItems = new ArrayList<>();
            for (OrderItemDTO orderItemDTO : orderDTO.getItems()) {
                OrderItem item = createOrderItem(order, orderItemDTO);
                ProductVariant variant = productService.findProductVariantById(orderItemDTO.getVariantId());
                variant.setStock(variant.getStock() - orderItemDTO.getQuantity());
                productService.saveVariant(variant);
                orderItems.add(item);
            }
            Payment payment = createPayment(order, orderDTO);
            order.setDelivery(delivery);
            order.setPayment(payment);
            orderService.saveOrder(order);
            userService.deleteAllCartDetail(user.getCart());
            gmailService.sendEmail(user,order, delivery.getReceiver_name(),orderItems);
            return ResponseEntity.accepted().body("Đang xác nhận đơn hàng");
        } else if (orderDTO.getPaymentMethod().equals("E_WALLET")) {
            Order order = createOrder(orderDTO);
            User user = userService.findById(orderDTO.getUserId());
            Delivery delivery = createDelivery(orderDTO, order);
            List<OrderItem> orderItems = new ArrayList<>();
            for (OrderItemDTO orderItemDTO : orderDTO.getItems()) {
                OrderItem item = createOrderItem(order, orderItemDTO);
                orderItems.add(item);
            }
            Payment payment = createPayment(order, orderDTO);
            order.setDelivery(delivery);
            order.setPayment(payment);
            orderService.saveOrder(order);
            userService.deleteAllCartDetail(user.getCart());
            String PaymentURL = vnPayService.createPaymentURL(request, payment,delivery,user);
            gmailService.sendEmail(user,order, delivery.getReceiver_name(),orderItems);
            return ResponseEntity.ok(PaymentURL);
        }
        return ResponseEntity.accepted().build();
        }
    @PostMapping("/Re_Pay")
    public ResponseEntity<Object> RePayOrder(@RequestParam("id") long id, HttpServletRequest request) throws UnsupportedEncodingException, MessagingException {
            Order rePayOrder = orderService.findbyOrderId(id);
            String PaymentURL = vnPayService.createPaymentURL(request, rePayOrder.getPayment(),rePayOrder.getDelivery(),rePayOrder.getUser());
            return ResponseEntity.ok(PaymentURL);
    }
    @PostMapping("/cancel")
    public ResponseEntity<Object> CancelOrder(@RequestParam("id") long id) {
        Order order = orderService.findbyOrderId(id);
        order.getDelivery().setDelivery_status(DeliveryStatus.FAILED);
        orderService.saveOrder(order);
        for(OrderItem item : order.getOrderDetails()) {
            ProductVariant productVariant = item.getProductVariant();
            productVariant.setStock(productVariant.getStock() + item.getQuantity());
            productService.saveVariant(productVariant);
        }
        return ResponseEntity.ok("Successfully cancel order");
    }
    @GetMapping("/view")
    public ResponseEntity<Object> viewOrder() {
        List<Order> orders = orderService.findAll();
        List<ResOrderDTO> resOrderDTOs = orders.stream().map(ResOrderDTO::new).toList();
        return ResponseEntity.ok(resOrderDTOs);
    }
    @GetMapping("/view/id")
    public ResponseEntity<Object> viewOrderById(@RequestParam("id") Long id) {
        List<Order> orders = orderService.findAllByUserId(id);
        List<ResOrderDTO> resOrderDTOs = orders.stream().map(ResOrderDTO::new).toList();
        return ResponseEntity.ok(resOrderDTOs);
    }
    @PutMapping("/update/delivery")
    public ResponseEntity<Object> updateDelivery(@RequestBody ResDeliveryDTO resDeliveryDTO) {
        Delivery delivery = orderService.getDeliveryById(resDeliveryDTO.getDeliveryId());
        if (delivery !=null) {
            delivery.setReceiver_name(resDeliveryDTO.getReceiverName());
            delivery.setReceiver_phone(resDeliveryDTO.getReceiverPhone());
            delivery.setDelivery_method(resDeliveryDTO.getDeliveryMethod());
            if (resDeliveryDTO.getDeliveryStatus().equals(DeliveryStatus.CANCELLED)) {
                Order order = delivery.getOrder();
                for(OrderItem item : order.getOrderDetails()) {
                    ProductVariant productVariant = item.getProductVariant();
                    productVariant.setStock(productVariant.getStock() + item.getQuantity());
                    productService.saveVariant(productVariant);
                }
            }
            delivery.setDelivery_status(resDeliveryDTO.getDeliveryStatus());
            delivery.setDelivery_date(resDeliveryDTO.getDeliveryDate());
            delivery.setDelivered_at(resDeliveryDTO.getDeliveredTime());
            delivery.setTracking_number(resDeliveryDTO.getTrackingNumber());
            delivery.setDelivery_fee(resDeliveryDTO.getDeliveryFee());
            delivery.setDelivery_address(resDeliveryDTO.getDeliveryAddress());
            delivery.setUpdated_at(Date.from(Instant.now()));
            orderService.saveDelivery(delivery);
            return ResponseEntity.ok(resDeliveryDTO);
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("/update/payment")
    public ResponseEntity<Object> updatePayment(@RequestBody PaymentDTO paymentDTO) {
        Payment payment = orderService.findbyPaymentId(paymentDTO.getPaymentId());
        if (payment !=null) {
           payment.setPaymentMethod(paymentDTO.getPaymentMethod());
           payment.setAmount(paymentDTO.getPaymentAmount());
           payment.setPaymentDate(paymentDTO.getPaymentDate());
           payment.setTransactionId(paymentDTO.getTransactionId());
           payment.setPaymentStatus(paymentDTO.getPaymentStatus());
           payment.setCreatedAt(payment.getCreatedAt());
           orderService.savePayment(payment);
            return ResponseEntity.ok(paymentDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Object> deleteOrder(@RequestParam(name = "id") long id) {
        Order order = orderService.findbyOrderId(id);
        if (order != null) {
            orderService.deleteOrder(order);
            return ResponseEntity.ok().body("Xóa đơn hàng thành công ");
        }
        return ResponseEntity.notFound().build();
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
                    orderService.saveOrder(order);
                    orderService.savePayment(payment);
                    redirectUrl += "?status=success&orderId=" + order.getId() + "&txnRef=" + transactionDTO.getVnp_ResponseCode();
        } else {
                    payment.setPaymentStatus(TransactionStatus.FAILED);
                    orderService.savePayment(payment);
                    redirectUrl += "?status=failed&error=" + transactionDTO.getVnp_ResponseCode();
                }
        response.sendRedirect(redirectUrl);
            }
        }

