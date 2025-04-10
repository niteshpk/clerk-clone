export interface Org {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface OrgResponse {
  data: {
    orgs: Org[];
  };
}
