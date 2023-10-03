package com.descope.java_sample_app;
import com.descope.client.*;
import com.descope.exception.DescopeException;
import com.descope.model.jwt.Token;
import com.descope.sdk.auth.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class JavaSampleAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(JavaSampleAppApplication.class, args);
	}

	public void validateSession(String sessionToken) {
		var descopeClient = new DescopeClient(Config.builder().projectId("__ProjectID__").build());

		// Validate the session. Will return an error if expired
		AuthenticationService as = descopeClient.getAuthenticationServices().getAuthService();
		try {
			Token t = as.validateSessionWithToken(sessionToken);
		} catch (DescopeException de) {
			// Handle the unauthorized error
		}
	}

	@GetMapping("/get_secret_message")
	public ResponseEntity<String> getSecretMessage(@RequestParam(value = "sessionToken") String sessionToken) {
		try {
			validateSession(sessionToken);
		} catch (DescopeException e) {
			// If session validation fails, return an unauthorized error response
			return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
		}
		String secretMessage = "Hello! Here is your secret message.";
		return new ResponseEntity<>(secretMessage, HttpStatus.OK);
	}


}







//import org.springframework.web.bind.annotation.GetMapping;
//		import org.springframework.web.bind.annotation.RequestParam;
//	@GetMapping("/hello")
//	public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
//		return String.format("Hello %s", name);
//	}