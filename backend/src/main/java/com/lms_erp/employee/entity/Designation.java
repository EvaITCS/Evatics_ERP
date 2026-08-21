package com.lms_erp.employee.entity;

import jakarta.persistence.*;
import lombok.*;
import com.lms_erp.user.entity.Role;
import java.time.LocalDateTime;

@Entity
@Table(name = "designations")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Designation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "designation_id")
    private Long designationId;

    @Column(name = "designation_name", nullable = false, unique = true)
    private String designationName;

    @Column(name = "designation_level")
    private String designationLevel;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}