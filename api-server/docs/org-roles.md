# Organization Roles API

This document describes the API endpoints for managing organization roles and their permissions.

## Base URL

All endpoints are prefixed with `/api/org-roles`

## Endpoints

### Create Role

Creates a new role for an organization.

```http
POST /api/org-roles
```

#### Request Body

```json
{
  "name": "admin",
  "description": "Organization administrator with full access",
  "organization_id": "67f13f875e1d6d1f3ac3f88f",
  "permissions": ["org:user:create", "org:user:delete"]
}
```

#### Response

```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "role": {
      "id": "67f156ef62d3d10a19f96411",
      "name": "admin",
      "description": "Organization administrator with full access",
      "organization_id": "67f13f875e1d6d1f3ac3f88f",
      "permissions": ["org:user:create", "org:user:delete"],
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Get Role by ID

Retrieves a specific role by its ID.

```http
GET /api/org-roles/67f156ef62d3d10a19f96411
```

#### Response

```json
{
  "success": true,
  "message": "Role retrieved successfully",
  "data": {
    "role": {
      "id": "67f156ef62d3d10a19f96411",
      "name": "admin",
      "description": "Organization administrator with full access",
      "organization_id": "67f13f875e1d6d1f3ac3f88f",
      "permissions": ["org:user:create", "org:user:delete"],
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Update Role

Updates an existing role.

```http
PUT /api/org-roles/67f156ef62d3d10a19f96411
```

#### Request Body

```json
{
  "name": "administrator",
  "description": "Updated description",
  "permissions": ["org:user:create", "org:user:delete", "org:settings:update"]
}
```

#### Response

```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "role": {
      "id": "67f156ef62d3d10a19f96411",
      "name": "administrator",
      "description": "Updated description",
      "organization_id": "67f13f875e1d6d1f3ac3f88f",
      "permissions": [
        "org:user:create",
        "org:user:delete",
        "org:settings:update"
      ],
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Delete Role

Deletes a role from an organization.

```http
DELETE /api/org-roles/67f156ef62d3d10a19f96411
```

#### Response

```json
{
  "success": true,
  "message": "Role deleted successfully",
  "data": {
    "roleId": "67f156ef62d3d10a19f96411"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Assign Role to User

Assigns a role to a user in an organization.

```http
POST /api/org-roles/67f156ef62d3d10a19f96411/assign
```

#### Request Body

```json
{
  "user_id": "67f13f875e1d6d1f3ac3f88f"
}
```

#### Response

```json
{
  "success": true,
  "message": "Role assigned successfully",
  "data": {
    "assignment": {
      "id": "67f156ef62d3d10a19f96411",
      "user_id": "67f13f875e1d6d1f3ac3f88f",
      "role_id": "67f156ef62d3d10a19f96411",
      "organization_id": "67f13f875e1d6d1f3ac3f88f",
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Remove Role from User

Removes a role from a user in an organization.

```http
DELETE /api/org-roles/67f156ef62d3d10a19f96411/assign
```

#### Request Body

```json
{
  "user_id": "67f13f875e1d6d1f3ac3f88f"
}
```

#### Response

```json
{
  "success": true,
  "message": "Role removed successfully",
  "data": {
    "assignmentId": "67f156ef62d3d10a19f96411"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

## Error Responses

### Role Not Found (404)

```json
{
  "success": false,
  "message": "Role not found",
  "error": {
    "code": "ROLE_NOT_FOUND",
    "details": "The requested role does not exist in this organization"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Duplicate Role (400)

```json
{
  "success": false,
  "message": "Role already exists",
  "error": {
    "code": "DUPLICATE_ROLE",
    "details": "A role with this name already exists in this organization"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Invalid Permissions (400)

```json
{
  "success": false,
  "message": "Invalid permissions",
  "error": {
    "code": "INVALID_PERMISSIONS",
    "details": "One or more permissions do not exist in this organization"
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
    "details": "You do not have permission to manage roles in this organization"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Failed to [operation] role",
  "error": {
    "code": "INTERNAL_ERROR",
    "details": "An unexpected error occurred"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```
