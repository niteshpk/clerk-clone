import { Request, Response, NextFunction } from "express";
import { ApiResponseBuilder } from "../types/api-response";
import { ValidationErrorItem } from "joi";

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.reduce(
        (acc: Record<string, string>, detail: ValidationErrorItem) => {
          const key = detail.path[0] as string;
          acc[key] = detail.message;
          return acc;
        },
        {}
      );

      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.validationError(
          "Validation failed",
          errorMessages,
          req.requestId
        )
      );
    }

    next();
  };
};
