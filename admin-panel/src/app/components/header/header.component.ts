import { selectUser } from "./../../store/auth/auth.selectors";
import { AuthService } from "./../../services/auth/auth.service";
import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { ClrIconModule, ClrDropdownModule } from "@clr/angular";
import { finalize } from "rxjs";
import { of } from "rxjs";
import { catchError } from "rxjs";
import { takeUntil } from "rxjs";
import { User } from "../../models/user.model";
import { BaseComponent } from "../base-component/base-component.component";
import { take } from "rxjs";
import { Store } from "@ngrx/store";
import { logoutSuccess } from "../../store/auth/auth.actions";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ClrIconModule,
    ClrDropdownModule,
    AsyncPipe,
  ],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent extends BaseComponent {
  user: User | null = null;

  constructor(private authService: AuthService, private store: Store) {
    super();

    this.store.select(selectUser).subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.setLoading(true);

    this.authService
      .logout()
      .pipe(
        take(1),
        takeUntil(this.onDestroy$),
        catchError(() => {
          return of(null);
        }),
        finalize(() => this.setLoading(false))
      )
      .subscribe(() => {
        this.store.dispatch(logoutSuccess());
      });
  }
}
