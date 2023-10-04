package com.descope.java_sample_app;
import com.descope.client.*;
import com.descope.exception.DescopeException;
import com.descope.model.jwt.Token;
import com.descope.sdk.auth.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class JavaSampleAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(JavaSampleAppApplication.class, args);
	}
	@Value("${descope.project.id}")
	private String descopeProjectId;

	public void validateSession(String sessionToken) throws DescopeException {
		var descopeClient = new DescopeClient(Config.builder().projectId(descopeProjectId).build());
		AuthenticationService as = descopeClient.getAuthenticationServices().getAuthService();
		Token t = as.validateSessionWithToken(sessionToken);
	}

	@GetMapping("/get_secret_message")
	public ResponseEntity<String> getSecretMessage(HttpServletRequest request) {
		try {
			// Extract the Authorization header from the request
			String authorizationHeader = request.getHeader("Authorization");

			if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
				// Extract and validate the token
				String sessionToken = authorizationHeader.substring(7); // Remove "Bearer " prefix

				validateSession(sessionToken);

				String secretMessage = "Hello! Here is your secret message.";
				String jsonResponse = "{\"message\": \"" + secretMessage + "\"}";

				return ResponseEntity.ok()
						.contentType(org.springframework.http.MediaType.APPLICATION_JSON)
						.body(jsonResponse);

			} else {
				// Handle the case where the Authorization header is missing or invalid
				String errorMessage = "Invalid or missing session token";
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"" + errorMessage + "\"}");
			}

		} catch (DescopeException e) {
			// If session validation fails, return an unauthorized error response
			return new ResponseEntity<>("Error getting authorization header", HttpStatus.UNAUTHORIZED);
		}
	}
}