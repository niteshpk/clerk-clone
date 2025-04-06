import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ClrDropdownModule } from "@clr/angular";

@Component({
  selector: "app-auth-pages",
  standalone: true,
  imports: [RouterOutlet, ClrDropdownModule],
  templateUrl: "./auth-pages.component.html",
  styleUrl: "./auth-pages.component.scss",
})
export class AuthPagesComponent {}
