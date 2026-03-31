package com.sliit.smartcampus.dto;

import com.sliit.smartcampus.model.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class IncidentTicketRequest {

    @NotBlank(message = "Title is mandatory")
    private String title;
    
    @NotBlank(message = "Category is mandatory")
    private String category;

    @NotBlank(message = "Description is mandatory")
    private String description;
    
    private String priority;
    
    private String preferredContact;
    
    private TicketStatus status = TicketStatus.OPEN;
    
    private String createdBy;
    
    private String roomId;
    
    private List<String> imageAttachments;

    public IncidentTicketRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getPreferredContact() {
        return preferredContact;
    }

    public void setPreferredContact(String preferredContact) {
        this.preferredContact = preferredContact;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public List<String> getImageAttachments() {
        return imageAttachments;
    }

    public void setImageAttachments(List<String> imageAttachments) {
        this.imageAttachments = imageAttachments;
    }
}
