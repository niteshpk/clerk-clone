import { AuthService } from "./../../services/auth/auth.service";
import { Component } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NgIf, AsyncPipe } from "@angular/common";
import { ClrIconModule, ClrDropdownModule } from "@clr/angular";
import { AppLevelAlertService } from "../../services/app-level-alert/app-level-alert.service";
import { LocalStorageService } from "../../services/storage/local-storage.service";
import { finalize } from "rxjs";
import { of } from "rxjs";
import { catchError } from "rxjs";
import { takeUntil } from "rxjs";
import { User } from "../../models/user.model";
import { BaseComponent } from "../base-component/base-component.component";
import { take } from "rxjs";

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

  constructor(
    private router: Router,
    private appAlertService: AppLevelAlertService,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    super();

    this.user = this.localStorageService.getItem("user");
  }

  logout() {
    this.setLoading(true);

    this.authService
      .logout()
      .pipe(
        take(1),
        takeUntil(this.onDestroy$),
        catchError(() => {
          this.clearLocalStorage();
          return of(null);
        }),
        finalize(() => this.setLoading(false))
      )
      .subscribe((res) => {
        if (!res) {
          return;
        }

        this.appAlertService.show({
          message: res.message,
          type: "warning",
          alertType: "warning",
        });

        this.clearLocalStorage();
      });
  }

  clearLocalStorage() {
    this.localStorageService.removeItem("user");
    this.localStorageService.removeItem("token");
    setTimeout(() => {
      this.router.navigateByUrl("/auth/login");
    }, 500);
  }
}
