package com.lms_erp.lead.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "action_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "action_type_id")
    private Long actionTypeId;

    @Column(name = "action_name", nullable = false, unique = true, length = 50)
    private String actionName;
}