package com.lms_erp.trainer.service.impl;

import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonContact;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.entity.StudentBatch;
import com.lms_erp.student.repository.StudentBatchRepository;
import com.lms_erp.trainer.dto.TrainerStudentResponse;
import com.lms_erp.trainer.service.TrainerStudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerStudentServiceImpl implements TrainerStudentService {

    private final StudentBatchRepository studentBatchRepository;

    @Override
    public List<TrainerStudentResponse> getMyStudents(Long employeeId) {

        List<StudentBatch> studentBatches =
                studentBatchRepository.findStudentsByTrainerPersonId(employeeId);

        List<TrainerStudentResponse> response = new ArrayList<>();

        for (StudentBatch sb : studentBatches) {

            StudentApplication application = sb.getStudentApplication();
            Person person = (application != null) ? application.getPerson() : null;

            String firstName = (person != null) ? person.getFirstName() : "";
            String lastName = (person != null && person.getLastName() != null) ? person.getLastName() : "";

            TrainerStudentResponse dto = TrainerStudentResponse.builder()
                    .studentPersonId(person != null ? person.getPersonId() : null)
                    .studentName((firstName + " " + lastName).trim())
                    .email(getEmail(person))
                    .phone(getPhone(person))
                    .gender(getGender(person))
                    .batchName(
                            sb.getBatch() != null ? sb.getBatch().getBatchName() : ""
                    )
                    .programName(
                            sb.getBatch() != null && sb.getBatch().getProgram() != null
                                    ? sb.getBatch().getProgram().getProgramName()
                                    : ""
                    )
                    .applicationStage(
                            (application != null && application.getApplicationStage() != null)
                                    ? application.getApplicationStage().getApplicationStageName()
                                    : ""
                    )
                    .admissionDate(
                            application != null ? application.getAdmissionDate() : null
                    )
                    .build();

            response.add(dto);
        }

        return response;
    }

    @Override
    public List<TrainerStudentResponse> getCurrentBatchStudents(Long employeeId) {

        List<StudentBatch> studentBatches =
                studentBatchRepository.findCurrentBatchStudentsByTrainerPersonId(employeeId);

        List<TrainerStudentResponse> response = new ArrayList<>();

        for (StudentBatch sb : studentBatches) {

            StudentApplication application = sb.getStudentApplication();
            Person person = (application != null) ? application.getPerson() : null;

            String firstName = (person != null) ? person.getFirstName() : "";
            String lastName = (person != null && person.getLastName() != null) ? person.getLastName() : "";

            TrainerStudentResponse dto = TrainerStudentResponse.builder()
                    .studentPersonId(person != null ? person.getPersonId() : null)
                    .studentName((firstName + " " + lastName).trim())

                    .email(getEmail(person))
                    .phone(getPhone(person))
                    .gender(getGender(person))
                    .batchName(
                            sb.getBatch() != null ? sb.getBatch().getBatchName() : ""
                    )
                    .programName(
                            sb.getBatch() != null && sb.getBatch().getProgram() != null
                                    ? sb.getBatch().getProgram().getProgramName()
                                    : ""
                    )
                    .applicationStage(
                            (application != null && application.getApplicationStage() != null)
                                    ? application.getApplicationStage().getApplicationStageName()
                                    : ""
                    )
                    .admissionDate(
                            application != null ? application.getAdmissionDate() : null
                    )
                    .build();

            response.add(dto);
        }

        return response;
    }

    private String getEmail(Person person) {

        if (person == null || person.getContacts() == null) {
            return "";
        }

        return person.getContacts().stream()
                .filter(c -> c.getContactType() != null
                        && "PRIMARY_EMAIL".equalsIgnoreCase(c.getContactType().getContactTypeName()))
                .map(PersonContact::getContactValue)
                .findFirst()
                .orElse("");
    }

    private String getPhone(Person person) {

        if (person == null || person.getContacts() == null) {
            return "";
        }

        return person.getContacts().stream()
                .filter(c -> c.getContactType() != null
                        && "PRIMARY_PHONE".equalsIgnoreCase(c.getContactType().getContactTypeName()))
                .map(PersonContact::getContactValue)
                .findFirst()
                .orElse("");
    }

    private String getGender(Person person) {

        if (person == null || person.getGender() == null) {
            return "";
        }

        return person.getGender().getGenderName();
    }
}