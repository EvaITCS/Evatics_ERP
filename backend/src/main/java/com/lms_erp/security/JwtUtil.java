package com.lms_erp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    /**
     * ===========================================================
     * SECRET KEY
     * ===========================================================
     */
    @Value("${jwt.secret}")
    private String secretKey;

    private SecretKey key;

    @PostConstruct
    public void init() {

        key = Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }

    /**
     * ===========================================================
     * GENERATE JWT TOKEN
     * ===========================================================
     */
    public String generateToken(UserDetails userDetails) {

        Date now = new Date();

        Date expiry =
                new Date(
                        now.getTime()
                                + SecurityConstants.EXPIRATION_TIME
                );

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuer(SecurityConstants.ISSUER)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    /**
     * ===========================================================
     * EXTRACT USERNAME
     * ===========================================================
     */
    public String extractUsername(String token) {

        return extractClaims(token)
                .getSubject();
    }

    /**
     * ===========================================================
     * EXTRACT CLAIMS
     * ===========================================================
     */
    public Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * ===========================================================
     * TOKEN VALIDATION
     * ===========================================================
     */
    public boolean validateToken(
            String token,
            UserDetails userDetails
    ) {

        try {

            String username =
                    extractUsername(token);

            return username.equals(
                    userDetails.getUsername()
            ) &&
                    !isTokenExpired(token);

        } catch (JwtException | IllegalArgumentException e) {

            return false;
        }
    }
    /**
     * ===========================================================
     * TOKEN EXPIRATION
     * ===========================================================
     */
    public boolean isTokenExpired(
            String token
    ) {

        return extractClaims(token)
                .getExpiration()
                .before(new Date());
    }
}