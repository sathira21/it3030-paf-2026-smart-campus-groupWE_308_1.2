package com.sliit.smartcampus.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resourceName; // e.g., "Main Computer Lab", "Study Room A"
    private String userEmail;
    private String startTime;    // Simplification for student selection
    private String endTime;
    private String status;       // PENDING, APPROVED, CANCELLED

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Booking() {}

    public Booking(String resourceName, String userEmail, String startTime, String endTime, String status) {
        this.resourceName = resourceName;
        this.userEmail = userEmail;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
