export interface Permission {
  id: number;
  permission: string;
  project_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionResponse {
  data: {
    permissions: Permission[];
  };
}
