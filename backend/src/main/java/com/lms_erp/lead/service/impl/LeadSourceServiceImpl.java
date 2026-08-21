package com.lms_erp.lead.service.impl;

import com.lms_erp.lead.dto.LeadSourceRequest;
import com.lms_erp.lead.dto.LeadSourceResponse;
import com.lms_erp.lead.entity.LeadSource;
import com.lms_erp.lead.repository.LeadSourceRepository;
import com.lms_erp.lead.service.LeadSourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadSourceServiceImpl implements LeadSourceService {

    private final LeadSourceRepository repository;

    // =====================================================
    // SAVE
    // =====================================================

    @Override
    public LeadSourceResponse save(LeadSourceRequest request) {

        String sourceName = toTitleCase(
                request.getSourceName()
                        .trim()
                        .replaceAll("\\s+", " ")
        );

        validateLeadSource(sourceName);

        if (repository.findBySourceNameIgnoreCase(sourceName).isPresent()) {
            throw new RuntimeException("Lead Source already exists.");
        }

        LeadSource source = LeadSource.builder()
                .sourceName(sourceName)
                .build();

        source = repository.save(source);

        return LeadSourceResponse.builder()
                .sourceId(source.getSourceId())
                .sourceName(source.getSourceName())
                .build();
    }

    // =====================================================
    // GET ALL
    // =====================================================

    @Override
    public List<LeadSourceResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(source -> LeadSourceResponse.builder()
                        .sourceId(source.getSourceId())
                        .sourceName(source.getSourceName())
                        .build())
                .toList();
    }


    // =====================================================
    // VALIDATION
    // =====================================================

    private void validateLeadSource(String sourceName) {

        if (sourceName.length() < 3) {
            throw new RuntimeException("Lead Source must be at least 3 characters.");
        }

        if (!sourceName.matches("^[A-Za-z][A-Za-z0-9 &()/-]{2,99}$")) {
            throw new RuntimeException("Invalid Lead Source.");
        }

        if (sourceName.chars().distinct().count() == 1) {
            throw new RuntimeException("Please enter a valid Lead Source.");
        }

        String lower = sourceName.trim().toLowerCase();

        List<String> invalidNames = List.of(
                "fb",
                "ig",
                "insta",
                "wp",
                "wts",
                "yt",
                "li",
                "abc",
                "xyz",
                "test",
                "demo",
                "na",
                "n/a",
                "other",
                "-",
                "."
        );

        if (invalidNames.contains(lower)) {
            throw new RuntimeException("Please enter a proper Lead Source.");
        }
    }

    // =====================================================
    // TITLE CASE
    // =====================================================

    private String toTitleCase(String value) {

        String[] words = value.toLowerCase().split("\\s+");

        StringBuilder builder = new StringBuilder();

        for (String word : words) {

            if (word.isBlank()) {
                continue;
            }

            builder.append(Character.toUpperCase(word.charAt(0)))
                    .append(word.substring(1))
                    .append(" ");
        }

        return builder.toString().trim();
    }
}