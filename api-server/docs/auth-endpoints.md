# Authentication Endpoints

## Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user account.

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "your_secure_password",
  "fullName": "John Doe",
  "phone": "+1234567890"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "fullName": "John Doe",
      "phone": "+1234567890",
      "isEmailVerified": false,
      "isPhoneVerified": false,
      "lastLogin": null,
      "createdAt": "2024-04-05T12:00:00.000Z",
      "updatedAt": "2024-04-05T12:00:00.000Z"
    }
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (400) - Invalid Phone Number:**

```json
{
  "success": false,
  "message": "Invalid phone number",
  "error": {
    "code": "INVALID_PHONE",
    "details": "Phone number must be in E.164 format"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (409):**

```json
{
  "success": false,
  "message": "Email already registered. Please use a different email or try logging in.",
  "error": {
    "code": "EMAIL_EXISTS"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate a user and create a session.

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "your_secure_password"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "fullName": "John Doe",
      "phone": "+1234567890",
      "isEmailVerified": true,
      "isPhoneVerified": false,
      "lastLogin": "2024-04-05T12:00:00.000Z",
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
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** End the current user session.

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
  "message": "Logged out successfully",
  "data": {
    "sessionId": "65f0ee85929231ae9940c0fb",
    "logoutTime": "2024-04-05T10:01:52.556Z"
  },
  "timestamp": "2024-04-05T10:01:52.556Z",
  "requestId": "599c73c1-f19a-4c90-a913-b96a83e43837"
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

## Verify Email

**Endpoint:** `GET /api/auth/verify-email`

**Description:** Verify a user's email address using the verification token.

**Query Parameters:**

```
?token=verification_token&email=user@example.com
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "email": "user@example.com"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Invalid or expired verification token",
  "error": {
    "code": "INVALID_TOKEN",
    "details": "The verification token is invalid, expired, or does not match the provided email address"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Resend Verification Email

**Endpoint:** `POST /api/auth/resend-verification`

**Description:** Request a new verification email to be sent.

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Verification email sent successfully",
  "data": {
    "email": "user@example.com"
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
    "code": "USER_NOT_FOUND"
  },
  "timestamp": "2024-04-05T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```
