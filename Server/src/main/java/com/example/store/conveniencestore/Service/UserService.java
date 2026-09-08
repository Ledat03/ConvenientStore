package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.DTO.UserDTO;
import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Repository.*;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.smartcardio.CardException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void save(User user) {
        userRepository.save(user);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(long id) {
        return userRepository.findById(id);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Role findByName(String name){
        return roleRepository.findRoleByName(name);
    }
    public Role findRoleById(long id) {
        return roleRepository.findRoleById(id);
    }

    @Transactional
    public void deleteUserById(long id) {
        Cart cart = cartRepository.findByUser_Id(id);
        if(cart != null) {
            cart.setUser(null);
            cartRepository.delete(cart);
        }
        userRepository.deleteUserById(id);
    }

    public User findByRefreshTokenAndEmail(String refreshToken, String email) {
        return userRepository.findByRefreshTokenAndEmail(refreshToken, email);
    }
    @Transactional
    public void updateUserToken(String Token,String username){
        User user = findByEmail(username);
        if(user != null){
            user.setRefreshToken(Token);
            userRepository.save(user);
        }
    }
    public Page<User> getUserByEmailOrRole(String name, String role, Pageable pageable){
        return userRepository.findUserByEmailOrRole(name,role,pageable);
    }

    public RestResponse<List<UserDTO>> handleListUser() {
        List<User> users = findAll();
        List<UserDTO> userDTOs = users.stream().map(UserDTO::new).toList();
        return RestResponse.ok(200,userDTOs);
    }
    @Transactional
    public RestResponse<User> handleSignUp(UserDTO userDTO) {
        User CheckExist = findByEmail(userDTO.getEmail());

        if (CheckExist != null && userDTO.getEmail().equals(CheckExist.getEmail())) {
            return RestResponse.error(400, "Email already exists");
        }
        User newUser = User.convertUserDTOToUser(userDTO,this,passwordEncoder);
        this.save(newUser);
        return RestResponse.ok(200,newUser);
    }
}
