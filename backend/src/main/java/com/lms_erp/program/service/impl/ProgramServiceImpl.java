package com.lms_erp.program.service.impl;

import com.lms_erp.program.constants.ProgramConstants;
import com.lms_erp.program.dto.*;
import com.lms_erp.program.entity.Program;
import com.lms_erp.program.exception.ProgramNotFoundException;
import com.lms_erp.program.mapper.ProgramMapper;
import com.lms_erp.program.repository.ProgramRepository;
import com.lms_erp.program.service.ProgramService;
import com.lms_erp.program.validation.ProgramValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgramServiceImpl implements ProgramService {

    private final ProgramRepository programRepository;

    @Override
    public ProgramResponse createProgram(ProgramCreateRequest request) {

        ProgramValidation.validateProgram(request);

        Program program = new Program();

        program.setProgramName(request.getProgramName());

        // Auto Generate Program Code
        String generatedCode = "PRG-" + System.currentTimeMillis();
        program.setProgramCode(generatedCode);

        program.setDurationValue(request.getDurationValue());
        program.setDurationType(request.getDurationType());
        program.setDescription(request.getDescription());
        program.setIsActive(true);

        Program savedProgram = programRepository.save(program);

        return ProgramMapper.mapToResponse(savedProgram);
    }

    @Override
    public List<ProgramResponse> getAllPrograms() {

        return programRepository.findAll()
                .stream()
                .map(ProgramMapper::mapToResponse)
                .toList();
    }

    @Override
    public ProgramResponse getProgramById(Long programId) {

        Program program = programRepository.findById(programId)
                .orElseThrow(() ->
                        new ProgramNotFoundException(
                                ProgramConstants.PROGRAM_NOT_FOUND
                        ));

        return ProgramMapper.mapToResponse(program);
    }

    @Override
    public ProgramResponse updateProgram(
            Long programId,
            ProgramUpdateRequest request
    ) {

        Program program = programRepository.findById(programId)
                .orElseThrow(() ->
                        new ProgramNotFoundException(
                                ProgramConstants.PROGRAM_NOT_FOUND
                        ));

        program.setProgramName(request.getProgramName());
        program.setDurationValue(request.getDurationValue());
        program.setDurationType(request.getDurationType());
        program.setDescription(request.getDescription());
        program.setIsActive(request.getIsActive());

        Program updatedProgram = programRepository.save(program);

        return ProgramMapper.mapToResponse(updatedProgram);
    }

    @Override
    public void deleteProgram(Long programId) {

        Program program = programRepository.findById(programId)
                .orElseThrow(() ->
                        new ProgramNotFoundException(
                                ProgramConstants.PROGRAM_NOT_FOUND
                        ));

        // Soft Delete
        program.setIsActive(false);

        programRepository.save(program);
    }

    @Override
    public List<ProgramResponse> getActivePrograms() {

        return programRepository.findByIsActive(true)
                .stream()
                .map(ProgramMapper::mapToResponse)
                .toList();
    }

    @Override
    public List<ProgramResponse> getInactivePrograms() {

        return programRepository.findByIsActive(false)
                .stream()
                .map(ProgramMapper::mapToResponse)
                .toList();
    }
}