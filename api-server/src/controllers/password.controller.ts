import { Request, Response } from "express";
import { hash } from "bcrypt";
import User from "../models/user.model";
import PasswordReset from "../models/password-reset.model";
import {
  generateVerificationToken,
  sendPasswordResetEmail,
} from "../services/email.service";
import { emailQueue } from "../services/email-queue.service";
import { ApiResponseBuilder } from "../types/api-response";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Email is required",
          { code: "MISSING_EMAIL" },
          req.requestId
        )
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "User not found with the provided email",
          { code: "USER_NOT_FOUND" },
          req.requestId
        )
      );
    }

    // Delete any existing reset tokens
    await PasswordReset.deleteMany({
      userId: user._id,
      isUsed: false,
    });

    // Create new reset token
    const resetToken = generateVerificationToken();
    await PasswordReset.create({
      userId: user._id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // Add email sending to queue
    emailQueue.addToQueue({
      email: user.email,
      token: resetToken,
      type: "reset",
    });

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Password reset email sent successfully",
        null,
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to process password reset request",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, email, password } = req.body;

    if (!email || !password || !token) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Email, password and token are required",
          { code: "MISSING_CREDENTIALS" },
          req.requestId
        )
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "User not found with the provided email",
          { code: "USER_NOT_FOUND" },
          req.requestId
        )
      );
    }

    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      userId: user._id,
      token,
      expiresAt: { $gt: new Date() },
      isUsed: false,
    });

    if (!resetRecord) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Invalid or expired reset token",
          {
            code: "INVALID_TOKEN",
            details:
              "The reset token is invalid, expired, or has already been used",
          },
          req.requestId
        )
      );
    }

    // Hash new password
    const hashedPassword = await hash(password, 10);

    // Update user's password
    user.passwordHash = hashedPassword;
    await user.save();

    // Mark reset token as used
    resetRecord.isUsed = true;
    await resetRecord.save();

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Password reset successful",
        null,
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to reset password",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};
