package com.lms_erp.student.invitation;

import com.lms_erp.student.entity.StudentApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ApplicationInvitationTokenRepository
        extends JpaRepository<ApplicationInvitationToken, Long> {

    @Query("""
    SELECT t
    FROM ApplicationInvitationToken t
    JOIN FETCH t.studentApplication sa
    JOIN FETCH sa.applicationStage
    WHERE t.token = :token
    """)
    Optional<ApplicationInvitationToken> findByToken(
            @Param("token") String token
    );

    Optional<ApplicationInvitationToken> findByStudentApplication(
            StudentApplication studentApplication
    );

    Optional<ApplicationInvitationToken>
    findByStudentApplicationPersonPersonId(
            Long personId
    );

    Optional<ApplicationInvitationToken>
    findTopByStudentApplicationOrderByCreatedAtDesc(
            StudentApplication studentApplication
    );

    boolean existsByToken(
            String token
    );

    boolean existsByStudentApplicationPersonPersonId(
            Long personId
    );

}