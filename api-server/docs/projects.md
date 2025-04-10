# Project Management API

## Project Model

```typescript
interface Project {
  name: string; // Project name (2-50 characters)
  slug: string; // Unique URL-friendly identifier
  created_by: string; // User ID who created the project
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
  requestId: string;
}
```

## Endpoints

### Create Project

- **POST** `/api/projects`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "My Project",
    "slug": "my-project"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Project created successfully",
    "data": {
      "project": {
        "name": "My Project",
        "slug": "my-project",
        "createdAt": "2024-03-20T12:00:00Z",
        "updatedAt": "2024-03-20T12:00:00Z",
        "id": "507f1f77bcf86cd799439011"
      }
    },
    "timestamp": "2024-03-20T12:00:00Z",
    "requestId": "2de787fa-e72f-4868-bf6b-349b59789e98"
  }
  ```

### Get My Projects

- **GET** `/api/projects`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "projects": [
        {
          "name": "My Project",
          "slug": "my-project",
          "createdAt": "2024-03-20T12:00:00Z",
          "updatedAt": "2024-03-20T12:00:00Z",
          "id": "507f1f77bcf86cd799439011"
        }
      ]
    },
    "timestamp": "2024-03-20T12:00:00Z",
    "requestId": "2de787fa-e72f-4868-bf6b-349b59789e98"
  }
  ```

### Get Project by ID

- **GET** `/api/projects/:id`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "project": {
        "name": "My Project",
        "slug": "my-project",
        "createdAt": "2024-03-20T12:00:00Z",
        "updatedAt": "2024-03-20T12:00:00Z",
        "id": "507f1f77bcf86cd799439011"
      }
    },
    "timestamp": "2024-03-20T12:00:00Z",
    "requestId": "2de787fa-e72f-4868-bf6b-349b59789e98"
  }
  ```

### Update Project

- **PUT** `/api/projects/:id`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "Updated Project Name",
    "slug": "updated-project-slug"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Project updated successfully",
    "data": {
      "project": {
        "name": "Updated Project Name",
        "slug": "updated-project-slug",
        "createdAt": "2024-03-20T12:00:00Z",
        "updatedAt": "2024-03-20T12:30:00Z",
        "id": "507f1f77bcf86cd799439011"
      }
    },
    "timestamp": "2024-03-20T12:30:00Z",
    "requestId": "2de787fa-e72f-4868-bf6b-349b59789e98"
  }
  ```

### Delete Project

- **DELETE** `/api/projects/:id`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Project deleted successfully",
    "data": {
      "project": {
        "name": "My Project",
        "slug": "my-project",
        "createdAt": "2024-03-20T12:00:00Z",
        "updatedAt": "2024-03-20T12:00:00Z",
        "id": "507f1f77bcf86cd799439011"
      }
    },
    "timestamp": "2024-03-20T12:00:00Z",
    "requestId": "2de787fa-e72f-4868-bf6b-349b59789e98"
  }
  ```

## Error Responses

### Validation Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "name": "Name is required",
      "slug": "Slug must be unique"
    }
  },
  "timestamp": "2024-03-20T12:00:00Z",
  "requestId": "2de787fa-e72f-4868-bf6b-349b59789e98"
}
```

### Not Found Error

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Project not found"
  },
  "timestamp": "2024-03-20T12:00:00Z",
  "requestId": "2de787fa-e72f-4868-bf6b-349b59789e98"
}
```

### Unauthorized Error

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "You don't have permission to perform this action"
  },
  "timestamp": "2024-03-20T12:00:00Z",
  "requestId": "2de787fa-e72f-4868-bf6b-349b59789e98"
}
```
