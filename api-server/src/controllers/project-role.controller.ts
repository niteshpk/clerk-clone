import { Request, Response } from "express";
import { ProjectRole } from "../models/project-role.model";
import { ApiResponseBuilder } from "../types/api-response";
import { transformDocument } from "../utils/transform";

export const createProjectRole = async (req: Request, res: Response) => {
  try {
    const { role, project_id } = req.body;
    const userId = res.locals.userId;

    const projectRole = new ProjectRole({
      role,
      project_id,
      created_by: userId,
    });

    await projectRole.save();

    const transformedProjectRole = transformDocument(projectRole.toObject());

    return ApiResponseBuilder.send(
      res,
      201,
      ApiResponseBuilder.created(
        "Project role created successfully",
        { role: transformedProjectRole },
        req.requestId
      )
    );
  } catch (error) {
    console.error("Create project role error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to create project role",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const getProjectRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projectRole = await ProjectRole.findById(id);

    const transformedProjectRole = transformDocument(projectRole?.toObject());

    if (!projectRole) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Project role not found",
          {
            code: "ROLE_NOT_FOUND",
            details: "The requested project role could not be found",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Project role retrieved successfully",
        { role: transformedProjectRole },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Get project role error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve project role",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const updateProjectRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, project_id } = req.body;

    const projectRole = await ProjectRole.findByIdAndUpdate(
      id,
      { role, project_id },
      { new: true, runValidators: true }
    );

    const transformedProjectRole = transformDocument(projectRole?.toObject());

    if (!projectRole) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Project role not found",
          {
            code: "ROLE_NOT_FOUND",
            details: "The requested project role could not be found",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Project role updated successfully",
        { role: transformedProjectRole },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Update project role error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to update project role",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const deleteProjectRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projectRole = await ProjectRole.findByIdAndDelete(id);

    if (!projectRole) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Project role not found",
          {
            code: "ROLE_NOT_FOUND",
            details: "The requested project role could not be found",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Project role deleted successfully",
        { roleId: id },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Delete project role error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to delete project role",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const getProjectRoles = async (req: Request, res: Response) => {
  try {
    const { project } = req.query;
    const query = project ? { project } : {};

    const projectRoles = await ProjectRole.find(query).lean();
    const transformedProjectRoles = transformDocument(projectRoles);
    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Project roles retrieved successfully",
        { roles: transformedProjectRoles },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Get project roles error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve project roles",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};
