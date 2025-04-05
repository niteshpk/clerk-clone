# User Endpoints

## Get Current User

**Endpoint:** `GET /api/users/me`

**Description:** Get the currently authenticated user's details.

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
  "message": "User details retrieved successfully",
  "data": {
    "user": {
      "_id": "user_123",
      "email": "user@example.com",
      "isEmailVerified": true,
      "createdAt": "2024-04-05T12:00:00.000Z",
      "updatedAt": "2024-04-05T12:00:00.000Z"
    }
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Unauthorized - No valid session found",
  "error": {
    "code": "UNAUTHORIZED",
    "details": "Please login to access this resource"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Get All Users

**Endpoint:** `GET /api/users`

**Description:** Get a list of all users (admin only).

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
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "user_123",
        "email": "user1@example.com",
        "isEmailVerified": true,
        "createdAt": "2024-04-05T12:00:00.000Z",
        "updatedAt": "2024-04-05T12:00:00.000Z"
      }
    ]
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Get User by ID

**Endpoint:** `GET /api/users/:id`

**Description:** Get details of a specific user.

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
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "_id": "user_123",
      "email": "user@example.com",
      "isEmailVerified": true,
      "createdAt": "2024-04-05T12:00:00.000Z",
      "updatedAt": "2024-04-05T12:00:00.000Z"
    }
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "User not found",
  "error": {
    "code": "USER_NOT_FOUND",
    "details": "The requested user could not be found"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Update User

**Endpoint:** `PUT /api/users/:id`

**Description:** Update a user's details.

**Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "email": "updated@example.com"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "_id": "user_123",
      "email": "updated@example.com",
      "isEmailVerified": true,
      "createdAt": "2024-04-05T12:00:00.000Z",
      "updatedAt": "2024-04-05T12:00:00.000Z"
    }
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (403):**

```json
{
  "success": false,
  "message": "Forbidden",
  "error": {
    "code": "FORBIDDEN",
    "details": "You can only update your own profile"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Delete User

**Endpoint:** `DELETE /api/users/:id`

**Description:** Delete a user account.

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
  "message": "User deleted successfully",
  "data": {
    "userId": "user_123"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (403):**

```json
{
  "success": false,
  "message": "Forbidden",
  "error": {
    "code": "FORBIDDEN",
    "details": "You can only delete your own profile"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```
