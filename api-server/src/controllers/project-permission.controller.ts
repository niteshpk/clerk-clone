import { Request, Response } from "express";
import ProjectPermission from "../models/project-permission.model";
import { ApiResponseBuilder } from "../types/api-response";

export const createProjectPermission = async (req: Request, res: Response) => {
  try {
    const { user, project, role, permissions } = req.body;
    const userId = res.locals.userId;

    if (!project) {
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
      user,
      project,
      role,
      permissions,
      created_by: userId,
    });

    await projectPermission.save();

    return ApiResponseBuilder.send(
      res,
      201,
      ApiResponseBuilder.created(
        "Project permission created successfully",
        { permission: projectPermission },
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
    const { role, permissions } = req.body;
    const userId = res.locals.userId;

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
      { role, permissions },
      { new: true, runValidators: true }
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
        { permission: projectPermission },
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
          "Project ID is required",
          { code: "MISSING_PROJECT_ID" },
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
