import { useCallback, useEffect, useState } from 'react'

import { useDescope, useSession, useUser } from '@descope/react-sdk'
import { Descope } from '@descope/react-sdk'
import { getSessionToken } from '@descope/react-sdk';

const App = () => {
  const { isAuthenticated, isSessionLoading } = useSession()
  const { user, isUserLoading } = useUser()
  const { logout } = useDescope()
  const [secretMessage, setSecretMessage] = useState("");
  
  useEffect(() => {
    getSecretMessage();
  }, []);

  const getSecretMessage = async () => {
    const sessionToken = getSessionToken();

    // example fetch call with authentication header
    fetch('http://localhost:8080/getSecretMessage', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + sessionToken,
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Data: ", data)
      setSecretMessage(data.message)
    })
    .catch(error => {
      console.log(error);
      setSecretMessage('Could not get secret message');
    });
  }

  

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  return <>
    {!isAuthenticated &&
      (
        <Descope
          flowId="sign-up-or-in"
          onSuccess={(e) => console.log(e.detail.user)}
          onError={(e) => console.log('Could not log in!')}
        />
      )
    }

    {
      (isSessionLoading || isUserLoading) && <p>Loading...</p>
    }
    <div>
      <p>Secret message: {secretMessage}</p>
    </div>

    {!isUserLoading && isAuthenticated &&
      (
        <>
          <p>Hello {user.name}</p>
          <div>My Private Component</div>
          <button onClick={handleLogout}>Logout</button>
        </>
      )
    }
  </>;
}

export default App;