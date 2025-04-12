import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ClrFormsModule } from "@clr/angular";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-form-horizontal",
  standalone: true,
  imports: [CommonModule, ClrFormsModule, ReactiveFormsModule],
  templateUrl: "./form-horizontal.component.html",
  styleUrls: ["./form-horizontal.component.scss"],
})
export class FormHorizontalComponent {
  @Input() form!: FormGroup;
  @Output() onSubmit = new EventEmitter<void>();
}
