import { Routes } from "@angular/router";
import { LoginPageComponent } from "@pages/auth/login-page/login-page.component";
import { SignupPageComponent } from "@pages/auth/signup-page/signup-page.component";
import { ForgotPasswordPageComponent } from "@pages/auth/forgot-password-page/forgot-password-page.component";
import { ResetPasswordPageComponent } from "@pages/auth/reset-password-page/reset-password-page.component";
import { VerifyEmailPageComponent } from "@pages/auth/verify-email-page/verify-email-page.component";
import { publicGuard } from "@guards/public.guard";

export const AUTH_ROUTES: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    component: LoginPageComponent,
    canActivate: [publicGuard],
  },
  {
    path: "signup",
    component: SignupPageComponent,
    canActivate: [publicGuard],
  },
  {
    path: "forgot-password",
    component: ForgotPasswordPageComponent,
    canActivate: [publicGuard],
  },
  {
    path: "reset-password",
    component: ResetPasswordPageComponent,
  },
  {
    path: "verify-email",
    component: VerifyEmailPageComponent,
  },
];
