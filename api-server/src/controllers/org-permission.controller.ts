import { Request, Response } from "express";
import Permission from "../models/org-permission.model";
import { ApiResponseBuilder } from "../types/api-response";

// Helper function to transform permission document
const transformPermission = (permission: any) => {
  if (!permission) return null;

  const transformed = {
    id: permission._id?.toString(),
    name: permission.name,
    description: permission.description,
    organization_id: permission.organization_id?.toString(),
    created_at: permission.created_at?.toISOString(),
    updated_at: permission.updated_at?.toISOString(),
  };

  return transformed;
};

/**
 * GET /api/org-permissions
 * Get all permissions for an organization
 */
export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Organization ID is required",
          {
            code: "MISSING_ORGANIZATION_ID",
            details:
              "Please provide an organization_id in the query parameters",
          },
          req.requestId
        )
      );
    }

    const permissions = await Permission.find({ organization_id })
      .sort({
        created_at: -1,
      })
      .lean();
    const transformedPermissions = permissions.map(transformPermission);

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Permissions retrieved successfully",
        { permissions: transformedPermissions },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Error retrieving permissions:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve permissions",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

/**
 * POST /api/org-permissions
 * Create a new permission for an organization
 */
export const createPermission = async (req: Request, res: Response) => {
  try {
    const { name, description, organization_id } = req.body;

    if (!organization_id) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Organization ID is required",
          {
            code: "MISSING_ORGANIZATION_ID",
            details: "Please provide an organization_id in the request body",
          },
          req.requestId
        )
      );
    }

    const existingPermission = await Permission.findOne({
      name,
      organization_id,
    });
    if (existingPermission) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Permission already exists",
          {
            code: "DUPLICATE_PERMISSION",
            details:
              "A permission with this name already exists in this organization",
          },
          req.requestId
        )
      );
    }

    const permission = await Permission.create({
      name,
      description,
      organization_id,
    });

    const transformedPermission = transformPermission(permission);

    return ApiResponseBuilder.send(
      res,
      201,
      ApiResponseBuilder.success(
        "Permission created successfully",
        { permission: transformedPermission },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Error creating permission:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to create permission",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

/**
 * PUT /api/org-permissions/:id
 * Update a permission in an organization
 */
export const updatePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, organization_id } = req.body;

    if (!organization_id) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Organization ID is required",
          {
            code: "MISSING_ORGANIZATION_ID",
            details: "Please provide an organization_id in the request body",
          },
          req.requestId
        )
      );
    }

    const permission = await Permission.findOne({ _id: id, organization_id });
    if (!permission) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Permission not found",
          {
            code: "PERMISSION_NOT_FOUND",
            details:
              "The requested permission does not exist in this organization",
          },
          req.requestId
        )
      );
    }

    // Check if the new name is already taken by another permission in the same organization
    if (name && name !== permission.name) {
      const existingPermission = await Permission.findOne({
        name,
        organization_id,
      });
      if (existingPermission) {
        return ApiResponseBuilder.send(
          res,
          400,
          ApiResponseBuilder.error(
            "Permission name already exists",
            {
              code: "DUPLICATE_PERMISSION",
              details:
                "A permission with this name already exists in this organization",
            },
            req.requestId
          )
        );
      }
    }

    const updatedPermission = await Permission.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    ).lean();

    const transformedPermission = transformPermission(updatedPermission);

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Permission updated successfully",
        { permission: transformedPermission },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Error updating permission:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to update permission",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

/**
 * DELETE /api/org-permissions/:id
 * Delete a permission from an organization
 */
export const deletePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findByIdAndDelete(id);

    if (!permission) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Permission not found",
          {
            code: "PERMISSION_NOT_FOUND",
            details:
              "The requested permission does not exist in this organization",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Permission deleted successfully",
        { permissionId: id },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Error deleting permission:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to delete permission",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

/**
 * GET /api/org-permissions/:id
 * Get a single permission by ID
 */
export const getPermissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findById(id);
    if (!permission) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Permission not found",
          {
            code: "PERMISSION_NOT_FOUND",
            details:
              "The requested permission does not exist in this organization",
          },
          req.requestId
        )
      );
    }

    const transformedPermission = transformPermission(permission);

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Permission retrieved successfully",
        { permission: transformedPermission },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Error retrieving permission:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve permission",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};
