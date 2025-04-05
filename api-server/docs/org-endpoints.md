# Organization Endpoints

## Create Organization

**Endpoint:** `POST /api/orgs`

**Description:** Create a new organization.

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
  "name": "My Organization"
}
```

**Validation Rules:**

- `name`: Required, 2-50 characters

**Success Response (201):**

```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "org": {
      "_id": "org_123",
      "name": "My Organization",
      "slug": "my-organization",
      "created_by": "user_123",
      "created_at": "2024-04-05T12:00:00.000Z",
      "updated_at": "2024-04-05T12:00:00.000Z"
    }
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "fields": {
      "name": "Organization name must be between 2 and 50 characters"
    }
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Get My Organizations

**Endpoint:** `GET /api/orgs`

**Description:** Get all organizations created by the current user.

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
  "message": "Organizations retrieved successfully",
  "data": {
    "orgs": [
      {
        "_id": "org_123",
        "name": "My Organization",
        "slug": "my-organization",
        "created_by": "user_123",
        "created_at": "2024-04-05T12:00:00.000Z",
        "updated_at": "2024-04-05T12:00:00.000Z"
      }
    ]
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Get Organization by ID

**Endpoint:** `GET /api/orgs/:id`

**Description:** Get details of a specific organization.

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
  "message": "Organization retrieved successfully",
  "data": {
    "org": {
      "_id": "org_123",
      "name": "My Organization",
      "slug": "my-organization",
      "created_by": "user_123",
      "created_at": "2024-04-05T12:00:00.000Z",
      "updated_at": "2024-04-05T12:00:00.000Z"
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
  "message": "Organization not found",
  "error": {
    "code": "ORG_NOT_FOUND",
    "details": "The requested organization could not be found or you don't have access to it"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Update Organization

**Endpoint:** `PUT /api/orgs/:id`

**Description:** Update an organization's details.

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
  "name": "Updated Organization Name"
}
```

**Validation Rules:**

- `name`: Optional, 2-50 characters

**Success Response (200):**

```json
{
  "success": true,
  "message": "Organization updated successfully",
  "data": {
    "org": {
      "_id": "org_123",
      "name": "Updated Organization Name",
      "slug": "updated-organization-name",
      "created_by": "user_123",
      "created_at": "2024-04-05T12:00:00.000Z",
      "updated_at": "2024-04-05T12:00:00.000Z"
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
  "message": "Organization not found",
  "error": {
    "code": "ORG_NOT_FOUND",
    "details": "The requested organization could not be found or you don't have permission to update it"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Delete Organization

**Endpoint:** `DELETE /api/orgs/:id`

**Description:** Delete an organization.

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
  "message": "Organization deleted successfully",
  "data": {
    "orgId": "org_123"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Organization not found",
  "error": {
    "code": "ORG_NOT_FOUND",
    "details": "The requested organization could not be found or you don't have permission to delete it"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```
