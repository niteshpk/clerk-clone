import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ClrModalModule } from "@clr/angular";
import { FormHorizontalComponent } from "@components/form-horizontal/form-horizontal.component";

@Component({
  selector: "app-modal-form",
  standalone: true,
  imports: [CommonModule, ClrModalModule, FormHorizontalComponent],
  templateUrl: "./modal-form.component.html",
  styleUrls: ["./modal-form.component.scss"],
})
export class ModalFormComponent {
  @Input() modalOpen = false;
  @Output() modalOpenChange = new EventEmitter<boolean>();
  @Input() title = "";
  @Input() form!: FormGroup;
  @Input() submitButtonText = "Submit";
  @Output() onSubmit = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  handleCancel() {
    this.modalOpen = false;
    this.modalOpenChange.emit(false);
    this.onCancel.emit();
  }

  handleSubmit() {
    this.onSubmit.emit();
    this.modalOpen = false;
    this.modalOpenChange.emit(false);
  }
}
