# Session Management Endpoints

## Get All Sessions

**Endpoint:** `GET /api/sessions`

**Description:** Get all active sessions for the current user.

**Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Sessions retrieved successfully",
  "data": [
    {
      "id": "session_123",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      "created_at": "2024-04-05T12:00:00.000Z",
      "expires_at": "2024-04-06T12:00:00.000Z",
      "is_active": true
    }
  ],
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": {
    "code": "UNAUTHORIZED",
    "details": "Invalid or missing authentication token"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Delete a Specific Session

**Endpoint:** `DELETE /api/sessions/:id`

**Description:** Delete a specific session by ID.

**Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Path Parameters:**

- `id`: The ID of the session to delete

**Success Response (200):**

```json
{
  "success": true,
  "message": "Session deleted successfully",
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Session not found or unauthorized",
  "error": {
    "code": "SESSION_NOT_FOUND",
    "details": "The requested session does not exist or you don't have permission to delete it"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Delete All Sessions

**Endpoint:** `DELETE /api/sessions`

**Description:** Delete all sessions for the current user (logout from all devices).

**Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "All sessions deleted successfully",
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Deactivate a Session

**Endpoint:** `PATCH /api/sessions/:id/deactivate`

**Description:** Deactivate a specific session without deleting it.

**Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Path Parameters:**

- `id`: The ID of the session to deactivate

**Success Response (200):**

```json
{
  "success": true,
  "message": "Session deactivated successfully",
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Session not found or unauthorized",
  "error": {
    "code": "SESSION_NOT_FOUND",
    "details": "The requested session does not exist or you don't have permission to deactivate it"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Notes

1. All session endpoints require authentication via Bearer token
2. Sessions automatically expire after 24 hours
3. Deactivated sessions cannot be reactivated
4. IP address and user agent information is collected for security purposes
5. Each session is tied to a specific user and cannot be accessed by other users
