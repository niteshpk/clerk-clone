import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectIsAuthenticated } from "../store/auth/auth.selectors";
import { take, map } from "rxjs";

export const publicGuard = () => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        return true;
      }
      return router.navigateByUrl("/user/first-page");
    })
  );
};
