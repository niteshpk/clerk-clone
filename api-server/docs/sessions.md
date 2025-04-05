# Session Management API

This document describes the API endpoints for managing user sessions.

## Base URL

All endpoints are prefixed with `/api/sessions`

## Endpoints

### Get All Sessions

Retrieves a list of all active sessions for the current user.

```http
GET /api/sessions
```

#### Response

```json
{
  "success": true,
  "message": "Sessions retrieved successfully",
  "data": {
    "sessions": [
      {
        "id": "67f14501b011097e6e58b0a5",
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0...",
        "created_at": "2025-04-05T16:16:08.716Z",
        "expires_at": "2025-04-06T16:16:08.716Z",
        "is_active": true
      }
    ]
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Get Session by ID

Retrieves a specific session by its ID.

```http
GET /api/sessions/67f14501b011097e6e58b0a5
```

#### Response

```json
{
  "success": true,
  "message": "Session retrieved successfully",
  "data": {
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

### Delete Session

Deletes a specific session.

```http
DELETE /api/sessions/67f14501b011097e6e58b0a5
```

#### Response

```json
{
  "success": true,
  "message": "Session deleted successfully",
  "data": {
    "sessionId": "67f14501b011097e6e58b0a5"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Delete All Sessions

Deletes all sessions for the current user.

```http
DELETE /api/sessions
```

#### Response

```json
{
  "success": true,
  "message": "All sessions deleted successfully",
  "data": {
    "deletedCount": 3
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Deactivate Session

Deactivates a specific session without deleting it.

```http
PATCH /api/sessions/67f14501b011097e6e58b0a5/deactivate
```

#### Response

```json
{
  "success": true,
  "message": "Session deactivated successfully",
  "data": {
    "session": {
      "id": "67f14501b011097e6e58b0a5",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2025-04-05T16:16:08.716Z",
      "expires_at": "2025-04-06T16:16:08.716Z",
      "is_active": false
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

## Error Responses

### Session Not Found (404)

```json
{
  "success": false,
  "message": "Session not found",
  "error": {
    "code": "SESSION_NOT_FOUND",
    "details": "The requested session does not exist"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Cannot Delete Active Session (400)

```json
{
  "success": false,
  "message": "Cannot delete active session",
  "error": {
    "code": "ACTIVE_SESSION",
    "details": "You cannot delete your currently active session"
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
    "details": "You do not have permission to access this session"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Failed to [operation] session",
  "error": {
    "code": "INTERNAL_ERROR",
    "details": "An unexpected error occurred"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```
