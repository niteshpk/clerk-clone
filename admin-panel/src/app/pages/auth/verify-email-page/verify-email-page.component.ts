import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth/auth.service";
import { BaseComponent } from "../../../components/base-component/base-component.component";
import { takeUntil } from "rxjs";
import { NgIf } from "@angular/common";
import { ClrFormsModule, ClrIconModule } from "@clr/angular";

@Component({
  selector: "app-verify-email-page",
  standalone: true,
  imports: [NgIf, ClrFormsModule, ClrIconModule, RouterLink],
  templateUrl: "./verify-email-page.component.html",
  styleUrl: "./verify-email-page.component.scss",
})
export class VerifyEmailPageComponent extends BaseComponent implements OnInit {
  isVerifying = true;
  isSuccess = false;
  isError = false;
  errorMessage = "";
  successMessage = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get("token");
    if (!token) {
      this.isError = true;
      this.errorMessage = "Invalid verification link";
      this.isVerifying = false;
      return;
    }

    this.verifyEmail(token);
  }

  verifyEmail(token: string) {
    this.authService
      .verifyEmail(token)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response) => {
          this.isSuccess = true;
          this.successMessage =
            response.message || "Email verified successfully!";
          this.isVerifying = false;
        },
        error: (error) => {
          this.isError = true;
          this.errorMessage = error.error?.message || "Failed to verify email";
          this.isVerifying = false;
        },
      });
  }

  resendVerificationEmail() {
    this.isVerifying = true;
    this.isError = false;
    const email = this.route.snapshot.queryParamMap.get("email");

    if (!email) {
      this.isError = true;
      this.errorMessage = "Email not found";
      this.isVerifying = false;
      return;
    }

    this.authService
      .resendVerificationEmail(email)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response) => {
          this.isSuccess = true;
          this.successMessage =
            response.message || "Verification email sent successfully!";
          this.isVerifying = false;
        },
        error: (error) => {
          this.isError = true;
          this.errorMessage =
            error.error?.message || "Failed to resend verification email";
          this.isVerifying = false;
        },
      });
  }
}
