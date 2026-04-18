package com.sliit.smartcampus.security;

import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

<<<<<<< Updated upstream
=======
/**
 * Unit test for the CustomOAuth2UserService class.
<<<<<<< HEAD
 * Validates the OAuth flow ensures correct role assignment based on domain/email.
=======
 * Validates the OAuth flow ensures correct role assignment based on
 * domain/email.
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
 */
>>>>>>> Stashed changes
@ExtendWith(MockitoExtension.class)
class CustomOAuth2UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private CustomOAuth2UserService customOAuth2UserService;

    @BeforeEach
    void setUp() {
<<<<<<< HEAD
        customOAuth2UserService = Mockito.spy(new CustomOAuth2UserService(userRepository));
=======
        customOAuth2UserService = Mockito.spy(new CustomOAuth2UserService(userRepository, "test-secret"));
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    }

    @Test
    void testLoadUser_NewAdminUser() throws Exception {
        // Arrange
        String adminEmail = "jane.doe@admin.smartcampus.com";
        OAuth2UserRequest mockRequest = mock(OAuth2UserRequest.class);
<<<<<<< HEAD
        
=======

>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("email", adminEmail);
        attributes.put("name", "Admin User");
        OAuth2User defaultUser = new DefaultOAuth2User(
                Collections.singleton(new OAuth2UserAuthority(attributes)), attributes, "email");
<<<<<<< HEAD
        
        doReturn(defaultUser).when((org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService) customOAuth2UserService).loadUser(any(OAuth2UserRequest.class));
=======

        doReturn(defaultUser).when(
                (org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService) customOAuth2UserService)
                .loadUser(any(OAuth2UserRequest.class));
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092

        when(userRepository.findByEmail(adminEmail)).thenReturn(Optional.empty());

        User savedUser = new User();
        savedUser.setId(10L);
        savedUser.setEmail(adminEmail);
        savedUser.setRole("ADMIN");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        OAuth2User resultUser = customOAuth2UserService.loadUser(mockRequest);

        // Assert
        assertTrue(resultUser instanceof CustomOAuth2User);
        CustomOAuth2User customOut = (CustomOAuth2User) resultUser;
        assertEquals(adminEmail, customOut.getEmail());
<<<<<<< HEAD
        
        Collection<? extends GrantedAuthority> authorities = customOut.getAuthorities();
        assertTrue(authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        
=======

        Collection<? extends GrantedAuthority> authorities = customOut.getAuthorities();
        assertTrue(authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));

>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
        verify(userRepository, times(1)).save(any(User.class));
    }
}
