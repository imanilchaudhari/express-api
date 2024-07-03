# Express API Service with Syslog, OpenTelemetry integration

Express API Service with OpenTelemetry integration

## Tech Stack

- Node.js 16
- NPM Libraries
  - Nodemon for Debugging and keeping track of changed files
  - Express for initiating the server
  - BodyParser to parse request body

## Walkthrough

### Set-up Docker (Recommended)

```
docker compose -f "docker-compose.yml" up -d --build
```

### Starting the API Server

```
nodemon app.js

OR

npm run start
```