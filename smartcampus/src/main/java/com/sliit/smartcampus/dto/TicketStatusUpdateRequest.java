package com.sliit.smartcampus.dto;

import com.sliit.smartcampus.model.TicketStatus;
import jakarta.validation.constraints.NotNull;

public class TicketStatusUpdateRequest {
    
    @NotNull(message = "Status is mandatory")
    private TicketStatus status;

    public TicketStatusUpdateRequest() {}

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }
}
