package com.sliit.smartcampus.service;

import com.sliit.smartcampus.model.Notification;
import com.sliit.smartcampus.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    private Notification sampleNotification;

    @BeforeEach
    void setUp() {
        sampleNotification = new Notification();
        sampleNotification.setId(1L);
        sampleNotification.setUserId(100L);
        sampleNotification.setMessage("Your booking is confirmed");
        sampleNotification.setRead(false);
        sampleNotification.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testCreateNotification_Success() {
        when(notificationRepository.save(any(Notification.class))).thenReturn(sampleNotification);

        Notification created = notificationService.createNotification(100L, "Your booking is confirmed");

        assertNotNull(created);
        assertEquals(100L, created.getUserId());
        assertEquals("Your booking is confirmed", created.getMessage());
        assertFalse(created.isRead());
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void testGetNotificationsByUserId() {
        when(notificationRepository.findByUserId(100L))
                .thenReturn(Arrays.asList(sampleNotification));

        List<Notification> notifications = notificationService.getNotificationsByUserId(100L);

        assertFalse(notifications.isEmpty());
        assertEquals(1, notifications.size());
        assertEquals("Your booking is confirmed", notifications.get(0).getMessage());
        verify(notificationRepository, times(1)).findByUserId(100L);
    }

    @Test
    void testMarkAsRead_Success() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(sampleNotification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Notification updated = notificationService.markAsRead(1L);

        assertTrue(updated.isRead());
        verify(notificationRepository, times(1)).findById(1L);
        verify(notificationRepository, times(1)).save(sampleNotification);
    }
}
