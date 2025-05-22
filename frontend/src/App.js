import React from 'react';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalProvider, useMsal, useIsAuthenticated } from '@azure/msal-react';

const msalConfig = {
  auth: {
    clientId: 'your-azure-client-id',
    authority: 'https://login.microsoftonline.com/your-tenant-id',
    redirectUri: window.location.origin
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

function ProfileContent() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginPopup().catch(e => {
      console.error(e);
    });
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  if (isAuthenticated) {
    return (
      <div>
        <h2>Welcome {accounts[0].username}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return <button onClick={handleLogin}>Login with Azure AD</button>;
}

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <div style={{ padding: 20 }}>
        <h1>Azure AD SSO Example</h1>
        <ProfileContent />
      </div>
    </MsalProvider>
  );
}
