import { Router, Request, Response } from "express";
import { ApiResponseBuilder } from "../types/api-response";

const router = Router();

// Example GET endpoint
router.get("/users/:id", (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Simulate fetching user data
    const user = {
      id: userId,
      name: "John Doe",
      email: "john@example.com",
    };

    // Success response with request ID
    const response = ApiResponseBuilder.success(
      "User fetched successfully",
      user,
      undefined,
      req.requestId
    );

    ApiResponseBuilder.send(res, 200, response);
  } catch (error) {
    // Error response with request ID
    const errorResponse = ApiResponseBuilder.error(
      "Failed to fetch user",
      {
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      req.requestId
    );

    ApiResponseBuilder.send(res, 500, errorResponse);
  }
});

// Example POST endpoint with validation
router.post("/users", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const errors: Record<string, string> = {};

  // Simple validation
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (password && password.length < 8)
    errors.password = "Password must be at least 8 characters";

  if (Object.keys(errors).length > 0) {
    // Validation error response
    const errorResponse = ApiResponseBuilder.validationError(
      "Validation failed",
      errors,
      req.requestId
    );

    return ApiResponseBuilder.send(res, 422, errorResponse);
  }

  // Success response for created resource
  const response = ApiResponseBuilder.created(
    "User created successfully",
    { id: "new_user_123", email },
    req.requestId
  );

  ApiResponseBuilder.send(res, 201, response);
});

// Example paginated endpoint
router.get("/users", (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  // Simulate paginated data
  const users = Array(limit)
    .fill(null)
    .map((_, i) => ({
      id: `user_${(page - 1) * limit + i + 1}`,
      name: `User ${(page - 1) * limit + i + 1}`,
      email: `user${(page - 1) * limit + i + 1}@example.com`,
    }));

  const totalItems = 48;
  const totalPages = Math.ceil(totalItems / limit);

  // Paginated response
  const response = ApiResponseBuilder.paginated(
    "Users fetched successfully",
    users,
    {
      page,
      limit,
      totalPages,
      totalItems,
    },
    req.requestId
  );

  ApiResponseBuilder.send(res, 200, response);
});

export default router;
