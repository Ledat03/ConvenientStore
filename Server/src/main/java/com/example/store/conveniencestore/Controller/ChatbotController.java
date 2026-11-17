package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.Service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("api/chatbot")
public class ChatbotController {

    private final ChatbotService  chatbotService;

    @PostMapping("/message")
    public ResponseEntity<?> handleUserRequest(@RequestBody String message){
        return ResponseEntity.ok().body(chatbotService.classifyAndHandleRequest(message));
    }
}
