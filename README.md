# Java + React Sample App (Descope)

A minimal full-stack sample showing how to authenticate users with [Descope](https://descope.com), call a protected backend API with the resulting session token, and embed a self-service profile widget.

- **Frontend:** React 18 with [`@descope/react-sdk`](https://github.com/descope/react-sdk) (Auth Provider, `<Descope>` flow runner, session hooks, `<UserProfile>` widget)
- **Backend:** Spring Boot 3.5 with [`descope-java`](https://github.com/descope/descope-java) (session validation + automatic token refresh)

## What this sample demonstrates

| Feature | Where |
|---|---|
| Hosted Descope flow rendered in React (`sign-up-or-in`) | `client/src/pages/SignIn.js` |
| Auth-aware routing with `useSession` / `useUser` | `client/src/pages/Home.js`, `Dashboard.js` |
| Tenant-scoped SSO via the same flow (no backend round trip) | `<Descope tenant={...}>` in `SignIn.js` |
| `<UserProfile>` self-service widget (auth methods, devices, logout) | `client/src/pages/Dashboard.js` |
| Calling a protected backend endpoint with the session JWT | `client/src/components/SecretMessage.js` |
| Server-side session validation **with automatic refresh** | `JavaSampleAppApplication.getSecretMessage` |
| Returning a rotated session JWT to the browser via response header | `X-Descope-Session-Jwt` header + CORS `exposedHeaders` |

## Prerequisites

| | |
|---|---|
| Java | 17+ (tested with JDK 26) |
| Node | 18+ |
| npm | bundled with Node |
| Maven | bundled via `./mvnw` (no separate install) |
| Descope project | create one at [app.descope.com](https://app.descope.com) |

If `java` is not on your `PATH`, point `JAVA_HOME` at your JDK before running the server. Example for Homebrew on macOS:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

## Descope console setup

A new Descope project comes with sensible defaults, but the sample relies on a few things existing in your project:

1. A flow named `sign-up-or-in` (created automatically in new projects).
2. A widget named `user-profile-widget` for the dashboard's `<UserProfile>` embed (also created by default).
3. **Optional — for tenant SSO demo:** a tenant configured with OIDC or SAML SSO ([app.descope.com/tenants](https://app.descope.com/tenants)) and an **SSO** step in the `sign-up-or-in` flow.

## Setup

### 1. Server

```bash
cd server
```

Set your project ID in `src/main/resources/application.properties`:

```properties
descope.project.id=<YOUR_DESCOPE_PROJECT_ID>
```

Run:

```bash
./mvnw spring-boot:run
```

The server listens on `http://localhost:8080`.

### 2. Client

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
REACT_APP_DESCOPE_PROJECT_ID=<YOUR_DESCOPE_PROJECT_ID>
```

Run:

```bash
npm start
```

The app opens at `http://localhost:3000`. If you host the client elsewhere, update the `@CrossOrigin` value in `JavaSampleAppApplication.java`.

## How session validation + refresh works

The client sends two headers when calling `/get_secret_message`:

- `Authorization: Bearer <sessionToken>` — short-lived session JWT
- `X-Refresh-Token: <refreshToken>` — long-lived refresh JWT (optional)

The backend calls `AuthenticationService.validateAndRefreshSessionWithTokens(session, refresh)`. If the session JWT is expired but the refresh JWT is still valid, the SDK transparently mints a fresh session JWT. The new JWT is returned to the browser in the `X-Descope-Session-Jwt` response header.

If the client omits the refresh header, the server falls back to plain `validateSessionWithToken`.

The `@CrossOrigin(... exposedHeaders = {"X-Descope-Session-Jwt"})` annotation is required so the browser's JS can read the rotated token from the response.

## Tenant SSO

This sample no longer uses dedicated backend SSO endpoints. Tenant SSO is handled entirely inside the Descope flow:

1. In your Descope project, configure a tenant ([app.descope.com/tenants](https://app.descope.com/tenants)) and enable SSO (SAML or OIDC) on it.
2. Make sure your `sign-up-or-in` flow contains an **SSO** step (or use a dedicated flow that does).
3. On the home page, enter the tenant ID and click **Sign in via Tenant SSO**. The browser navigates to `/signin?tenant=<id>`, and the `<Descope tenant={tenantId}>` component runs the SSO flow for that tenant.

No backend code is needed for the SSO exchange — the React SDK handles redirect and token exchange end-to-end.

## `<UserProfile>` widget

The dashboard embeds `<UserProfile widgetId="user-profile-widget">`. The widget is rendered from your Descope project's widget configuration, so you can change layout, fields, and styling in the Descope console without touching this code.

To enable it, make sure a widget named `user-profile-widget` exists in your project (the default works for most setups). See [Descope widgets docs](https://docs.descope.com/widgets/users).

## Project structure

```
server/
  src/main/java/com/descope/java_sample_app/
    JavaSampleAppApplication.java   # Spring Boot app + protected endpoint
  src/main/resources/
    application.properties          # Descope project ID

client/
  src/
    index.js                        # AuthProvider + router
    pages/
      Home.js                       # Public landing + tenant SSO entry
      SignIn.js                     # <Descope> flow runner
      Dashboard.js                  # Protected page + UserProfile widget
      Layout.js                     # Nav
    components/
      SecretMessage.js              # Authenticated fetch against backend
```

## License

MIT — see [LICENSE](LICENSE).
