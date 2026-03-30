package com.sliit.smartcampus.service;

import com.sliit.smartcampus.model.IncidentTicket;
import com.sliit.smartcampus.repository.IncidentTicketRepository;
import com.sliit.smartcampus.repository.UserRepository;
import com.sliit.smartcampus.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class IncidentTicketService {

    private final IncidentTicketRepository incidentTicketRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Autowired
    public IncidentTicketService(IncidentTicketRepository incidentTicketRepository,
                                 NotificationService notificationService,
                                 UserRepository userRepository) {
        this.incidentTicketRepository = incidentTicketRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public IncidentTicket createTicket(IncidentTicket ticket) {
        if (ticket.getStatus() == null) {
            ticket.setStatus("OPEN");
        }
        return incidentTicketRepository.save(ticket);
    }

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
        Optional<IncidentTicket> ticketOpt = incidentTicketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            IncidentTicket ticket = ticketOpt.get();
            String oldStatus = ticket.getStatus();
            ticket.setStatus(newStatus.toUpperCase());
            IncidentTicket updatedTicket = incidentTicketRepository.save(ticket);

            // Automatically notify the student of the status change
            if (!newStatus.equalsIgnoreCase(oldStatus)) {
                notifyUserOfStatusChange(updatedTicket);
            }

            return updatedTicket;
        }
        throw new RuntimeException("Ticket not found with id: " + id);
    }

    public void deleteTicket(Long id) {
        if (!incidentTicketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found with id: " + id);
        }
        incidentTicketRepository.deleteById(id);
    }

    public IncidentTicket updateAssignment(Long id, String assignedTo) {
        Optional<IncidentTicket> ticketOpt = incidentTicketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            IncidentTicket ticket = ticketOpt.get();
            ticket.setAssignedTo(assignedTo);
            return incidentTicketRepository.save(ticket);
        }
        throw new RuntimeException("Ticket not found with id: "+ id);
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
}
