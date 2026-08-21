
CREATE TABLE persons (

                         person_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                         person_uuid CHAR(36) NOT NULL UNIQUE,

                         first_name VARCHAR(255) NOT NULL,

                         middle_name VARCHAR(255),

                         last_name VARCHAR(255),

                         gender_id BIGINT,

                         birth_year YEAR,

                         nationality_id BIGINT,

                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                         updated_at TIMESTAMP NULL DEFAULT NULL
        ON UPDATE CURRENT_TIMESTAMP,

                         CONSTRAINT fk_person_gender
                             FOREIGN KEY (gender_id)
                                 REFERENCES gender_master(gender_id),

                         CONSTRAINT fk_person_nationality
                             FOREIGN KEY (nationality_id)
                                 REFERENCES nationality_master(nationality_id),

                         INDEX idx_person_name (first_name, last_name),
                         INDEX idx_person_nationality (nationality_id)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

-- person_types
CREATE TABLE person_types (
                              person_type_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                              type_name VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE person_contacts
(
    contact_id BIGINT NOT NULL AUTO_INCREMENT,

    person_id BIGINT NOT NULL,

    contact_type_id BIGINT NOT NULL,

    country_id BIGINT NULL,

    contact_value VARCHAR(150) NOT NULL,

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (contact_id),

    CONSTRAINT uk_person_contact
        UNIQUE (person_id, contact_type_id, contact_value),

    CONSTRAINT fk_person_contact_person
        FOREIGN KEY (person_id)
            REFERENCES persons(person_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,

    CONSTRAINT fk_person_contact_type
        FOREIGN KEY (contact_type_id)
            REFERENCES contact_type_master(contact_type_id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE,

    CONSTRAINT fk_person_contact_country
        FOREIGN KEY (country_id)
            REFERENCES country_master(country_id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
)
    ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE contact_type_master (

                                     contact_type_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                     contact_type_name VARCHAR(50) NOT NULL UNIQUE,

                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE person_addresses
(
    address_id BIGINT NOT NULL AUTO_INCREMENT,

    person_id BIGINT NOT NULL,

    address_type_id BIGINT NULL,

    address_line_1 VARCHAR(255)  NULL,

    address_line_2 VARCHAR(255) NULL,

    city VARCHAR(100) NOT NULL,

    state VARCHAR(100) NOT NULL,

    country VARCHAR(100) NOT NULL,

    zipcode VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (address_id),

    CONSTRAINT fk_person_address_person
        FOREIGN KEY (person_id)
            REFERENCES persons(person_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,

    CONSTRAINT fk_person_address_type
        FOREIGN KEY (address_type_id)
            REFERENCES address_type_master(address_type_id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
)
    ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE person_emergency_contacts
(
    emergency_contact_id BIGINT NOT NULL AUTO_INCREMENT,

    person_id BIGINT NOT NULL,

    contact_name VARCHAR(100) NOT NULL,

    relationship VARCHAR(50) NOT NULL,

    phone_number VARCHAR(20) NOT NULL,

    address_line_1 VARCHAR(255) NOT NULL,

    address_line_2 VARCHAR(255) NULL,

    city VARCHAR(100) NOT NULL,

    state VARCHAR(100) NOT NULL,

    country VARCHAR(100) NOT NULL,

    zipcode VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (emergency_contact_id),

    CONSTRAINT fk_emergency_person
        FOREIGN KEY (person_id)
            REFERENCES persons(person_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
)
    ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE address_type_master (
                                     address_type_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     address_type_name VARCHAR(50) NOT NULL UNIQUE,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE country_master (
                                country_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                country_code CHAR(2) NOT NULL UNIQUE,

                                country_name VARCHAR(100) NOT NULL UNIQUE,

                                phone_code VARCHAR(10),

                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE nationality_master (

                                    nationality_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                    country_id BIGINT NOT NULL,

                                    nationality_name VARCHAR(100) NOT NULL,

                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                    CONSTRAINT fk_nationality_country
                                        FOREIGN KEY (country_id)
                                            REFERENCES country_master(country_id),

                                    CONSTRAINT uk_country_nationality
                                        UNIQUE(country_id, nationality_name)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE gender_master (
                               gender_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                               gender_name VARCHAR(50) NOT NULL UNIQUE,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE person_documents (
                                  person_document_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                  person_id BIGINT NOT NULL,

                                  document_type VARCHAR(50) NOT NULL,

                                  document_number VARCHAR(100),

                                  file_name VARCHAR(255),

                                  file_data LONGBLOB,

                                  content_type VARCHAR(100),

                                  file_size BIGINT,

                                  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                  CONSTRAINT fk_person_documents_person
                                      FOREIGN KEY (person_id)
                                          REFERENCES persons(person_id)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE person_education (

                                  person_education_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                  person_id BIGINT NOT NULL,

                                  qualification VARCHAR(100) NOT NULL,

                                  institute_name VARCHAR(150),

                                  field_of_study VARCHAR(100),

                                  passing_year INT,

                                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                  CONSTRAINT fk_person_education_person
                                      FOREIGN KEY(person_id)
                                          REFERENCES persons(person_id)

);
CREATE TABLE person_visa (

                             person_visa_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                             person_id BIGINT NOT NULL,

                             visa_type VARCHAR(100) NOT NULL,

                             ead_type VARCHAR(150) NULL,

                             visa_expiry_date DATE,

                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                             CONSTRAINT fk_person_visa_person
                                 FOREIGN KEY (person_id)
                                     REFERENCES persons(person_id)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


-- person_work_experience
CREATE TABLE person_work_experience (

                                        experience_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                        person_id BIGINT NOT NULL,

                                        company_name VARCHAR(150),

                                        designation VARCHAR(150),

                                        start_date DATE,

                                        end_date DATE,

                                        currently_working BOOLEAN DEFAULT FALSE,

                                        skills_used VARCHAR(255),

                                        job_description TEXT,

                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                        CONSTRAINT fk_work_exp_person
                                            FOREIGN KEY(person_id)
                                                REFERENCES persons(person_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE lead_status_history (
                                     history_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     person_id BIGINT NOT NULL,
                                     old_status_id BIGINT,
                                     new_status_id BIGINT NOT NULL,
                                     remarks TEXT,
                                     changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     changed_by_person_id BIGINT NOT NULL,

                                     CONSTRAINT fk_lsh_person
                                         FOREIGN KEY (person_id)
                                             REFERENCES candidates(person_id),

                                     CONSTRAINT fk_lsh_old_status
                                         FOREIGN KEY (old_status_id)
                                             REFERENCES lead_status_master(lead_status_id),

                                     CONSTRAINT fk_lsh_new_status
                                         FOREIGN KEY (new_status_id)
                                             REFERENCES lead_status_master(lead_status_id),

                                     CONSTRAINT fk_lsh_changed_by
                                         FOREIGN KEY (changed_by_person_id)
                                             REFERENCES employees(person_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE reminder_schedule (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                                   reminder_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- FOLLOW-UP REFERENCE
    -- =====================================================

                                   followup_id BIGINT NOT NULL,

    -- =====================================================
    -- REMINDER DETAILS
    -- =====================================================

                                   reminder_time TIMESTAMP NOT NULL,

                                   reminder_type VARCHAR(30) NOT NULL,

                                   reminder_status VARCHAR(20) DEFAULT 'PENDING',

                                   sent_at TIMESTAMP NULL,

                                   is_completed BOOLEAN DEFAULT FALSE,

                                   notification_sent BOOLEAN DEFAULT FALSE,
                                   admin_escalation_sent BOOLEAN NOT NULL DEFAULT FALSE,
    -- =====================================================
    -- AUDIT
    -- =====================================================

                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                                   KEY idx_reminder_followup (followup_id),

                                   KEY idx_reminder_time (reminder_time),

                                   KEY idx_reminder_status (reminder_status),

                                   KEY idx_reminder_completed (is_completed),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                                   CONSTRAINT fk_reminder_followup
                                       FOREIGN KEY (followup_id)
                                           REFERENCES lead_followups(followup_id)
                                           ON UPDATE CASCADE
                                           ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE candidates (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                            person_id BIGINT PRIMARY KEY,

    -- =====================================================
    -- LEAD DETAILS
    -- =====================================================

                            source_id BIGINT,

                            lead_status_id BIGINT,

                            lead_priority VARCHAR(30) DEFAULT 'WARM',

                            next_followup_date TIMESTAMP DEFAULT NULL,

                            computer_experience BOOLEAN DEFAULT FALSE,

                            is_archived BOOLEAN DEFAULT FALSE,

                            import_job_id BIGINT,
                            custom_lead_source VARCHAR(100) NULL,
    -- =====================================================
    -- CREATED BY
    -- =====================================================

                            created_by_person_id BIGINT  NULL,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                            KEY idx_candidate_status (lead_status_id),

                            KEY idx_candidate_source (source_id),

                            KEY idx_candidate_created_by (created_by_person_id),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                            CONSTRAINT fk_candidate_person
                                FOREIGN KEY (person_id)
                                    REFERENCES persons(person_id),

                            CONSTRAINT fk_candidate_source
                                FOREIGN KEY (source_id)
                                    REFERENCES lead_sources(source_id),

                            CONSTRAINT fk_candidate_status
                                FOREIGN KEY (lead_status_id)
                                    REFERENCES lead_status_master(lead_status_id),

                            CONSTRAINT fk_candidate_created_by
                                FOREIGN KEY (created_by_person_id)
                                    REFERENCES employees(person_id)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE lead_assignments (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                                  assignment_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- ASSIGNMENT DETAILS
    -- =====================================================

                                  person_id BIGINT NOT NULL,

                                  employee_person_id BIGINT NOT NULL,

                                  assigned_by_person_id BIGINT DEFAULT NULL,

                                  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                  is_active BOOLEAN DEFAULT TRUE,

                                  remarks TEXT,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                                  KEY idx_assignment_person (person_id),

                                  KEY idx_assignment_employee (employee_person_id),

                                  KEY idx_assignment_assigned_by (assigned_by_person_id),

                                  KEY idx_assignment_active (is_active),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                                  CONSTRAINT fk_assignment_candidate
                                      FOREIGN KEY (person_id)
                                          REFERENCES candidates(person_id)
                                          ON UPDATE CASCADE
                                          ON DELETE RESTRICT,

                                  CONSTRAINT fk_assignment_employee
                                      FOREIGN KEY (employee_person_id)
                                          REFERENCES employees(person_id)
                                          ON UPDATE CASCADE
                                          ON DELETE RESTRICT,

                                  CONSTRAINT fk_assignment_assigned_by
                                      FOREIGN KEY (assigned_by_person_id)
                                          REFERENCES employees(person_id)
                                          ON UPDATE CASCADE
                                          ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE communication_logs (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                                    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- COMMUNICATION DETAILS
    -- =====================================================

                                    person_id BIGINT NOT NULL,

                                    employee_person_id BIGINT NOT NULL,

                                    communication_type VARCHAR(30) NOT NULL,

                                    communication_status VARCHAR(30),

                                    remarks TEXT,

                                    communication_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                                    KEY idx_comm_person (person_id),

                                    KEY idx_comm_employee (employee_person_id),

                                    KEY idx_comm_time (communication_time),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                                    CONSTRAINT fk_comm_candidate
                                        FOREIGN KEY (person_id)
                                            REFERENCES candidates(person_id)
                                            ON UPDATE CASCADE
                                            ON DELETE RESTRICT,

                                    CONSTRAINT fk_comm_employee
                                        FOREIGN KEY (employee_person_id)
                                            REFERENCES employees(person_id)
                                            ON UPDATE CASCADE
                                            ON DELETE RESTRICT

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE lead_followups (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                                followup_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- REFERENCES
    -- =====================================================

                                person_id BIGINT NOT NULL,

                                employee_person_id BIGINT NOT NULL,

    -- =====================================================
    -- FOLLOW-UP DETAILS
    -- =====================================================

                                followup_type VARCHAR(50) NOT NULL,

                                followup_status VARCHAR(20) DEFAULT 'PENDING',

                                remarks TEXT,

                                scheduled_at TIMESTAMP NOT NULL,

                                completed_at TIMESTAMP DEFAULT NULL,

                                next_followup_at TIMESTAMP DEFAULT NULL,

                                retry_count INT DEFAULT 0,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                                KEY idx_followup_person (person_id),

                                KEY idx_followup_employee (employee_person_id),

                                KEY idx_followup_status (followup_status),

                                KEY idx_followup_scheduled (scheduled_at),

                                KEY idx_followup_next (next_followup_at),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                                CONSTRAINT fk_followup_candidate
                                    FOREIGN KEY (person_id)
                                        REFERENCES candidates(person_id)
                                        ON UPDATE CASCADE
                                        ON DELETE RESTRICT,

                                CONSTRAINT fk_followup_employee
                                    FOREIGN KEY (employee_person_id)
                                        REFERENCES employees(person_id)
                                        ON UPDATE CASCADE
                                        ON DELETE RESTRICT

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE lead_notes (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                            note_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- NOTE DETAILS
    -- =====================================================

                            person_id BIGINT NOT NULL,

                            employee_person_id BIGINT NOT NULL,

                            note_text TEXT NOT NULL,

                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                            KEY idx_note_person (person_id),

                            KEY idx_note_employee (employee_person_id),

                            KEY idx_note_created (created_at),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                            CONSTRAINT fk_note_candidate
                                FOREIGN KEY (person_id)
                                    REFERENCES candidates(person_id)
                                    ON UPDATE CASCADE
                                    ON DELETE RESTRICT,

                            CONSTRAINT fk_note_employee
                                FOREIGN KEY (employee_person_id)
                                    REFERENCES employees(person_id)
                                    ON UPDATE CASCADE
                                    ON DELETE RESTRICT

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE lead_scores (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                             person_id BIGINT PRIMARY KEY,

    -- =====================================================
    -- SCORING DETAILS
    -- =====================================================

                             call_score INT DEFAULT 0,

                             email_score INT DEFAULT 0,

                             document_score INT DEFAULT 0,

                             followup_score INT DEFAULT 0,

                             engagement_score INT DEFAULT 0,

                             total_score INT DEFAULT 0,

                             lead_temperature VARCHAR(20) DEFAULT 'WARM',

    -- =====================================================
    -- AUDIT
    -- =====================================================

                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                             updated_at TIMESTAMP NULL DEFAULT NULL
        ON UPDATE CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                             KEY idx_lead_score_temperature (lead_temperature),

                             KEY idx_lead_score_total (total_score),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                             CONSTRAINT fk_lead_score_candidate
                                 FOREIGN KEY (person_id)
                                     REFERENCES candidates(person_id)
                                     ON UPDATE CASCADE
                                     ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE lead_status_master (

                                    lead_status_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                    status_name VARCHAR(50) NOT NULL UNIQUE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE lead_sources (

                              source_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                              source_name VARCHAR(100) UNIQUE NOT NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE lead_import_jobs (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                                  import_job_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- IMPORT FILE DETAILS
    -- =====================================================

                                  original_file_name VARCHAR(255) NOT NULL,

                                  imported_by_person_id BIGINT NOT NULL,

                                  assignment_type VARCHAR(100),

                                  assigned_employee_person_id BIGINT,

    -- =====================================================
    -- IMPORT SUMMARY
    -- =====================================================

                                  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                  total_records INT DEFAULT 0,

                                  duplicate_records INT DEFAULT 0,

                                  invalid_records INT DEFAULT 0,

                                  final_records INT DEFAULT 0,

                                  status VARCHAR(50) DEFAULT 'UPLOADED',

                                  remarks TEXT,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                                  KEY idx_import_imported_by (imported_by_person_id),

                                  KEY idx_import_assigned_employee (assigned_employee_person_id),

                                  KEY idx_import_status (status),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                                  CONSTRAINT fk_import_imported_by
                                      FOREIGN KEY (imported_by_person_id)
                                          REFERENCES employees(person_id)
                                          ON UPDATE CASCADE
                                          ON DELETE RESTRICT,

                                  CONSTRAINT fk_import_assigned_employee
                                      FOREIGN KEY (assigned_employee_person_id)
                                          REFERENCES employees(person_id)
                                          ON UPDATE CASCADE
                                          ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE lead_import_staging (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                                     staging_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- IMPORT JOB
    -- =====================================================

                                     import_job_id BIGINT NOT NULL,

                                     assigned_employee_person_id BIGINT DEFAULT NULL,

                                     auto_assigned BOOLEAN DEFAULT FALSE,

    -- =====================================================
    -- IMPORTED LEAD DATA
    -- =====================================================

                                     first_name VARCHAR(100) NOT NULL,

                                     middle_name VARCHAR(100),

                                     last_name VARCHAR(100),

                                     email VARCHAR(255) NOT NULL,

                                     phone VARCHAR(50) NOT NULL,

                                     visa_type VARCHAR(100),

                                     visa_status VARCHAR(100),

                                     reject_reason VARCHAR(255),

                                     extra_data JSON,

    -- =====================================================
    -- VALIDATION
    -- =====================================================

                                     is_duplicate BOOLEAN DEFAULT FALSE,

                                     is_invalid BOOLEAN DEFAULT FALSE,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                                     KEY idx_staging_job (import_job_id),

                                     KEY idx_staging_employee (assigned_employee_person_id),

                                     KEY idx_staging_email (email),

                                     KEY idx_staging_phone (phone),

                                     KEY idx_staging_duplicate (is_duplicate),

                                     KEY idx_staging_invalid (is_invalid),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                                     CONSTRAINT fk_staging_job
                                         FOREIGN KEY (import_job_id)
                                             REFERENCES lead_import_jobs(import_job_id)
                                             ON UPDATE CASCADE
                                             ON DELETE CASCADE,

                                     CONSTRAINT fk_staging_employee
                                         FOREIGN KEY (assigned_employee_person_id)
                                             REFERENCES employees(person_id)
                                             ON UPDATE CASCADE
                                             ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE lead_import_audit_log (

                                       audit_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                       import_job_id BIGINT NOT NULL,

                                       action_type VARCHAR(100) NOT NULL,

                                       action_by_person_id BIGINT NOT NULL,

                                       description TEXT,

                                       action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                       KEY idx_import_audit_job (import_job_id),
                                       KEY idx_import_audit_action_by (action_by_person_id),

                                       CONSTRAINT fk_import_audit_job
                                           FOREIGN KEY (import_job_id)
                                               REFERENCES lead_import_jobs(import_job_id)
                                               ON UPDATE CASCADE
                                               ON DELETE CASCADE,

                                       CONSTRAINT fk_import_audit_action_by
                                           FOREIGN KEY (action_by_person_id)
                                               REFERENCES employees(person_id)
                                               ON UPDATE CASCADE
                                               ON DELETE RESTRICT

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE lead_distribution_history (

                                           distribution_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                           import_job_id BIGINT NOT NULL,

                                           assigned_to_person_id BIGINT NOT NULL,

                                           assigned_by_person_id BIGINT NOT NULL,

                                           assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                           KEY idx_distribution_job (import_job_id),
                                           KEY idx_distribution_to (assigned_to_person_id),
                                           KEY idx_distribution_by (assigned_by_person_id),

                                           CONSTRAINT fk_distribution_job
                                               FOREIGN KEY (import_job_id)
                                                   REFERENCES lead_import_jobs(import_job_id)
                                                   ON UPDATE CASCADE
                                                   ON DELETE CASCADE,

                                           CONSTRAINT fk_distribution_to
                                               FOREIGN KEY (assigned_to_person_id)
                                                   REFERENCES employees(person_id)
                                                   ON UPDATE CASCADE
                                                   ON DELETE RESTRICT,

                                           CONSTRAINT fk_distribution_by
                                               FOREIGN KEY (assigned_by_person_id)
                                                   REFERENCES employees(person_id)
                                                   ON UPDATE CASCADE
                                                   ON DELETE RESTRICT

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE lead_import_mapping (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                                     mapping_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- MAPPING DETAILS
    -- =====================================================

                                     import_job_id BIGINT NOT NULL,

                                     person_id BIGINT NOT NULL,

                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                                     KEY idx_mapping_job (import_job_id),

                                     KEY idx_mapping_person (person_id),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                                     CONSTRAINT fk_mapping_job
                                         FOREIGN KEY (import_job_id)
                                             REFERENCES lead_import_jobs(import_job_id)
                                             ON UPDATE CASCADE
                                             ON DELETE CASCADE,

                                     CONSTRAINT fk_mapping_person
                                         FOREIGN KEY (person_id)
                                             REFERENCES candidates(person_id)
                                             ON UPDATE CASCADE
                                             ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE student_applications
(
    person_id BIGINT PRIMARY KEY,

    counselor_person_id BIGINT DEFAULT NULL,

    application_stage_id BIGINT NOT NULL,

    current_step TINYINT UNSIGNED NOT NULL DEFAULT 0,

    applied_date DATE,

    admission_date DATE,

    recheck_reason TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    KEY idx_student_application_stage (application_stage_id),

    KEY idx_student_application_counselor (counselor_person_id),

    KEY idx_student_current_step (current_step),

    CONSTRAINT fk_student_application_person
        FOREIGN KEY (person_id)
            REFERENCES persons(person_id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,

    CONSTRAINT fk_student_application_counselor
        FOREIGN KEY (counselor_person_id)
            REFERENCES employees(person_id)
            ON UPDATE CASCADE
            ON DELETE SET NULL,

    CONSTRAINT fk_student_application_stage
        FOREIGN KEY (application_stage_id)
            REFERENCES application_stage_master(application_stage_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT
)
    ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE application_stage_master (

                                          application_stage_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                          application_stage_name VARCHAR(100) NOT NULL UNIQUE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE student_support_tickets (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                                         ticket_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- STUDENT DETAILS
    -- =====================================================

                                         person_id BIGINT NOT NULL,

    -- =====================================================
    -- TICKET DETAILS
    -- =====================================================

                                         subject VARCHAR(200) NOT NULL,

                                         message TEXT NOT NULL,

                                         status VARCHAR(30) DEFAULT 'OPEN',

    -- =====================================================
    -- AUDIT
    -- =====================================================

                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                                         KEY idx_ticket_person (person_id),

                                         KEY idx_ticket_status (status),

                                         KEY idx_ticket_created (created_at),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                                         CONSTRAINT fk_support_student
                                             FOREIGN KEY (person_id)
                                                 REFERENCES student_applications(person_id)
                                                 ON UPDATE CASCADE
                                                 ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE batches (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                         batch_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- BATCH DETAILS
    -- =====================================================

                         batch_name VARCHAR(100) NOT NULL,

                         batch_code VARCHAR(50) NOT NULL UNIQUE,

                         program_id BIGINT NOT NULL,

                         trainer_person_id BIGINT DEFAULT NULL,

                         batch_status_id BIGINT NOT NULL,

    -- =====================================================
    -- SCHEDULE
    -- =====================================================

                         start_date DATE,

                         end_date DATE,

    -- =====================================================
    -- CAPACITY
    -- =====================================================

                         min_students INT DEFAULT 5,

                         max_students INT DEFAULT 12,

                         current_strength INT NOT NULL DEFAULT 0,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                         created_by_person_id BIGINT,

                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                         KEY idx_batch_program (program_id),
                         KEY idx_batch_trainer (trainer_person_id),
                         KEY idx_batch_status (batch_status_id),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                         CONSTRAINT fk_batch_program
                             FOREIGN KEY (program_id)
                                 REFERENCES programs(program_id)
                                 ON UPDATE CASCADE
                                 ON DELETE RESTRICT,

                         CONSTRAINT fk_batch_trainer
                             FOREIGN KEY (trainer_person_id)
                                 REFERENCES employees(person_id)
                                 ON UPDATE CASCADE
                                 ON DELETE SET NULL,

                         CONSTRAINT fk_batch_status
                             FOREIGN KEY (batch_status_id)
                                 REFERENCES batch_status_master(batch_status_id)
                                 ON UPDATE CASCADE
                                 ON DELETE RESTRICT,

                         CONSTRAINT fk_batch_created_by
                             FOREIGN KEY (created_by_person_id)
                                 REFERENCES employees(person_id)
                                 ON UPDATE CASCADE
                                 ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE batch_status_master (

                                     batch_status_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                     batch_status_name VARCHAR(50) NOT NULL UNIQUE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE student_batches (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                                 student_batch_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- REFERENCES
    -- =====================================================

                                 person_id BIGINT NOT NULL,

                                 batch_id BIGINT NOT NULL,

                                 application_stage_id BIGINT NOT NULL,

    -- =====================================================
    -- ENROLLMENT DETAILS
    -- =====================================================

                                 assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                 completed_date DATE DEFAULT NULL,

                                 dropped_date DATE DEFAULT NULL,

                                 drop_reason VARCHAR(500),

                                 remarks TEXT,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                                 KEY idx_student_batch_person (person_id),

                                 KEY idx_student_batch_batch (batch_id),

                                 KEY idx_student_batch_stage (application_stage_id),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                                 CONSTRAINT fk_sb_student
                                     FOREIGN KEY (person_id)
                                         REFERENCES student_applications(person_id)
                                         ON UPDATE CASCADE
                                         ON DELETE RESTRICT,

                                 CONSTRAINT fk_sb_batch
                                     FOREIGN KEY (batch_id)
                                         REFERENCES batches(batch_id)
                                         ON UPDATE CASCADE
                                         ON DELETE RESTRICT,

                                 CONSTRAINT fk_sb_application_stage
                                     FOREIGN KEY (application_stage_id)
                                         REFERENCES application_stage_master(application_stage_id)
                                         ON UPDATE CASCADE
                                         ON DELETE RESTRICT,

    -- =====================================================
    -- PREVENT DUPLICATE ENROLLMENT
    -- =====================================================

                                 CONSTRAINT uk_student_batch
                                     UNIQUE (person_id, batch_id)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;




CREATE TABLE student_application_invitation_tokens (

                                                       id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                                       person_id BIGINT NOT NULL,

                                                       token VARCHAR(100) NOT NULL,

                                                       status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

                                                       expiry_time DATETIME NOT NULL,

                                                       sent_at DATETIME DEFAULT NULL,

                                                       accepted_at DATETIME DEFAULT NULL,

                                                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                                       UNIQUE KEY uk_invitation_token (token),

                                                       UNIQUE KEY uk_student_invitation (person_id),

                                                       KEY idx_invitation_status (status),

                                                       CONSTRAINT fk_invitation_student
                                                           FOREIGN KEY (person_id)
                                                               REFERENCES student_applications(person_id)
                                                               ON UPDATE CASCADE
                                                               ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE student_drop_status_master (

                                            drop_status_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                            status_name VARCHAR(50) NOT NULL UNIQUE,

                                            description VARCHAR(255),

                                            is_active BOOLEAN NOT NULL DEFAULT TRUE,

                                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE student_drop_requests
(
    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

    drop_request_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- REFERENCES
    -- =====================================================

    student_batch_id BIGINT NOT NULL,

    requested_by_person_id BIGINT NOT NULL,

    assigned_to_person_id BIGINT DEFAULT NULL,

    reviewed_by_person_id BIGINT DEFAULT NULL,

    drop_status_id BIGINT NOT NULL,

    -- =====================================================
    -- REQUEST DETAILS
    -- =====================================================

    drop_reason TEXT NOT NULL,

    recommendation VARCHAR(100),

    review_remarks TEXT,

    -- =====================================================
    -- TIMESTAMPS
    -- =====================================================

    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    assigned_at TIMESTAMP DEFAULT NULL,

    reviewed_at TIMESTAMP DEFAULT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

    KEY idx_sdr_student_batch (student_batch_id),

    KEY idx_sdr_requested_by (requested_by_person_id),

    KEY idx_sdr_assigned_to (assigned_to_person_id),

    KEY idx_sdr_reviewed_by (reviewed_by_person_id),

    KEY idx_sdr_status (drop_status_id),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

    CONSTRAINT fk_sdr_student_batch
        FOREIGN KEY (student_batch_id)
            REFERENCES student_batches(student_batch_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT,

    CONSTRAINT fk_sdr_requested_by
        FOREIGN KEY (requested_by_person_id)
            REFERENCES employees(person_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT,

    CONSTRAINT fk_sdr_assigned_to
        FOREIGN KEY (assigned_to_person_id)
            REFERENCES employees(person_id)
            ON UPDATE CASCADE
            ON DELETE SET NULL,

    CONSTRAINT fk_sdr_reviewed_by
        FOREIGN KEY (reviewed_by_person_id)
            REFERENCES employees(person_id)
            ON UPDATE CASCADE
            ON DELETE SET NULL,

    CONSTRAINT fk_sdr_status
        FOREIGN KEY (drop_status_id)
            REFERENCES student_drop_status_master(drop_status_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE programs (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                          program_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- PROGRAM DETAILS
    -- =====================================================

                          program_name VARCHAR(150) NOT NULL,

                          program_code VARCHAR(50) NOT NULL UNIQUE,

                          description TEXT,

    -- =====================================================
    -- PROGRAM DURATION
    -- =====================================================

                          duration_value INT NOT NULL,

                          duration_type VARCHAR(20) NOT NULL DEFAULT 'MONTHS',

    -- =====================================================
    -- STATUS
    -- =====================================================

                          is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE employees (

    -- =====================================================
    -- PERSON INFORMATION
    -- =====================================================

                           person_id BIGINT PRIMARY KEY,

                           employee_code VARCHAR(30) NOT NULL UNIQUE,

    -- =====================================================
    -- JOINING DETAILS
    -- =====================================================

                           joining_date DATE NOT NULL,

                           probation_end_date DATE DEFAULT NULL,

                           is_married BOOLEAN NOT NULL DEFAULT FALSE,

    -- =====================================================
    -- ORGANIZATION DETAILS
    -- =====================================================

                           department_id BIGINT NOT NULL,

                           designation_id BIGINT NOT NULL,

                           employment_type VARCHAR(30) NOT NULL,

                           employee_status_id BIGINT NOT NULL,

                           mode_id BIGINT DEFAULT NULL,

                           shift_id BIGINT DEFAULT NULL,

                           location_id BIGINT DEFAULT NULL,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                           KEY idx_employee_department (department_id),
                           KEY idx_employee_designation (designation_id),
                           KEY idx_employee_status (employee_status_id),
                           KEY idx_employee_mode (mode_id),
                           KEY idx_employee_shift (shift_id),
                           KEY idx_employee_location (location_id),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                           CONSTRAINT fk_employee_person
                               FOREIGN KEY (person_id)
                                   REFERENCES persons(person_id)
                                   ON UPDATE CASCADE
                                   ON DELETE CASCADE,

                           CONSTRAINT fk_employee_department
                               FOREIGN KEY (department_id)
                                   REFERENCES departments(department_id)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,

                           CONSTRAINT fk_employee_designation
                               FOREIGN KEY (designation_id)
                                   REFERENCES designations(designation_id)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,

                           CONSTRAINT fk_employee_status
                               FOREIGN KEY (employee_status_id)
                                   REFERENCES employee_status_master(employee_status_id)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,

                           CONSTRAINT fk_employee_mode
                               FOREIGN KEY (mode_id)
                                   REFERENCES work_modes(mode_id)
                                   ON UPDATE CASCADE
                                   ON DELETE SET NULL,

                           CONSTRAINT fk_employee_shift
                               FOREIGN KEY (shift_id)
                                   REFERENCES shifts(shift_id)
                                   ON UPDATE CASCADE
                                   ON DELETE SET NULL,

                           CONSTRAINT fk_employee_location
                               FOREIGN KEY (location_id)
                                   REFERENCES locations(location_id)
                                   ON UPDATE CASCADE
                                   ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;








CREATE TABLE departments (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                             department_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- DEPARTMENT DETAILS
    -- =====================================================

                             department_name VARCHAR(100) NOT NULL UNIQUE,

                             description TEXT,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE designations (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                              designation_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- DESIGNATION DETAILS
    -- =====================================================

                              designation_name VARCHAR(100) NOT NULL UNIQUE,

                              designation_level VARCHAR(20),

                              role_id BIGINT DEFAULT NULL,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                              KEY idx_designation_role (role_id),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                              CONSTRAINT fk_designation_role
                                  FOREIGN KEY (role_id)
                                      REFERENCES roles(role_id)
                                      ON UPDATE CASCADE
                                      ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE locations (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                           location_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- LOCATION DETAILS
    -- =====================================================

                           location_name VARCHAR(100) NOT NULL UNIQUE,

                           address TEXT,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE holidays (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                          holiday_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- HOLIDAY DETAILS
    -- =====================================================

                          holiday_name VARCHAR(100) NOT NULL,

                          holiday_date DATE NOT NULL,

                          holiday_type VARCHAR(50) DEFAULT NULL,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- UNIQUE CONSTRAINT
    -- =====================================================

                          CONSTRAINT uk_holiday
                              UNIQUE (holiday_date, holiday_name)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE shifts (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                        shift_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- SHIFT DETAILS
    -- =====================================================

                        shift_name VARCHAR(50) NOT NULL UNIQUE,

                        start_time TIME NOT NULL,

                        end_time TIME NOT NULL,

                        is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE work_modes (

                            mode_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                            mode_name VARCHAR(50) NOT NULL UNIQUE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE employee_activity_logs (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                                        activity_log_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- REFERENCES
    -- =====================================================

                                        person_id BIGINT NOT NULL,

                                        created_by_person_id BIGINT DEFAULT NULL,

    -- =====================================================
    -- ACTIVITY DETAILS
    -- =====================================================

                                        activity_type VARCHAR(100),

                                        activity_description TEXT,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                                        KEY idx_activity_person (person_id),

                                        KEY idx_activity_created_by (created_by_person_id),

                                        KEY idx_activity_type (activity_type),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                                        CONSTRAINT fk_activity_employee
                                            FOREIGN KEY (person_id)
                                                REFERENCES employees(person_id)
                                                ON UPDATE CASCADE
                                                ON DELETE CASCADE,

                                        CONSTRAINT fk_activity_created_by
                                            FOREIGN KEY (created_by_person_id)
                                                REFERENCES employees(person_id)
                                                ON UPDATE CASCADE
                                                ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE employee_status_master (

                                        employee_status_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                        status_name VARCHAR(50) NOT NULL UNIQUE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE employee_status_history (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                                         history_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- REFERENCES
    -- =====================================================

                                         person_id BIGINT NOT NULL,

                                         old_status_id BIGINT DEFAULT NULL,

                                         new_status_id BIGINT NOT NULL,

                                         changed_by_person_id BIGINT DEFAULT NULL,

    -- =====================================================
    -- DETAILS
    -- =====================================================

                                         remarks TEXT,

                                         changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                                         KEY idx_status_history_person (person_id),

                                         KEY idx_status_history_old (old_status_id),

                                         KEY idx_status_history_new (new_status_id),

                                         KEY idx_status_history_changed_by (changed_by_person_id),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                                         CONSTRAINT fk_emp_status_history_person
                                             FOREIGN KEY (person_id)
                                                 REFERENCES employees(person_id)
                                                 ON UPDATE CASCADE
                                                 ON DELETE CASCADE,

                                         CONSTRAINT fk_emp_status_history_old
                                             FOREIGN KEY (old_status_id)
                                                 REFERENCES employee_status_master(employee_status_id)
                                                 ON UPDATE CASCADE
                                                 ON DELETE SET NULL,

                                         CONSTRAINT fk_emp_status_history_new
                                             FOREIGN KEY (new_status_id)
                                                 REFERENCES employee_status_master(employee_status_id)
                                                 ON UPDATE CASCADE
                                                 ON DELETE RESTRICT,

                                         CONSTRAINT fk_emp_status_history_changed_by
                                             FOREIGN KEY (changed_by_person_id)
                                                 REFERENCES employees(person_id)
                                                 ON UPDATE CASCADE
                                                 ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE leave_types (

                             leave_type_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                             leave_type_name VARCHAR(100) NOT NULL UNIQUE,

                             max_days_allowed INT,

                             is_paid BOOLEAN NOT NULL DEFAULT TRUE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE leave_status_master (

                                     leave_status_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                     status_name VARCHAR(50) NOT NULL UNIQUE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE employee_leave_requests (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                                         leave_request_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- REFERENCES
    -- =====================================================

                                         person_id BIGINT NOT NULL,

                                         leave_type_id BIGINT NOT NULL,

                                         leave_status_id BIGINT DEFAULT NULL,

                                         approved_by_person_id BIGINT DEFAULT NULL,

    -- =====================================================
    -- LEAVE DETAILS
    -- =====================================================

                                         start_date DATE NOT NULL,

                                         end_date DATE NOT NULL,

                                         reason TEXT,

                                         approved_at TIMESTAMP NULL,

                                         applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                                         KEY idx_leave_person (person_id),

                                         KEY idx_leave_type (leave_type_id),

                                         KEY idx_leave_status (leave_status_id),

                                         KEY idx_leave_approved_by (approved_by_person_id),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                                         CONSTRAINT fk_leave_employee
                                             FOREIGN KEY (person_id)
                                                 REFERENCES employees(person_id)
                                                 ON UPDATE CASCADE
                                                 ON DELETE CASCADE,

                                         CONSTRAINT fk_leave_type
                                             FOREIGN KEY (leave_type_id)
                                                 REFERENCES leave_types(leave_type_id)
                                                 ON UPDATE CASCADE
                                                 ON DELETE RESTRICT,

                                         CONSTRAINT fk_leave_status
                                             FOREIGN KEY (leave_status_id)
                                                 REFERENCES leave_status_master(leave_status_id)
                                                 ON UPDATE CASCADE
                                                 ON DELETE SET NULL,

                                         CONSTRAINT fk_leave_approved_by
                                             FOREIGN KEY (approved_by_person_id)
                                                 REFERENCES employees(person_id)
                                                 ON UPDATE CASCADE
                                                 ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE action_types (

                              action_type_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                              action_name VARCHAR(50) NOT NULL UNIQUE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE action_status_master (

                                      action_status_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                      status_name VARCHAR(100) NOT NULL UNIQUE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE email_logs (

                            email_log_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                            person_id BIGINT NOT NULL,

                            email_type VARCHAR(100),

                            sent_to VARCHAR(100) NOT NULL,

                            email_subject VARCHAR(255),

                            sent_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                            status VARCHAR(50),

                            KEY idx_email_person (person_id),

                            KEY idx_email_status (status),

                            CONSTRAINT fk_email_person
                                FOREIGN KEY (person_id)
                                    REFERENCES persons(person_id)
                                    ON UPDATE CASCADE
                                    ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE trainer_tasks (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                               task_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- REFERENCES
    -- =====================================================

                               trainer_person_id BIGINT NOT NULL,

                               created_by_person_id BIGINT DEFAULT NULL,

    -- =====================================================
    -- TASK DETAILS
    -- =====================================================

                               title VARCHAR(255) NOT NULL,

                               description TEXT,

                               due_date DATE,

                               status ENUM (
        'PENDING',
        'IN_PROGRESS',
        'COMPLETED'
    ) NOT NULL DEFAULT 'PENDING',

    -- =====================================================
    -- AUDIT
    -- =====================================================

                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                               KEY idx_trainer_task_person (trainer_person_id),

                               KEY idx_trainer_task_status (status),

                               KEY idx_trainer_task_due_date (due_date),

                               KEY idx_trainer_task_created_by (created_by_person_id),

    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

                               CONSTRAINT fk_tt_trainer
                                   FOREIGN KEY (trainer_person_id)
                                       REFERENCES employees(person_id)
                                       ON UPDATE CASCADE
                                       ON DELETE CASCADE,

                               CONSTRAINT fk_tt_created_by
                                   FOREIGN KEY (created_by_person_id)
                                       REFERENCES employees(person_id)
                                       ON UPDATE CASCADE
                                       ON DELETE SET NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;





CREATE TABLE users (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                       user_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- =====================================================
    -- PERSON
    -- =====================================================

                       person_id BIGINT NOT NULL UNIQUE,

    -- =====================================================
    -- LOGIN DETAILS
    -- =====================================================

                       username VARCHAR(100) NOT NULL UNIQUE,

                       password VARCHAR(255) NOT NULL,

                       is_active BOOLEAN NOT NULL DEFAULT TRUE,

                       is_locked BOOLEAN NOT NULL DEFAULT FALSE,

                       failed_attempts INT NOT NULL DEFAULT 0,

                       last_login TIMESTAMP NULL,

                       must_change_password BOOLEAN NOT NULL DEFAULT FALSE,

                       password_changed_at TIMESTAMP NULL,

    -- =====================================================
    -- AUDIT
    -- =====================================================

                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- =====================================================
    -- INDEXES
    -- =====================================================

                       KEY idx_user_username (username),

                       KEY idx_user_person (person_id),

    -- =====================================================
    -- FOREIGN KEY
    -- =====================================================

                       CONSTRAINT fk_user_person
                           FOREIGN KEY (person_id)
                               REFERENCES persons(person_id)
                               ON UPDATE CASCADE
                               ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


-- roles
CREATE TABLE roles (
                       role_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       role_name VARCHAR(100) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE user_roles (

                            user_role_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                            user_id BIGINT NOT NULL,

                            role_id BIGINT NOT NULL,

                            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                            FOREIGN KEY (user_id)
                                REFERENCES users(user_id),

                            FOREIGN KEY (role_id)
                                REFERENCES roles(role_id),

                            UNIQUE(user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE person_type_map (

                                 person_type_map_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                 person_id BIGINT NOT NULL,

                                 person_type_id BIGINT NOT NULL,

                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                 CONSTRAINT uk_person_type
                                     UNIQUE (person_id, person_type_id),

                                 CONSTRAINT fk_ptm_person
                                     FOREIGN KEY (person_id)
                                         REFERENCES persons(person_id)
                                         ON DELETE CASCADE
                                         ON UPDATE CASCADE,

                                 CONSTRAINT fk_ptm_type
                                     FOREIGN KEY (person_type_id)
                                         REFERENCES person_types(person_type_id)
                                         ON DELETE RESTRICT
                                         ON UPDATE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE notifications (

    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

                               notification_id BIGINT NOT NULL AUTO_INCREMENT,


    -- =====================================================
    -- AUDIT
    -- =====================================================

                               created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),


    -- =====================================================
    -- READ STATUS
    -- =====================================================

                               is_read BIT(1) NOT NULL DEFAULT b'0',


    -- =====================================================
    -- NOTIFICATION MESSAGE
    -- =====================================================

                               message TEXT,


    -- =====================================================
    -- NOTIFICATION TYPE
    -- =====================================================

                               notification_type ENUM(

        -- Lead notifications
        'CALLBACK_DUE',
    'FOLLOWUP',
    'FOLLOWUP_PENDING',
    'LEAD_ARCHIVED',
    'LEAD_ASSIGNED',
    'LEAD_CONVERTED',
    'LEAD_REASSIGNED',
    'REMINDER',
    'STATUS_CHANGED',
    'SYSTEM_ALERT',
    'FOLLOWUP_ESCALATED',

    -- Contract notifications
    'CONTRACT_UPLOADED',
    'CONTRACT_SIGNED'

) NULL,


    -- =====================================================
    -- TITLE
    -- =====================================================

    title VARCHAR(255) NOT NULL,


    -- =====================================================
    -- EMPLOYEE RECIPIENT
    -- Employee ka PK/reference = employees.person_id
    -- =====================================================

    employee_person_id BIGINT NULL,


    -- =====================================================
    -- STUDENT RECIPIENT
    -- Student ka current schema mein reference:
    -- student_applications.person_id
    -- =====================================================

    student_person_id BIGINT NULL,


    -- =====================================================
    -- LEAD RECIPIENT / RELATED LEAD
    -- Lead ka reference = candidates.person_id
    -- =====================================================

    lead_person_id BIGINT NULL,


    -- =====================================================
    -- PRIMARY KEY
    -- =====================================================

    PRIMARY KEY (notification_id),


    -- =====================================================
    -- INDEXES
    -- =====================================================

    KEY idx_notifications_employee (
        employee_person_id
    ),

    KEY idx_notifications_student (
        student_person_id
    ),

    KEY idx_notifications_lead (
        lead_person_id
    ),

    KEY idx_notifications_employee_read (
        employee_person_id,
        is_read
    ),

    KEY idx_notifications_student_read (
        student_person_id,
        is_read
    ),

    KEY idx_notifications_lead_read (
        lead_person_id,
        is_read
    ),

    KEY idx_notifications_created (
        created_at
    ),

    KEY idx_notifications_type (
        notification_type
    ),


    -- =====================================================
    -- EMPLOYEE FOREIGN KEY
    -- =====================================================

    CONSTRAINT fk_notifications_employee
        FOREIGN KEY (employee_person_id)
        REFERENCES employees(person_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,


    -- =====================================================
    -- STUDENT FOREIGN KEY
    -- IMPORTANT:
    -- students table nahi hai.
    -- Student = student_applications.person_id
    -- =====================================================

    CONSTRAINT fk_notifications_student
        FOREIGN KEY (student_person_id)
        REFERENCES student_applications(person_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,


    -- =====================================================
    -- LEAD FOREIGN KEY
    -- =====================================================

    CONSTRAINT fk_notifications_lead
        FOREIGN KEY (lead_person_id)
        REFERENCES candidates(person_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL

)
    ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE profile_change_requests (
                                         request_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                         candidate_person_id BIGINT NOT NULL,

                                         request_type VARCHAR(30) NOT NULL,

                                         operation_type VARCHAR(10) NOT NULL,

                                         target_id BIGINT NULL,

                                         new_data JSON NOT NULL,

                                         status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

                                         reviewed_by_person_id BIGINT NULL,

                                         reviewed_at TIMESTAMP NULL,

                                         rejection_reason TEXT NULL,

                                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                         CONSTRAINT fk_pcr_student
                                             FOREIGN KEY (candidate_person_id)
                                                 REFERENCES persons(person_id)
                                                 ON DELETE CASCADE
                                                 ON UPDATE CASCADE,

                                         CONSTRAINT fk_pcr_reviewer
                                             FOREIGN KEY (reviewed_by_person_id)
                                                 REFERENCES employees(person_id)
                                                 ON DELETE SET NULL
                                                 ON UPDATE CASCADE,

                                         INDEX idx_pcr_student_status (
        candidate_person_id,
        status
    ),

                                         INDEX idx_pcr_status (
        status
    ),

                                         INDEX idx_pcr_reviewer (
        reviewed_by_person_id
    ),

                                         INDEX idx_pcr_target (
        target_id
    )

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE contracts (
                           contract_id BIGINT PRIMARY KEY AUTO_INCREMENT,

                           batch_id BIGINT NOT NULL,

                           file_name VARCHAR(255) NOT NULL,

                           file_data LONGBLOB NOT NULL,

                           content_type VARCHAR(100) NOT NULL,

                           file_size BIGINT,

                           uploaded_by_person_id BIGINT NOT NULL,

                           uploaded_at DATETIME(6)
        DEFAULT CURRENT_TIMESTAMP(6),

                           status ENUM('ACTIVE', 'INACTIVE')
        DEFAULT 'ACTIVE',

                           CONSTRAINT fk_contract_batch
                               FOREIGN KEY (batch_id)
                                   REFERENCES batches(batch_id),

                           CONSTRAINT fk_contract_person
                               FOREIGN KEY (uploaded_by_person_id)
                                   REFERENCES persons(person_id)
);
