import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthorizationCodeCallback = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState("");
    const hasFetchedRef = useRef(false);

    const navigate = useNavigate();

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      // Ref added to prevent calling of endpoint twice,
      // due to React Strict Mode behavior in development
      // for debugging
      if (hasFetchedRef.current) {
        return;
      }
      hasFetchedRef.current = true;
      
      if (code) {

        fetch(`http://localhost:8080/authorization-code/callback`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            body: JSON.stringify({ code }),
        })
        .then(async response => {
            const data = await response.json();
            setResponse(data);
            // Navigate to protected page
            // navigate('/protected', { replace: true });
        })
        .catch(error => {
          console.error('Error:', error);
          setError(error);
        });
      }
    }, []);



    if (error) {
        return ( <p>{error.toString()}</p>);
    }

    if (response) {
        return (
            <div>
                <p>{response.email}</p>
                <p>{response.userId}</p>
                <p>{response.token}</p>
                <p>{response.refreshToken}</p>
            </div>
        );
    }
  
    return (
      <div>Loading...</div>
    );
}

export default AuthorizationCodeCallback;
