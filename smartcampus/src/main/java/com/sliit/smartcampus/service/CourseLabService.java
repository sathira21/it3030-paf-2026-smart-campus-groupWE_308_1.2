package com.sliit.smartcampus.service;

import com.sliit.smartcampus.model.CourseLab;
import com.sliit.smartcampus.repository.CourseLabRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseLabService {

    private final CourseLabRepository courseLabRepository;

    @Autowired
    public CourseLabService(CourseLabRepository courseLabRepository) {
        this.courseLabRepository = courseLabRepository;
    }

    public List<CourseLab> findAllLabs() {
        return courseLabRepository.findAll();
    }

    public List<CourseLab> searchLabs(String name) {
        return courseLabRepository.findByLabNameContainingIgnoreCase(name);
    }

    public CourseLab saveLab(CourseLab lab) {
        return courseLabRepository.save(lab);
    }
}
