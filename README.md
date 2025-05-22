# Azure AD SSO Production Ready Docker Setup

This project contains a minimal example of Azure AD SSO integration with Node.js backend and React frontend, dockerized with Nginx reverse proxy with HTTPS.

---

## Project structure
```
azure-ad-sso-prod/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── index.js
│   │   └── App.js
├── nginx/
│   ├── nginx.conf
│   └── certs/  (place your SSL certs here)
├── docker-compose.yml
└── README.md

```


## Setup

1. Copy `.env.example` to `.env` in `backend/` and fill in your Azure AD credentials.

2. Place your SSL certificates (fullchain.pem and privkey.pem) in `nginx/certs/`

3. Update `nginx/nginx.conf` with your domain name in `server_name`

4. Build and run containers:

```bash
docker-compose up --build

````
5. Access the frontend on https://yourdomain.com
