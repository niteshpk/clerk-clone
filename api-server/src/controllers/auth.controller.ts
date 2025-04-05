import { Request, Response } from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Session from "../models/session.model";
import EmailVerification from "../models/email-verification.model";
import {
  generateVerificationToken,
  sendVerificationEmail,
} from "../services/email.service";
import { ApiResponseBuilder } from "../types/api-response";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponseBuilder.send(
        res,
        409,
        ApiResponseBuilder.error(
          "Email already registered. Please use a different email or try logging in.",
          { code: "EMAIL_EXISTS" },
          req.requestId
        )
      );
    }

    const hashed = await hash(password, 10);
    const user = await User.create({
      email,
      passwordHash: hashed,
    });

    // Create email verification record
    const verificationToken = generateVerificationToken();
    await EmailVerification.create({
      userId: user._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await sendVerificationEmail(email, verificationToken);

    return ApiResponseBuilder.send(
      res,
      201,
      ApiResponseBuilder.created(
        "Registration successful. Please check your email to verify your account.",
        { email: user.email },
        req.requestId
      )
    );
  } catch (error) {
    console.error("Registration error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "An error occurred during registration. Please try again.",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      const fields: Record<string, string> = {};
      if (!token) fields.token = "Token is required";
      if (!email) fields.email = "Email is required";

      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Verification token and email are required",
          {
            code: "MISSING_PARAMETERS",
            fields,
          },
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
          "User not found",
          { code: "USER_NOT_FOUND" },
          req.requestId
        )
      );
    }

    const verification = await EmailVerification.findOne({
      userId: user._id,
      token,
      expiresAt: { $gt: new Date() },
      isVerified: false,
    });

    if (!verification) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Invalid or expired verification token",
          {
            code: "INVALID_TOKEN",
            details:
              "The verification token is invalid, expired, or does not match the provided email address",
          },
          req.requestId
        )
      );
    }

    // Update verification status
    verification.isVerified = true;
    await verification.save();

    // Update user's email verification status
    user.isEmailVerified = true;
    await user.save();

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Email verified successfully",
        { email: user.email },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to verify email",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Email and password are required",
          { code: "MISSING_CREDENTIALS" },
          req.requestId
        )
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponseBuilder.send(
        res,
        401,
        ApiResponseBuilder.error(
          "Invalid credentials",
          { code: "INVALID_CREDENTIALS" },
          req.requestId
        )
      );
    }

    // Check if email is verified
    const verification = await EmailVerification.findOne({
      userId: user._id,
      isVerified: true,
    });

    if (!verification) {
      // Check if there's an existing unverified token
      const existingVerification = await EmailVerification.findOne({
        userId: user._id,
        isVerified: false,
        expiresAt: { $gt: new Date() },
      });

      let details = "Please verify your email before logging in.";

      if (!existingVerification) {
        // Generate new verification token if none exists
        const newToken = generateVerificationToken();
        await EmailVerification.create({
          userId: user._id,
          token: newToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });
        await sendVerificationEmail(user.email, newToken);
        details =
          "A new verification email has been sent to your email address.";
      } else {
        details =
          "A verification email has already been sent to your email address. Please check your inbox.";
      }

      return ApiResponseBuilder.send(
        res,
        403,
        ApiResponseBuilder.error(
          "Email not verified",
          {
            code: "EMAIL_NOT_VERIFIED",
            details,
            fields: {
              email: user.email,
              canResend: (!existingVerification).toString(),
            },
          },
          req.requestId
        )
      );
    }

    const isValidPassword = await compare(password, user.passwordHash);
    if (!isValidPassword) {
      return ApiResponseBuilder.send(
        res,
        401,
        ApiResponseBuilder.error(
          "Invalid credentials",
          { code: "INVALID_CREDENTIALS" },
          req.requestId
        )
      );
    }

    const session = await Session.create({ user: user._id });
    const token = jwt.sign(
      { sessionId: session._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Login successful",
        { token },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Login error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "An error occurred during login. Please try again.",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await Session.findByIdAndDelete(res.locals.sessionId);
    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Logged out successfully",
        undefined,
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Logout error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "An error occurred during logout. Please try again.",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
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

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "User not found",
          { code: "USER_NOT_FOUND" },
          req.requestId
        )
      );
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Email is already verified",
          { code: "ALREADY_VERIFIED" },
          req.requestId
        )
      );
    }

    // Delete any existing unverified tokens
    await EmailVerification.deleteMany({
      userId: user._id,
      isVerified: false,
    });

    // Create new verification token
    const verificationToken = generateVerificationToken();
    await EmailVerification.create({
      userId: user._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Verification email sent successfully",
        { email },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Resend verification email error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to resend verification email",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};
