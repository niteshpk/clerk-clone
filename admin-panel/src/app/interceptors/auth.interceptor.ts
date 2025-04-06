import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectToken } from "../store/auth/auth.selectors";
import { Observable, take, switchMap } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
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
    return new Observable((observer) => {
      store
        .select(selectToken)
        .pipe(
          take(1),
          switchMap((token) => {
            if (token) {
              const authReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`,
                },
              });
              return next(authReq);
            }
            return next(req);
          })
        )
        .subscribe({
          next: (response) => observer.next(response),
          error: (error) => observer.error(error),
          complete: () => observer.complete(),
        });
    });
  }

  return next(req);
};
