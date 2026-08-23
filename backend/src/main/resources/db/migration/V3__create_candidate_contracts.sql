-- Reconciles the schema with the JPA entities: V1 was transcribed before
-- several entity changes, and ddl-auto=validate (docker/prod profiles)
-- refuses to start on any mismatch. Everything below was derived by
-- diffing the V1 schema against the schema Hibernate generates from the
-- entities (ddl-auto=update on an empty database).
--
-- Only JDBC-type-code differences are corrected (CHAR vs VARCHAR, YEAR vs
-- INT, TEXT vs VARCHAR, VARCHAR vs ENUM, CHAR vs BINARY, TINYINT UNSIGNED
-- vs INT); length/nullability/default drift that validate ignores is left
-- alone. timestamp vs datetime(6) and tinyint(1) vs bit(1) report the same
-- JDBC type codes, so those are left alone too.

-- Missing from V1: backs com.lms_erp.student.entity.CandidateContract.
CREATE TABLE candidate_contracts (

    candidate_contract_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    contract_id BIGINT NOT NULL,

    candidate_person_id BIGINT NOT NULL,

    status ENUM('PENDING', 'SIGNED') NOT NULL,

    signature_type VARCHAR(30),

    signature_data VARCHAR(500),

    signed_at DATETIME(6) NULL DEFAULT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_candidate_contract
        UNIQUE (contract_id, candidate_person_id),

    CONSTRAINT fk_candidate_contract_contract
        FOREIGN KEY (contract_id)
            REFERENCES contracts(contract_id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,

    CONSTRAINT fk_candidate_contract_candidate
        FOREIGN KEY (candidate_person_id)
            REFERENCES student_applications(person_id)
            ON UPDATE CASCADE
            ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

-- Missing role: AuthService.register() requires it, V2 never seeded it.
INSERT INTO roles (role_name) VALUES ('CANDIDATE');

-- Columns added to entities after V1 was transcribed.
ALTER TABLE candidates
    ADD COLUMN re_engagement_date DATETIME(6) NULL DEFAULT NULL;

ALTER TABLE lead_scores
    ADD COLUMN lead_priority ENUM('COLD', 'HOT', 'WARM') NOT NULL;

ALTER TABLE lead_sources
    ADD COLUMN created_at DATETIME(6) NULL DEFAULT NULL;

-- Type reconciliations (V1 type -> entity-expected type).
ALTER TABLE country_master
    MODIFY COLUMN country_code VARCHAR(2) NOT NULL;

ALTER TABLE persons
    MODIFY COLUMN birth_year INT NULL DEFAULT NULL,
    MODIFY COLUMN person_uuid BINARY(16) NOT NULL;

ALTER TABLE student_applications
    MODIFY COLUMN current_step INT NOT NULL DEFAULT 0;

ALTER TABLE departments
    MODIFY COLUMN description VARCHAR(255) NULL DEFAULT NULL;

ALTER TABLE candidates
    MODIFY COLUMN lead_priority ENUM('COLD', 'HOT', 'WARM') NULL DEFAULT 'WARM';

ALTER TABLE lead_followups
    MODIFY COLUMN followup_status ENUM('CANCELLED', 'COMPLETED', 'PENDING', 'RESCHEDULED') NULL DEFAULT 'PENDING',
    MODIFY COLUMN followup_type ENUM('CALL', 'EMAIL', 'SMS') NOT NULL;

ALTER TABLE student_application_invitation_tokens
    MODIFY COLUMN status ENUM('ACCEPTED', 'PENDING', 'SENT') NOT NULL DEFAULT 'PENDING';

ALTER TABLE student_drop_requests
    MODIFY COLUMN recommendation ENUM('APPROVE', 'HOLD', 'REJECT') NULL DEFAULT NULL;
