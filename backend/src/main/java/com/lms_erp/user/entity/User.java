package com.lms_erp.user.entity;

import com.lms_erp.person.entity.Person;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @OneToOne
    @JoinColumn(name = "person_id")
    private Person person;

    private String username;

    private String password;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "is_locked")
    private Boolean isLocked;

    @Column(name = "failed_attempts")
    private Integer failedAttempts;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "must_change_password")
    private Boolean mustChangePassword;

    @Column(name = "password_changed_at")
    private LocalDateTime passwordChangedAt;
}