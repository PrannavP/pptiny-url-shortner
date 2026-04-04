# PPTiny URL Shortener

A lightweight URL shortening service with a REST API backend and a companion CLI tool. Paste a long URL, get a short 6-character code, and redirect anyone who visits it.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [API Setup](#api-setup)
  - [CLI Setup](#cli-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [User Endpoints](#user-endpoints)
  - [URL Endpoints](#url-endpoints)
- [CLI Usage](#cli-usage)
- [How It Works](#how-it-works)

---

## Overview

PPTiny URL Shortener lets you turn any long URL into a short, shareable link. It consists of two parts:

- **`api/`** — An Express.js REST API backed by MongoDB that handles user accounts, URL creation, and redirection.
- **`cli/`** — A Node.js command-line tool that lets you register, log in, and shorten URLs directly from your terminal.

---

## Project Structure

```
pptiny-url-shortner/
├── api/                        # REST API server
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── urlController.js    # Shorten & redirect logic
│   │   └── userController.js   # Register & login logic
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT auth middleware
│   ├── models/
│   │   ├── Url.js              # URL schema
│   │   └── User.js             # User schema
│   ├── routes/
│   │   ├── UrlRoutes.js        # URL routes
│   │   └── userRoutes.js       # User routes
│   ├── utils/
│   │   ├── generateJWTTokenHelper.js   # JWT generator
│   │   └── generateRandomWords.js      # Short-code generator
│   ├── app.js                  # Express app setup
│   ├── server.js               # Entry point
│   └── package.json
└── cli/                        # CLI tool
    ├── helper/
    │   └── helperFunctions.js  # Shared helper functions
    ├── main.js                 # CLI entry point
    └── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| API Framework | Express.js 5 |
| Database | MongoDB (via Mongoose) |
| Authentication | JSON Web Tokens (jsonwebtoken) |
| Password Hashing | bcryptjs |
| CLI Framework | Commander.js |
| Config | dotenv |

---

## Getting Started

### Prerequisites

- Node.js v18+
- A running MongoDB instance (local or Atlas)

### API Setup

```bash
cd api
npm install
```

Create a `.env` file inside `api/` (see [Environment Variables](#environment-variables)), then start the server:

```bash
npm start
```

The server will start on the port defined in your `.env` file.

### CLI Setup

```bash
cd cli
npm install
```

Create a `.env` file inside `cli/` with the server URL variables (see [Environment Variables](#environment-variables)).

Run commands directly with Node:

```bash
node main.js --help
```

Or link it globally for use as a system command:

```bash
npm link
pptiny-url-shortener --help
```

---

## Environment Variables

### API (`api/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port the API server listens on | `6969` |
| `MONGODB_CONNECTION_URI` | MongoDB connection string | `mongodb://localhost:27017/pptiny` |
| `JWT_SECRET` | Secret key for signing JWTs | `your-secret-key` |
| `JWT_EXPIRE` | JWT expiry duration | `7d` |
| `RELEASE_VERSON` | Set to `PRODUCTION` for prod builds | `PRODUCTION` |
| `BACKEND_SERVER_URL_LOCAL` | Base URL used for local short links | `http://localhost:6969` |
| `BACKEND_SERVER_URL_PROD` | Base URL used for production short links | `https://yourdomain.com` |

### CLI (`cli/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `RELEASE_VERSON` | Set to `PRODUCTION` for prod builds | `PRODUCTION` |
| `BACKEND_SERVER_URL_LOCAL` | Local API base URL | `http://localhost:6969` |
| `BACKEND_SERVER_URL_PROD` | Production API base URL | `https://yourdomain.com` |

---

## API Reference

### Base URL

```
http://localhost:<PORT>
```

---

### User Endpoints

#### Register a new user

```
POST /api/v1/pptiny/user/register
```

**Request body:**

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123",
  "createdFrom": "web",
  "allowUnlimited": true
}
```

**Success response (201):**

```json
{ "message": "User created successfully." }
```

**Error response (400):**

```json
{ "message": "User already exists." }
```

---

#### Login

```
POST /api/v1/pptiny/user/login
```

**Request body:**

```json
{
  "username": "john",
  "password": "secret123"
}
```

**Success response (200):**

```json
{
  "_id": "64f...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error response (400):**

```json
{ "message": "Invalid credentials." }
```

---

### URL Endpoints

#### Shorten a URL

```
POST /pptiny/shorten
```

**Request body:**

```json
{
  "originalUrl": "https://example.com/very/long/path",
  "createdBy": 1
}
```

**Success response (200):**

```json
{ "message": "http://localhost:6969/pptiny/abcdef" }
```

The value returned in `message` is the complete shortened URL.

---

#### Redirect to original URL

```
GET /pptiny/:shortenCode
```

Visiting a shortened URL in a browser (or via curl) will issue an HTTP redirect to the original URL.

**Example:**

```
GET /pptiny/abcdef  →  302 Redirect to https://example.com/very/long/path
```

**Error response (404):**

```json
{ "message": "URL not found" }
```

---

## CLI Usage

All commands follow this pattern:

```
node main.js <command> [subcommand] [arguments]
```

### Register an account

```bash
node main.js user register <username> <email> <password>
```

**Example:**

```bash
node main.js user register john john@example.com secret123
```

### Log in

```bash
node main.js user login <username> <password>
```

**Example:**

```bash
node main.js user login john secret123
```

After a successful login, your user ID and JWT token are saved to `~/Documents/pptiny.txt` for use by subsequent commands.

### Shorten a URL

```bash
node main.js url short <long_url>
```

**Example:**

```bash
node main.js url short https://example.com/very/long/path
```

**Output:**

```
Shortened URL: http://localhost:6969/pptiny/abcdef
```

### Help

```bash
node main.js --help
node main.js user --help
node main.js url --help
```

---

## How It Works

1. **Short code generation** — When a URL is shortened, a random 6-character lowercase string (e.g. `abcdef`) is generated and stored alongside the original URL in MongoDB.
2. **Redirection** — When someone visits `/pptiny/<code>`, the API looks up the code in the database and issues an HTTP 302 redirect to the stored original URL.
3. **Authentication** — User passwords are hashed with bcrypt before storage. On login, a JWT is issued and (in the CLI) saved locally to `~/Documents/pptiny.txt`.
4. **Environment switching** — Setting `RELEASE_VERSON=PRODUCTION` in `.env` switches the base URL used in generated short links from the local URL to the production URL.
