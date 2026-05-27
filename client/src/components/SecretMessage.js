import { getRefreshToken, getSessionToken } from "@descope/react-sdk";
import { useEffect, useState } from "react";

const SecretMessage = () => {
    const [secretMessage, setSecretMessage] = useState("");

    useEffect(() => {
        const fetchSecretMessage = async () => {
            const sessionToken = getSessionToken();
            const refreshToken = getRefreshToken();

            try {
                const res = await fetch('http://localhost:8080/get_secret_message', {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${sessionToken}`,
                        ...(refreshToken ? { 'X-Refresh-Token': refreshToken } : {}),
                    },
                });

                const rotated = res.headers.get('X-Descope-Session-Jwt');
                if (rotated) {
                    console.log('Backend rotated session JWT');
                }

                const data = await res.json();
                setSecretMessage(data.message);
            } catch (err) {
                console.log(err);
                setSecretMessage("Error fetching message-your server may not be running.");
            }
        };

        fetchSecretMessage();
    }, []);

    return (
        <div className="mb-6 p-6 bg-black/20 rounded-lg border border-[#5cf34f]/20 backdrop-blur-sm text-left max-w-xl mx-auto">
            <p className="text-sm text-gray-300">
                <span className="font-semibold text-[#5cf34f]">Secret message:</span>{' '}
                <span className="text-gray-100">{secretMessage || '—'}</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
                Visible once authenticated and a valid session token is passed to the backend.
            </p>
        </div>
    )
}

export default SecretMessage;
