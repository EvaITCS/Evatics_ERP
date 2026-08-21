package com.lms_erp.student.entity;

import com.lms_erp.batch.entity.Batch;
import com.lms_erp.person.entity.Person;
import com.lms_erp.student.enums.ContractStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contracts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contract_id")
    private Long contractId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "batch_id",
            nullable = false
    )
    private Batch batch;

    @Column(
            name = "file_name",
            nullable = false,
            length = 255
    )
    private String fileName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "uploaded_by_person_id",
            nullable = false
    )
    private Person uploadedBy;

    @Column(
            name = "uploaded_at",
            insertable = false,
            updatable = false
    )
    private LocalDateTime uploadedAt;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false
    )
    @Builder.Default
    private ContractStatus status = ContractStatus.ACTIVE;

    @Lob
    @Column(
            name = "file_data",
            nullable = false,
            columnDefinition = "LONGBLOB"
    )
    private byte[] fileData;

    @Column(
            name = "content_type",
            nullable = false,
            length = 100
    )
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;
}