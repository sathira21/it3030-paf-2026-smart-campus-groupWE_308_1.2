package com.sliit.smartcampus.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
<<<<<<< Updated upstream
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
=======
        registry.addMapping("/**")
<<<<<<< HEAD
                .allowedOrigins("http://localhost:3000")
=======
                .allowedOriginPatterns("http://localhost:[*]")
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
>>>>>>> Stashed changes
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
