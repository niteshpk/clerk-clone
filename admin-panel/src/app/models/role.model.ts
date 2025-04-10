export interface Role {
  id: number;
  role: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface RoleResponse {
  data: {
    roles: Role[];
  };
}
