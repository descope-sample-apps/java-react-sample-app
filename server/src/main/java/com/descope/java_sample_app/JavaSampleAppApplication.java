package com.descope.java_sample_app;

import com.descope.client.Config;
import com.descope.client.DescopeClient;
import com.descope.exception.DescopeException;
import com.descope.model.jwt.Token;
import com.descope.sdk.auth.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class JavaSampleAppApplication {

	private final String accessKey;
	private final ObjectProvider<AuthenticationService> authServiceProvider;

	public JavaSampleAppApplication(@Value("${descope.access.key:}") String accessKey,
			ObjectProvider<AuthenticationService> authServiceProvider) {
		this.accessKey = accessKey;
		this.authServiceProvider = authServiceProvider;
	}

	public static void main(String[] args) {
		SpringApplication.run(JavaSampleAppApplication.class, args);
	}

	// SDK 1.1.0 throws ClientSetupException on an empty project ID, so the bean is skipped
	// when the env var is unset. Endpoints then return a config-missing error instead of
	// crashing the app at startup — useful for a sample that may be cloned and run cold.
	@Bean
	@ConditionalOnExpression("'${descope.project.id:}'.trim() != ''")
	public DescopeClient descopeClient(@Value("${descope.project.id}") String projectId) {
		return new DescopeClient(Config.builder().projectId(projectId).build());
	}

	@Bean
	@ConditionalOnBean(DescopeClient.class)
	public AuthenticationService authenticationService(DescopeClient descopeClient) {
		return descopeClient.getAuthenticationServices().getAuthService();
	}

	@GetMapping("/test_backend")
	public ResponseEntity<?> testBackend() {
		AuthenticationService authService = authServiceProvider.getIfAvailable();
		if (authService == null) {
			return errorBody(HttpStatus.INTERNAL_SERVER_ERROR, "DESCOPE_PROJECT_ID is not configured on the server");
		}
		if (accessKey == null || accessKey.isBlank()) {
			return errorBody(HttpStatus.INTERNAL_SERVER_ERROR, "DESCOPE_ACCESS_KEY is not configured on the server");
		}
		try {
			Token token = authService.exchangeAccessKey(accessKey);
			return ResponseEntity.ok(tokenPayload(token, "Backend authenticated to Descope via access key"));
		} catch (DescopeException e) {
			return errorBody(HttpStatus.UNAUTHORIZED, "Access key exchange failed: " + e.getMessage());
		}
	}

	@GetMapping("/validate_session")
	public ResponseEntity<?> validateSession(HttpServletRequest req) {
		Token token = (Token) req.getAttribute(DescopeAuthInterceptor.TOKEN_ATTR);
		return ResponseEntity.ok(tokenPayload(token, "Session token validated"));
	}

	@GetMapping("/validate_and_refresh_session")
	public ResponseEntity<?> validateAndRefreshSession(HttpServletRequest req) {
		Token token = (Token) req.getAttribute(DescopeAuthInterceptor.TOKEN_ATTR);
		return ResponseEntity.ok(tokenPayload(token, "Session validated; refreshed if expired"));
	}

	private static ResponseEntity<?> errorBody(HttpStatus status, String message) {
		return ResponseEntity.status(status).body(Map.of("status", "error", "message", message));
	}

	private static Map<String, Object> tokenPayload(Token token, String message) {
		Map<String, Object> payload = new HashMap<>();
		payload.put("status", "ok");
		payload.put("message", message);
		payload.put("projectId", token.getProjectId());
		payload.put("subjectId", token.getId());
		payload.put("expiration", token.getExpiration());
		return payload;
	}
}
