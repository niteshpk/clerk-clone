import { Injectable } from "@angular/core";
import { BaseHttpService } from "@services/base-http/base-http.service";
import { Project, ProjectResponse } from "@models/project.model";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private readonly BASE_URL = environment.apiUrl + "/api/projects";

  constructor(private baseHttp: BaseHttpService) {}

  getProjects(): Observable<Project[]> {
    return this.baseHttp
      .get<ProjectResponse>(this.BASE_URL)
      .pipe(map((res: ProjectResponse) => res.data.projects));
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.baseHttp.post<Project>(this.BASE_URL, project);
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.baseHttp.put<Project>(`${this.BASE_URL}/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.baseHttp.delete(`${this.BASE_URL}/${id}`);
  }
}
