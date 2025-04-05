# Permissions API Documentation

This document describes the API endpoints for managing permissions in the system. All permissions are organization-specific.

## Base URL

All endpoints are prefixed with `/api/permissions`

## Endpoints

### Get All Permissions

Retrieves a list of all permissions for the current organization.

```http
GET /api/permissions
```

#### Response

```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": {
    "permissions": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "org:user:create",
        "description": "Permission to create users in an organization",
        "organization_id": "507f1f77bcf86cd799439012",
        "created_at": "2024-04-05T12:00:00.000Z",
        "updated_at": "2024-04-05T12:00:00.000Z"
      }
    ]
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Create Permission

Creates a new permission for the current organization.

```http
POST /api/permissions
```

#### Request Body

```json
{
  "name": "org:user:create",
  "description": "Permission to create users in an organization"
}
```

#### Response

```json
{
  "success": true,
  "message": "Permission created successfully",
  "data": {
    "permission": {
      "id": "507f1f77bcf86cd799439011",
      "name": "org:user:create",
      "description": "Permission to create users in an organization",
      "organization_id": "507f1f77bcf86cd799439012",
      "created_at": "2024-04-05T12:00:00.000Z",
      "updated_at": "2024-04-05T12:00:00.000Z"
    }
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Update Permission

Updates an existing permission in the current organization.

```http
PUT /api/permissions/:id
```

#### Request Body

```json
{
  "name": "org:user:create",
  "description": "Updated description for permission"
}
```

#### Response

```json
{
  "success": true,
  "message": "Permission updated successfully",
  "data": {
    "permission": {
      "id": "507f1f77bcf86cd799439011",
      "name": "org:user:create",
      "description": "Updated description for permission",
      "organization_id": "507f1f77bcf86cd799439012",
      "created_at": "2024-04-05T12:00:00.000Z",
      "updated_at": "2024-04-05T12:00:00.000Z"
    }
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Delete Permission

Deletes a permission from the current organization.

```http
DELETE /api/permissions/:id
```

#### Response

```json
{
  "success": true,
  "message": "Permission deleted successfully",
  "data": {
    "permissionId": "507f1f77bcf86cd799439011"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Error Responses

### Permission Not Found (404)

```json
{
  "success": false,
  "message": "Permission not found",
  "error": {
    "code": "PERMISSION_NOT_FOUND",
    "details": "The requested permission does not exist in this organization"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Duplicate Permission (400)

```json
{
  "success": false,
  "message": "Permission already exists",
  "error": {
    "code": "DUPLICATE_PERMISSION",
    "details": "A permission with this name already exists in this organization"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Failed to [operation] permission",
  "error": {
    "code": "INTERNAL_ERROR",
    "details": "An unexpected error occurred"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```
