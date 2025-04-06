import { Routes } from "@angular/router";
import { publicGuard } from "../../guards/public.guard";
import { LoginPageComponent } from "./login-page/login-page.component";
import { SignupPageComponent } from "./signup-page/signup-page.component";
import { ForgetPasswordPageComponent } from "./forget-password-page/forget-password-page.component";
import { VerifyEmailPageComponent } from "./verify-email-page/verify-email-page.component";

export const AUTH_ROUTES: Routes = [
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
    path: "forget-password",
    component: ForgetPasswordPageComponent,
    canActivate: [publicGuard],
  },
  {
    path: "verify-email",
    component: VerifyEmailPageComponent,
  },
];
