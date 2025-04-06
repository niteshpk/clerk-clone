import { Component } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NgIf } from "@angular/common";
import { ClrIconModule, ClrDropdownModule } from "@clr/angular";
import { AppLevelAlertService } from "../../services/app-level-alert/app-level-alert.service";
import { LocalStorageService } from "../../services/storage/local-storage.service";
import { User } from "../../models/user.model";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ClrIconModule,
    ClrDropdownModule,
    NgIf,
  ],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  isLoggingOut = false;
  user: User | null = null;

  constructor(
    private router: Router,
    private appAlertService: AppLevelAlertService,
    private localStorageService: LocalStorageService
  ) {
    this.user = this.localStorageService.getItem("user");
  }

  logout() {
    this.isLoggingOut = true;
    this.appAlertService.show({
      message: "Logging out...",
      type: "info",
      alertType: "info",
    });

    this.localStorageService.removeItem("user");
    this.localStorageService.removeItem("token");

    setTimeout(() => {
      this.isLoggingOut = false;
      this.router.navigateByUrl("/auth/login");
    }, 1000);
  }
}
