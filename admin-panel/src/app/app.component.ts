import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import "@cds/core/icon/register.js";
import { CommonModule } from "@angular/common";
import { Store } from "@ngrx/store";
import { initAuth } from "./store/auth/auth.actions";

import "@cds/core/icon/register.js";
import { ClarityIcons, userIcon, checkCircleIcon } from "@cds/core/icon";

ClarityIcons.addIcons(userIcon);
ClarityIcons.addIcons(checkCircleIcon);

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(initAuth());
  }
}
