package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.ChangePassword;
import com.example.store.conveniencestore.DTO.UserDTO;
import com.example.store.conveniencestore.Domain.RestResponse;
import com.example.store.conveniencestore.Domain.Role;
import com.example.store.conveniencestore.Domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.example.store.conveniencestore.Service.UserService;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/view")
    public ResponseEntity<Object> getUsers() {
        return ResponseEntity.ok().body(userService.handleListUser());
    }
    @GetMapping("/view-user")
    public ResponseEntity<Object> getUser(@RequestParam("id") Long id) {
        User user = userService.findById(id);
        UserDTO userDTO = new UserDTO(user);
        return ResponseEntity.ok().body(userDTO);
    }
    @PutMapping("/update-user")
    public ResponseEntity<Object> updateUserProfile(@Valid @RequestBody UserDTO userDTO) {
        User user = userService.findById(userDTO.getId());  
        Role role =  userService.findByName("user");
        if(user != null) {
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setEmail(userDTO.getEmail());
            user.setUsername(userDTO.getUsername());
            user.setAddress(userDTO.getAddress());
            user.setPhone(userDTO.getPhone());
            user.setRole(role);
            user.setUpdatedAt(Instant.now());
            user.setUpdatedBy("user");
            user.setRefreshToken(user.getRefreshToken());
            userService.save(user);
        }
        return ResponseEntity.ok().body(userDTO);
    }
    @PutMapping("/update")
    public ResponseEntity<Object> updateUser(@Valid @RequestBody UserDTO userDTO) {
        Role role =  userService.findByName(userDTO.getRole());
        if(role != null) {
            User user = userService.findById(userDTO.getId());
            if(userService.findById(user.getId()) != null) {
                user = User.convertUserDTOToUser(userDTO,userService,passwordEncoder,role);
                userService.save(user);
                return ResponseEntity.ok().body("Update Successfully !");
            }else  {
                return ResponseEntity.badRequest().body("Can't find User");
            }
        }else{
            return ResponseEntity.badRequest().body("Some fields are incorrect, please check and try again !");
        }
}
    @PutMapping("/change-password")
    public ResponseEntity<Object> changePassword(@RequestBody ChangePassword changePassword) {
        User user = userService.findById(changePassword.getId());
        if(user != null) {
            if(passwordEncoder.matches(changePassword.getCurrentPassword(), user.getPasswordHash())) {
                String hash = passwordEncoder.encode(changePassword.getPassword());
                user.setPasswordHash(hash);
                userService.save(user);
                return ResponseEntity.ok().body("Password was changed !");
            }else{
                return ResponseEntity.ok().body("Old password doesn't match !");
            }
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("/re-password")
    public ResponseEntity<Object> changePassword(@RequestParam(name = "password") String password, @RequestParam(name = "email") String email) {
        User user = userService.findByEmail(email);
        String hash = passwordEncoder.encode(password);
        user.setPasswordHash(hash);
        userService.save(user);
        return ResponseEntity.ok().body("Password has been changed !");
    }
    @PostMapping("/create")
    public ResponseEntity<RestResponse<Object>> createUser(@Valid @RequestBody UserDTO user) {
        RestResponse<Object> restResponse = new RestResponse<>();
        if (user != null) {
                Role getRole = userService.findByName(user.getRole());
                userService.save(User.builder()
                        .phone(user.getPhone())
                        .address(user.getAddress())
                        .createdBy("admin")
                        .createdAt(Instant.now())
                        .firstName(user.getFirstName().trim())
                        .lastName(user.getLastName().trim())
                        .username(user.getUsername().trim())
                        .passwordHash(passwordEncoder.encode(user.getPasswordHash()))
                        .role(getRole)
                        .email(user.getEmail().toLowerCase().trim())
                        .build());
                restResponse.setResponseData(user);
                return ResponseEntity.ok().body(restResponse);
        }
        restResponse.setResponseData("Something went wrong !");
        return ResponseEntity.badRequest().body(restResponse);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable Long id) {
        RestResponse<Object> restRestponse = new RestResponse<>();
        if(userService.findById(id) != null) {
            userService.deleteUserById(id);
            restRestponse.setMessage("Delete User Successfully !");
        }else{
            return ResponseEntity.badRequest().body(restRestponse);
        }

        return ResponseEntity.ok().body(restRestponse);
    }
    @GetMapping("/count_user")
    public ResponseEntity<Object> countUser() {
        long count = userService.findAll().size();
        return ResponseEntity.ok().body(count);
    }
    @GetMapping("/filter")
    public ResponseEntity<List<UserDTO>> filterUser(String name,String role,int page){
        Pageable pageable = PageRequest.of(page,8);
        Page<User> data = userService.getUserByEmailOrRole(name,role,pageable);
        List<UserDTO> response = data.stream().map(UserDTO::new).toList();
        return ResponseEntity.ok(response);
    }
}
