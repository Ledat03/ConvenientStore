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

    public OrderController( VNPayService vnPayService, UserService userService, ProductService productService, GmailService gmailService,OrderService orderService) {
        this.orderService = orderService;
        this.userService = userService;
        this.productService = productService;
        this.vnPayService = vnPayService;
        this.gmailService = gmailService;

    }
    private UserDTO convertUserToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setUsername(user.getUsername());
        userDTO.setAddress(user.getAddress());
        userDTO.setPhone(user.getPhone());
        userDTO.setRole(user.getRole().getName());
        return userDTO;
    }
    private String getTime(LocalDateTime localDateTime) {
        String formattedTime = localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return formattedTime;
    }
    public ResOrderDTO convertOrderToOrderDTO(Order order) {
        ResOrderDTO resOrderDTO = new ResOrderDTO();
        resOrderDTO.setOrderId(order.getId());
        resOrderDTO.setUser(convertUserToDTO(order.getUser()));
        resOrderDTO.setTotalPrice(order.getTotal());
        resOrderDTO.setDelivery(convertDeliveryToDeliveryDTO(order.getDelivery()));
        List<ResOrderItemDTO> resOrderItemDTOs = order.getOrderDetails().stream().map(this::convertOrderItemToOrderItemDTO).toList();
        resOrderDTO.setOrderItemDTOs(resOrderItemDTOs);
        resOrderDTO.setPayment(convertPaymentToPaymentDTO(order.getPayment()));
        return resOrderDTO;
    }
    public ResOrderItemDTO convertOrderItemToOrderItemDTO(OrderItem orderItem) {
        ResOrderItemDTO resOrderItemDTO = new ResOrderItemDTO();
        resOrderItemDTO.setOrderItemId(orderItem.getId());
        resOrderItemDTO.setQuantity(orderItem.getQuantity());
        resOrderItemDTO.setTotalPrice(orderItem.getTotalPrice());
        resOrderItemDTO.setProduct(convertProductToProductDTO(orderItem.getProduct()));
        resOrderItemDTO.setProductVariant(convertVariantToDTO(orderItem.getProductVariant()));
        return resOrderItemDTO;
    }
    public PaymentDTO convertPaymentToPaymentDTO(Payment payment) {
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setPaymentId(payment.getId());
        paymentDTO.setPaymentMethod(payment.getPaymentMethod());
        paymentDTO.setPaymentAmount(payment.getAmount());
        paymentDTO.setPaymentDate(payment.getPaymentDate());
        paymentDTO.setTransactionId(payment.getTransactionId());
        paymentDTO.setPaymentStatus(payment.getPaymentStatus());
        paymentDTO.setCreateTime(payment.getCreatedAt());
        return paymentDTO;
    }
    public ResDeliveryDTO convertDeliveryToDeliveryDTO(Delivery delivery) {
        ResDeliveryDTO resDeliveryDTO = new ResDeliveryDTO();
        resDeliveryDTO.setDeliveryId(delivery.getDeliveryId());
        resDeliveryDTO.setDeliveryMethod(delivery.getDelivery_method());
        resDeliveryDTO.setDeliveryDate(delivery.getDelivery_date());
        resDeliveryDTO.setDeliveryFee(delivery.getDelivery_fee());
        resDeliveryDTO.setDeliveryStatus(delivery.getDelivery_status());
        resDeliveryDTO.setTrackingNumber(delivery.getTracking_number());
        resDeliveryDTO.setDeliveredTime(delivery.getDelivered_at());
        resDeliveryDTO.setReceiverName(delivery.getReceiver_name());
        resDeliveryDTO.setReceiverPhone(delivery.getReceiver_phone());
        resDeliveryDTO.setDeliveryAddress(delivery.getDelivery_address());
        return resDeliveryDTO;
    }
    public ProductVariantDTO convertVariantToDTO(ProductVariant product) {
        ProductVariantDTO productVariantDTO = new ProductVariantDTO();
        productVariantDTO.setId(product.getVariantId());
        productVariantDTO.setProductId(product.getProduct().getProductId());
        productVariantDTO.setProductImage(product.getProductImage());
        productVariantDTO.setStock(product.getStock());
        productVariantDTO.setPrice(product.getPrice());
        productVariantDTO.setSalePrice(product.getSalePrice());
        productVariantDTO.setCalUnit(product.getCalUnit());
        productVariantDTO.setSkuCode(product.getSkuCode());
        productVariantDTO.setIsActive(product.getIsActive());
        return productVariantDTO;
    }
    private ProductDTO convertProductToProductDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductId(product.getProductId());
        productDTO.setProductName(product.getProductName());
        productDTO.setProductDescription(product.getProductDescription());
        productDTO.setHowToUse(product.getHowToUse());
        productDTO.setPreserve(product.getPreserve());
        productDTO.setOrigin(product.getOrigin());
        productDTO.setCategory(product.getCategory().getCategoryName());
        productDTO.setSubCategory(product.getSubCategory().getSubCategoryName());
        productDTO.setIngredient(product.getIngredient());
        productDTO.setUpdateAt(getTime(product.getUpdatedAt()));
        productDTO.setImage(product.getImage());
        productDTO.setStatus(product.getStatus());
        productDTO.setIsActive(Boolean.toString(product.getIsActive()));
        productDTO.setBrand(product.getBrand().getBrandName());
        productDTO.setSku(product.getSku());
        List<ProductVariantDTO> temp = product.getProductVariant().stream().map(this::convertVariantToDTO).toList();
        productDTO.setProductVariant(temp);
        return productDTO;
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
    @PostMapping("/add")
    public ResponseEntity<Object> addOrder(@RequestBody OrderDTO orderDTO, HttpServletRequest request) throws UnsupportedEncodingException, MessagingException {
        if (orderDTO.getPaymentMethod().equals("COD")) {
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
    @GetMapping("/view")
    public ResponseEntity<Object> viewOrder() {
        List<Order> orders = orderService.findAll();
        List<ResOrderDTO> resOrderDTOs = orders.stream().map(this::convertOrderToOrderDTO).toList();
        return ResponseEntity.ok(resOrderDTOs);
    }
    @GetMapping("/view/id")
    public ResponseEntity<Object> viewOrderById(@RequestParam("id") Long id) {
        List<Order> orders = orderService.findAllByUserId(id);
        List<ResOrderDTO> resOrderDTOs = orders.stream().map(this::convertOrderToOrderDTO).toList();
        return ResponseEntity.ok(resOrderDTOs);
    }
    @PutMapping("/update/delivery")
    public ResponseEntity<Object> updateDelivery(@RequestBody ResDeliveryDTO resDeliveryDTO) {
        Delivery delivery = orderService.getDeliveryById(resDeliveryDTO.getDeliveryId());
        if (delivery !=null) {
            delivery.setReceiver_name(resDeliveryDTO.getReceiverName());
            delivery.setReceiver_phone(resDeliveryDTO.getReceiverPhone());
            delivery.setDelivery_method(resDeliveryDTO.getDeliveryMethod());
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

