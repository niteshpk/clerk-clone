import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LocalStorageService } from "../storage/local-storage.service";

export type Theme = "light" | "dark";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>("light");
  theme$ = this.themeSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    // Initialize theme from localStorage or system preference
    const savedTheme = this.localStorageService.getItem("theme") as Theme;

    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      this.setTheme(prefersDark ? "dark" : "light");
    }
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.localStorageService.setItem("theme", theme);
    document.body.setAttribute("cds-theme", theme);
  }

  toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    this.setTheme(currentTheme === "light" ? "dark" : "light");
  }
}
