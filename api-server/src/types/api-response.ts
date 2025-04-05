import { Response } from "express";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
  error?: {
    code: string;
    details?: string;
    fields?: Record<string, string>;
  };
  timestamp?: string;
  requestId?: string;
};

export class ApiResponseBuilder {
  private static cleanData<T>(data: T): T {
    if (data === null || data === undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.cleanData(item)) as T;
    }

    if (typeof data === "object") {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (key !== "__v") {
          cleaned[key] = this.cleanData(value);
        }
      }
      return cleaned as T;
    }

    return data;
  }

  static success<T>(
    message: string,
    data?: T,
    pagination?: ApiResponse<T>["pagination"],
    requestId?: string
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data: data ? this.cleanData(data) : undefined,
      pagination,
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  static error(
    message: string,
    error: {
      code: string;
      details?: string;
      fields?: Record<string, string>;
    },
    requestId?: string
  ): ApiResponse<never> {
    return {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  static send<T>(
    res: Response,
    statusCode: number,
    response: ApiResponse<T>
  ): Response {
    const cleanedResponse = {
      ...response,
      data: response.data ? this.cleanData(response.data) : undefined,
    };
    return res.status(statusCode).json(cleanedResponse);
  }

  // New helper methods for common scenarios
  static created<T>(
    message: string,
    data: T,
    requestId?: string
  ): ApiResponse<T> {
    return this.success(message, data, undefined, requestId);
  }

  static notFound(message: string, requestId?: string): ApiResponse<never> {
    return this.error(message, { code: "NOT_FOUND" }, requestId);
  }

  static validationError(
    message: string,
    fields: Record<string, string>,
    requestId?: string
  ): ApiResponse<never> {
    return this.error(message, { code: "VALIDATION_ERROR", fields }, requestId);
  }

  static unauthorized(
    message: string = "Unauthorized",
    requestId?: string
  ): ApiResponse<never> {
    return this.error(message, { code: "UNAUTHORIZED" }, requestId);
  }

  static forbidden(
    message: string = "Forbidden",
    requestId?: string
  ): ApiResponse<never> {
    return this.error(message, { code: "FORBIDDEN" }, requestId);
  }

  static internalError(
    message: string = "Internal Server Error",
    details?: string,
    requestId?: string
  ): ApiResponse<never> {
    return this.error(message, { code: "INTERNAL_ERROR", details }, requestId);
  }

  static paginated<T>(
    message: string,
    data: T[],
    pagination: ApiResponse<T>["pagination"],
    requestId?: string
  ): ApiResponse<T[]> {
    return this.success(message, data, pagination, requestId);
  }
}

// Example usage:
// const response = ApiResponseBuilder.success('User fetched successfully', userData);
// ApiResponseBuilder.send(res, 200, response);

// const errorResponse = ApiResponseBuilder.error(
//   'User not found',
//   { code: 'USER_NOT_FOUND', details: 'No user exists with the given ID' }
// );
// ApiResponseBuilder.send(res, 404, errorResponse);
