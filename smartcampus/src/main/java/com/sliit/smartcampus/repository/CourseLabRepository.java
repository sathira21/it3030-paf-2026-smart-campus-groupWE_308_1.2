package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.model.CourseLab;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseLabRepository extends JpaRepository<CourseLab, Long> {
    List<CourseLab> findByLabNameContainingIgnoreCase(String name);
}
