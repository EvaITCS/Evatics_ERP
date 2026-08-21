package com.lms_erp.student.invitation;

import com.lms_erp.student.entity.ApplicationStageMaster;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.repository.ApplicationStageRepository;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.repository.UserRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvitationTokenServiceImpl implements InvitationTokenService {

    private final ApplicationInvitationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentApplicationRepository studentApplicationRepository;
    private final ApplicationStageRepository applicationStageRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @PostConstruct
    private void validateFrontendUrl() {

        if (frontendUrl == null ||
                frontendUrl.isBlank()) {

            throw new IllegalStateException(
                    "app.frontend-url must be configured"
            );
        }

        frontendUrl = frontendUrl.trim();

        if (frontendUrl.endsWith("/")) {
            frontendUrl =
                    frontendUrl.substring(
                            0,
                            frontendUrl.length() - 1
                    );
        }
    }

    @Override
    @Transactional
    public String generateInvitationLink(StudentApplication studentApplication) {

        ApplicationInvitationToken invitation = tokenRepository
                .findByStudentApplication(studentApplication)
                .orElse(new ApplicationInvitationToken());

        invitation.setStudentApplication(studentApplication);

        // New token generated only if record doesn't already exist
        if (invitation.getId() == null) {
            invitation.setToken(UUID.randomUUID().toString());
        }

        invitation.setStatus(InvitationStatus.SENT);
        invitation.setSentAt(LocalDateTime.now());
        invitation.setAcceptedAt(null);
        invitation.setExpiryTime(LocalDateTime.now().plusDays(7));

        tokenRepository.save(invitation);

        return frontendUrl + "/application/start/" + invitation.getToken();
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationInvitationToken validateToken(String token) {

        ApplicationInvitationToken invitationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid invitation link"));

        StudentApplication application =
                invitationToken.getStudentApplication();

        String stage =
                application.getApplicationStage()
                        .getApplicationStageName();

        if ("ENROLLED".equals(stage)) {

            throw new RuntimeException("Invitation link already used.");

        }


        // Expiry check
        if (invitationToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invitation link has expired.");
        }

// Only SENT invitation can be used
        if (invitationToken.getStatus() != InvitationStatus.SENT) {
            throw new RuntimeException("Invitation is not active.");
        }

        return invitationToken;
    }

    @Override
    public Long getPersonIdFromToken(String token) {
        ApplicationInvitationToken invitation = validateToken(token);
        return invitation.getStudentApplication().getPersonId();
    }

    @Override
    @Transactional
    public void changePasswordByInvitation(ChangePasswordByInvitationRequest request) {

        // 1. Validates active status, expiry, existence in one call
        ApplicationInvitationToken invitation = validateToken(request.getToken());

        // 2. Fetch User
        User user = userRepository.findByPersonPersonId(
                        invitation.getStudentApplication().getPersonId())
                .orElseThrow(() -> new RuntimeException("User not found."));

        // 3. Current password verify
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect.");
        }

        // 4. Confirm password check
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match.");
        }


        ApplicationStageMaster stage = applicationStageRepository
                .findByApplicationStageName("APPLICATION_STARTED")
                .orElseThrow(() -> new RuntimeException("APPLICATION_STARTED stage not found."));



        // Save new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        user.setPasswordChangedAt(LocalDateTime.now());
        userRepository.save(user);

        // Update application stage
        StudentApplication application = invitation.getStudentApplication();
        application.setApplicationStage(stage);
        studentApplicationRepository.save(application);



    }

    @Override
    @Transactional
    public void markInvitationSent(StudentApplication studentApplication) {

        ApplicationInvitationToken invitation = tokenRepository
                .findByStudentApplication(studentApplication)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        invitation.setStatus(InvitationStatus.SENT);
        invitation.setSentAt(LocalDateTime.now());

        tokenRepository.save(invitation);
    }
}