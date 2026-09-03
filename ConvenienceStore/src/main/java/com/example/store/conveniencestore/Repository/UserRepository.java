package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User save(User user);
    @Query("SELECT u from User u")
    List<User> findAll();
    @Query("select u from User u where u.id = :id")
    User findById(@Param("id") long id);
    User findByEmail(String email);
    @Transactional
    void deleteUserById(long id);
    User findByRefreshTokenAndEmail(String refreshToken, String email);
    @Query("SELECT u FROM User u " + "JOIN u.role r WHERE (:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND (:role IS NULL or r.name = :role)")
    Page<User> findUserByEmailOrRole(@Param("email") String email,@Param("role") String role,Pageable pageable);
}
