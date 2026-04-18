# Smart Campus Backend

## Leader Contribution Summary
This backend contains the architecture and security functionality for the Smart Campus project, including:

- Google OAuth2 sign-in using Spring Security
- role-based access control for `ADMIN`, `STUDENT`, and other users
- JWT issuance and validation for API protection
- real-time notification support using WebSocket/STOMP
- a GitHub Actions CI workflow for automated build and verification
- secure secret handling using `secrets.properties` and environment variables

## What is included

### Authentication & Authorization
- `smartcampus/src/main/java/com/sliit/smartcampus/config/SecurityConfig.java`
  - enables OAuth2 login
  - configures route authorization
  - integrates custom OAuth2 user service and success handler
  - adds JWT authentication filter

- `smartcampus/src/main/java/com/sliit/smartcampus/security/CustomOAuth2UserService.java`
  - loads Google user info
  - creates or updates local user records
  - assigns roles securely based on email / whitelist criteria

- `smartcampus/src/main/java/com/sliit/smartcampus/config/UserDataInitializer.java`
  - bootstraps admin/student users for initial testing

### Notifications
- `smartcampus/src/main/java/com/sliit/smartcampus/controller/NotificationController.java`
  - REST endpoints for fetching and marking notifications

- `smartcampus/src/main/java/com/sliit/smartcampus/controller/WebSocketNotificationController.java`
  - STOMP WebSocket handling for real-time broadcasts
  - internal `/api/ws/broadcast` endpoint for service-triggered events

### CI/CD
- GitHub Actions workflow: `.github/workflows/build.yml`
  - checks out code
  - sets up Java 17
  - caches Maven dependencies
  - runs `mvn -B clean verify`

## How to verify locally

1. Copy `secrets.properties.example` to `secrets.properties`
2. Fill in all real secret values locally
3. Run the backend in the `smartcampus` folder:
   ```bash
   ./mvnw -B clean verify
   ```
4. Confirm the application starts on `http://localhost:8081`
5. Use the frontend with `http://localhost:3000` and verify Google login + protected pages
6. Trigger a notification event and confirm the frontend receives it via WebSocket

## Secret handling

- `secrets.properties` is ignored by Git by design
- local placeholder: `secrets.properties.example`
- production or CI should use environment variables for sensitive values, such as:
  - `spring.security.oauth2.client.registration.google.client-secret`
  - `spring.mail.password`

## CI Workflow details

The current GitHub Actions job is located at `smartcampus/.github/workflows/build.yml` and executes a full Maven verification build. This provides continuous validation of backend code, dependency resolution, and test execution.

## Important paths

- Security configuration: `src/main/java/com/sliit/smartcampus/config/SecurityConfig.java`
- OAuth user service: `src/main/java/com/sliit/smartcampus/security/CustomOAuth2UserService.java`
- Notification controllers: `src/main/java/com/sliit/smartcampus/controller/NotificationController.java`
- WebSocket notifications: `src/main/java/com/sliit/smartcampus/controller/WebSocketNotificationController.java`

## Next improvement ideas

- Add README badges for GitHub Actions status
- Add a frontend build/test workflow for full-stack CI
- Add explicit role-based API documentation for student/admin endpoints
