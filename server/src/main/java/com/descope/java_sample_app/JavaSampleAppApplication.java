package com.descope.java_sample_app;

import com.descope.client.*;
import com.descope.client.Config.ConfigBuilder;
import com.descope.exception.DescopeException;
import com.descope.model.auth.AuthenticationInfo;
import com.descope.model.jwt.Token;
import com.descope.model.magiclink.LoginOptions;
import com.descope.model.sso.SSOOIDCSettings;
import com.descope.model.sso.SSOTenantSettingsResponse;
import com.descope.sdk.auth.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

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

	@Value("${descope.management.key}")
	private String descopeManagementKey;

	DescopeClient descopeClient = new DescopeClient(
			Config.builder().projectId(descopeProjectId).managementKey(descopeManagementKey).build());

	public void validateSession(String sessionToken) throws DescopeException {
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

	public void configureOIDCSettings(String tenantId, SSOOIDCSettings ssoOIDCSettings, List<String> domains)
			throws DescopeException {
		descopeClient.getManagementServices().getSsoService().configureOIDCSettings(tenantId, ssoOIDCSettings, domains);
	}

	public void loadSettings(String tenantId) throws DescopeException {
		SSOTenantSettingsResponse res = descopeClient.getManagementServices().getSsoService().loadSettings(tenantId);
	}

	public void deleteOIDCSettings(String tenantId) throws DescopeException {
		descopeClient.getManagementServices().getSsoService().deleteSettings(tenantId);
	}

	public void startSSO(String tenantId, String redirectUrl, String prompt, LoginOptions loginOptions)
			throws DescopeException {
		descopeClient.getAuthenticationServices().getSsoServiceProvider().start(tenantId, redirectUrl, prompt,
				loginOptions);
	}

	public void exchangeToken(String code) throws DescopeException {
		AuthenticationInfo ai = descopeClient.getAuthenticationServices().getSsoServiceProvider().exchangeToken(code);
	}

}