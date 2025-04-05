import { Request, Response } from "express";
import User from "../models/user.model";
import { ApiResponseBuilder } from "../types/api-response";
import { Types } from "mongoose";
import SMSService from "../services/sms-local.service";
import { generateOTP } from "../utils/otp.utils";

// Initialize SMS service
const smsService = new SMSService();

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore: Map<string, { otp: string; timestamp: number }> = new Map();
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to transform _id to id and handle ObjectId and Date conversions
const transformUser = (user: any) => {
  if (!user) return null;
  const { _id, createdAt, updatedAt, lastLogin, ...rest } = user;
  return {
    id: _id instanceof Types.ObjectId ? _id.toString() : _id,
    ...rest,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    lastLogin: lastLogin instanceof Date ? lastLogin.toISOString() : lastLogin,
  };
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Validation Error",
          {
            code: "MISSING_FIELDS",
            details: "Phone number and OTP are required",
          },
          req.requestId
        )
      );
    }

    const storedOTP = otpStore.get(phoneNumber);

    if (!storedOTP) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Invalid OTP",
          {
            code: "OTP_NOT_FOUND",
            details: "OTP not found or expired",
          },
          req.requestId
        )
      );
    }

    if (Date.now() - storedOTP.timestamp > OTP_EXPIRY_TIME) {
      otpStore.delete(phoneNumber);
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Invalid OTP",
          {
            code: "OTP_EXPIRED",
            details: "OTP has expired",
          },
          req.requestId
        )
      );
    }

    if (storedOTP.otp !== otp) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Invalid OTP",
          {
            code: "INVALID_OTP",
            details: "The provided OTP is incorrect",
          },
          req.requestId
        )
      );
    }

    // Clear the OTP after successful verification
    otpStore.delete(phoneNumber);

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "OTP verified successfully",
        null,
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to verify OTP",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Validation Error",
          {
            code: "MISSING_FIELDS",
            details: "Phone number is required",
          },
          req.requestId
        )
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const timestamp = Date.now();

    // Store the new OTP
    otpStore.set(phoneNumber, { otp, timestamp });

    // Send OTP via SMS
    const smsSent = await smsService.sendOTP(phoneNumber, otp);

    if (!smsSent) {
      return ApiResponseBuilder.send(
        res,
        500,
        ApiResponseBuilder.error(
          "SMS Error",
          {
            code: "SMS_SEND_FAILED",
            details: "Failed to send OTP via SMS",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "OTP sent successfully",
        null,
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Error resending OTP:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to resend OTP",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const user = await User.findById(userId).select("-passwordHash").lean();

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
        { user: transformUser(user) },
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
    const users = await User.find().select("-passwordHash").lean();

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Users retrieved successfully",
        { users: users.map(transformUser) },
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
    const user = await User.findById(id).select("-passwordHash").lean();

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
        { user: transformUser(user) },
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

    // Validate phone number if provided
    if (req.body.phone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
      if (!phoneRegex.test(req.body.phone)) {
        return ApiResponseBuilder.send(
          res,
          400,
          ApiResponseBuilder.error(
            "Invalid phone number",
            {
              code: "INVALID_PHONE",
              details: "Phone number must be in E.164 format",
            },
            req.requestId
          )
        );
      }
    }

    const updateData = {
      ...req.body,
      // Ensure passwordHash is not accidentally updated
      passwordHash: undefined,
    };

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select("-passwordHash")
      .lean();

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
        { user: transformUser(user) },
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
