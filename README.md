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


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
