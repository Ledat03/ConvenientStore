package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Repository.*;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final CartDetailRepository cartDetailRepository;
    private final ProductRepository productRepository;
    private final VariantRepository variantRepository;
    public UserService(UserRepository userRepository,VariantRepository variantRepository,ProductRepository productRepository, RoleRepository roleRepository, CartRepository cartRepository, OrderRepository orderRepository, CartDetailRepository cartDetailRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.cartDetailRepository = cartDetailRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
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

    public User findByRefreshTokenAndEmail(String refreshToken, String email) {
        return userRepository.findByRefreshTokenAndEmail(refreshToken, email);
    }
    public void updateUserToken(String Token,String username){
        User user = findByEmail(username);
        if(user != null){
            user.setRefreshToken(Token);
            userRepository.save(user);
        }
    }
    public String AddNewProductToCart(long userId, long productId, long variantId,int quantity) {
        Cart userCart = cartRepository.findByUser_Id(userId);
        if(userCart == null && quantity == 0) {
            Cart newCart = new Cart();
            CartDetail newCartDetail = new CartDetail();
            newCart.setUser(userRepository.findById(userId));
            newCartDetail.setProduct(productRepository.findById(productId));
            newCartDetail.setProductVariant(variantRepository.findByVariantId(variantId));
            newCartDetail.setCart(newCart);
            newCartDetail.setQuantity(1);
            newCart.setSumQuantity(1);
            cartRepository.save(newCart);
            cartDetailRepository.save(newCartDetail);
            return "Tạo mới giỏ hàng và thêm thành công !";
        } else if (userCart == null && quantity != 0) {
            Cart newCart = new Cart();
            CartDetail newCartDetail = new CartDetail();
            newCart.setUser(userRepository.findById(userId));
            newCartDetail.setProduct(productRepository.findById(productId));
            newCartDetail.setProductVariant(variantRepository.findByVariantId(variantId));
            newCartDetail.setCart(newCart);
            newCartDetail.setQuantity(quantity);
            newCart.setSumQuantity(quantity);
            cartRepository.save(newCart);
            cartDetailRepository.save(newCartDetail);
            return "Tạo mới giỏ hàng và thêm nhiều thành công !";
        } else {
            CartDetail newCartDetail = cartDetailRepository.findByProduct_ProductIdAndCartIdAndProductVariant_VariantId( productId,userCart.getId(),variantId);
            if (newCartDetail != null && quantity == 0) {
                newCartDetail.setQuantity(newCartDetail.getQuantity() + 1);
                userCart.setSumQuantity(userCart.getSumQuantity()+1);
                cartDetailRepository.save(newCartDetail);
                cartRepository.save(userCart);
                return "Tăng số lượng thành công !";
            } else if (newCartDetail != null && quantity != 0) {
                userCart.setSumQuantity(userCart.getSumQuantity()-newCartDetail.getQuantity()+quantity);
                newCartDetail.setQuantity(quantity);
                cartDetailRepository.save(newCartDetail);
                cartRepository.save(userCart);
                return "Tăng nhiều thành công !";
            } else {
                newCartDetail = new CartDetail();
                newCartDetail.setProduct(productRepository.findById(productId));
                newCartDetail.setProductVariant(variantRepository.findByVariantId(variantId));
                newCartDetail.setQuantity(1);
                newCartDetail.setCart(userCart);
                userCart.setSumQuantity(userCart.getSumQuantity()+1);
                cartDetailRepository.save(newCartDetail);
                return "Thêm vào giỏ hàng thành công !";
            }
        }
    }
    public Cart getUserCart(long userId) {
        return cartRepository.findByUser_Id(userId);
    }
    public void deleteCartDetail(long CartDetailId) {
        CartDetail cartDetail = cartDetailRepository.findById(CartDetailId);
        Cart cart = cartRepository.findByDetails(cartDetail);
        if(cartDetail != null && cart != null) {
            cart.setSumQuantity(cart.getSumQuantity() - cartDetail.getQuantity());
            cartDetailRepository.deleteById(CartDetailId);
            cartRepository.save(cart);
        }
    }
    public CartDetail findCartDetailById(long CartDetailId) {
        return cartDetailRepository.findById(CartDetailId);
    }
}
