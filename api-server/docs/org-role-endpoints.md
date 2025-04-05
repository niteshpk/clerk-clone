# Organization Role Management Endpoints

## Create Organization Role

**Endpoint:** `POST /api/org-roles`

**Description:** Create a new role within an organization.

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
  "organization_id": "org_123",
  "role": "admin"
}
```

**Validation Rules:**

- `organization_id`: Required, valid organization ID
- `role`: Required, string

**Success Response (201):**

```json
{
  "success": true,
  "message": "Organization role created successfully",
  "data": {
    "id": "role_123",
    "organization_id": "org_123",
    "role": "admin",
    "created_at": "2024-04-05T12:00:00.000Z",
    "updated_at": "2024-04-05T12:00:00.000Z"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Get Organization Role

**Endpoint:** `GET /api/org-roles/:id`

**Description:** Get details of a specific organization role.

**Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Path Parameters:**

- `id`: The ID of the organization role

**Success Response (200):**

```json
{
  "success": true,
  "message": "Organization role retrieved successfully",
  "data": {
    "id": "role_123",
    "organization_id": "org_123",
    "role": "admin",
    "created_at": "2024-04-05T12:00:00.000Z",
    "updated_at": "2024-04-05T12:00:00.000Z"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Update Organization Role

**Endpoint:** `PATCH /api/org-roles/:id`

**Description:** Update an existing organization role.

**Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Path Parameters:**

- `id`: The ID of the organization role to update

**Request Body:**

```json
{
  "role": "moderator"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Organization role updated successfully",
  "data": {
    "id": "role_123",
    "organization_id": "org_123",
    "role": "moderator",
    "created_at": "2024-04-05T12:00:00.000Z",
    "updated_at": "2024-04-05T12:30:00.000Z"
  },
  "timestamp": "2024-04-05T12:30:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Delete Organization Role

**Endpoint:** `DELETE /api/org-roles/:id`

**Description:** Delete an organization role.

**Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Path Parameters:**

- `id`: The ID of the organization role to delete

**Success Response (200):**

```json
{
  "success": true,
  "message": "Organization role deleted successfully",
  "timestamp": "2024-04-05T12:30:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Get All Organization Roles

**Endpoint:** `GET /api/org-roles`

**Description:** Get all roles for a specific organization.

**Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Query Parameters:**

- `organization_id`: The ID of the organization (required)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Organization roles retrieved successfully",
  "data": [
    {
      "id": "role_123",
      "organization_id": "org_123",
      "role": "admin",
      "created_at": "2024-04-05T12:00:00.000Z",
      "updated_at": "2024-04-05T12:00:00.000Z"
    },
    {
      "id": "role_456",
      "organization_id": "org_123",
      "role": "member",
      "created_at": "2024-04-05T12:00:00.000Z",
      "updated_at": "2024-04-05T12:00:00.000Z"
    }
  ],
  "timestamp": "2024-04-05T12:30:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Notes

1. All endpoints require authentication via Bearer token
2. Users must have appropriate permissions within the organization to manage roles
3. Role names should be consistent across the organization
4. Deleting a role will remove all user associations with that role
5. The `organization_id` must be a valid organization that the user has access to
