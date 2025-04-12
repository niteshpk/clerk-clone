import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type Theme = "light" | "dark";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    // Apply initial theme
    this.applyTheme(this.themeSubject.value);
  }

  private getInitialTheme(): Theme {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  }

  toggleTheme(): void {
    const newTheme = this.themeSubject.value === "light" ? "dark" : "light";
    this.themeSubject.next(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.setAttribute("cds-theme", newTheme);
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute("data-theme", theme);
  }
}
