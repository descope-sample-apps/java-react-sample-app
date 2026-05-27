# Java + React Sample App (Descope)

A minimal full-stack sample showing how to authenticate users with [Descope](https://descope.com), call protected backend APIs with the resulting session JWT, and embed a self-service profile widget.

- **Frontend:** React 18 + Vite with [`@descope/react-sdk`](https://github.com/descope/react-sdk) (`<AuthProvider>`, `<Descope>` flow runner, session hooks, `<UserProfile>` widget)
- **Backend:** Spring Boot 4.0 with [`descope-java`](https://github.com/descope/descope-java) — access-key exchange (M2M) and user-session validation via a `HandlerInterceptor`

## What this sample demonstrates

| Feature | Where |
|---|---|
| Hosted Descope flow rendered in React (`sign-up-or-in`) | `client/src/pages/SignIn.jsx` |
| Auth-aware routing with `useSession` / `useUser` | `client/src/pages/Home.jsx`, `Dashboard.jsx` |
| Tenant-scoped SSO via the same flow (no backend round trip) | `<Descope tenant={...}>` in `SignIn.jsx` |
| `<UserProfile>` self-service widget | `client/src/pages/Dashboard.jsx` |
| Backend M2M auth via Descope access key | `GET /test_backend` |
| Frontend → backend session validation with the user's JWT | `GET /validate_session` (Authorization header) |
| Combined validate + refresh in one call | `GET /validate_and_refresh_session` (Authorization + `X-Refresh-Token`) |
| Cross-cutting auth via Spring `HandlerInterceptor` | `server/.../DescopeAuthInterceptor.java` |
| Manual `aud` claim check (SDK 1.1.0 has no aud overload) | `DescopeAuthInterceptor.preHandle` |

## Prerequisites

| | |
|---|---|
| Java | 17+ (tested with JDK 26) |
| Node | 18+ |
| npm | bundled with Node |
| Maven | bundled via `./mvnw` (no separate install) |
| Descope project | create one at [app.descope.com](https://app.descope.com) |

If `java` is not on your `PATH`, point `JAVA_HOME` at your JDK before running the server (macOS example):

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

Pass a higher major version (`21`, `25`, etc.) if that is what you have installed.

## Descope console setup

A new Descope project comes with sensible defaults; the sample relies on a few things existing:

1. A flow named `sign-up-or-in` (created automatically in new projects).
2. A widget named `user-profile-widget` for the dashboard's `<UserProfile>` embed (also created by default).
3. **Optional, for the `/test_backend` demo:** an access key created at [app.descope.com/accesskeys](https://app.descope.com/accesskeys). Treat it like a server secret.
4. **Optional, for tenant SSO:** a tenant with OIDC or SAML SSO ([app.descope.com/tenants](https://app.descope.com/tenants)) plus an **SSO** step in the `sign-up-or-in` flow.

## Setup

### 1. Server

```bash
cd server
cp .env.sample .env
# edit .env and fill in DESCOPE_PROJECT_ID and (optional) DESCOPE_ACCESS_KEY
./mvnw spring-boot:run
```

The server listens on `http://localhost:8080`. If you start it without `DESCOPE_PROJECT_ID`, the app still boots, but protected endpoints return a config-missing 500 — useful for getting the toolchain working before wiring credentials.

`server/.env` is gitignored. Spring Boot loads it via the `spring.config.import` line in `application.properties`:

```properties
spring.config.import=optional:file:.env[.properties]

descope.project.id=${DESCOPE_PROJECT_ID:}
descope.access.key=${DESCOPE_ACCESS_KEY:}
```

The `optional:` prefix means the app still boots when `.env` is missing. The `[.properties]` extension hint tells Spring to parse the file as Java properties (`KEY=VALUE` lines). Real env vars exported in your shell still win over `.env` values.

### 2. Client

```bash
cd client
npm install
```

Create a `.env` (or `.env.local`) in `client/`:

```env
VITE_DESCOPE_PROJECT_ID=<your-project-id>
```

Run the dev server:

```bash
npm run dev
```

The app opens at `http://localhost:3000`. If you host the client on a different origin, update the allowed origin in `server/.../WebConfig.java`.

## Backend endpoints

All session endpoints expect `Authorization: Bearer <session-jwt>`. The browser-side helper `getSessionToken()` from `@descope/react-sdk` returns the active JWT.

| Endpoint | Method | Headers | SDK call | Notes |
|---|---|---|---|---|
| `/test_backend` | GET | — | `authService.exchangeAccessKey(key)` | Backend-only auth (M2M). The access key never leaves the server. |
| `/validate_session` | GET | `Authorization` | `authService.validateSessionWithToken(jwt)` + manual aud check | Verifies the user's session JWT is signed by Descope and issued for this project. |
| `/validate_and_refresh_session` | GET | `Authorization`, `X-Refresh-Token` | `authService.validateAndRefreshSessionWithTokens(jwt, refresh)` | Same as above but mints a fresh session JWT if the current one is expired and the refresh token is still valid. |

The interceptor short-circuits CORS preflight requests so the browser can issue cross-origin calls with an `Authorization` header.

## Aud claim validation

Descope JWTs include an `aud` claim equal to your project ID. To reject tokens issued for *other* Descope projects, the interceptor compares `token.getProjectId()` against the configured `descope.project.id` and returns 401 on mismatch.

The Descope docs reference a two-argument `validateSessionWithToken(token, aud)` overload, but that overload does **not** exist in the released Java SDK (verified through `java-sdk-1.1.0` and `main`). The manual comparison above produces the same security outcome until the SDK ships its `VerifyOptions` overload.

## Tenant SSO

Tenant SSO is handled entirely inside the Descope flow — no backend endpoints are needed:

1. Configure a tenant in your Descope project and enable SSO (SAML or OIDC) on it.
2. Make sure your `sign-up-or-in` flow contains an **SSO** step.
3. On the home page, enter the tenant ID and click **Sign in via Tenant SSO**. The browser navigates to `/signin?tenant=<id>`, and `<Descope tenant={tenantId}>` runs the SSO flow for that tenant.

The React SDK performs the redirect and token exchange end-to-end.

## `<UserProfile>` widget

The dashboard embeds `<UserProfile widgetId="user-profile-widget">`. Layout, fields, and styling are configured in the Descope console, so visual changes do not require touching this code.

See [Descope widgets docs](https://docs.descope.com/widgets/users).

## Project structure

```
server/
  src/main/java/com/descope/java_sample_app/
    JavaSampleAppApplication.java   # Boot entry + thin controllers + Descope beans
    DescopeAuthInterceptor.java     # Authorization-header validation, aud check
    WebConfig.java                  # CORS + interceptor registration
  src/main/resources/
    application.properties          # ${DESCOPE_PROJECT_ID} / ${DESCOPE_ACCESS_KEY}

client/
  index.html                        # Vite entry
  vite.config.js
  src/
    index.jsx                       # AuthProvider + router
    pages/
      Home.jsx                      # Public landing + tenant SSO entry
      SignIn.jsx                    # <Descope> flow runner
      Dashboard.jsx                 # Protected page + UserProfile widget + API demos
      Layout.jsx                    # Nav
    components/
      TestApiComponent.jsx          # Two cards: access-key exchange + session validation
```

## Testing

Run the backend unit tests:

```bash
cd server && ./mvnw test
```

The default `JavaSampleAppApplicationTests.contextLoads` verifies the Spring context boots with or without `DESCOPE_PROJECT_ID` set — handy for CI.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `500` from `/test_backend` or `/validate_session` with message `DESCOPE_PROJECT_ID is not configured` | Env var unset when the JVM started | Export `DESCOPE_PROJECT_ID` before `./mvnw spring-boot:run` |
| `401 Missing or malformed Authorization header` | Frontend called the endpoint without a session JWT | Sign in first; `getSessionToken()` returns `undefined` until the flow completes |
| `401 Session aud claim mismatch` | The JWT was issued for a different Descope project than the server is configured for | Make sure server `DESCOPE_PROJECT_ID` and client `VITE_DESCOPE_PROJECT_ID` point at the same project |
| Browser console: `blocked by CORS policy: Response to preflight request doesn't pass access control check` | Frontend served from an origin other than `http://localhost:3000` | Update the allowed origin in `WebConfig.java` |
| Vite picks up stale env value after editing `.env` | Vite caches env at dev-server start | Stop and restart `npm run dev` |
| Maven warnings about `sun.misc.Unsafe` / `jansi` on JDK 26 | Maven 3.9.4 reflective access on a newer JVM | Harmless; suppress with `export MAVEN_OPTS="--enable-native-access=ALL-UNNAMED"` |

## License

MIT — see [LICENSE](LICENSE).
