import { useCallback, useEffect, useState } from 'react'

import { useDescope, useSession, useUser } from '@descope/react-sdk'
import { Descope } from '@descope/react-sdk'
import { getSessionToken } from '@descope/react-sdk';
import SecretMessage from '../components/SecretMessage';
import SSOSignIn from '../components/SSOSignIn';


const Home = () => {
    const { isAuthenticated, isSessionLoading } = useSession()
  const { isUserLoading } = useUser()
  
  useEffect(() => {
      if (!isSessionLoading && isAuthenticated) {
          window.location.href = '/dashboard';
      }
  });

  if (isSessionLoading || isUserLoading) {
    return <p>Loading...</p>;
  }

  return <>
    <div>
      <h1>Welcome to your home page</h1>
      <button onClick={() => window.location.href = '/signin'}>Sign In</button>
      <SecretMessage/>
      <SSOSignIn/>

    </div>
  </>;
}

export default Home