package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.Domain.Order;
import com.example.store.conveniencestore.Domain.OrderItem;
import com.example.store.conveniencestore.Domain.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    public GmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendEmail(User user, Order order, String receiverName, List<OrderItem> items) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(user.getEmail());
        helper.setSubject("Xác nhận đơn hàng #" + order.getId());

        Context context = new Context();
        context.setVariable("username", receiverName);
        context.setVariable("orderId", order.getId());
        context.setVariable("paymentStatus", order.getPayment().getPaymentStatus());
        context.setVariable("paymentMethod", order.getPayment().getPaymentMethod());
        context.setVariable("deliveryAddress", order.getDelivery().getDelivery_address());
        context.setVariable("totalAmount", order.getTotal());

        List<Map<String, String>> itemList = new ArrayList<>();
        for (OrderItem item : items) {
            Map<String, String> map = new HashMap<>();
            map.put("productName", item.getProduct().getProductName());
            map.put("calUnit", item.getProductVariant().getCalUnit());
            map.put("quantity", String.valueOf(item.getQuantity()));
            map.put("totalPrice", String.valueOf(item.getTotalPrice()));
            itemList.add(map);
        }
        context.setVariable("items", itemList);
        String content = templateEngine.process("orderEmail.html", context);
        helper.setText(content, true);
        mailSender.send(message);
    }
    public void sendCodeResetPassword(String gmail , String number) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(gmail);
        helper.setSubject("Lấy lại mật khẩu " + gmail);
        helper.setText("Mã khôi phục của bạn là", number);
        mailSender.send(message);
    }
}
