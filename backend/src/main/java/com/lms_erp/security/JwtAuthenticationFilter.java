package com.lms_erp.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private final CustomUserDetailsService
            customUserDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // ==========================================
        // GET JWT FROM AUTHORIZATION HEADER
        // ==========================================

        String authHeader =
                request.getHeader(SecurityConstants.AUTH_HEADER);

        String jwt = null;
        String username = null;

        if (authHeader != null &&
                authHeader.startsWith(SecurityConstants.TOKEN_PREFIX)) {

            jwt = authHeader.substring(
                    SecurityConstants.TOKEN_PREFIX.length()
            );
        }

        // ==========================================
        // PROCESS JWT ONLY IF PRESENT
        // ==========================================

        if (jwt != null) {

            try {

                username = jwtUtil.extractUsername(jwt);

            } catch (JwtException | IllegalArgumentException ex) {

                SecurityContextHolder.clearContext();

            }

            // ==========================================
            // AUTHENTICATE USER
            // ==========================================

            if (username != null &&
                    SecurityContextHolder.getContext()
                            .getAuthentication() == null) {

                try {

                    UserDetails userDetails =
                            customUserDetailsService
                                    .loadUserByUsername(username);

                    // ==========================================
                    // VALIDATE TOKEN
                    // ==========================================

                    if (jwtUtil.validateToken(jwt, userDetails)) {

                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        authToken.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(authToken);
                    }

                } catch (Exception ex) {

                    SecurityContextHolder.clearContext();
                }
            }
        }

        // ==========================================
        // ALWAYS CONTINUE FILTER CHAIN
        // ==========================================

        filterChain.doFilter(request, response);
    }
}