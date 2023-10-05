import { getSessionToken } from "@descope/react-sdk";
import { useEffect, useState } from "react";

const SecretMessage = () => {
    const [secretMessage, setSecretMessage] = useState("");
    useEffect(() => {
        console.log("Get secret message")
        getSecretMessage();
    });

    const getSecretMessage = async () => {
        const sessionToken = getSessionToken();

        // example fetch call with authentication header
        fetch('http://localhost:8080/get_secret_message', {
            headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + sessionToken,
            }
        })
        .then(response => response.json())
        .then(data => {
            setSecretMessage(data.message)
        })
        .catch(error => {
            console.log(error)
            setSecretMessage("Error fetching message-your server may not be running.")
        });
    }

    return <>
        <p><b>Secret message:</b> {secretMessage}</p>
        <p>We'll see the secret message once the user authenticates and a valid session token is passed to the backend.</p>
    </>
}

export default SecretMessage;