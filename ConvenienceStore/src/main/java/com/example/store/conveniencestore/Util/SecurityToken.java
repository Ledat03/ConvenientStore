package com.example.store.conveniencestore.Util;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.example.store.conveniencestore.DTO.ResLoginDTO;
import com.example.store.conveniencestore.DTO.UserDTO;
import com.nimbusds.jose.util.Base64;
import com.nimbusds.jwt.JWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

@Service
public class SecurityToken {
    private final JwtEncoder jwtEncoder;
    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    @Value("${store.jwt.base64-secret}")
    private String jwtPrivateKey;

    @Value("${store.jwt.access-token-validity-in-seconds}")
    private long accessTokenExpiration;

    @Value("${store.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public SecurityToken(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String createAccessToken(String email,ResLoginDTO.UserLogin userLogin) {
        Instant now = Instant.now();
        Instant validity = now.plus(this.accessTokenExpiration, ChronoUnit.SECONDS);
        List<String> authorities = new ArrayList<>();
        authorities.add("ROLE_USER_CREATE");
        authorities.add("ROLE_USER_UPDATE");
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("user", userLogin)
                .claim("permissions", authorities)
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).type("JWT").build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
    public String createRefreshToken(String Email, ResLoginDTO userDTO) {
        Instant now = Instant.now();
        Instant validity = now.plus(this.refreshTokenExpiration, ChronoUnit.SECONDS);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(Email)
                .claim("user",userDTO.getUser() )
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).type("JWT").build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public Jwt checkRefreshToken(String refreshToken) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(getSecretKey())
                .macAlgorithm(JWT_ALGORITHM).build();
        try {
            System.out.println("Refresh Token: " + refreshToken);
             return decoder.decode(refreshToken);

        } catch (Exception e) {
            System.out.println("refreshToken not valid");
            throw e;
        }
    }
    /**
     * Get the JWT of the current user.
     * @return the JWT of the current user.
     */
    public static Optional<String> getCurrentUserJWT() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication())
                .filter(authentication -> authentication.getCredentials() instanceof String)
                .map(authentication -> (String) authentication.getCredentials());
    }
    public SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtPrivateKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALGORITHM.getName());
    }
    /**
     * Check if a user is authenticated.
     * @return true if the user is authenticated, false otherwise.
     */
    public static boolean isAuthenticated() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication())
                .map(Authentication::isAuthenticated)
                .orElse(false);
    }

    /**
     * Get the login of the current user.
     * @return the login of the current user.
     */
    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication())
                .map(authentication -> {
                    if (authentication.getPrincipal() instanceof UserDetails) {
                        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                        return userDetails.getUsername();
                    } else if (authentication.getPrincipal() instanceof String) {
                        return (String) authentication.getPrincipal();
                    } else if(authentication.getPrincipal() instanceof Jwt jwt){
                        return jwt.getSubject();
                    }
                    return null;
                });
    }

    /**
     * Get the roles of the current user.
     * @return the roles of the current user.
     */
    public static Set<String> getCurrentUserRoles() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();

        if (authentication == null) {
            return Collections.emptySet();
        }

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
    }

    /**
     * Check if the current user has a specific role.
     * @param role the role to check
     * @return true if the current user has the role, false otherwise.
     */
    public static boolean hasRole(String role) {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();

        if (authentication == null) {
            return false;
        }

        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(role));
    }

    /**
     * Check if the current user has any of the given roles.
     * @param roles the roles to check
     * @return true if the current user has any of the roles, false otherwise.
     */
    public static boolean hasAnyRole(String... roles) {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();

        if (authentication == null || roles == null || roles.length == 0) {
            return false;
        }

        Set<String> roleSet = new HashSet<>(Arrays.asList(roles));
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(roleSet::contains);
    }

    /**
     * Check if the current user has all of the given roles.
     * @param roles the roles to check
     * @return true if the current user has all of the roles, false otherwise.
     */
    public static boolean hasAllRoles(String... roles) {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();

        if (authentication == null || roles == null || roles.length == 0) {
            return false;
        }

        Set<String> userRoles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        return userRoles.containsAll(Arrays.asList(roles));
    }

    /**
     * Get the current user's authentication object.
     * @return the current authentication object.
     */
    public static Optional<Authentication> getCurrentAuthentication() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication());
    }

    /**
     * Get the current user's principal object.
     * @return the current principal object.
     */
    public static Optional<Object> getCurrentUserPrincipal() {
        return getCurrentAuthentication()
                .map(Authentication::getPrincipal);
    }

    /**
     * Check if the current user is anonymous.
     * @return true if the current user is anonymous, false otherwise.
     */
    public static boolean isAnonymous() {
        return !isAuthenticated() || hasRole("ROLE_ANONYMOUS");
    }

    /**
     * Clear the security context.
     */
    public static void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }
}
