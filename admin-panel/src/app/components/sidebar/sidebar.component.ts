import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { ClrVerticalNavModule } from "@clr/angular";
import { NavItem } from "@models/common.model";
import { ClrIconModule } from "@clr/angular";
import { NgForOf } from "@angular/common";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [
    RouterLink,
    RouterLink,
    RouterLinkActive,
    ClrVerticalNavModule,
    ClrIconModule,
    NgForOf,
    RouterOutlet,
  ],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {
  navigationItems: NavItem[] = [
    {
      path: "/user/projects-page",
      label: "Projects Page",
      icon: "bolt",
    },
    {
      path: "/user/roles-page",
      label: "Roles Page",
      icon: "bolt",
    },
    {
      path: "/user/permissions-page",
      label: "Permissions Page",
      icon: "bolt",
    },
    {
      path: "/user/manage-page",
      label: "Manage Page",
      icon: "bolt",
    },
  ];
}
