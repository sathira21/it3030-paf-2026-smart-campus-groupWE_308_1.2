package com.sliit.smartcampus.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class AuthRateLimitingTest {

    private RateLimitingService rateLimitingService;
    private final String testIp = "127.0.0.1";

    @BeforeEach
    void setUp() {
        rateLimitingService = new RateLimitingService();
    }

    @Test
    void testRateLimitTriggersOnSixthAttempt() {
        // First 5 attempts should succeed (tokens consumed)
        for (int i = 1; i <= 5; i++) {
            assertTrue(rateLimitingService.tryConsume(testIp), "Attempt " + i + " should succeed");
        }

        // 6th attempt should fail
        assertFalse(rateLimitingService.tryConsume(testIp), "6th attempt should be rate limited");
    }
}
