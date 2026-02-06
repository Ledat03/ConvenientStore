package com.example.store.conveniencestore.Repository;


import com.example.store.conveniencestore.Domain.Cart;
import com.example.store.conveniencestore.Domain.CartDetail;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query("SELECT c FROM Cart c where  c.user.id = :userId")
    Cart findByUser_Id(@Param("userId") long userId);
    Cart save(Cart cart);
    void delete(Cart cart);
    Cart findByDetails(@Param("details") CartDetail details);
}
