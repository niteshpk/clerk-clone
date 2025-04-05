# API Response Format

This document describes the standardized API response format used across our application. The format ensures consistency, predictability, and ease of consumption for all API clients.

## Response Structure

All API responses follow this base structure:

```typescript
type ApiResponse<T> = {
  success: boolean; // Indicates if the request was successful
  message: string; // Human-readable message describing the result
  data?: T; // Response data (for successful requests)
  pagination?: {
    // Pagination info (for paginated responses)
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
  error?: {
    // Error details (for failed requests)
    code: string; // Error code for programmatic handling
    details?: string; // Detailed error message
    fields?: Record<string, string>; // Field-specific validation errors
  };
  timestamp?: string; // ISO timestamp of the response
  requestId?: string; // Unique ID for request tracing
};
```

## Response Types

### 1. Success Response (200)

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 2. Created Response (201)

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "new_user_123",
    "email": "new@example.com"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 3. Paginated Response (200)

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    { "id": "user_1", "name": "User 1" },
    { "id": "user_2", "name": "User 2" }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalItems": 48
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 4. Error Response (4xx/5xx)

```json
{
  "success": false,
  "message": "User not found",
  "error": {
    "code": "USER_NOT_FOUND",
    "details": "No user exists with the given ID"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 5. Validation Error Response (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "fields": {
      "email": "Email is invalid",
      "password": "Password must be at least 8 characters"
    }
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Using the ApiResponseBuilder

The `ApiResponseBuilder` class provides helper methods for creating consistent responses:

### Success Responses

```typescript
// Basic success response
const response = ApiResponseBuilder.success(
  "User fetched successfully",
  userData,
  undefined,
  req.requestId
);

// Created response (201)
const response = ApiResponseBuilder.created(
  "User created successfully",
  newUser,
  req.requestId
);

// Paginated response
const response = ApiResponseBuilder.paginated(
  "Users fetched successfully",
  users,
  {
    page: 1,
    limit: 10,
    totalPages: 5,
    totalItems: 48,
  },
  req.requestId
);
```

### Error Responses

```typescript
// Not found error (404)
const response = ApiResponseBuilder.notFound("User not found", req.requestId);

// Validation error (422)
const response = ApiResponseBuilder.validationError(
  "Validation failed",
  {
    email: "Email is invalid",
    password: "Password is required",
  },
  req.requestId
);

// Unauthorized error (401)
const response = ApiResponseBuilder.unauthorized(
  "Authentication required",
  req.requestId
);

// Forbidden error (403)
const response = ApiResponseBuilder.forbidden(
  "Insufficient permissions",
  req.requestId
);

// Internal server error (500)
const response = ApiResponseBuilder.internalError(
  "Something went wrong",
  error.message,
  req.requestId
);
```

### Sending Responses

```typescript
// Send success response
ApiResponseBuilder.send(res, 200, response);

// Send error response
ApiResponseBuilder.send(res, 404, errorResponse);
```

## Request ID Middleware

The request ID middleware automatically adds a unique identifier to each request and response:

```typescript
// Request header
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000

// Response header
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
```

This ID is useful for:

- Tracing requests across microservices
- Debugging issues in production
- Correlating logs and metrics

## Best Practices

1. **Always include a meaningful message**

   - Make messages clear and actionable
   - Use consistent language across similar endpoints

2. **Use appropriate error codes**

   - Use standard HTTP status codes
   - Include specific error codes for programmatic handling

3. **Include request ID**

   - Always pass `req.requestId` to response builders
   - Use the ID for debugging and tracing

4. **Handle pagination consistently**

   - Always include pagination info for list endpoints
   - Use consistent parameter names (`page`, `limit`)

5. **Validate input thoroughly**
   - Use the validation error format for invalid input
   - Provide specific field-level error messages

## Example Usage

```typescript
// In your route handler
router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await userService.getUser(req.params.id);

    if (!user) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.notFound("User not found", req.requestId)
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "User fetched successfully",
        user,
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to fetch user",
        error.message,
        req.requestId
      )
    );
  }
});
```
