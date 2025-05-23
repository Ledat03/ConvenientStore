package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User save(User user);
    List<User> findAll();
    User findById(long id);
    User findByEmail(String email);
    void deleteUserById(long id);

}
