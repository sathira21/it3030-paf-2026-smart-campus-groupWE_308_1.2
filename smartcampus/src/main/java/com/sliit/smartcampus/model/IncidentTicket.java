package com.sliit.smartcampus.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/**
 * Entity representing an Incident Ticket within the Smart Campus Support Hub.
 * Tracks maintenance, IT, or facility issues raised by users.
 */
@Entity
@Table(name = "incident_tickets")
public class IncidentTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;

    @Column(length = 1000)
    private String description;

    private String priority;
    private String preferredContact;
    
    private String status;
    
    @Column(length = 1000)
    private String resolutionNotes;
    private String createdBy;

    private String roomId;
    private String assignedTo; // Email of the technician/admin assigned to the ticket

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ElementCollection
    @CollectionTable(name = "ticket_images", joinColumns = @JoinColumn(name = "ticket_id"))
    @Column(name = "image_url")
    private List<String> imageAttachments = new ArrayList<>();
    
    @OneToMany(mappedBy = "incidentTicket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TicketComment> comments = new ArrayList<>();

    public IncidentTicket() {
    }

    public IncidentTicket(String title, String category, String description, String priority, String preferredContact, String status, String createdBy, String roomId) {
        this.title = title;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.preferredContact = preferredContact;
        this.status = status;
        this.createdBy = createdBy;
        this.roomId = roomId;
    }

    // Helper methods for attachments and comments
    
    public void addImageAttachment(String imageUrl) {
        if (this.imageAttachments.size() >= 3) {
            throw new IllegalStateException("Maximum of 3 image attachments are allowed.");
        }
        this.imageAttachments.add(imageUrl);
    }
    
    public void addComment(TicketComment comment) {
        comments.add(comment);
        comment.setIncidentTicket(this);
    }
    
    public void removeComment(TicketComment comment) {
        comments.remove(comment);
        comment.setIncidentTicket(null);
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public String getPreferredContact() {
        return preferredContact;
    }

    public void setPreferredContact(String preferredContact) {
        this.preferredContact = preferredContact;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public List<String> getImageAttachments() {
        return imageAttachments;
    }

    public void setImageAttachments(List<String> imageAttachments) {
        if (imageAttachments != null && imageAttachments.size() > 3) {
            throw new IllegalArgumentException("Maximum of 3 image attachments are allowed.");
        }
        this.imageAttachments = imageAttachments;
    }

    public List<TicketComment> getComments() {
        return comments;
    }

    public void setComments(List<TicketComment> comments) {
        this.comments = comments;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
