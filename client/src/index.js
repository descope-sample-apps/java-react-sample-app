import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from '@descope/react-sdk';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider
            projectId={process.env.REACT_APP_DESCOPE_PROJECT_ID}
        >
            <App />
        </AuthProvider>
    </React.StrictMode>
);
