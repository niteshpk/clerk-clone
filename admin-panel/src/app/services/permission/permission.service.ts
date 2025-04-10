import { Injectable } from "@angular/core";
import { BaseHttpService } from "@services/base-http/base-http.service";
import { Permission, PermissionResponse } from "@models/permission.model";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class PermissionService {
  private readonly BASE_URL = environment.apiUrl + "/api/project-permissions";

  constructor(private baseHttp: BaseHttpService) {}

  getPermissions(): Observable<Permission[]> {
    return this.baseHttp
      .get<PermissionResponse>(this.BASE_URL)
      .pipe(map((res: PermissionResponse) => res.data.permissions));
  }

  createPermission(Permission: Partial<Permission>): Observable<Permission> {
    return this.baseHttp.post<Permission>(this.BASE_URL, Permission);
  }

  updatePermission(
    id: number,
    Permission: Partial<Permission>
  ): Observable<Permission> {
    return this.baseHttp.put<Permission>(`${this.BASE_URL}/${id}`, Permission);
  }

  deletePermission(id: number): Observable<void> {
    return this.baseHttp.delete(`${this.BASE_URL}/${id}`);
  }
}
