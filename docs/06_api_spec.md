# NEO Timesheet & Project Management API Specification

This document outlines the API endpoints for the NEO Timesheet & Project Management application.

## Base URL

`https://neoback-end.vercel.app/api`

## Authentication

All protected endpoints require a JSON Web Token (JWT) provided in the `Authorization` header as a Bearer token.

**Header:**
`Authorization: Bearer <YOUR_JWT_TOKEN>`

---

## Endpoints

### 1. Authentication

#### `POST /auth/login`
**Description:** Authenticates a user and returns a JWT token.

#### `GET /auth/me`
**Description:** Retrieves the authenticated user's details. Used for session validation on boot.

... (See actual implementation and super-admin-api.md for more)
