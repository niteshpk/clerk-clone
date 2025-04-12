import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { AuthService } from "@services/auth/auth.service";

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Clear auth data
        authService.clearAuth();

        // Redirect to login page
        router.navigate(["/auth/login"]);
      }
      return throwError(() => error);
    })
  );
};
