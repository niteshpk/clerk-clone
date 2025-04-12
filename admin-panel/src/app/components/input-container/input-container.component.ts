import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClrFormsModule } from "@clr/angular";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-input-container",
  standalone: true,
  imports: [CommonModule, ClrFormsModule, ReactiveFormsModule],
  templateUrl: "./input-container.component.html",
  styleUrls: ["./input-container.component.scss"],
})
export class InputContainerComponent {
  @Input() label: string = "";
  @Input() control!: FormControl;
  @Input() name: string = "";
  @Input() type: string = "text";
  @Input() placeholder: string = "";
  @Input() autocomplete: string = "";
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() class: string = "w-100";
}
