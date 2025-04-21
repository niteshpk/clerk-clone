import { Request, Response } from "express";
import ProjectPermission from "../models/project-permission.model";
import { ApiResponseBuilder } from "../types/api-response";
import { transformDocument } from "../utils/transform";

export const createProjectPermission = async (req: Request, res: Response) => {
  try {
    const { project_id, permission } = req.body;
    const userId = res.locals.userId;

    if (!project_id) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Project ID is required",
          { code: "MISSING_PROJECT_ID" },
          req.requestId
        )
      );
    }

    const projectPermission = new ProjectPermission({
      project_id,
      permission,
      created_by: userId,
    });

    await projectPermission.save();

    const transformedProjectPermission = transformDocument(
      projectPermission.toObject()
    );

    return ApiResponseBuilder.send(
      res,
      201,
      ApiResponseBuilder.created(
        "Project permission created successfully",
        { permission: transformedProjectPermission },
        req.requestId
      )
    );
  } catch (error) {
    console.error("Create project permission error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to create project permission",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const updateProjectPermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { project_id, permission } = req.body;

    if (!id) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Project ID is required",
          { code: "MISSING_PROJECT_ID" },
          req.requestId
        )
      );
    }

    const projectPermission = await ProjectPermission.findByIdAndUpdate(
      id,
      { project_id, permission },
      { new: true, runValidators: true }
    );

    const transformedProjectPermission = transformDocument(
      projectPermission?.toObject()
    );

    if (!projectPermission) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Project permission not found",
          {
            code: "PERMISSION_NOT_FOUND",
            details: "The requested project permission could not be found",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Project permission updated successfully",
        { permission: transformedProjectPermission },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Update project permission error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to update project permission",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const deleteProjectPermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "ID is required",
          { code: "MISSING_ID" },
          req.requestId
        )
      );
    }

    const projectPermission = await ProjectPermission.findByIdAndDelete(id);

    if (!projectPermission) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Project permission not found",
          {
            code: "PERMISSION_NOT_FOUND",
            details: "The requested project permission could not be found",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Project permission deleted successfully",
        { permissionId: id },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Delete project permission error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to delete project permission",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const getProjectPermissions = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    const query = projectId ? { project_id: projectId } : {};

    const projectPermissions = await ProjectPermission.find(query).lean();

    const transformedProjectPermissions = projectPermissions.map((permission) =>
      transformDocument(permission)
    );

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Project permissions fetched successfully",
        { permissions: transformedProjectPermissions },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Get project permission error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to get project permission",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const getProjectPermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Project ID is required",
          { code: "MISSING_PROJECT_ID" },
          req.requestId
        )
      );
    }

    const projectPermission = await ProjectPermission.findById(id);

    const transformedProjectPermission = transformDocument(
      projectPermission?.toObject()
    );

    if (!projectPermission) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Project permission not found",
          {
            code: "PERMISSION_NOT_FOUND",
            details: "The requested project permission could not be found",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Project permission fetched successfully",
        { permission: transformedProjectPermission },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Get project permission error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to get project permission",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};
