package com.example.store.conveniencestore.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import com.example.store.conveniencestore.Service.UserDetailsCustom;
import com.example.store.conveniencestore.Service.UserService;
import com.example.store.conveniencestore.Util.SecurityToken;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;
import java.util.List;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
@EnableWebSecurity
public class SecurityConfig {

    private final UserService userService;
    private final EntryPointConfig entryPointConfig;

    public SecurityConfig(UserService userService, EntryPointConfig entryPointConfig) {
        this.userService = userService;
        this.entryPointConfig = entryPointConfig;
    }

    @Value("${store.jwt.base64-secret}")
    private String jwtPrivateKey;

    @Value("${store.jwt.access-token-validity-in-seconds}")
    private long jwtExpiredTime;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailsCustom(userService);
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(getSecretKey())
                .macAlgorithm(SecurityToken.JWT_ALGORITHM).build();
        return token -> {
            try {
                return decoder.decode(token);
            } catch (Exception e) {
                throw e;
            }
        };
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
    }

    public SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtPrivateKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, SecurityToken.JWT_ALGORITHM.getName());
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(c -> c.disable())
                .authorizeHttpRequests(
                        authorizeRequests -> authorizeRequests
                                .requestMatchers("/","/api/**","/product/view/**","/variant/view/**","/cart/view/**","/main/","/brand/view","/promotion/**","/order/vnpay_jsp/vnpay_return","/api/check/auth/refresh","/order/**").permitAll()
                                .anyRequest().authenticated())
                .oauth2ResourceServer(
                        (oauth2) -> oauth2.jwt(Customizer.withDefaults())
                                .authenticationEntryPoint(entryPointConfig))
                .cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration corsConfiguration = new CorsConfiguration();
            corsConfiguration.setAllowedOrigins(List.of("http://localhost:3000"));
            corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
            corsConfiguration.setAllowCredentials(true);
            corsConfiguration.addAllowedHeader("*");
            corsConfiguration.addExposedHeader("Set-Cookie");
            return corsConfiguration;
        }))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");
        jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("permissions");
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
}
