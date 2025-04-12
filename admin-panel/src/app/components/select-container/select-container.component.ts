import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ClrSelectModule } from "@clr/angular";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-select-container",
  standalone: true,
  imports: [CommonModule, ClrSelectModule, ReactiveFormsModule],
  templateUrl: "./select-container.component.html",
  styleUrls: ["./select-container.component.scss"],
})
export class SelectContainerComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() name!: string;
  @Input() options: { label: string; value: string }[] = [];
}
