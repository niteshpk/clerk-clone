import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, finalize, of, take, tap } from "rxjs";
import { LocalStorageService } from "@services/storage/local-storage.service";
import * as AuthActions from "./auth.actions";
import { Router } from "@angular/router";
import { AuthService } from "@services/auth/auth.service";
import { Store } from "@ngrx/store";
import { User } from "@models/user.model";

@Injectable()
export class AuthEffects {
  private localStorageService: LocalStorageService;
  persistAuth$: any;
  redirectToLogin$: any;
  initAuth$: any;
  loginSuccess$: any;
  logoutSuccess$: any;

  constructor(
    private actions$: Actions,
    private router: Router,
    private authService: AuthService,
    private store: Store
  ) {
    this.localStorageService = new LocalStorageService();

    // Initialize auth state from localStorage
    this.initAuth$ = createEffect(
      () => {
        return this.actions$.pipe(
          ofType("[Auth] Init Auth"),
          tap(() => {
            const token = this.localStorageService.getItem("token") as string;
            const userStr = this.localStorageService.getItem("user");

            if (token) {
              this.store.dispatch(AuthActions.setToken({ token }));
              if (userStr) {
                try {
                  const user = JSON.parse(userStr) as User;
                  this.store.dispatch(AuthActions.setUser({ user }));
                } catch (e) {
                  console.error("Error parsing user from localStorage:", e);
                }
              }
            }
          })
        );
      },
      { dispatch: false }
    );

    // Handle login success
    this.loginSuccess$ = createEffect(
      () => {
        return this.actions$.pipe(
          ofType(AuthActions.loginSuccess),
          tap(({ token, user }) => {
            this.localStorageService.setItem("token", token);
            this.localStorageService.setItem("user", JSON.stringify(user));
            this.router.navigateByUrl("/user/first-page");
          })
        );
      },
      { dispatch: false }
    );

    // Handle logout success
    this.logoutSuccess$ = createEffect(
      () => {
        return this.actions$.pipe(
          ofType(AuthActions.logoutSuccess),
          tap(() => {
            this.localStorageService.removeItem("token");
            this.localStorageService.removeItem("user");
            this.router.navigateByUrl("/auth/login");
          })
        );
      },
      { dispatch: false }
    );

    this.persistAuth$ = createEffect(
      () => {
        return this.actions$.pipe(
          ofType(AuthActions.setToken, AuthActions.setUser),
          tap((action) => {
            if (action.type === AuthActions.setToken.type) {
              this.localStorageService.setItem("token", action.token);
            } else if (action.type === AuthActions.setUser.type) {
              this.localStorageService.setItem(
                "user",
                JSON.stringify(action.user)
              );
            }
          })
        );
      },
      { dispatch: false }
    );

    // Handle logout API call
    this.redirectToLogin$ = createEffect(
      () => {
        return this.actions$.pipe(
          ofType(AuthActions.logout),
          tap(() => {
            this.authService
              .logout()
              .pipe(
                take(1),
                catchError(() => {
                  return of(null);
                }),
                finalize(() => {
                  this.store.dispatch(AuthActions.logoutSuccess());
                })
              )
              .subscribe();
          })
        );
      },
      { dispatch: false }
    );
  }
}
