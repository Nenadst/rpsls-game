# Rock Paper Scissors Lizard Spock

A modern implementation of the Rock Paper Scissors Lizard Spock game with both client and server components.

## 🚀 Quick Start with Docker

The easiest way to run the entire application is using Docker Compose:

```bash
docker-compose up --build
```

This will start both the client (http://localhost:80) and server (http://localhost:5000).

## 📁 Project Structure

```
rpsls-game-challenge/
├── client/          # React frontend application
├── server/          # Node.js/Express backend API
├── docker-compose.yml
└── README.md
```

## 🔧 Individual Setup

### Client Setup

```bash
cd client
npm install
npm run dev
```

The client will be available at `http://localhost:3000`

### Server Setup

```bash
cd server
npm install
npm run dev
```

The server will be available at `http://localhost:5000`

## 🐳 Docker Instructions

### Running with Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down
```

### Running Individual Containers

#### Server Container
```bash
cd server
docker build -t rpsls-server .
docker run -p 5000:5000 rpsls-server
```

#### Client Container
```bash
cd client
docker build -t rpsls-client .
docker run -p 80:80 rpsls-client
```

## 📚 Documentation

- [Client Documentation](./client/README.md) - React frontend details
- [Server Documentation](./server/README.md) - API documentation

## 🎮 Game Rules

Rock Paper Scissors Lizard Spock follows the rules from [Sam Kass](http://www.samkass.com/theories/RPSSL.html):

- Rock crushes Scissors and Lizard
- Paper covers Rock and disproves Spock
- Scissors cuts Paper and decapitates Lizard
- Lizard eats Paper and poisons Spock
- Spock vaporizes Rock and smashes Scissors

## 🏗️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, TanStack Query
- **Backend**: Node.js, Express, TypeScript
- **Containerization**: Docker, Docker Compose