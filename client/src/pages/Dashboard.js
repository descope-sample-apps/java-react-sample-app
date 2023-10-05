import { getSessionToken, useDescope, useSession, useUser } from "@descope/react-sdk"
import { useCallback, useEffect, useState } from "react"
import SecretMessage from "../components/SecretMessage";

const Dashboard = () => {

    const { user, isUserLoading } = useUser()
    const { isAuthenticated, isSessionLoading } = useSession();
    const { logout } = useDescope()

    useEffect(() => {
        if (!isSessionLoading && !isAuthenticated) {
            window.location.href = '/';
        }
    });

    const handleLogout = useCallback(() => {
        logout()
    }, [logout])
    
    
    if (isUserLoading || isSessionLoading || !user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
           
          <p>Hello {user.name}</p>
          <div>My Private Component</div>
          <button onClick={handleLogout}>Logout</button>
          <SecretMessage/>

          
        </div>
    );
}

export default Dashboard