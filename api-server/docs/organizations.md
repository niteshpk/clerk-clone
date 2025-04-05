# Organization Management API

This document describes the API endpoints for managing organizations and their members.

## Base URL

All endpoints are prefixed with `/api/organizations`

## Endpoints

### Create Organization

Creates a new organization.

```http
POST /api/organizations
```

#### Request Body

```json
{
  "name": "Acme Corp",
  "description": "A leading technology company"
}
```

#### Response

```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "organization": {
      "id": "67f13f875e1d6d1f3ac3f88f",
      "name": "Acme Corp",
      "description": "A leading technology company",
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Get Organization

Retrieves a specific organization by its ID.

```http
GET /api/organizations/67f13f875e1d6d1f3ac3f88f
```

#### Response

```json
{
  "success": true,
  "message": "Organization retrieved successfully",
  "data": {
    "organization": {
      "id": "67f13f875e1d6d1f3ac3f88f",
      "name": "Acme Corp",
      "description": "A leading technology company",
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Update Organization

Updates an existing organization.

```http
PUT /api/organizations/67f13f875e1d6d1f3ac3f88f
```

#### Request Body

```json
{
  "name": "Acme Corporation",
  "description": "Updated description"
}
```

#### Response

```json
{
  "success": true,
  "message": "Organization updated successfully",
  "data": {
    "organization": {
      "id": "67f13f875e1d6d1f3ac3f88f",
      "name": "Acme Corporation",
      "description": "Updated description",
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Delete Organization

Deletes an organization.

```http
DELETE /api/organizations/67f13f875e1d6d1f3ac3f88f
```

#### Response

```json
{
  "success": true,
  "message": "Organization deleted successfully",
  "data": {
    "organizationId": "67f13f875e1d6d1f3ac3f88f"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Add Member to Organization

Adds a user to an organization.

```http
POST /api/organizations/67f13f875e1d6d1f3ac3f88f/members
```

#### Request Body

```json
{
  "user_id": "67f13f875e1d6d1f3ac3f88f",
  "role": "member"
}
```

#### Response

```json
{
  "success": true,
  "message": "Member added successfully",
  "data": {
    "member": {
      "id": "67f13f875e1d6d1f3ac3f88f",
      "user_id": "67f13f875e1d6d1f3ac3f88f",
      "organization_id": "67f13f875e1d6d1f3ac3f88f",
      "role": "member",
      "created_at": "2025-04-05T16:16:08.716Z",
      "updated_at": "2025-04-05T16:16:08.716Z"
    }
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Remove Member from Organization

Removes a user from an organization.

```http
DELETE /api/organizations/67f13f875e1d6d1f3ac3f88f/members/67f13f875e1d6d1f3ac3f88f
```

#### Response

```json
{
  "success": true,
  "message": "Member removed successfully",
  "data": {
    "memberId": "67f13f875e1d6d1f3ac3f88f"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

## Error Responses

### Organization Not Found (404)

```json
{
  "success": false,
  "message": "Organization not found",
  "error": {
    "code": "ORGANIZATION_NOT_FOUND",
    "details": "The requested organization does not exist"
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
    "details": "You do not have permission to perform this action"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Member Already Exists (400)

```json
{
  "success": false,
  "message": "Member already exists",
  "error": {
    "code": "MEMBER_EXISTS",
    "details": "This user is already a member of the organization"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Failed to [operation] organization",
  "error": {
    "code": "INTERNAL_ERROR",
    "details": "An unexpected error occurred"
  },
  "timestamp": "2025-04-05T16:16:08.716Z",
  "requestId": "07860514-8343-4a75-80eb-2d56fe064b69"
}
```
