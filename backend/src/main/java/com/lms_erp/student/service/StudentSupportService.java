package com.lms_erp.student.service;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.person.entity.Person;
import com.lms_erp.security.CurrentUserService;
import com.lms_erp.student.dto.StudentSupportRequest;
import com.lms_erp.student.dto.SupportTicketResponse;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.entity.StudentSupportTicket;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.student.repository.StudentSupportTicketRepository;
import com.lms_erp.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentSupportService {

    private final StudentApplicationRepository studentApplicationRepository;
    private final StudentSupportTicketRepository supportTicketRepository;
    private final EmployeeRepository employeeRepository;
    private final CurrentUserService currentUserService;

    public String createTicket(StudentSupportRequest request) {

        User currentUser = currentUserService.getCurrentUser();

        Person person = currentUser.getPerson();

        if (person == null) {
            throw new RuntimeException("Person not found");
        }

        StudentApplication application = studentApplicationRepository
                .findByPerson(person)
                .orElseThrow(() ->
                        new RuntimeException("Student Application not found"));

        StudentSupportTicket ticket = new StudentSupportTicket();

        ticket.setStudentApplication(application);
        ticket.setSubject(request.getSubject());
        ticket.setMessage(request.getMessage());
        ticket.setStatus("OPEN");

        supportTicketRepository.save(ticket);

        return "Support ticket created successfully";
    }

    @Transactional(readOnly = true)
    public List<SupportTicketResponse> getAdminTickets() {

        return supportTicketRepository
                .findByStatusOrderByCreatedAtDesc("OPEN")
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupportTicketResponse> getCounselorTickets() {

        User currentUser = currentUserService.getCurrentUser();

        if (currentUser.getPerson() == null ||
                currentUser.getPerson().getPersonId() == null) {
            throw new RuntimeException("Person not found for current user");
        }

        Employee employee = employeeRepository
                .findByPersonPersonId(currentUser.getPerson().getPersonId())
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        Long counselorPersonId = employee.getPerson().getPersonId();

        return supportTicketRepository
                .findByStatusOrderByCreatedAtDesc("OPEN")
                .stream()
                .filter(ticket ->
                        ticket.getStudentApplication() != null
                                && ticket.getStudentApplication().getCounselor() != null
                                && ticket.getStudentApplication().getCounselor().getPerson() != null
                                && counselorPersonId.equals(
                                ticket.getStudentApplication()
                                        .getCounselor()
                                        .getPerson()
                                        .getPersonId()
                        ))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public String resolveTicket(Long ticketId) {

        StudentSupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        ticket.setStatus("RESOLVED");

        supportTicketRepository.save(ticket);

        return "Ticket resolved successfully.";
    }

    private SupportTicketResponse convertToResponse(
            StudentSupportTicket ticket
    ) {

        SupportTicketResponse dto = new SupportTicketResponse();

        dto.setTicketId(ticket.getTicketId());

        if (ticket.getStudentApplication() != null) {

            dto.setPersonId(
                    ticket.getStudentApplication().getPersonId()
            );

            if (ticket.getStudentApplication().getApplicationStage() != null) {
                dto.setApplicationStage(
                        ticket.getStudentApplication()
                                .getApplicationStage()
                                .getApplicationStageName()
                );
            }
            Person person = ticket.getStudentApplication().getPerson();

            if (person != null) {

                String firstName =
                        person.getFirstName() == null
                                ? ""
                                : person.getFirstName();

                String lastName =
                        person.getLastName() == null
                                ? ""
                                : person.getLastName();

                dto.setStudentName(
                        (firstName + " " + lastName).trim()
                );
            }
        }

        dto.setSubject(ticket.getSubject());
        dto.setMessage(ticket.getMessage());
        dto.setStatus(ticket.getStatus());
        dto.setCreatedAt(ticket.getCreatedAt());

        return dto;
    }
}