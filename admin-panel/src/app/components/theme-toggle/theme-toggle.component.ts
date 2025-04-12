import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";
import { ThemeService } from "@services/theme/theme.service";

@Component({
  selector: "app-theme-toggle",
  standalone: true,
  imports: [CommonModule, ClarityModule],
  template: `
    <button
      class="btn btn-icon"
      (click)="toggleTheme()"
      [attr.aria-label]="
        (themeService.theme$ | async) === 'dark'
          ? 'Switch to light theme'
          : 'Switch to dark theme'
      "
    >
      <clr-icon
        [attr.shape]="(themeService.theme$ | async) === 'dark' ? 'sun' : 'moon'"
      ></clr-icon>
    </button>
  `,
  styles: [
    `
      .btn-icon {
        padding: 0.5rem;
        border-radius: 50%;
        background: var(--background-color);
        border: 1px solid var(--border-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
