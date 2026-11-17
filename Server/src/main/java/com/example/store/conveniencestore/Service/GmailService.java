
package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.Domain.Order;
import com.example.store.conveniencestore.Domain.OrderItem;
import com.example.store.conveniencestore.Domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GmailService {

    private static final Logger log =
            LoggerFactory.getLogger(GmailService.class);

    private final TemplateEngine templateEngine;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${brevo.api-key}")
    private String apiKey;

    @Value("${brevo.sender-email}")
    private String fromAddress;

    @Value("${brevo.sender-name:ConvenienceStore}")
    private String senderName;

    @Value("${brevo.api-url:https://api.brevo.com/v3/smtp/email}")
    private String apiUrl;

    public GmailService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @Async
    public void sendEmail(
            User user,
            Order order,
            String receiverName,
            List<OrderItem> items
    ) {
        try {
            Context context = new Context();

            context.setVariable("username", receiverName);
            context.setVariable("orderId", order.getId());
            context.setVariable(
                    "paymentStatus",
                    order.getPayment().getPaymentStatus()
            );
            context.setVariable(
                    "paymentMethod",
                    order.getPayment().getPaymentMethod()
            );
            context.setVariable(
                    "deliveryAddress",
                    order.getDelivery().getDelivery_address()
            );
            context.setVariable("totalAmount", order.getTotal());

            List<Map<String, String>> itemList = new ArrayList<>();

            for (OrderItem item : items) {
                Map<String, String> map = new HashMap<>();

                map.put(
                        "productName",
                        item.getProduct().getProductName()
                );
                map.put(
                        "calUnit",
                        item.getProductVariant().getCalUnit()
                );
                map.put(
                        "quantity",
                        String.valueOf(item.getQuantity())
                );
                map.put(
                        "totalPrice",
                        String.valueOf(item.getTotalPrice())
                );

                itemList.add(map);
            }

            context.setVariable("items", itemList);

            String content = templateEngine.process(
                    "orderEmail.html",
                    context
            );

            String subject = "Xác nhận đơn hàng #" + order.getId();

            sendViaBrevo(
                    user.getEmail(),
                    subject,
                    content,
                    null
            );

            log.info(
                    "Đã gửi yêu cầu email xác nhận đơn hàng #{} tới Brevo",
                    order.getId()
            );

        } catch (Exception e) {
            log.error(
                    "Gửi mail đơn hàng #{} thất bại: {}",
                    order.getId(),
                    e.getMessage(),
                    e
            );
        }
    }

    public void sendCodeResetPassword(
            String gmail,
            String number
    ) {
        String subject = "Lấy lại mật khẩu " + gmail;

        String textContent = "Mã khôi phục của bạn là: " + number;

        String htmlContent =
                "<html><body>" +
                        "<p>Mã khôi phục của bạn là:</p>" +
                        "<h2>" + number + "</h2>" +
                        "</body></html>";

        try {
            sendViaBrevo(
                    gmail,
                    subject,
                    htmlContent,
                    textContent
            );

            log.info("Đã gửi yêu cầu email khôi phục mật khẩu tới Brevo");

        } catch (Exception e) {
            log.error(
                    "Gửi mail khôi phục mật khẩu thất bại: {}",
                    e.getMessage(),
                    e
            );

            throw new IllegalStateException(
                    "Không thể gửi email khôi phục mật khẩu",
                    e
            );
        }
    }

    public void sendCodeRegister(
            String gmail,
            String number
    ) {
        String subject = "Xác nhận địa chỉ gmail : " + gmail;

        String textContent = "Mã xác nhận của bạn là: " + number;

        String htmlContent =
                "<html><body>" +
                        "<p>Mã xác nhận của bạn là:</p>" +
                        "<h2>" + number + "</h2>" +
                         "<h2> Không được phép gửi mã này cho bất kì ai ! </h2>"+
                        "</body></html>";

        try {
            sendViaBrevo(
                    gmail,
                    subject,
                    htmlContent,
                    textContent
            );

            log.info("Đã gửi yêu cầu xác nhận email tới Brevo");

        } catch (Exception e) {
            log.error(
                    "Gửi mail xác nhận thất bại: {}",
                    e.getMessage(),
                    e
            );

            throw new IllegalStateException(
                    "Không thể gửi email xác nhận ",
                    e
            );
        }
    }

    private void sendViaBrevo(
            String to,
            String subject,
            String htmlContent,
            String textContent
    ) {
        Map<String, Object> sender = Map.of(
                "name", senderName,
                "email", fromAddress
        );

        Map<String, Object> recipient = Map.of(
                "email", to
        );

        Map<String, Object> payload = new HashMap<>();

        payload.put("sender", sender);
        payload.put("to", List.of(recipient));
        payload.put("subject", subject);
        payload.put("htmlContent", htmlContent);

        if (textContent != null) {
            payload.put("textContent", textContent);
        }

        org.springframework.http.HttpHeaders headers =
                new org.springframework.http.HttpHeaders();

        headers.setContentType(
                org.springframework.http.MediaType.APPLICATION_JSON
        );
        headers.setAccept(
                List.of(org.springframework.http.MediaType.APPLICATION_JSON)
        );
        headers.set("api-key", apiKey);

        org.springframework.http.HttpEntity<Map<String, Object>> request =
                new org.springframework.http.HttpEntity<>(payload, headers);

        try {
            org.springframework.http.ResponseEntity<Map> response =
                    restTemplate.postForEntity(
                            apiUrl,
                            request,
                            Map.class
                    );

            Object messageId = response.getBody() == null
                    ? null
                    : response.getBody().get("messageId");

            log.info(
                    "Brevo API response: status={}, messageId={}",
                    response.getStatusCode(),
                    messageId
            );

        } catch (RestClientResponseException e) {
            log.error(
                    "Brevo API HTTP Error {}: {}",
                    e.getStatusCode(),
                    e.getResponseBodyAsString()
            );

            throw e;
        }
    }
}
