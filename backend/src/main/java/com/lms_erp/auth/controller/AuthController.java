package com.lms_erp.auth.controller;

import com.lms_erp.auth.dto.AuthResponse;
import com.lms_erp.auth.dto.LoginRequest;
import com.lms_erp.auth.dto.RegisterRequest;
import com.lms_erp.auth.service.AuthService;
import com.lms_erp.exception.HttpException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor


public class AuthController {

    private final AuthService authService;

    /**
     * NOTE: centralized exception handling to
     * {@link com.lms_erp.exception.GlobalExceptionHandler#handleHttpException(HttpException)}
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        AuthResponse response = authService.register(req);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest req
    ) {

        AuthResponse authResponse =
                authService.login(req);

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Logged out successfully"
                )
        );
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {

        return ResponseEntity.ok(
                authService.getCurrentUser()
        );
    }
}