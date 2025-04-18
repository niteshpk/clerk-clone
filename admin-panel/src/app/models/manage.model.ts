export interface RolePermission {
  roleId: string;
  roleName: string;
  permissions: PermissionItem[];
}

export interface PermissionItem {
  permissionId: string;
  isChecked: boolean;
  permission: string;
}

export interface ManageResponse {
  success: boolean;
  message: string;
  data: {
    permissions: RolePermission[];
  };
}
