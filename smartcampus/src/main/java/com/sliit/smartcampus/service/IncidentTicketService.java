package com.sliit.smartcampus.service;

import com.sliit.smartcampus.dto.IncidentTicketRequest;
import com.sliit.smartcampus.model.IncidentTicket;
import com.sliit.smartcampus.model.TicketComment;
import com.sliit.smartcampus.repository.IncidentTicketRepository;
import com.sliit.smartcampus.repository.TicketCommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sliit.smartcampus.model.TicketStatus;
import com.sliit.smartcampus.exception.TicketNotFoundException;
import com.sliit.smartcampus.exception.InvalidTicketStateException;
import com.sliit.smartcampus.exception.CommentNotFoundException;
import com.sliit.smartcampus.exception.CommentOwnershipException;
import java.util.List;

@Service
@Transactional
public class IncidentTicketService {

    private final IncidentTicketRepository repository;
    private final TicketCommentRepository ticketCommentRepository;

    @Autowired
    public IncidentTicketService(IncidentTicketRepository repository, TicketCommentRepository ticketCommentRepository) {
        this.repository = repository;
        this.ticketCommentRepository = ticketCommentRepository;
    }

    public IncidentTicket createTicket(IncidentTicketRequest request) {
        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(request.getTitle());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContact(request.getPreferredContact());
        ticket.setStatus(request.getStatus());
        ticket.setCreatedBy(request.getCreatedBy());
        ticket.setRoomId(request.getRoomId());
        
        if (request.getImageAttachments() != null) {
            request.getImageAttachments().forEach(ticket::addImageAttachment);
        }

        return repository.save(ticket);
    }

    @Transactional(readOnly = true)
    public List<IncidentTicket> getAllTickets() {
        return repository.findAll();
    }

    public IncidentTicket updateTicketStatus(Long id, TicketStatus newStatus) {
        IncidentTicket ticket = repository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + id));

        if (ticket.getStatus() == TicketStatus.OPEN && newStatus == TicketStatus.CLOSED) {
            throw new InvalidTicketStateException("Ticket cannot be moved to 'CLOSED' directly from 'OPEN'");
        }

        ticket.setStatus(newStatus);
        return repository.save(ticket);
    }

    public IncidentTicket assignTechnician(Long id, String technician, String notes) {
        IncidentTicket ticket = repository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + id));

        ticket.setAssignedTechnician(technician);
        if (notes != null) {
            ticket.setResolutionNotes(notes);
        }
        
        return repository.save(ticket);
    }

    public TicketComment addComment(Long ticketId, String author, String commentText) {
        IncidentTicket ticket = repository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + ticketId));

        TicketComment comment = new TicketComment(commentText, author, ticket);
        ticket.addComment(comment);
        return ticketCommentRepository.save(comment);
    }

    public void deleteComment(Long ticketId, Long commentId, String userEmail) {
        IncidentTicket ticket = repository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + ticketId));

        TicketComment comment = ticketCommentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getIncidentTicket().getId().equals(ticket.getId())) {
            throw new CommentNotFoundException("Comment not found for this ticket: " + ticketId);
        }

        if (!comment.getAuthor().equals(userEmail)) {
            throw new CommentOwnershipException("You do not have permission to delete this comment");
        }

        ticket.removeComment(comment);
        ticketCommentRepository.delete(comment);
    }
}
