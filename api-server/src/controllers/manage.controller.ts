import { Request, Response } from "express";
import ManagePermission from "../models/manage.model";
import { ProjectRole } from "../models/project-role.model";
import ProjectPermission from "../models/project-permission.model";
import { Types } from "mongoose";

interface IPermission {
  permissionId: string;
  isChecked: boolean;
  permission?: string;
}

interface IRolePermission {
  roleId: string;
  roleName?: string;
  permissions: IPermission[];
}

export const getRoleWisePermissionsForProject = async (
  req: Request,
  res: Response
) => {
  try {
    const { projectId } = req.params;
    const userId = res.locals.userId;

    // Get all roles for this project
    const roles = await ProjectRole.find({
      project_id: new Types.ObjectId(projectId),
    }).lean();

    // Get all permissions for this project
    const permissions = await ProjectPermission.find({
      project_id: new Types.ObjectId(projectId),
    }).lean();

    // If no roles or permissions exist, return empty array
    if (!roles.length || !permissions.length) {
      return res.status(200).json({
        success: true,
        message: "Project permissions fetched successfully",
        data: {
          permissions: [],
        },
        timestamp: new Date().toISOString(),
        requestId: req.requestId,
      });
    }

    // Get all managed permissions for this project
    const managedPermissions = await ManagePermission.find({
      project_id: new Types.ObjectId(projectId),
    }).lean();

    // Create a map of permission IDs to permission names
    const permissionMap = new Map(
      permissions.map((perm: any) => [perm._id.toString(), perm.permission])
    );

    // For each role, ensure all permissions exist
    const roleWisePermissions = await Promise.all(
      roles.map(async (role) => {
        const roleId = role._id.toString();
        const rolePermissions = managedPermissions
          .filter((perm) => perm.role_id.toString() === roleId)
          .map((perm) => ({
            permissionId: perm.permission_id.toString(),
            isChecked: perm.is_checked,
            permission: permissionMap.get(perm.permission_id.toString()) || "",
          }));

        // If no permissions exist for this role, create them
        if (rolePermissions.length === 0) {
          const newPermissions = await Promise.all(
            permissions.map(async (perm) => {
              const newPermission = await ManagePermission.create({
                project_id: new Types.ObjectId(projectId),
                role_id: new Types.ObjectId(roleId),
                permission_id: new Types.ObjectId(perm._id.toString()),
                is_checked: false,
                created_by: userId,
              });

              return {
                permissionId: newPermission.permission_id.toString(),
                isChecked: false,
                permission: perm.permission,
              };
            })
          );

          return {
            roleId,
            roleName: role.role,
            permissions: newPermissions,
          };
        }

        return {
          roleId,
          roleName: role.role,
          permissions: rolePermissions,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Project permissions fetched successfully",
      data: {
        permissions: roleWisePermissions,
      },
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    });
  } catch (error) {
    console.error("Get project permissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve project permissions",
      error: error instanceof Error ? error.message : "Internal server error",
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    });
  }
};

export const updateRoleWisePermissionsForProject = async (
  req: Request,
  res: Response
) => {
  try {
    const { projectId } = req.params;
    const rolePermissions: IRolePermission[] = req.body;
    const userId = res.locals.userId;

    // Validate input
    if (!Array.isArray(rolePermissions)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: {
          code: "INVALID_REQUEST_BODY",
          details: "Request body must be an array of role permissions",
        },
        timestamp: new Date().toISOString(),
        requestId: req.requestId,
      });
    }

    // Get all roles and permissions in one go
    const [roles, permissionDetails] = await Promise.all([
      ProjectRole.find().lean(),
      ProjectPermission.find().lean(),
    ]);

    // Create lookup maps
    const roleMap = new Map(
      roles.map((role: any) => [role._id.toString(), role.role])
    );
    const permissionMap = new Map(
      permissionDetails.map((perm: any) => [
        perm._id.toString(),
        perm.permission,
      ])
    );

    // Process each role's permissions
    const results = await Promise.all(
      rolePermissions.map(async (rolePermission) => {
        const { roleId, permissions } = rolePermission;

        // Update or create each permission
        const permissionUpdates = await Promise.all(
          permissions.map(async (perm: IPermission) => {
            const { permissionId, isChecked } = perm;

            // First, try to find and update existing permission
            const existingPermission = await ManagePermission.findOne({
              project_id: new Types.ObjectId(projectId),
              role_id: new Types.ObjectId(roleId),
              permission_id: new Types.ObjectId(permissionId),
            });

            if (existingPermission) {
              // Update existing permission
              existingPermission.is_checked = isChecked;
              await existingPermission.save();
            } else {
              // Create new permission
              await ManagePermission.create({
                project_id: new Types.ObjectId(projectId),
                role_id: new Types.ObjectId(roleId),
                permission_id: new Types.ObjectId(permissionId),
                is_checked: isChecked,
                created_by: userId,
              });
            }

            return {
              permissionId,
              isChecked,
              permission: permissionMap.get(permissionId) || "",
            };
          })
        );

        return {
          roleId,
          roleName: roleMap.get(roleId) || "",
          permissions: permissionUpdates,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Project permissions updated successfully",
      data: {
        permissions: results,
      },
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    });
  } catch (error) {
    console.error("Update project permissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update project permissions",
      error: error instanceof Error ? error.message : "Internal server error",
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    });
  }
};
