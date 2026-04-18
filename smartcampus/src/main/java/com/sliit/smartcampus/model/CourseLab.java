package com.sliit.smartcampus.model;

import jakarta.persistence.*;

/**
 * CourseLab Entity used to represent physical campus constraints,
 * tracking capacities and software suites for laboratory scheduling.
 */
@Entity
@Table(name = "course_labs")
public class CourseLab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String labName;
    private int capacity;
    private String software; // e.g., "MATLAB, Visual Studio, Docker"
    private String location; // e.g., "Level 3, Block A"
    private boolean available;

    public CourseLab() {}

    public CourseLab(String labName, int capacity, String software, String location, boolean available) {
        this.labName = labName;
        this.capacity = capacity;
        this.software = software;
        this.location = location;
        this.available = available;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLabName() { return labName; }
    public void setLabName(String labName) { this.labName = labName; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public String getSoftware() { return software; }
    public void setSoftware(String software) { this.software = software; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
