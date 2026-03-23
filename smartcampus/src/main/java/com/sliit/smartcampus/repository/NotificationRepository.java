package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
