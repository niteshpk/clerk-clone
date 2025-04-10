import { Injectable } from "@angular/core";
import { BaseHttpService } from "@services/base-http/base-http.service";
import { Role, RoleResponse } from "@models/role.model";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private readonly BASE_URL = environment.apiUrl + "/api/org-roles";

  constructor(private baseHttp: BaseHttpService) {}

  getRoles(): Observable<Role[]> {
    return this.baseHttp
      .get<RoleResponse>(this.BASE_URL)
      .pipe(map((res: RoleResponse) => res.data.roles));
  }

  createRole(Role: Partial<Role>): Observable<Role> {
    return this.baseHttp.post<Role>(this.BASE_URL, Role);
  }

  updateRole(id: number, Role: Partial<Role>): Observable<Role> {
    return this.baseHttp.put<Role>(`${this.BASE_URL}/${id}`, Role);
  }

  deleteRole(id: number): Observable<void> {
    return this.baseHttp.delete(`${this.BASE_URL}/${id}`);
  }
}
