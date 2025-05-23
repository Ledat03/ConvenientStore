package com.example.store.conveniencestore.Config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {
    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        FileInputStream serviceAccount = new FileInputStream("src/main/java/com/example/store/conveniencestore/Config/AdminKey/convinient-final-firebase-adminsdk-fbsvc-f6f82ec075.json");
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setStorageBucket("convinient-final.appspot.com") // Thay bằng bucket của bạn
                .build();
        return FirebaseApp.initializeApp(options);
    }
}