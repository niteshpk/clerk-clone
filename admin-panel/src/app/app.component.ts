import { AfterViewInit, Component, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import "@cds/core/icon/register.js";
import { CommonModule } from "@angular/common";
import { Store } from "@ngrx/store";
import { initAuth } from "./store/auth/auth.actions";

import "@cds/core/icon/register.js";
import { ClarityIcons, userIcon, checkCircleIcon } from "@cds/core/icon";
import { ThemeService } from "./services/theme/theme.service";

ClarityIcons.addIcons(userIcon);
ClarityIcons.addIcons(checkCircleIcon);

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(initAuth());
  }

  ngAfterViewInit() {
    // scroll to top once page router navigation end
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}
