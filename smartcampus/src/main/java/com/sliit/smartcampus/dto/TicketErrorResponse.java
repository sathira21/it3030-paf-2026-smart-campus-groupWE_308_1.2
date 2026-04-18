package com.sliit.smartcampus.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class TicketErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private Map<String, String> validationErrors;

    public TicketErrorResponse(LocalDateTime timestamp, int status, String error, Map<String, String> validationErrors) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.validationErrors = validationErrors;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public Map<String, String> getValidationErrors() {
        return validationErrors;
    }

    public void setValidationErrors(Map<String, String> validationErrors) {
        this.validationErrors = validationErrors;
    }
}
