export interface Role {
  id: number;
  role: string;
  project_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleResponse {
  data: {
    roles: Role[];
  };
}
