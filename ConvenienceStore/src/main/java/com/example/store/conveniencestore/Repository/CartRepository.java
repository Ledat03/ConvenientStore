package com.example.store.conveniencestore.Repository;


import com.example.store.conveniencestore.Domain.Cart;
import com.example.store.conveniencestore.Domain.CartDetail;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUser_Id(long userId);
    Cart save(Cart cart);
    @Transactional
    void delete(Cart cart);
    Cart findByDetails(CartDetail details);
}
