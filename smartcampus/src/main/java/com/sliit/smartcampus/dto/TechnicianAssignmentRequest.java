package com.sliit.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;

public class TechnicianAssignmentRequest {

    @NotBlank(message = "Assigned technician is mandatory")
    private String assignedTechnician;

    private String resolutionNotes;

    public TechnicianAssignmentRequest() {}

    public String getAssignedTechnician() {
        return assignedTechnician;
    }

    public void setAssignedTechnician(String assignedTechnician) {
        this.assignedTechnician = assignedTechnician;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
}
