package com.example.store.conveniencestore.Controller;

import com.example.store.conveniencestore.DTO.RoleDTO;
import com.example.store.conveniencestore.DTO.UserDTO;
import com.example.store.conveniencestore.Domain.Role;
import com.example.store.conveniencestore.Domain.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.example.store.conveniencestore.Domain.RestRestponse;
import com.example.store.conveniencestore.Service.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("user")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }
    private String convertToDTO(Role role) {
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setId(role.getId());
        roleDTO.setName(role.getName());
        return roleDTO.getName();
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
       userDTO.setRole(convertToDTO(user.getRole()));
       return userDTO;
    }
    private User convertUserDTOToUser(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setEmail(userDTO.getEmail());
        User TempUser = userService.findById(userDTO.getId());
        if(userDTO.getPasswordHash() != null) {
            user.setPasswordHash(passwordEncoder.encode(userDTO.getPasswordHash()));
        }else{
            user.setPasswordHash(TempUser.getPasswordHash());
        }
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setUsername(userDTO.getUsername());
        user.setAddress(userDTO.getAddress());
        user.setPhone(userDTO.getPhone());
        user.setRole(convertRoleDTOToRole(userDTO.getRole()));
        return user;
    }
    private Role convertRoleDTOToRole(String roleName) {
        Role role =  userService.findByName(roleName);
        return role;
    }
    @GetMapping("/view")
    public ResponseEntity<List<UserDTO>> getUsers() {
        List<User> users = userService.findAll();
        RestRestponse<List<UserDTO>> usersResponse = new RestRestponse<>();
        List<UserDTO> userDTOs = users.stream().map(this::convertUserToDTO).toList();
        usersResponse.setData(userDTOs);
        return ResponseEntity.ok().body(userDTOs);
    }

    @PutMapping("/update")
    public ResponseEntity<Object> updateUser(@RequestBody UserDTO userDTO) {
            User user = convertUserDTOToUser(userDTO);
        if(userService.findById(user.getId()) != null) {
            userService.save(user);
        }
        return ResponseEntity.ok().body(userDTO);
}
    @PostMapping("/create")
    public ResponseEntity<RestRestponse<Object>> createUser(@RequestBody UserDTO user) {
        RestRestponse<Object> restRestponse = new RestRestponse<>();
        if (user != null) {
            Role getRole = userService.findByName(user.getRole());
            String hashPassword = passwordEncoder.encode(user.getPasswordHash());
            User newUser = new User();
            newUser.setUsername(user.getUsername());
            newUser.setEmail(user.getEmail());
            newUser.setPasswordHash(hashPassword);
            newUser.setRole(getRole);
            newUser.setFirstName(user.getFirstName());
            newUser.setLastName(user.getLastName());
            newUser.setAddress(user.getAddress());
            newUser.setPhone(user.getPhone());
            userService.save(newUser);
            restRestponse.setData(user);
        }
        return ResponseEntity.ok().body(restRestponse);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable Long id) {
        RestRestponse<Object> restRestponse = new RestRestponse<>();
        if(userService.findById(id) != null) {
            userService.deleteUserById(id);
            restRestponse.setMessage("Xóa người dùng thành công !");
        }else{
            return ResponseEntity.badRequest().body(restRestponse);
        }

        return ResponseEntity.ok().body(restRestponse);
    }
}
