import { Routes } from "@angular/router";
import { BlankPageComponent } from "@pages/user-pages/blank-page/blank-page.component";
import { FirstPageComponent } from "@pages/user-pages/first-page/first-page.component";
import { PermissionsPageComponent } from "@pages/user-pages/permissions-page/permissions-page.component";
import { ProjectsPageComponent } from "@pages/user-pages/projects-page/projects-page.component";
import { RolesPageComponent } from "@pages/user-pages/roles-page/roles-page.component";

export const USER_ROUTES: Routes = [
  {
    path: "first-page",
    component: FirstPageComponent,
  },
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
    path: "blank-page",
    component: BlankPageComponent,
  },
];
