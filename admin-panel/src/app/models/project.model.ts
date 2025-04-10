export interface Project {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectResponse {
  data: {
    projects: Project[];
  };
}
