package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.model.TicketComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {
    List<TicketComment> findByIncidentTicketId(Long incidentTicketId);
}
