import { Request, Response } from "express";
import Organization from "../models/org.model";
import { ApiResponseBuilder } from "../types/api-response";

export const createOrg = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = res.locals.userId;

    const org = await Organization.create({
      name,
      ownerId: userId,
      members: [userId],
    });

    return ApiResponseBuilder.send(
      res,
      201,
      ApiResponseBuilder.created(
        "Organization created successfully",
        { org },
        req.requestId
      )
    );
  } catch (error) {
    console.error("Create organization error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to create organization",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const getMyOrgs = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const orgs = await Organization.find({ members: userId });

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Organizations retrieved successfully",
        { orgs },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Get organizations error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve organizations",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const getOrgById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = res.locals.userId;

    const org = await Organization.findOne({
      _id: id,
      members: userId,
    });

    if (!org) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Organization not found",
          {
            code: "ORG_NOT_FOUND",
            details:
              "The requested organization could not be found or you don't have access to it",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Organization retrieved successfully",
        { org },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Get organization error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve organization",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const updateOrg = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = res.locals.userId;
    const { name } = req.body;

    const org = await Organization.findOne({
      _id: id,
      ownerId: userId,
    });

    if (!org) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Organization not found",
          {
            code: "ORG_NOT_FOUND",
            details:
              "The requested organization could not be found or you don't have permission to update it",
          },
          req.requestId
        )
      );
    }

    org.name = name;
    await org.save();

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Organization updated successfully",
        { org },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Update organization error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to update organization",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const deleteOrg = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = res.locals.userId;

    const org = await Organization.findOneAndDelete({
      _id: id,
      ownerId: userId,
    });

    if (!org) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Organization not found",
          {
            code: "ORG_NOT_FOUND",
            details:
              "The requested organization could not be found or you don't have permission to delete it",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Organization deleted successfully",
        { orgId: id },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Delete organization error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to delete organization",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};
