package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery,Long> {
    Delivery findByDeliveryId(long deliveryId);
    Delivery save(Delivery delivery);
}
