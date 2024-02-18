# Java React Sample App

This sample app showcases Descope authentication built using React for frontend and Java Spring for backend. The frontend incldues a home, login, and dashboard screen, with the dashboard including a call to the backend to get a "secret message" that is only shared when a valid session token is passed in.

Authentication and session validation are implemented using Descope's [React SDK](https://github.com/descope/react-sdk) and [Java SDK](https://github.com/descope/descope-java) in the frontend and backend respectively.

## Setup & Running

### Run server

1. Navigate into the server folder:

```
cd server
```

2. In your `application.properties` file, add your Descope project ID:

```
descope.project.id=<YOUR_DESCOPE_PROJECT_ID>
```

3. To run the application, run the following command in a terminal window (in the complete) directory:

```
./gradlew bootRun
```

If you use Maven, run the following command in a terminal window (in the complete) directory:

```
./mvnw spring-boot:run
```

### Run client

1. Navigate into the client folder:

```
cd client
```

2. Install dependencies

```
npm i
```

3. Create a `.env` folder and add environment variables:

```
REACT_APP_DESCOPE_PROJECT_ID="YOUR_DESCOPE_PROJECT_ID"
```

4. Start the application

```
npm start
```

>Note: If you're not running the client at <http://localhost:3000> you may need to change the server's CrossOrigin domain to wherever you're hosting it (in JavaSampleAppApplication.java).

```
@CrossOrigin(origins = "http://localhost:3000")
```

## Tenant-based OIDC SSO Setup

You will need to configure a tenant in your Descope console with OIDC. Then, you can use the associated tenant ID to start SSO, redirect to the IdP authentication portal, and then exchange the returned code for 
authenticated user info. We'll include the steps to set up in the UI here, but this can also be done via API or SDK.

1. Create a tenant [here](https://app.descope.com/tenants)
2. Then, click on the tenant, Authentication Methods, SSO and enable and configure SSO via OIDC with an Identity Provider

Be sure to have `https://api.descope.com/v1/oauth/callback` in the allowed redirect URIs

![Screenshot 2024-02-17 at 10 42 35 AM](https://github.com/descope-sample-apps/java-react-sample-app/assets/46854522/76cf59da-5e8e-4067-b601-23445b05bf77)

3. Run your application per `Setup & Running` as described above, with the client at http://localhost:3000 and server at http://localhost:8080.

4. Navigate to the url where your client is running and input the tenant ID.

![Screenshot 2024-02-17 at 10 38 23 AM](https://github.com/descope-sample-apps/java-react-sample-app/assets/46854522/a7647954-c166-447a-b848-0171364210a2)

5. Log in via your IdP. Then, you'll be redirected back to the application where the SSO exchange will complete.

![Screenshot 2024-02-17 at 10 46 38 AM](https://github.com/descope-sample-apps/java-react-sample-app/assets/46854522/0159a703-20a3-4a2e-b25c-120c043f66a2)

You should see a message saying token exchange was successful along with the signed in user.
![Screenshot 2024-02-17 at 10 44 14 AM](https://github.com/descope-sample-apps/java-react-sample-app/assets/46854522/7ca5f180-67dd-48a0-8921-554cfc303e89)



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
