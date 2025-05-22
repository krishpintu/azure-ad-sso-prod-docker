require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Setup JWKS client to get signing keys
const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/v2.0/keys`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err, null);
      return;
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Middleware to verify JWT token
function checkJwt(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  jwt.verify(token, getKey, {
    audience: process.env.AZURE_CLIENT_ID,
    issuer: `https://sts.windows.net/${process.env.AZURE_TENANT_ID}/`,
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token invalid', details: err.message });
    }
    req.user = decoded;
    next();
  });
}

// Protected API route example
app.get('/api/profile', checkJwt, async (req, res) => {
  try {
    // Fetch user profile from Microsoft Graph API
    const accessToken = req.headers.authorization.replace('Bearer ', '');

    const graphRes = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.json({ profile: graphRes.data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile', details: error.message });
  }
});

// Public test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
