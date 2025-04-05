import { Request, Response } from "express";
import Organization from "../models/org.model";
import { ApiResponseBuilder } from "../types/api-response";
import { transformDocument } from "../utils/transform";

// Helper function to generate a unique slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const createOrg = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = res.locals.userId;

    // Generate a unique slug
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists and append a counter if it does
    while (await Organization.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const org = await Organization.create({
      name,
      slug,
      created_by: userId,
    });

    const orgData = transformDocument(org.toObject());

    return ApiResponseBuilder.send(
      res,
      201,
      ApiResponseBuilder.created(
        "Organization created successfully",
        { org: orgData },
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
    const orgs = await Organization.find({ created_by: userId }).lean();
    const transformedOrgs = transformDocument(orgs);

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Organizations retrieved successfully",
        { orgs: transformedOrgs },
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
      created_by: userId,
    }).lean();

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

    const transformedOrg = transformDocument(org);

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Organization retrieved successfully",
        { org: transformedOrg },
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
      created_by: userId,
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

    // If name is being updated, generate a new slug
    if (name && name !== org.name) {
      const baseSlug = generateSlug(name);
      let slug = baseSlug;
      let counter = 1;

      while (await Organization.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      org.name = name;
      org.slug = slug;
    }

    await org.save();
    const orgData = transformDocument(org.toObject());

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Organization updated successfully",
        { org: orgData },
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
      created_by: userId,
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
