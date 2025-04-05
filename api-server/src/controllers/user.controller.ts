import { Request, Response } from "express";
import User from "../models/user.model";
import { ApiResponseBuilder } from "../types/api-response";

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const user = await User.findById(userId).select("-passwordHash");

    if (!user) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "User not found",
          {
            code: "USER_NOT_FOUND",
            details: "The requested user could not be found",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "User details retrieved successfully",
        { user },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve user details",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-passwordHash");

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Users retrieved successfully",
        { users },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Get all users error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve users",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-passwordHash");

    if (!user) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "User not found",
          {
            code: "USER_NOT_FOUND",
            details: "The requested user could not be found",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "User retrieved successfully",
        { user },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Get user by ID error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve user",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = res.locals.userId;

    // Check if user is trying to update their own profile
    if (id !== userId) {
      return ApiResponseBuilder.send(
        res,
        403,
        ApiResponseBuilder.error(
          "Forbidden",
          {
            code: "FORBIDDEN",
            details: "You can only update your own profile",
          },
          req.requestId
        )
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!user) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "User not found",
          {
            code: "USER_NOT_FOUND",
            details: "The requested user could not be found",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "User updated successfully",
        { user },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Update user error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to update user",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = res.locals.userId;

    // Check if user is trying to delete their own profile
    if (id !== userId) {
      return ApiResponseBuilder.send(
        res,
        403,
        ApiResponseBuilder.error(
          "Forbidden",
          {
            code: "FORBIDDEN",
            details: "You can only delete your own profile",
          },
          req.requestId
        )
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "User not found",
          {
            code: "USER_NOT_FOUND",
            details: "The requested user could not be found",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "User deleted successfully",
        { userId: id },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to delete user",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};
