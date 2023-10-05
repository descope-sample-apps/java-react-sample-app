import { Descope, useSession } from "@descope/react-sdk";
import { useEffect } from "react";

const SignIn = () => {
    const { isAuthenticated, isSessionLoading } = useSession()
    useEffect(() => {
        if (!isSessionLoading && isAuthenticated) {
            window.location.href = '/dashboard';
        }
    });
    return (
        <div>
            <h1>SignIn</h1>
            <Descope
                flowId="sign-up-or-in"
                onSuccess={(e) => console.log(e.detail.user)}
                onError={(e) => console.log('Could not log in!')}
            />
        </div>
    )
}

export default SignIn;