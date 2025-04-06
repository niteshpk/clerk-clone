import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth/auth.service";
import { BaseComponent } from "../../../components/base-component/base-component.component";
import { catchError, finalize, of, take, takeUntil } from "rxjs";
import { NgIf, AsyncPipe } from "@angular/common";
import { ClrFormsModule, ClrIconModule } from "@clr/angular";
import { validateEmail } from "../../../utils/validations";
import { SpinnerComponent } from "../../../components/spinner/spinner.component";

@Component({
  selector: "app-verify-email-page",
  standalone: true,
  imports: [
    NgIf,
    ClrFormsModule,
    ClrIconModule,
    RouterLink,
    AsyncPipe,
    SpinnerComponent,
  ],
  templateUrl: "./verify-email-page.component.html",
  styleUrl: "./verify-email-page.component.scss",
})
export class VerifyEmailPageComponent extends BaseComponent implements OnInit {
  isSuccess = false;
  isError = false;
  errorMessage = "";
  successMessage = "";
  loadingMessage = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get("token") || "";
    const email = this.route.snapshot.queryParamMap.get("email") || "";

    this.errorMessage = "";

    if (!token) {
      this.setErrorState(true, "Token was not found");
    }

    if (!this.isError && !email) {
      this.setErrorState(true, "Email was not found");
    }

    if (!this.isError && !validateEmail(email)) {
      this.setErrorState(true, "Invalid email format");
    }

    if (this.isError) {
      this.setLoadingState(false, "");
      return;
    }

    this.verifyEmail(token, email);
  }

  verifyEmail(token: string, email: string) {
    this.setLoading(true);
    this.loadingMessage = "Verifying your email...";

    this.authService
      .verifyEmail(token, email)
      .pipe(
        take(1),
        takeUntil(this.onDestroy$),
        catchError((error: any) => {
          this.setErrorState(
            true,
            error.error?.message || "Failed to verify email"
          );
          return of(null);
        }),
        finalize(() => this.setLoadingState(false, ""))
      )
      .subscribe((response: any) => {
        console.log(response);

        if (!response) {
          return;
        }

        this.isSuccess = true;
        this.successMessage =
          response.message || "Email verified successfully!";

        setTimeout(() => {
          this.router.navigate(["/auth/login"]);
        }, 3000);
      });
  }

  private setLoadingState(loading: boolean, message: string) {
    this.isLoading$.next(loading);
    this.loadingMessage = message;
  }

  private setErrorState(error: boolean, message: string) {
    this.isError = error;
    this.errorMessage = message;
  }

  private setSuccessState(success: boolean, message: string) {
    this.isSuccess = success;
    this.successMessage = message;
  }

  resendVerificationEmail() {
    this.setLoadingState(true, "Resending verification email...");
    this.isError = false;

    const email = this.route.snapshot.queryParamMap.get("email");

    if (!email) {
      this.setErrorState(true, "Email not found");
      this.setLoadingState(false, "");
      return;
    }

    if (!validateEmail(email)) {
      this.setErrorState(true, "Invalid email format");
      this.setLoadingState(false, "");
      return;
    }

    this.authService
      .resendVerificationEmail(email)
      .pipe(
        take(1),
        takeUntil(this.onDestroy$),
        catchError((error: any) => {
          this.setErrorState(
            true,
            error.error?.message || "Failed to resend verification email"
          );
          return of(null);
        }),
        finalize(() => this.setLoadingState(false, ""))
      )
      .subscribe((response: any) => {
        console.log(response);

        if (!response) {
          return;
        }

        this.setSuccessState(
          true,
          response.message || "Verification email sent successfully!"
        );
      });
  }
}
