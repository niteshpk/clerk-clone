import { Request, Response } from "express";
import { OrganizationRole } from "../models/organizationRole";
import mongoose from "mongoose";
import { ApiResponseBuilder } from "../types/api-response";
import { transformDocument } from "../utils/transform";

export const createOrganizationRole = async (req: Request, res: Response) => {
  try {
    const { organization_id, role } = req.body;

    const organizationRole = new OrganizationRole({
      organization_id: new mongoose.Types.ObjectId(organization_id),
      role,
    });

    await organizationRole.save();
    const roleData = transformDocument(organizationRole.toObject());

    return ApiResponseBuilder.send(
      res,
      201,
      ApiResponseBuilder.created(
        "Organization role created successfully",
        { role: roleData },
        req.requestId
      )
    );
  } catch (error: any) {
    console.error("Create organization role error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to create organization role",
        error.message,
        req.requestId
      )
    );
  }
};

export const getOrganizationRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationRole = await OrganizationRole.findById(id);

    if (!organizationRole) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Organization role not found",
          {
            code: "ROLE_NOT_FOUND",
            details: "The requested organization role could not be found",
          },
          req.requestId
        )
      );
    }

    const roleData = transformDocument(organizationRole.toObject());
    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Organization role retrieved successfully",
        { role: roleData },
        undefined,
        req.requestId
      )
    );
  } catch (error: any) {
    console.error("Get organization role error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve organization role",
        error.message,
        req.requestId
      )
    );
  }
};

export const updateOrganizationRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const organizationRole = await OrganizationRole.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!organizationRole) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Organization role not found",
          {
            code: "ROLE_NOT_FOUND",
            details: "The requested organization role could not be found",
          },
          req.requestId
        )
      );
    }

    const roleData = transformDocument(organizationRole.toObject());
    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Organization role updated successfully",
        { role: roleData },
        undefined,
        req.requestId
      )
    );
  } catch (error: any) {
    console.error("Update organization role error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to update organization role",
        error.message,
        req.requestId
      )
    );
  }
};

export const deleteOrganizationRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationRole = await OrganizationRole.findByIdAndDelete(id);

    if (!organizationRole) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Organization role not found",
          {
            code: "ROLE_NOT_FOUND",
            details: "The requested organization role could not be found",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Organization role deleted successfully",
        { roleId: id },
        undefined,
        req.requestId
      )
    );
  } catch (error: any) {
    console.error("Delete organization role error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to delete organization role",
        error.message,
        req.requestId
      )
    );
  }
};

export const getOrganizationRoles = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;
    const query = organization_id ? { organization_id } : {};

    const organizationRoles = await OrganizationRole.find(query).lean();
    const rolesData = organizationRoles.map((role) => transformDocument(role));

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Organization roles retrieved successfully",
        { roles: rolesData },
        undefined,
        req.requestId
      )
    );
  } catch (error: any) {
    console.error("Get organization roles error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve organization roles",
        error.message,
        req.requestId
      )
    );
  }
};
