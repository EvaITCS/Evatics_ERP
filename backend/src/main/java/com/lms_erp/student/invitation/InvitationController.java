package com.lms_erp.student.invitation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/application")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationTokenService invitationTokenService;

    /**
     * Validate Invitation Token
     */
    @GetMapping("/validate/{token}")
    public ResponseEntity<String> validateInvitationToken(
            @PathVariable String token
    ) {

        invitationTokenService.validateToken(token);

        return ResponseEntity.ok("VALID");
    }

    /**
     * Get Person Id From Token
     */
    @GetMapping("/student/{token}")
    public ResponseEntity<Long> getPersonIdFromToken(
            @PathVariable String token
    ) {

        return ResponseEntity.ok(
                invitationTokenService.getPersonIdFromToken(token)
        );
    }

    /**
     * Change Password
     */
    @PostMapping("/change-password")
    public ResponseEntity<String> changePasswordByInvitation(
            @RequestBody ChangePasswordByInvitationRequest request
    ) {

        invitationTokenService.changePasswordByInvitation(request);

        return ResponseEntity.ok("Password changed successfully.");
    }
}