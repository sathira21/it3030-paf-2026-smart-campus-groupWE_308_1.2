package com.sliit.smartcampus.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket createNewBucket() {
        // Limit: 5 failed attempts per 15 minutes
        Bandwidth limit = Bandwidth.builder()
                .capacity(5)
                .refillIntervally(5, Duration.ofMinutes(15))
                .build();
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    public Bucket resolveBucket(String ipAddress) {
        return buckets.computeIfAbsent(ipAddress, key -> createNewBucket());
    }

    public boolean tryConsume(String ipAddress) {
        return resolveBucket(ipAddress).tryConsume(1);
    }
    
    public long getAvailableTokens(String ipAddress) {
        return resolveBucket(ipAddress).getAvailableTokens();
    }
}
