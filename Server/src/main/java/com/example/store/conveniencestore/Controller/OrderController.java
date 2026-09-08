package com.example.store.conveniencestore.Controller;
import com.example.store.conveniencestore.DTO.*;
import com.example.store.conveniencestore.DTO.Response.ResDeliveryDTO;
import com.example.store.conveniencestore.DTO.Response.ResOrderDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.EnumType.DeliveryStatus;
import com.example.store.conveniencestore.EnumType.PaymentMethod;
import com.example.store.conveniencestore.EnumType.TransactionStatus;
import com.example.store.conveniencestore.Service.*;
import com.example.store.conveniencestore.VNPay.Config;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final ProductService productService;
    private final VNPayService vnPayService;

    @PostMapping("/add")
    public ResponseEntity<Object> addOrder(@RequestBody Optional<OrderDTO> orderDTO, HttpServletRequest request) throws UnsupportedEncodingException, MessagingException {
        RestResponse<String> restResponse =  orderService.handleAddOrder(orderDTO,request);
        return new ResponseEntity<>(restResponse, HttpStatus.valueOf(restResponse.getStatusCode()));
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
        order.getDelivery().setDelivery_status(DeliveryStatus.CANCELLED);
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
    @GetMapping("/view/{id}")
    public ResponseEntity<Object> viewOrderById(@PathVariable("id") long id) {
        List<Order> orders = orderService.findAllByUserId(id);
        List<ResOrderDTO> resOrderDTOs = orders.stream().map(ResOrderDTO::new).toList();
        return ResponseEntity.ok(resOrderDTOs);
    }
    @PutMapping("/update/delivery")
    public ResponseEntity<Object> updateDelivery(@RequestBody ResDeliveryDTO resDeliveryDTO) {
     RestResponse<Object> restResponse = orderService.handleUpdateDelivery(resDeliveryDTO);
        return new ResponseEntity<>(restResponse, HttpStatus.valueOf(restResponse.getStatusCode()));
    }
    @PutMapping("/update/payment")
    public ResponseEntity<Object> updatePayment(@RequestBody PaymentDTO paymentDTO) {
        RestResponse<Object> restResponse = orderService.handleUpdatePayment(paymentDTO);
        return new ResponseEntity<>( restResponse, HttpStatus.valueOf(restResponse.getStatusCode()));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Object> deleteOrder(@RequestParam(name = "id") long id) {
        RestResponse<String> restResponse = orderService.handleDeleteOrder(id);
        return new ResponseEntity<>(restResponse, HttpStatus.valueOf(restResponse.getStatusCode()));
    }
    @GetMapping("/filter")
    public ResponseEntity<PageResponse<List<ResOrderDTO>>> getOrderByFilter(@RequestParam(value = "search" ,required = false) String username,
                                                           @RequestParam(value = "time"  ,required = false,defaultValue = "0") int days,
                                                           @RequestParam(value = "deliveryStatus" ,required = false) String deliveryStatus,
                                                           @RequestParam(value = "paymentStatus"  ,required = false) String paymentStatus,
                                                           @RequestParam(value = "page"  ,required = false ,defaultValue = "0") int page){
        String name = null;
        LocalDateTime now = null,past = null;
        TransactionStatus ts = null;
        DeliveryStatus ds = null;
        if(username != null) name = username;
        if(days != 0) {
            now = LocalDateTime.now();
            past = now.minusDays(days);
        }
        if(deliveryStatus != null) ds = DeliveryStatus.valueOf(deliveryStatus);
        if (paymentStatus != null) ts = TransactionStatus.valueOf(paymentStatus);
        Pageable pageable = PageRequest.of(page,8);
        Page<Order> data = orderService.getOrdersByFilter(name,now,past,ds,ts,pageable);
        List<ResOrderDTO> response = data.stream().map(ResOrderDTO::new).toList();
        PageResponse<List<ResOrderDTO>> res = new PageResponse<>(response,data.getTotalElements());
        return ResponseEntity.ok(res);
    }
    @GetMapping("/vnpay_jsp/vnpay_return")
    public void handleVNPayReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            fields.put(fieldName, fieldValue);
        }
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

        boolean isValidSignature = VNPayService.checkSignature(fields);
        if (!isValidSignature) {
            redirectUrl += "?status=invalid&txnCode=97";
            response.sendRedirect(redirectUrl);
            return;
        }
        Payment payment = orderService.findbyTransactionId(transactionDTO.getVnp_TxnRef());
        if (payment != null && transactionDTO.getVnp_TransactionStatus().equals("00") && transactionDTO.getVnp_ResponseCode().equals("00") ) {
                    payment.setPaymentStatus(TransactionStatus.SUCCESS);
                    payment.setPaymentDate(LocalDateTime.now());
                    Order order = payment.getOrder();
                    order.setPayment(payment);
                    orderService.saveOrder(order);
                    orderService.savePayment(payment);
                    redirectUrl += "?status=success&orderId=" + order.getId() + "&txnCode=" + transactionDTO.getVnp_ResponseCode();
        } else {
                    payment.setPaymentStatus(TransactionStatus.FAILED);
                    orderService.savePayment(payment);
                    redirectUrl += "?status=failed&txnCode=" + transactionDTO.getVnp_ResponseCode();
                }
                response.sendRedirect(redirectUrl);
            }
        }

