import { HttpInterceptorFn } from "@angular/common/http";
import { LocalStorageService } from "../services/storage/local-storage.service";
import { inject } from "@angular/core";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);

  const publicRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forget-password",
    "/api/auth/verify-email",
    "/api/auth/resend-verification",
  ];

  // Check if the request URL is not in public routes
  const isPublicRoute = publicRoutes.some((route) => req.url.includes(route));

  if (!isPublicRoute) {
    const token = localStorageService.getItem<string>("token");

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    console.log(req.headers.get("Authorization"));
  }

  return next(req);
};
