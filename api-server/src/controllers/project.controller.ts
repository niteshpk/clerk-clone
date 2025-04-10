import { Request, Response } from "express";
import Project from "../models/project.model";
import { ApiResponseBuilder } from "../types/api-response";
import { transformDocument } from "../utils/transform";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = res.locals.userId;
    console.log(userId);
    // Generate slug from name
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    while (await Project.findOne({ slug })) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
    }

    const project = await Project.create({
      name,
      slug,
      created_by: userId,
    });

    const transformedProject = transformDocument(project.toObject());

    return ApiResponseBuilder.send(
      res,
      201,
      ApiResponseBuilder.created(
        "Project created successfully",
        { project: transformedProject },
        req.requestId
      )
    );
  } catch (error) {
    console.error("Create project error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to create project",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const getMyProjects = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const projects = await Project.find({ created_by: userId }).lean();
    const transformedProjects = transformDocument(projects);

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Projects retrieved successfully",
        { projects: transformedProjects },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Get my projects error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve projects",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).lean();

    if (!project) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Project not found",
          {
            code: "PROJECT_NOT_FOUND",
            details: "The requested project could not be found",
          },
          req.requestId
        )
      );
    }

    const transformedProject = transformDocument(project.toObject());

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Project retrieved successfully",
        { project: transformedProject },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Get project by ID error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to retrieve project",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = res.locals.userId;

    const project = await Project.findOne({
      _id: id,
      created_by: userId,
    });

    if (!project) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Project not found",
          {
            code: "PROJECT_NOT_FOUND",
            details: "The requested project could not be found",
          },
          req.requestId
        )
      );
    }

    // If name is being updated, generate new slug
    if (name && name !== project.name) {
      let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      while (await Project.findOne({ slug, _id: { $ne: id } })) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
      }
      project.slug = slug;
    }

    project.name = name || project.name;
    await project.save();

    const transformedProject = transformDocument(project.toObject());

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Project updated successfully",
        { project: transformedProject },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Update project error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to update project",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = res.locals.userId;

    const project = await Project.findOneAndDelete({
      _id: id,
      created_by: userId,
    });

    if (!project) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Project not found",
          {
            code: "PROJECT_NOT_FOUND",
            details: "The requested project could not be found",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Project deleted successfully",
        { projectId: id },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Delete project error:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to delete project",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};
