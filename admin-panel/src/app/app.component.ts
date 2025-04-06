import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import "@cds/core/icon/register.js";
import { CommonModule } from "@angular/common";

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
export class AppComponent {}
