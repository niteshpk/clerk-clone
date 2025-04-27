import { Routes } from "@angular/router";
import { PermissionsPageComponent } from "@pages/user/permissions-page/permissions-page.component";
import { ProjectsPageComponent } from "@pages/user/projects-page/projects-page.component";
import { RolesPageComponent } from "@pages/user/roles-page/roles-page.component";
import { ManagePageComponent } from "@pages/user/manage-page/manage-page.component";
export const USER_ROUTES: Routes = [
  {
    path: "projects-page",
    component: ProjectsPageComponent,
  },
  {
    path: "roles-page",
    component: RolesPageComponent,
  },
  {
    path: "permissions-page",
    component: PermissionsPageComponent,
  },
  {
    path: "manage-page",
    component: ManagePageComponent,
  },
];
