# Authentication API

This document describes the API endpoints for user authentication and session management.

## Base URL

All endpoints are prefixed with `/api/auth`

## Endpoints

### Register User

Creates a new user account.

```http
POST /api/auth/register
```

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "67f13f875e1d6d1f3ac3f88f",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    },
    "session": {
      "id": "67f14501b011097e6e58b0a5",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2025-04-05T16:16:08.716Z",
      "expires_at": "2025-04-06T16:16:08.716Z",
      "is_active": true
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Login User

Authenticates a user and creates a new session.

```http
POST /api/auth/login
```

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "67f13f875e1d6d1f3ac3f88f",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    },
    "session": {
      "id": "67f14501b011097e6e58b0a5",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2025-04-05T16:16:08.716Z",
      "expires_at": "2025-04-06T16:16:08.716Z",
      "is_active": true
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Logout User

Terminates the current user session.

```http
POST /api/auth/logout
```

#### Response

```json
{
  "success": true,
  "message": "Logout successful",
  "data": {
    "sessionId": "67f14501b011097e6e58b0a5"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Get Current User

Retrieves the currently authenticated user's information.

```http
GET /api/auth/me
```

#### Response

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "67f13f875e1d6d1f3ac3f88f",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

## Error Responses

### Invalid Credentials (401)

```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "The provided email or password is incorrect"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Email Already Exists (400)

```json
{
  "success": false,
  "message": "Email already exists",
  "error": {
    "code": "EMAIL_EXISTS",
    "details": "A user with this email already exists"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": {
    "code": "UNAUTHORIZED",
    "details": "Authentication required"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Failed to [operation]",
  "error": {
    "code": "INTERNAL_ERROR",
    "details": "An unexpected error occurred"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```
