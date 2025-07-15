package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.Domain.*;
import com.example.store.conveniencestore.Repository.*;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import javax.smartcardio.CardException;
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
    public void updateUserToken(String Token,String username){
        User user = findByEmail(username);
        if(user != null){
            user.setRefreshToken(Token);
            userRepository.save(user);
        }
    }
    public Object AddNewProductToCart(long userId, long productId, long variantId,int quantity) throws CardException {
        Cart userCart = cartRepository.findByUser_Id(userId);
        CartDetail cartItem = cartDetailRepository.findByProduct_ProductIdAndCartIdAndProductVariant_VariantId(productId,userCart.getId(),variantId);
        ProductVariant productVariant = variantRepository.findByVariantId(variantId);
        if (productVariant.getStock() < quantity) {
            throw new CardException("Mặt hàng này tạm thời đã hết !");
        }else if (cartItem != null && productVariant.getStock() < cartItem.getQuantity() + quantity) {
            throw new CardException("Mặt hàng này tạm thời đã hết");
        }else {
            if(userCart == null && quantity == 1) {
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
            } else if (userCart == null && quantity != 1) {
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
                if (newCartDetail != null && quantity == 1) {
                    newCartDetail.setQuantity(newCartDetail.getQuantity() + 1);
                    userCart.setSumQuantity(userCart.getSumQuantity()+1);
                    cartDetailRepository.save(newCartDetail);
                    cartRepository.save(userCart);
                    return "Tăng số lượng thành công !";
                } else if (newCartDetail != null && quantity != 1 ) {
                    userCart.setSumQuantity(userCart.getSumQuantity()+quantity);
                    newCartDetail.setQuantity(newCartDetail.getQuantity() + quantity);
                    cartDetailRepository.save(newCartDetail);
                    cartRepository.save(userCart);
                    return "Tăng nhiều thành công !";
                }else if (newCartDetail == null && quantity != 1) {
                    CartDetail cartDetail = new CartDetail();
                    userCart.setSumQuantity(userCart.getSumQuantity()+quantity);
                    cartDetail.setProduct(productRepository.findById(productId));
                    cartDetail.setProductVariant(variantRepository.findByVariantId(variantId));
                    cartDetail.setQuantity(quantity);
                    cartDetail.setCart(userCart);
                    cartDetailRepository.save(cartDetail);
                    cartRepository.save(userCart);
                    return "Tạo & Thêm nhiều cùng lúc thành công !";
                } else if (newCartDetail == null && quantity == 1) {
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
        return "Không vào trường hợp nào";
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
    public void deleteAllCartDetail(Cart cart) {
        cartDetailRepository.deleteAllByCart(cart);
    }

    @Transactional
    public Cart getOrCreateUserCart(long userId) {
        Cart cart = cartRepository.findByUser_Id(userId);
        if (cart == null) {
            cart = new Cart();
            User user = userRepository.findById(userId);
            cart.setUser(user);
            cart.setSumQuantity(0);
            cart = cartRepository.save(cart);

        }
        return cart;
    }

    public CartDetail findCartDetailById(long CartDetailId) {
        return cartDetailRepository.findById(CartDetailId);
    }
}
