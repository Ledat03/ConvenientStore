package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Cart;
import com.example.store.conveniencestore.Domain.CartDetail;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Long> {
    CartDetail findByCart(Cart cart);
    CartDetail findById(long id);
    @Transactional
    CartDetail save(CartDetail cartDetail);
    CartDetail findByProduct_ProductIdAndCartIdAndProductVariant_VariantId(long productId,long cartId,long variantId);
    @Transactional
    void deleteById(long id);
    List<CartDetail> findByCart_Id(long id);
}
