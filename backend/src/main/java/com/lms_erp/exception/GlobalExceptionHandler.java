package com.lms_erp.exception;



import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {



    /**
     * Not needed. HttpException extends ErrorResponseException
     * which is handled similarly by spring web.
     *
     * Leaving as reference.
     *
     * May potentially add headers to response in the future
     * @param ex {@link HttpException}
     * @return {@link ProblemDetail} problem detail
     */
    @ExceptionHandler(HttpException.class)
    public ResponseEntity<ProblemDetail> handleHttpException(
            HttpException ex
    ) {
        return ResponseEntity
                .status(ex.getStatusCode())
                .header("X-Correlation-ID", "SHOULD_BE_SET_IN_THE_FUTURE")
                .body(ex.getBody());
    }


}