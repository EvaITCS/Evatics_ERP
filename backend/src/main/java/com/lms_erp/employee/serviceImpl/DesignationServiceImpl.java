package com.lms_erp.employee.serviceImpl;

import com.lms_erp.employee.dto.DesignationRequest;
import com.lms_erp.employee.dto.DesignationResponse;
import com.lms_erp.employee.entity.Designation;
import com.lms_erp.employee.exception.DesignationNotFoundException;
import com.lms_erp.employee.repository.DesignationRepository;
import com.lms_erp.employee.service.DesignationService;
import com.lms_erp.user.entity.Role;
import com.lms_erp.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DesignationServiceImpl implements DesignationService {

    private final DesignationRepository designationRepository;
    private final RoleRepository roleRepository;

    // =====================================================
    // CREATE DESIGNATION
    // =====================================================

    @Override
    public DesignationResponse createDesignation(DesignationRequest request) {

        if (designationRepository.existsByDesignationName(request.getDesignationName())) {
            throw new IllegalArgumentException("Designation already exists.");
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() ->
                        new RuntimeException("Role not found with id : " + request.getRoleId()));

        Designation designation = Designation.builder()
                .designationName(request.getDesignationName())
                .designationLevel(request.getDesignationLevel())
                .role(role)
                .build();

        Designation savedDesignation = designationRepository.save(designation);

        return mapToResponse(savedDesignation);
    }

    // =====================================================
    // UPDATE DESIGNATION
    // =====================================================

    @Override
    public DesignationResponse updateDesignation(Long designationId,
                                                 DesignationRequest request) {

        Designation designation = designationRepository.findById(designationId)
                .orElseThrow(() ->
                        new DesignationNotFoundException(
                                "Designation not found with id : " + designationId));

        designationRepository.findByDesignationName(request.getDesignationName())
                .ifPresent(existing -> {
                    if (!existing.getDesignationId().equals(designationId)) {
                        throw new IllegalArgumentException("Designation already exists.");
                    }
                });

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() ->
                        new RuntimeException("Role not found with id : " + request.getRoleId()));

        designation.setDesignationName(request.getDesignationName());
        designation.setDesignationLevel(request.getDesignationLevel());
        designation.setRole(role);

        Designation updatedDesignation = designationRepository.save(designation);

        return mapToResponse(updatedDesignation);
    }

    // =====================================================
    // GET DESIGNATION BY ID
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public DesignationResponse getDesignationById(Long designationId) {

        Designation designation = designationRepository.findById(designationId)
                .orElseThrow(() ->
                        new DesignationNotFoundException(
                                "Designation not found with id : " + designationId));

        return mapToResponse(designation);
    }

    // =====================================================
    // GET ALL DESIGNATIONS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<DesignationResponse> getAllDesignations() {

        return designationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =====================================================
    // DELETE DESIGNATION
    // =====================================================

    @Override
    public void deleteDesignation(Long designationId) {

        Designation designation = designationRepository.findById(designationId)
                .orElseThrow(() ->
                        new DesignationNotFoundException(
                                "Designation not found with id : " + designationId));

        designationRepository.delete(designation);
    }

    // =====================================================
    // ENTITY -> RESPONSE MAPPER
    // =====================================================

    private DesignationResponse mapToResponse(Designation designation) {

        return DesignationResponse.builder()
                .designationId(designation.getDesignationId())
                .designationName(designation.getDesignationName())
                .designationLevel(designation.getDesignationLevel())
                .roleName(
                        designation.getRole() != null
                                ? designation.getRole().getRoleName()
                                : null
                )
                .build();
    }
}