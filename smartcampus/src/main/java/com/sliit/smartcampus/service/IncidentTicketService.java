package com.sliit.smartcampus.service;

import com.sliit.smartcampus.dto.IncidentTicketRequest;
<<<<<<< HEAD
import com.sliit.smartcampus.exception.InvalidTicketStateException;
import com.sliit.smartcampus.exception.TicketNotFoundException;
import com.sliit.smartcampus.model.IncidentTicket;
import com.sliit.smartcampus.model.TicketComment;
import com.sliit.smartcampus.repository.IncidentTicketRepository;
import com.sliit.smartcampus.repository.TicketCommentRepository;
import com.sliit.smartcampus.repository.UserRepository;
import com.sliit.smartcampus.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sliit.smartcampus.model.TicketStatus;
import com.sliit.smartcampus.exception.TicketNotFoundException;
import com.sliit.smartcampus.exception.InvalidTicketStateException;
=======
import com.sliit.smartcampus.dto.NotificationPayload;
import com.sliit.smartcampus.model.IncidentTicket;
import com.sliit.smartcampus.model.TicketComment;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.repository.IncidentTicketRepository;
import com.sliit.smartcampus.repository.TicketCommentRepository;
import com.sliit.smartcampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sliit.smartcampus.exception.TicketNotFoundException;
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
import com.sliit.smartcampus.exception.CommentNotFoundException;
import com.sliit.smartcampus.exception.CommentOwnershipException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
<<<<<<< HEAD
public class IncidentTicketService {

    private final IncidentTicketRepository incidentTicketRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final FileStorageService fileStorageService;
=======
@Transactional
public class IncidentTicketService {

    private final IncidentTicketRepository incidentTicketRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092

    @Autowired
    public IncidentTicketService(IncidentTicketRepository incidentTicketRepository,
                                 NotificationService notificationService,
                                 UserRepository userRepository,
                                 TicketCommentRepository ticketCommentRepository,
<<<<<<< HEAD
                                 FileStorageService fileStorageService) {
=======
                                 FileStorageService fileStorageService,
                                 SimpMessagingTemplate messagingTemplate) {
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
        this.incidentTicketRepository = incidentTicketRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.ticketCommentRepository = ticketCommentRepository;
        this.fileStorageService = fileStorageService;
<<<<<<< HEAD
    }

    public IncidentTicket createTicket(IncidentTicket ticket) {
        if (ticket.getStatus() == null) {
            ticket.setStatus("OPEN");
        }
        return incidentTicketRepository.save(ticket);
    }

    public IncidentTicket createTicketFromRequest(IncidentTicketRequest request) {
=======
        this.messagingTemplate = messagingTemplate;
    }

    public IncidentTicket createTicket(IncidentTicketRequest request) {
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(request.getTitle());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContact(request.getPreferredContact());
<<<<<<< HEAD
        if (request.getStatus() != null) {
            ticket.setStatus(request.getStatus().name());
        } else {
            ticket.setStatus("OPEN");
        }
        ticket.setCreatedBy(request.getCreatedBy());
        ticket.setRoomId(request.getRoomId());

=======
        ticket.setStatus(request.getStatus() != null ? request.getStatus().toString() : "OPEN");
        ticket.setCreatedBy(request.getCreatedBy());
        ticket.setRoomId(request.getRoomId());
        
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
        if (request.getImageAttachments() != null) {
            request.getImageAttachments().forEach(ticket::addImageAttachment);
        }

<<<<<<< HEAD
        return incidentTicketRepository.save(ticket);
    }

=======
        IncidentTicket savedTicket = incidentTicketRepository.save(ticket);
        notifyAdminsOfNewTicket(savedTicket);
        return savedTicket;
    }

    private void notifyAdminsOfNewTicket(IncidentTicket ticket) {
        List<User> admins = userRepository.findAllByRole("ADMIN");
        String message = "New ticket #" + ticket.getId() + " submitted by " + ticket.getCreatedBy() + ".";
        String title = "New Incident Reported";

        for (User admin : admins) {
            notificationService.createNotification(admin.getId(), message);
        }

        NotificationPayload payload = new NotificationPayload("INCIDENT_CREATED", title, message, "ADMIN");
        messagingTemplate.convertAndSend("/topic/public", payload);
    }

    @Transactional(readOnly = true)
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    public List<IncidentTicket> getAllTickets() {
        return incidentTicketRepository.findAll();
    }

    public List<IncidentTicket> getAllTicketsByStatus(String status) {
        if (status == null || status.isBlank() || status.equalsIgnoreCase("ALL")) {
            return incidentTicketRepository.findAll();
        }
        return incidentTicketRepository.findByStatus(status.toUpperCase());
    }

    public List<IncidentTicket> getTicketsByCreator(String email) {
        return incidentTicketRepository.findByCreatedBy(email);
    }

    public Optional<IncidentTicket> getTicketById(Long id) {
        return incidentTicketRepository.findById(id);
    }

    public IncidentTicket updateStatus(Long id, String newStatus) {
<<<<<<< HEAD
        Optional<IncidentTicket> ticketOpt = incidentTicketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            IncidentTicket ticket = ticketOpt.get();
            String oldStatus = ticket.getStatus();
            
            if ("OPEN".equalsIgnoreCase(oldStatus) && "CLOSED".equalsIgnoreCase(newStatus)) {
                throw new InvalidTicketStateException("Ticket cannot be moved to 'CLOSED' directly from 'OPEN'");
            }
            
            ticket.setStatus(newStatus.toUpperCase());
            IncidentTicket updatedTicket = incidentTicketRepository.save(ticket);

            // Automatically notify the student of the status change
            if (!newStatus.equalsIgnoreCase(oldStatus)) {
                notifyUserOfStatusChange(updatedTicket);
            }

            return updatedTicket;
        }
        throw new TicketNotFoundException("Ticket not found with id: " + id);
=======
        IncidentTicket ticket = incidentTicketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + id));
        String oldStatus = ticket.getStatus();
        ticket.setStatus(newStatus.toUpperCase());
        IncidentTicket updatedTicket = incidentTicketRepository.save(ticket);

        // Automatically notify the student of the status change
        if (!newStatus.equalsIgnoreCase(oldStatus)) {
            notifyUserOfStatusChange(updatedTicket);
        }

        return updatedTicket;
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    }

    public void deleteTicket(Long id) {
        if (!incidentTicketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found with id: " + id);
        }
        incidentTicketRepository.deleteById(id);
    }

<<<<<<< HEAD
    public IncidentTicket updateAssignment(Long id, String assignedTo, String notes) {
=======
    public IncidentTicket updateAssignment(Long id, String assignedTo) {
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
        Optional<IncidentTicket> ticketOpt = incidentTicketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            IncidentTicket ticket = ticketOpt.get();
            ticket.setAssignedTo(assignedTo);
<<<<<<< HEAD
            if (notes != null) {
                ticket.setResolutionNotes(notes);
            }
            return incidentTicketRepository.save(ticket);
        }
        throw new TicketNotFoundException("Ticket not found with id: " + id);
=======
            return incidentTicketRepository.save(ticket);
        }
        throw new RuntimeException("Ticket not found with id: "+ id);
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    }

    /**
     * Returns aggregated ticket counts by status for the admin dashboard charts.
     */
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("OPEN",        incidentTicketRepository.countByStatus("OPEN"));
        stats.put("IN_PROGRESS", incidentTicketRepository.countByStatus("IN_PROGRESS"));
        stats.put("RESOLVED",    incidentTicketRepository.countByStatus("RESOLVED"));
        stats.put("TOTAL",       incidentTicketRepository.count());
        return stats;
    }

    public IncidentTicket uploadEvidence(Long ticketId, MultipartFile[] files) {
        IncidentTicket ticket = incidentTicketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + ticketId));

        List<String> filePaths = fileStorageService.storeFiles(files);
        filePaths.forEach(ticket::addImageAttachment);

        return incidentTicketRepository.save(ticket);
    }

    private void notifyUserOfStatusChange(IncidentTicket ticket) {
        Optional<User> userOpt = userRepository.findByEmail(ticket.getCreatedBy());
        if (userOpt.isPresent()) {
            String statusLabel = switch (ticket.getStatus()) {
                case "IN_PROGRESS" -> "is now being worked on 🔧";
                case "RESOLVED"    -> "has been resolved ✅";
                default            -> "has been updated to " + ticket.getStatus();
            };
            String message = "Ticket #" + ticket.getId() + " \"" + ticket.getTitle() + "\" " + statusLabel;
            notificationService.createNotification(userOpt.get().getId(), message);
        }
    }

    public TicketComment addComment(Long ticketId, String author, String commentText) {
        IncidentTicket ticket = incidentTicketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + ticketId));

        TicketComment comment = new TicketComment(commentText, author, ticket);
        ticket.addComment(comment);
        return ticketCommentRepository.save(comment);
    }

    public void deleteComment(Long ticketId, Long commentId, String userEmail) {
        IncidentTicket ticket = incidentTicketRepository.findById(ticketId)
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
