import { Routes } from "@angular/router";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { AuthPagesComponent } from "./pages/auth/auth-pages/auth-pages.component";
import { ForgotPasswordPageComponent } from "./pages/auth/forgot-password-page/forgot-password-page.component";
import { LoginPageComponent } from "./pages/auth/login-page/login-page.component";
import { ResetPasswordPageComponent } from "./pages/auth/reset-password-page/reset-password-page.component";
import { SignupPageComponent } from "./pages/auth/signup-page/signup-page.component";
import { FirstPageComponent } from "./pages/user-pages/first-page/first-page.component";
import { SecondPageComponent } from "./pages/user-pages/second-page/second-page.component";
import { UserPagesComponent } from "./pages/user-pages/user-pages.component";
import { BlankPageComponent } from "./pages/user-pages/blank-page/blank-page.component";
import { VerifyEmailPageComponent } from "./pages/auth/verify-email-page/verify-email-page.component";
import { authGuard } from "./guards/auth.guard";
import { publicGuard } from "./guards/public.guard";

export const routes: Routes = [
  {
    path: "auth",
    canActivate: [publicGuard],
    component: AuthPagesComponent,
    children: [
      { path: "", redirectTo: "/auth/login", pathMatch: "full" },
      {
        path: "login",
        component: LoginPageComponent,
      },
      {
        path: "signup",
        component: SignupPageComponent,
      },
      {
        path: "forgot-password",
        component: ForgotPasswordPageComponent,
      },
      {
        path: "reset-password",
        component: ResetPasswordPageComponent,
      },
      {
        path: "verify-email",
        component: VerifyEmailPageComponent,
      },
    ],
  },
  {
    path: "user",
    canActivate: [authGuard],
    component: UserPagesComponent,
    children: [
      {
        path: "first-page",
        component: FirstPageComponent,
      },
      {
        path: "second-page",
        component: SecondPageComponent,
      },
      {
        path: "blank-page",
        component: BlankPageComponent,
      },
    ],
  },
  { path: "", redirectTo: "/auth/login", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent },
];
