import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClrSpinnerModule } from "@clr/angular";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-spinner",
  standalone: true,
  imports: [CommonModule, ClrSpinnerModule, ReactiveFormsModule],
  template: `
    <div class="spinner-container" [class.spinner-inverse-container]="inverse">
      <clr-spinner
        [clrInverse]="inverse"
        [clrSmall]="small"
        [clrMedium]="medium"
        [clrInline]="inline"
      >
        {{ text }}...
      </clr-spinner>
      <br *ngIf="!inline" />
      {{ text }}
    </div>
  `,
  styles: [
    `
      .spinner-container {
        text-align: center;
        padding: 1rem;
      }
    `,
  ],
})
export class SpinnerComponent {
  @Input() text = "Loading";
  @Input() inverse = false;
  @Input() small = false;
  @Input() medium = true;
  @Input() inline = false;
}
