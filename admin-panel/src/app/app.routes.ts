import { Routes } from "@angular/router";
import { AuthPagesComponent } from "./pages/auth/auth-pages/auth-pages.component";
import { UserPagesComponent } from "./pages/user-pages/user-pages.component";
import { authGuard } from "@guards/auth.guard";
import { publicGuard } from "@guards/public.guard";
import { AUTH_ROUTES } from "@pages/auth/auth.routes";
import { USER_ROUTES } from "@pages/user/user.routes";

export const routes: Routes = [
  {
    path: "auth",
    canActivate: [publicGuard],
    component: AuthPagesComponent,
    children: AUTH_ROUTES,
  },
  {
    path: "user",
    canActivate: [authGuard],
    component: UserPagesComponent,
    children: USER_ROUTES,
  },
  {
    path: "",
    redirectTo: "auth/login",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "auth/login",
  },
];
