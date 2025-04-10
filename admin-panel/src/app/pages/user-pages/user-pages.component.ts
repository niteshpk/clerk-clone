import { Component } from "@angular/core";
import { Router } from "@angular/router";
import {
  ClrModalModule,
  ClrVerticalNavModule,
  ClrIconModule,
} from "@clr/angular";
import { AppLevelAlertComponent } from "../../components/app-level-alert/app-level-alert.component";
import { DialogComponent } from "../../components/dialog/dialog.component";
import { HeaderComponent } from "../../components/header/header.component";
import { AppLevelAlertService } from "../../services/app-level-alert/app-level-alert.service";
import { SidebarComponent } from "@app/components/sidebar/sidebar.component";

@Component({
  selector: "app-user-pages",
  standalone: true,
  imports: [
    ClrVerticalNavModule,
    ClrModalModule,
    ClrIconModule,
    AppLevelAlertComponent,
    DialogComponent,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: "./user-pages.component.html",
  styleUrl: "./user-pages.component.scss",
})
export class UserPagesComponent {
  isLoggingOut = false;

  constructor(
    private router: Router,
    private alertService: AppLevelAlertService
  ) {}

  handleClose($event: boolean) {
    console.log($event);
  }

  logout() {
    this.isLoggingOut = true;
    this.alertService.show({
      message: "Logging out...",
      type: "info",
      alertType: "info",
    });
    setTimeout(() => {
      this.isLoggingOut = false;
      this.router.navigateByUrl("/auth/login");
    }, 1000);
  }
}
