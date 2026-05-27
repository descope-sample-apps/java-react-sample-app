package com.descope.java_sample_app;

import com.descope.client.*;
import com.descope.exception.DescopeException;
import com.descope.model.jwt.Token;
import com.descope.sdk.auth.AuthenticationService;

import jakarta.annotation.PostConstruct;

import java.util.HashMap;
import java.util.Map;

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

	@Value("${descope.project.id}")
	private String descopeProjectId;

	@Value("${descope.access.key:}")
	private String descopeAccessKey;

	private DescopeClient descopeClient;

	public static void main(String[] args) {
		SpringApplication.run(JavaSampleAppApplication.class, args);
	}

	@PostConstruct
	public void init() {
		descopeClient = new DescopeClient(Config.builder().projectId(descopeProjectId).build());
	}

	@GetMapping("/test_backend")
	public ResponseEntity<?> testBackend() {
		if (descopeAccessKey == null || descopeAccessKey.isBlank()) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of(
							"status", "error",
							"message", "DESCOPE_ACCESS_KEY is not configured on the server"));
		}

		try {
			AuthenticationService authService = descopeClient.getAuthenticationServices().getAuthService();
			Token token = authService.exchangeAccessKey(descopeAccessKey);

			Map<String, Object> payload = new HashMap<>();
			payload.put("status", "ok");
			payload.put("message", "Backend authenticated to Descope via access key");
			payload.put("projectId", token.getProjectId());
			payload.put("expiration", token.getExpiration());
			payload.put("subjectId", token.getId());
			return ResponseEntity.ok(payload);
		} catch (DescopeException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of(
							"status", "error",
							"message", "Access key exchange failed: " + e.getMessage()));
		}
	}
}
