package com.sliit.smartcampus.exception;

import com.sliit.smartcampus.controller.IncidentTicketController;
import com.sliit.smartcampus.dto.TicketErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
<<<<<<< HEAD
=======
import org.springframework.http.converter.HttpMessageNotReadableException;
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice(assignableTypes = IncidentTicketController.class)
public class IncidentTicketExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<TicketErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        TicketErrorResponse response = new TicketErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                errors
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TicketNotFoundException.class)
    public ResponseEntity<TicketErrorResponse> handleTicketNotFoundException(TicketNotFoundException ex) {
        TicketErrorResponse response = new TicketErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidTicketStateException.class)
    public ResponseEntity<TicketErrorResponse> handleInvalidTicketStateException(InvalidTicketStateException ex) {
        TicketErrorResponse response = new TicketErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CommentNotFoundException.class)
    public ResponseEntity<TicketErrorResponse> handleCommentNotFoundException(CommentNotFoundException ex) {
        TicketErrorResponse response = new TicketErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CommentOwnershipException.class)
    public ResponseEntity<TicketErrorResponse> handleCommentOwnershipException(CommentOwnershipException ex) {
        TicketErrorResponse response = new TicketErrorResponse(
                LocalDateTime.now(),
                HttpStatus.FORBIDDEN.value(),
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<TicketErrorResponse> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException ex) {
        TicketErrorResponse response = new TicketErrorResponse(
                LocalDateTime.now(),
                413,
                "File size exceeds the configured maximum limit (5MB per file / 15MB per request).",
                null
        );
        return new ResponseEntity<>(response, HttpStatus.valueOf(413));
    }

    @ExceptionHandler(FileValidationException.class)
    public ResponseEntity<TicketErrorResponse> handleFileValidationException(FileValidationException ex) {
        TicketErrorResponse response = new TicketErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
<<<<<<< HEAD
=======

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<TicketErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        TicketErrorResponse response = new TicketErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Malformed request body or invalid ticket data.",
                Map.of("error", ex.getMostSpecificCause().getMessage())
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
}
