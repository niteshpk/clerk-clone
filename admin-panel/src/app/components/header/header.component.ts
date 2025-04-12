import { AuthService } from "@services/auth/auth.service";
import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { ClrIconModule, ClrDropdownModule } from "@clr/angular";
import { finalize } from "rxjs";
import { of } from "rxjs";
import { catchError } from "rxjs";
import { takeUntil } from "rxjs";
import { User } from "../../models/user.model";
import { BaseComponent } from "../base-component/base-component.component";
import { take } from "rxjs";
import { Theme, ThemeService } from "@services/theme/theme.service";

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
  theme: Theme = "dark";

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {
    super();

    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
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
        this.authService.clearAuth();
        this.router.navigate(["/auth/login"]);
      });
  }
}
