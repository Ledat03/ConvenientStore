package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.Domain.Role;
import com.example.store.conveniencestore.Domain.User;
import com.example.store.conveniencestore.Repository.RoleRepository;
import com.example.store.conveniencestore.Repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

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
        userRepository.deleteUserById(id);
    }
}
