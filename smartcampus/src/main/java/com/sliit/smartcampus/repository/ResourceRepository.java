package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByType(String type);
    List<Resource> findByStatus(String status);
    List<Resource> findByIsPopularTrue();
    
    @org.springframework.data.jpa.repository.Query("SELECT r FROM Resource r WHERE " +
            "LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.type) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.location) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Resource> searchByKeyword(String keyword);
}
