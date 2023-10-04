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
  }, [isAuthenticated]);

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

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  if (isSessionLoading || isUserLoading) {
    return <p>Loading...</p>;
  }

  return <>
    {!isAuthenticated &&
      (<Descope
        flowId="sign-up-or-in"
        onSuccess={(e) => console.log(e.detail.user)}
        onError={(e) => console.log('Could not log in!')}
      />)
    }

    {isAuthenticated &&
      (
        <>
          <p>Hello {user.name}</p>
          <div>My Private Component</div>
          <button onClick={handleLogout}>Logout</button>
        </>
      )
    }
    <div>
      <p><b>Secret message:</b> {secretMessage}</p>
      <p>We'll see the secret message once the user authenticates and a valid session token is passed to the backend.</p>
    </div>
  </>;
}

export default App;