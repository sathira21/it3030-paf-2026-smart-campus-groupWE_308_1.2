package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.model.IncidentTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, Long> {

    List<IncidentTicket> findByCreatedBy(String email);

    List<IncidentTicket> findByStatus(String status);

    long countByStatus(String status);

    List<IncidentTicket> findByCreatedByAndStatus(String email, String status);
}