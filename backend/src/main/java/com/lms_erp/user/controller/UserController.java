package com.lms_erp.user.controller;

import com.lms_erp.user.dto.UserDto;
import com.lms_erp.user.service.UserService;
import com.lms_erp.user.dto.ChangePasswordRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import com.lms_erp.user.dto.UserSecurityDto;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor

public class UserController {

    private final UserService userService;

    @GetMapping("/counsellors")
    public List<UserDto> getCounsellors() {

        return userService.getAllCounsellors();
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid
            @RequestBody
            ChangePasswordRequest request
    ) {

        userService.changePassword(
                request
        );

        return ResponseEntity.ok(
                "Password Changed Successfully"
        );
    }

    // =====================================
    // GET LOCKED USERS
    // =====================================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/locked")
    public List<UserSecurityDto> getLockedUsers() {

        return userService.getLockedUsers();

    }

    // =====================================
    // UNLOCK USER
    // =====================================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/unlock/{userId}")
    public ResponseEntity<?> unlockUser(
            @PathVariable Long userId
    ) {

        try {

            userService.unlockUser(userId);

            return ResponseEntity.ok(
                    "User unlocked successfully."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }

    }
}