package com.lms_erp.trainer.entity;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.trainer.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trainer_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long taskId;

    /**
     * Trainer
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_person_id", nullable = false)
    private Employee trainer;

    /**
     * Created By
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_person_id")
    private Employee createdBy;

    /**
     * Task Details
     */
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private TaskStatus status = TaskStatus.PENDING;

    /**
     * Audit
     */
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}