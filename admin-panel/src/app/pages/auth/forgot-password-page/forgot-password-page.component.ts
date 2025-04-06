import { AsyncPipe, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ClrDropdownModule, ClrFormsModule } from "@clr/angular";
import { BaseComponent } from "../../../components/base-component/base-component.component";
import { AuthService } from "../../../services/auth/auth.service";
import { finalize } from "rxjs/operators";
import { of } from "rxjs";
import { catchError } from "rxjs/operators";
import { validateEmail } from "../../../utils/validations";
import { take, takeUntil } from "rxjs/operators";
import { AlertComponent } from "../../../components/alert/alert.component";

@Component({
  selector: "app-forgot-password-page",
  standalone: true,
  imports: [
    ClrFormsModule,
    ClrDropdownModule,
    FormsModule,
    RouterLink,
    NgIf,
    AsyncPipe,
    AlertComponent,
  ],
  templateUrl: "./forgot-password-page.component.html",
  styleUrl: "./forgot-password-page.component.scss",
})
export class ForgotPasswordPageComponent extends BaseComponent {
  email = "test1@example.com";

  errorMessage = "";
  successMessage = "";

  constructor(private authService: AuthService) {
    super();
  }

  validateEmail(email: string) {
    return validateEmail(email);
  }

  getResetPasswordLink() {
    this.errorMessage = "";

    if (!this.email || !validateEmail(this.email)) {
      this.errorMessage = "Invalid email address format";
      return;
    }

    this.setLoading(true);

    this.authService
      .forgotPassword(this.email)
      .pipe(
        take(1),
        takeUntil(this.onDestroy$),
        catchError((error) => {
          this.errorMessage = error.error.message;
          return of(null);
        }),
        finalize(() => this.setLoading(false))
      )
      .subscribe((res) => {
        if (!res) {
          return;
        }

        this.successMessage = res.message;
      });
  }
}
