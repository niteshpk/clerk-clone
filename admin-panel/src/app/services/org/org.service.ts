import { Injectable } from "@angular/core";
import { BaseHttpService } from "@services/base-http/base-http.service";
import { Org, OrgResponse } from "@models/org.model";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class OrgService {
  private readonly BASE_URL = environment.apiUrl + "/api/orgs";

  constructor(private baseHttp: BaseHttpService) {}

  getOrgs(): Observable<Org[]> {
    return this.baseHttp
      .get<OrgResponse>(this.BASE_URL)
      .pipe(map((res: OrgResponse) => res.data.orgs));
  }

  createOrg(org: Partial<Org>): Observable<Org> {
    return this.baseHttp.post<Org>(this.BASE_URL, org);
  }

  updateOrg(id: number, org: Partial<Org>): Observable<Org> {
    return this.baseHttp.put<Org>(`${this.BASE_URL}/${id}`, org);
  }

  deleteOrg(id: number): Observable<void> {
    return this.baseHttp.delete(`${this.BASE_URL}/${id}`);
  }
}
