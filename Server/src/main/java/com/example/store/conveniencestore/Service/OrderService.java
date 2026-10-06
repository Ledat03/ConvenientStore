package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.DTO.OrderDTO;
import com.example.store.conveniencestore.DTO.OrderItemDTO;
import com.example.store.conveniencestore.DTO.PaymentDTO;
import com.example.store.conveniencestore.DTO.Response.ResDeliveryDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.DeliveryStatus;
import com.example.store.conveniencestore.EnumType.PaymentMethod;
import com.example.store.conveniencestore.EnumType.TransactionStatus;
import com.example.store.conveniencestore.Repository.*;
import com.example.store.conveniencestore.VNPay.Config;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final DeliveryRepository deliveryRepository;
    private final PaymentRepository paymentRepository;
    private final ProductService productService;
    private final PromotionService promotionService;
    private final UserService userService;
    private final GmailService gmailService;
    private final CartService cartService;
    private final VNPayService vNPayService;

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
    @Transactional
    public Order createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setUser(userService.findById(orderDTO.getUserId()));
        order.setTotal(Double.parseDouble(orderDTO.getPayTotal()));
        return saveOrder(order);
    }
    @Transactional
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
        return saveDelivery(delivery);
    }
    @Transactional
    public OrderItem createOrderItem(Order order, OrderItemDTO orderItemDTO) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(productService.findProductById(orderItemDTO.getProductId()));
        orderItem.setQuantity(orderItemDTO.getQuantity());
        orderItem.setTotalPrice(Double.parseDouble(String.valueOf(orderItemDTO.getQuantity())) * orderItemDTO.getUnitPrice());
        orderItem.setProductVariant(productService.findProductVariantById(orderItemDTO.getVariantId()));
        return saveOrderItem(orderItem);
    }
    @Transactional
    public Payment createPayment(Order order,OrderDTO orderDTO) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(PaymentMethod.valueOf(orderDTO.getPaymentMethod()));
        BigDecimal total = BigDecimal.valueOf(Long.parseLong(orderDTO.getPayTotal()));
        payment.setAmount(total);
        payment.setPaymentStatus(TransactionStatus.PENDING);
        payment.setTransactionId(Config.getRandomNumber(8));
        payment.setCreatedAt(LocalDateTime.now());
        return savePayment(payment);
    }
    @Transactional
    public PromotionUser createPromotionUser(User user,Promotion promotion) {
        PromotionUser promotionUser = new PromotionUser();
        promotionUser.setCreatedAt(LocalDateTime.now());
        promotionUser.setPromotion(promotion);
        promotionUser.setUser(user);
        return promotionService.savePromotionUserUsage(promotionUser);
    }
    @Transactional
    public Payment handleAddOrderItems(OrderDTO orderDTO,Order order,Delivery delivery,User user) throws  MessagingException {
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
        saveOrder(order);
        cartService.deleteAllCartDetail(user.getCart());
        gmailService.sendEmail(user,order, delivery.getReceiver_name(),orderItems);
        return payment;
    }
    @Transactional
    public RestResponse<String> handleAddOrder(Optional<OrderDTO> orderDTO , HttpServletRequest request) throws MessagingException, UnsupportedEncodingException {
        if (orderDTO.isPresent()) {
            Order order = createOrder(orderDTO.get());
            User user = userService.findById(orderDTO.get().getUserId());
            Delivery delivery = createDelivery(orderDTO.get(), order);
            Payment payment = handleAddOrderItems(orderDTO.get(), order, delivery, user);
            if(orderDTO.get().getPromotionId() != 0){
                Promotion promotion = promotionService.findPromotionById(orderDTO.get().getPromotionId());
                promotion.setUsageLimit(promotion.getUsageLimit() - 1);
                promotionService.savePromo(promotion);
                createPromotionUser(user,promotion);
            }
            if (orderDTO.get().getPaymentMethod().equals("COD")) {
                return RestResponse.ok(202,"Order is on progress");
            } else if (orderDTO.get().getPaymentMethod().equals("E_WALLET")) {
                String paymentURL = vNPayService.createPaymentURL(request, payment, delivery, user);
                return RestResponse.ok(201, paymentURL);
            }
        }
        return RestResponse.error(400,"Something went wrong!");
    }
    @Transactional
    public RestResponse<Object> handleUpdatePayment(PaymentDTO paymentDTO){
        Payment payment = findbyPaymentId(paymentDTO.getPaymentId());
        if (payment !=null) {
            payment.setPaymentMethod(paymentDTO.getPaymentMethod());
            payment.setAmount(paymentDTO.getPaymentAmount());
            payment.setPaymentDate(paymentDTO.getPaymentDate());
            payment.setTransactionId(paymentDTO.getTransactionId());
            payment.setPaymentStatus(paymentDTO.getPaymentStatus());
            payment.setCreatedAt(payment.getCreatedAt());
            savePayment(payment);
            return RestResponse.ok(200,paymentDTO);
        }
        return RestResponse.error(400,"Something went wrong!");
    }
    @Transactional
    public RestResponse<String> handleDeleteOrder(long id){
        Order order = findbyOrderId(id);
        if (order != null) {
            deleteOrder(order);
            return RestResponse.ok(204,"Delete order successfully ");
        }
        return RestResponse.error(400,"Something went wrong!");
    }
    @Transactional
    public RestResponse<Object> handleUpdateDelivery(ResDeliveryDTO resDeliveryDTO){
        Delivery delivery = getDeliveryById(resDeliveryDTO.getDeliveryId());
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
            saveDelivery(delivery);
            return RestResponse.ok(200,resDeliveryDTO);
        }
        return RestResponse.error(400,"Something went wrong!");
    }
}
