package com.lms_erp.trainer.service.impl;

import com.lms_erp.security.CurrentUserService;
import com.lms_erp.trainer.dto.TrainerTaskCreateRequest;
import com.lms_erp.trainer.dto.TrainerTaskResponse;

import com.lms_erp.trainer.repository.TrainerTaskRepository;
import com.lms_erp.trainer.entity.TrainerTask;

import com.lms_erp.trainer.enums.TaskStatus;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;

import com.lms_erp.trainer.service.TrainerTaskService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerTaskServiceImpl
        implements TrainerTaskService {

    private final TrainerTaskRepository
            taskRepository;

    private final EmployeeRepository employeeRepository;
    private final CurrentUserService currentUserService;
    // =========================
    // CREATE TASK
    // =========================

    @Override
    @Transactional
    public TrainerTaskResponse createTask(
            TrainerTaskCreateRequest request
    ) {

        Long userId = currentUserService.getCurrentUserId();

        Employee trainer = employeeRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found")
                );

        TrainerTask task =
                TrainerTask.builder()

                        .trainer(
                                trainer
                        )

                        .title(
                                request.getTitle()
                        )

                        .description(
                                request.getDescription()
                        )

                        .dueDate(
                                request.getDueDate()
                        )

                        .status(
                                TaskStatus.PENDING
                        )

                        .build();

        TrainerTask savedTask =
                taskRepository.save(task);

        return mapToResponse(savedTask);
    }

    // =========================
    // GET TASKS BY TRAINER ID
    // =========================



    // =========================
    // UPDATE TASK STATUS
    // =========================

    @Override
    @Transactional
    public TrainerTaskResponse updateTaskStatus(
            Long taskId,
            TaskStatus status
    ) {

        // Get logged-in user
        Long userId = currentUserService.getCurrentUserId();

        Employee loggedInTrainer = employeeRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found")
                );

        // Find task
        TrainerTask task = taskRepository
                .findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Task not found with ID: " + taskId
                        )
                );

        // Security check - task must belong to logged-in trainer
        if (!task.getTrainer().getPersonId()
                .equals(loggedInTrainer.getPersonId())) {

            throw new RuntimeException(
                    "You are not authorized to update this task"
            );
        }

        // Update status
        task.setStatus(status);

        TrainerTask updatedTask = taskRepository.save(task);

        return mapToResponse(updatedTask);
    }

    // =========================
    // MAP ENTITY TO RESPONSE
    // =========================

    private TrainerTaskResponse mapToResponse(
            TrainerTask task
    ) {

        String trainerName = "Trainer";

        if (
                task.getTrainer() != null
                        &&
                        task.getTrainer().getPerson() != null
        ) {

            trainerName =
                    task.getTrainer()
                            .getPerson()
                            .getFirstName()

                            + " " +

                            task.getTrainer()
                                    .getPerson()
                                    .getLastName();
        }

        return TrainerTaskResponse
                .builder()

                .taskId(
                        task.getTaskId()
                )
                .trainerPersonId(
                        task.getTrainer() != null
                                ? task.getTrainer().getPersonId()
                                : null
                )

                .trainerName(
                        trainerName
                )

                .title(
                        task.getTitle()
                )

                .description(
                        task.getDescription()
                )

                .dueDate(
                        task.getDueDate()
                )

                .status(
                        task.getStatus() != null
                                ? task.getStatus()
                                : null
                )

                .createdAt(
                        task.getCreatedAt()
                )

                .build();

    }
    public List<TrainerTaskResponse> getTasksByTrainer() {

        Long userId = currentUserService.getCurrentUserId();

        Employee trainer = employeeRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found")
                );

        return
        taskRepository.findByTrainerPersonId(
                        trainer.getPersonId()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();

    }
}