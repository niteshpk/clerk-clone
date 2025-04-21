import { Injectable } from "@angular/core";
import { BaseHttpService } from "@services/base-http/base-http.service";
import { ManageResponse, RolePermission } from "@models/manage.model";
import { map, Observable, tap } from "rxjs";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class ManageService {
  private readonly BASE_URL =
    environment.apiUrl + "/api/manage-permissions/projects";

  constructor(private baseHttp: BaseHttpService) {}

  getProjectPermissions(projectId: string): Observable<RolePermission[]> {
    return this.baseHttp
      .get<ManageResponse>(`${this.BASE_URL}/${projectId}`)
      .pipe(map((res: ManageResponse) => res.data.permissions));
  }

  updateProjectPermissions(
    projectId: string,
    rolePermissions: RolePermission[]
  ): Observable<RolePermission[]> {
    return this.baseHttp
      .put<ManageResponse>(`${this.BASE_URL}/${projectId}`, rolePermissions)
      .pipe(map((res: ManageResponse) => res.data.permissions));
  }
}
