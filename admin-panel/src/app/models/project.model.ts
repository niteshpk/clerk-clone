export interface Project {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectResponse {
  data: {
    projects: Project[];
  };
}
