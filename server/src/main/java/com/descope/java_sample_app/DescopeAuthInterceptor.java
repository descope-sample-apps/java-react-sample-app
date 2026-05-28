package com.descope.java_sample_app;

import com.descope.exception.DescopeException;
import com.descope.model.jwt.Token;
import com.descope.sdk.auth.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class DescopeAuthInterceptor implements HandlerInterceptor {

	public static final String TOKEN_ATTR = "descopeToken";

	private static final Logger log = LoggerFactory.getLogger(DescopeAuthInterceptor.class);

	private final ObjectProvider<AuthenticationService> authServiceProvider;
	private final String expectedProjectId;

	public DescopeAuthInterceptor(ObjectProvider<AuthenticationService> authServiceProvider,
			@Value("${descope.project.id:}") String expectedProjectId) {
		this.authServiceProvider = authServiceProvider;
		this.expectedProjectId = expectedProjectId;
	}

	@Override
	public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws IOException {
		// Preflight OPTIONS requests carry no Authorization header by design; blocking them
		// would fail CORS and the browser would never send the real request.
		if (CorsUtils.isPreFlightRequest(req)) {
			return true;
		}
		AuthenticationService authService = authServiceProvider.getIfAvailable();
		if (authService == null) {
			return writeError(res, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"DESCOPE_PROJECT_ID is not configured on the server");
		}

		String authHeader = req.getHeader("Authorization");
		if (authHeader == null || !authHeader.regionMatches(true, 0, "Bearer ", 0, 7)) {
			return writeError(res, HttpServletResponse.SC_UNAUTHORIZED,
					"Missing or malformed Authorization header (expected: Bearer <session-token>)");
		}

		String sessionToken = authHeader.substring(7).trim();
		String refreshToken = req.getHeader("X-Refresh-Token");

		try {
			Token token = (refreshToken != null && !refreshToken.isBlank())
					? authService.validateAndRefreshSessionWithTokens(sessionToken, refreshToken)
					: authService.validateSessionWithToken(sessionToken);

			// Java SDK 1.1.0 does not expose an aud-claim overload on validateSessionWithToken,
			// so reject cross-project tokens manually by comparing the issuing project ID.
			if (!expectedProjectId.equals(token.getProjectId())) {
				return writeError(res, HttpServletResponse.SC_UNAUTHORIZED,
						"Session aud claim mismatch (expected projectId " + expectedProjectId + ")");
			}

			req.setAttribute(TOKEN_ATTR, token);
			return true;
		} catch (DescopeException e) {
			log.debug("Session validation failed", e);
			return writeError(res, HttpServletResponse.SC_UNAUTHORIZED, "Invalid session");
		}
	}

	private boolean writeError(HttpServletResponse res, int status, String message) throws IOException {
		res.setStatus(status);
		res.setContentType("application/json");
		res.getWriter().write("{\"status\":\"error\",\"message\":\"" + escapeJson(message) + "\"}");
		return false;
	}

	private static String escapeJson(String s) {
		StringBuilder sb = new StringBuilder(s.length() + 16);
		for (int i = 0; i < s.length(); i++) {
			char c = s.charAt(i);
			switch (c) {
				case '"':  sb.append("\\\""); break;
				case '\\': sb.append("\\\\"); break;
				case '\b': sb.append("\\b"); break;
				case '\f': sb.append("\\f"); break;
				case '\n': sb.append("\\n"); break;
				case '\r': sb.append("\\r"); break;
				case '\t': sb.append("\\t"); break;
				default:
					if (c < 0x20) {
						sb.append(String.format("\\u%04x", (int) c));
					} else {
						sb.append(c);
					}
			}
		}
		return sb.toString();
	}
}
