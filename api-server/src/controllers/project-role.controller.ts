import { Request, Response } from "express";
import { ProjectRole } from "../models/project-role.model";
import { ApiResponseBuilder } from "../types/api-response";

export const createProjectRole = async (req: Request, res: Response) => {
  try {
    const { name, description, project, permissions } = req.body;
    const userId = res.locals.userId;

    const projectRole = new ProjectRole({
      name,
      description,
      project,
      permissions,
      created_by: userId,
    });

    await projectRole.save();

    return ApiResponseBuilder.send(
      res,
      201,
      ApiResponseBuilder.created(
        "Project role created successfully",
        { role: projectRole },
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
        { role: projectRole },
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
    const { name, description, permissions } = req.body;

    const projectRole = await ProjectRole.findByIdAndUpdate(
      id,
      { name, description, permissions },
      { new: true, runValidators: true }
    );

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
        { role: projectRole },
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

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Project roles retrieved successfully",
        { roles: projectRoles },
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
