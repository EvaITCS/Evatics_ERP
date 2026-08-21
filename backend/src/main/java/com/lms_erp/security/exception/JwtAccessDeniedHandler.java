package com.lms_erp.security.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms_erp.config.properties.SecurityConfigProperties;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Default JWT access denied handler
 * Handles 403 Forbidden responses
 */
@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;
    private final SecurityConfigProperties properties;

    @Autowired
    public JwtAccessDeniedHandler(ObjectMapper objectMapper, SecurityConfigProperties properties) {
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    public JwtAccessDeniedHandler(ObjectMapper objectMapper) {
        this(objectMapper, null);
    }

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException, ServletException {

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.FORBIDDEN.value());

        Map<String, Object> errorDetails = buildErrorResponse(request, accessDeniedException);
        objectMapper.writeValue(response.getOutputStream(), errorDetails);
    }

    private Map<String, Object> buildErrorResponse(
            HttpServletRequest request,
            AccessDeniedException accessDeniedException) {

        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now().toString());
        errorDetails.put("status", HttpStatus.FORBIDDEN.value());
        errorDetails.put("error", "Forbidden");

        boolean includeMessage = properties == null || properties.getException().isIncludeMessage();
        boolean includePath = properties == null || properties.getException().isIncludePath();
        boolean includeTrace = properties != null && properties.getException().isIncludeStackTrace();

        if (includeMessage) {
            errorDetails.put("message", accessDeniedException.getMessage());
        }

        if (includePath) {
            errorDetails.put("path", request.getRequestURI());
        }

        if (includeTrace) {
            errorDetails.put("trace", getStackTrace(accessDeniedException));
        }

        return errorDetails;
    }

    private String getStackTrace(Exception ex) {
        StringBuilder sb = new StringBuilder();
        for (StackTraceElement element : ex.getStackTrace()) {
            sb.append(element.toString()).append("\n");
        }
        return sb.toString();
    }
}