# Azure AD SSO Production Ready Docker Setup

This project contains a minimal example of Azure AD SSO integration with Node.js backend and React frontend, dockerized with Nginx reverse proxy with HTTPS.

---

## Setup

1. Copy `.env.example` to `.env` in `backend/` and fill in your Azure AD credentials.

2. Place your SSL certificates (fullchain.pem and privkey.pem) in `nginx/certs/`

3. Update `nginx/nginx.conf` with your domain name in `server_name`

4. Build and run containers:

```bash
docker-compose up --build
