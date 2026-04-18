package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.model.CourseLab;
import com.sliit.smartcampus.service.CourseLabService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labs")
public class CourseLabController {

    private final CourseLabService courseLabService;

    @Autowired
    public CourseLabController(CourseLabService courseLabService) {
        this.courseLabService = courseLabService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<CourseLab>> getAllLabs() {
        return ResponseEntity.ok(courseLabService.findAllLabs());
    }

    @GetMapping("/search")
    public ResponseEntity<List<CourseLab>> searchLabs(@RequestParam String q) {
        return ResponseEntity.ok(courseLabService.searchLabs(q));
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseLab> createLab(@RequestBody CourseLab lab) {
        return ResponseEntity.ok(courseLabService.saveLab(lab));
    }
}
