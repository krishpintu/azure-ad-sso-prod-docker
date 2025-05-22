import React from 'react';
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { MsalProvider, useMsal, useIsAuthenticated } from '@azure/msal-react';

const msalConfig = {
  auth: {
    clientId: 'your-azure-client-id',
    authority: 'https://login.microsoftonline.com/your-tenant-id',
    redirectUri: 'https://yourdomain.com',  // Update for production
  }
};

const loginRequest = {
  scopes: ["User.Read"] // Add scopes your app needs
};

const msalInstance = new PublicClientApplication(msalConfig);

function ProfileContent() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => console.error(e));
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  const callApi = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const accessToken = response.accessToken;

      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = await res.json();
      console.log("User profile from API:", data);
      alert(`Hello, ${data.profile.displayName}`);
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        instance.acquireTokenPopup(loginRequest).then(response => {
          // Retry API call or update UI
        });
      } else {
        console.error(error);
      }
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      callApi();
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (
      <div>
        <h2>Welcome, {accounts[0].username}</h2>
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
