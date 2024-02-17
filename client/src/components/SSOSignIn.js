import { useState } from "react";

const SSOSignIn = () => {

    const [tenantId, setTenantId] = useState("");
    const startSSOSignIn = () => {
        if (!tenantId) {
            alert("Please enter a tenant ID");
            return;
        } else {
            const queryParams = new URLSearchParams({
                tenantId,
                redirectUrl: 'http://localhost:8080/authorization-code/callback',
            }).toString();
            fetch(`http://localhost:8080/start_sso?${queryParams}`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(async (response) => {
                const url = (await response.json()).url;
                console.log(url)
                window.location.href = url;
            }).catch((error) => {
                console.log(error)
                alert("Error starting SSO sign in.")
                // Could be that your tenant ID is invalid
            });
        }
    }

    return <>
        <h1>Tenant SSO OIDC Sign In</h1>
        <input type="text" value={tenantId} placeholder="Tenant ID" onChange={(e) => setTenantId(e.target.value)} />
        <button onClick={startSSOSignIn}>Sign in via SSO</button>
    </>
}

export default SSOSignIn;
