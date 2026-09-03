package com.example.store.conveniencestore.DTO;

import com.example.store.conveniencestore.Domain.PromotionUser;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserPromotionDTO {
    private long userId;
    private String userName;
    public UserPromotionDTO(PromotionUser promotionUser){
        this.setUserId(promotionUser.getUser().getId());
        this.setUserName(promotionUser.getUser().getUsername());
    }
}
