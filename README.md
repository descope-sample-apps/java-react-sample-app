# Java React Sample App 


## Setup & Running

### Run server

1. Navigate into the server folder:
```
cd server
```

2. Create a .env folder and add environment variables:
```
PROJECT_ID="YOUR_DESCOPE_PROJECT_ID"
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

3. Create a .env folder and add environment variables:
```
NEXT_PUBLIC_DESCOPE_PROJECT_ID="YOUR_DESCOPE_PROJECT_ID"
```

4. Start the application
```
npm start
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
