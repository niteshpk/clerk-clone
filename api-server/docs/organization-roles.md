# Organization Roles API Documentation

This document describes the API endpoints for managing organization roles.

## Base URL

```
/api/organization-roles
```

## Response Structure

All responses follow this standard structure:

```json
{
  "success": boolean,
  "message": string,
  "data": object | null,
  "error": {
    "code": string,
    "details": string
  } | null,
  "requestId": string
}
```

## Endpoints

### Create Organization Role

```http
POST /api/organization-roles
```

Creates a new organization role.

#### Request Body

```json
{
  "organization_id": "string (ObjectId)",
  "role": "string (enum: 'admin', 'member', 'viewer')"
}
```

#### Success Response (201)

```json
{
  "success": true,
  "message": "Organization role created successfully",
  "data": {
    "role": {
      "_id": "string (ObjectId)",
      "organization_id": "string (ObjectId)",
      "role": "string",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)"
    }
  },
  "error": null,
  "requestId": "string"
}
```

### Get All Organization Roles

```http
GET /api/organization-roles
```

Retrieves all organization roles. Can be filtered by organization_id.

#### Query Parameters

- `organization_id` (optional): Filter roles by organization ID

#### Success Response (200)

```json
{
  "success": true,
  "message": "Organization roles retrieved successfully",
  "data": {
    "roles": [
      {
        "_id": "string (ObjectId)",
        "organization_id": "string (ObjectId)",
        "role": "string",
        "created_at": "string (ISO date)",
        "updated_at": "string (ISO date)"
      }
    ]
  },
  "error": null,
  "requestId": "string"
}
```

### Get Organization Role by ID

```http
GET /api/organization-roles/:id
```

Retrieves a specific organization role by its ID.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Organization role retrieved successfully",
  "data": {
    "role": {
      "_id": "string (ObjectId)",
      "organization_id": "string (ObjectId)",
      "role": "string",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)"
    }
  },
  "error": null,
  "requestId": "string"
}
```

### Update Organization Role

```http
PUT /api/organization-roles/:id
```

Updates an existing organization role.

#### Request Body

```json
{
  "role": "string (enum: 'admin', 'member', 'viewer')"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Organization role updated successfully",
  "data": {
    "role": {
      "_id": "string (ObjectId)",
      "organization_id": "string (ObjectId)",
      "role": "string",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)"
    }
  },
  "error": null,
  "requestId": "string"
}
```

### Delete Organization Role

```http
DELETE /api/organization-roles/:id
```

Deletes an organization role.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Organization role deleted successfully",
  "data": {
    "roleId": "string (ObjectId)"
  },
  "error": null,
  "requestId": "string"
}
```

## Error Responses

### Not Found Error (404)

```json
{
  "success": false,
  "message": "Organization role not found",
  "data": null,
  "error": {
    "code": "ROLE_NOT_FOUND",
    "details": "The requested organization role could not be found"
  },
  "requestId": "string"
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Failed to [operation] organization role",
  "data": null,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "details": "Error message details"
  },
  "requestId": "string"
}
```
