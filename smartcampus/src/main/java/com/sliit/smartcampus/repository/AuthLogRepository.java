package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.model.AuthLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuthLogRepository extends JpaRepository<AuthLog, UUID> {
}
