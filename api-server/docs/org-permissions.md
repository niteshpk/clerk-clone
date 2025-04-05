# Organization Permissions API

This document describes the API endpoints for managing organization-specific permissions.

## Base URL

All endpoints are prefixed with `/api/org-permissions`

## Endpoints

### Get All Permissions

Retrieves a list of all permissions for a specific organization.

```http
GET /api/org-permissions?organization_id=67f13f875e1d6d1f3ac3f88f
```

#### Query Parameters

- `organization_id` (required): The ID of the organization

#### Response

```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": {
    "permissions": [
      {
        "id": "67f156ef62d3d10a19f96411",
        "name": "org:user:create",
        "description": "Able to create users under their org",
        "organization_id": "67f13f875e1d6d1f3ac3f88f",
        "created_at": "2025-04-05T16:16:08.716Z",
        "updated_at": "2025-04-05T16:16:08.716Z"
      }
    ]
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Get Permission by ID

Retrieves a specific permission by its ID.

```http
GET /api/org-permissions/67f156ef62d3d10a19f96411
```

#### Response

```json
{
  "success": true,
  "message": "Permission retrieved successfully",
  "data": {
    "permission": {
      "id": "67f156ef62d3d10a19f96411",
      "name": "org:user:create",
      "description": "Able to create users under their org",
      "organization_id": "67f13f875e1d6d1f3ac3f88f",
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Create Permission

Creates a new permission for an organization.

```http
POST /api/org-permissions
```

#### Request Body

```json
{
  "name": "org:user:create",
  "description": "Able to create users under their org",
  "organization_id": "67f13f875e1d6d1f3ac3f88f"
}
```

#### Response

```json
{
  "success": true,
  "message": "Permission created successfully",
  "data": {
    "permission": {
      "id": "67f156ef62d3d10a19f96411",
      "name": "org:user:create",
      "description": "Able to create users under their org",
      "organization_id": "67f13f875e1d6d1f3ac3f88f",
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Update Permission

Updates an existing permission.

```http
PUT /api/org-permissions/67f156ef62d3d10a19f96411
```

#### Request Body

```json
{
  "name": "org:user:create",
  "description": "Updated description for permission",
  "organization_id": "67f13f875e1d6d1f3ac3f88f"
}
```

#### Response

```json
{
  "success": true,
  "message": "Permission updated successfully",
  "data": {
    "permission": {
      "id": "67f156ef62d3d10a19f96411",
      "name": "org:user:create",
      "description": "Updated description for permission",
      "organization_id": "67f13f875e1d6d1f3ac3f88f",
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Delete Permission

Deletes a permission from an organization.

```http
DELETE /api/org-permissions/67f156ef62d3d10a19f96411
```

#### Response

```json
{
  "success": true,
  "message": "Permission deleted successfully",
  "data": {
    "permissionId": "67f156ef62d3d10a19f96411"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

## Error Responses

### Missing Organization ID (400)

```json
{
  "success": false,
  "message": "Organization ID is required",
  "error": {
    "code": "MISSING_ORGANIZATION_ID",
    "details": "Please provide an organization_id in the query parameters"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Permission Not Found (404)

```json
{
  "success": false,
  "message": "Permission not found",
  "error": {
    "code": "PERMISSION_NOT_FOUND",
    "details": "The requested permission does not exist in this organization"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
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
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
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
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```
