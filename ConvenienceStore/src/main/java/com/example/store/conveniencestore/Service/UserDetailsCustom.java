package com.example.store.conveniencestore.Service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;

public class UserDetailsCustom implements UserDetailsService {
    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsCustom.class);

    public UserDetailsCustom(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("Loading user by username: {}", username);
        com.example.store.conveniencestore.Domain.User user = this.userService.findByEmail(username);
        if (user == null) {
            logger.error("User not found with username: {}", username);
            throw new UsernameNotFoundException("Không tìm thấy người dùng");
        }
        logger.info("User found: {}", user.getEmail());
        return new User(
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
    }
}
