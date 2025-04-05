import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ClarityModule } from "@clr/angular";

export type ButtonType =
  | "btn-primary"
  | "btn-secondary"
  | "btn-danger"
  | "btn-success"
  | "btn-info"
  | "btn-warning"
  | "btn-light"
  | "btn-dark";

@Component({
  selector: "app-button",
  standalone: true,
  imports: [ClarityModule],
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
})
export class ButtonComponent {
  @Input() type: string = "button";

  @Input() text: string = "Submit";

  @Input() btnType: ButtonType = "btn-primary";

  @Input() disabled: boolean = false;

  @Input() classes: string = "";

  @Output() onClick = new EventEmitter<void>();

  handleClick($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.onClick.emit();
  }
}
