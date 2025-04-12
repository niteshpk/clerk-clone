import { AsyncPipe, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ClrDropdownModule, ClrFormsModule } from "@clr/angular";
import { take, takeUntil, catchError, of, finalize } from "rxjs";
import { AuthService } from "@services/auth/auth.service";
import { validateEmail } from "@utils/validations";
import { BaseComponent } from "@components/base-component/base-component.component";

@Component({
  selector: "app-reset-password-page",
  standalone: true,
  imports: [
    ClrFormsModule,
    ClrDropdownModule,
    RouterLink,
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: "./reset-password-page.component.html",
  styleUrl: "./reset-password-page.component.scss",
})
export class ResetPasswordPageComponent
  extends BaseComponent
  implements OnInit
{
  resetPasswordClicked = false;
  resendForgotPasswordClicked = false;
  isSuccess = false;
  isError = false;
  errorMessage = "";
  successMessage = "";
  loadingMessage = "";

  form!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    token: FormControl<string>;
  }>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private formBuilder: NonNullableFormBuilder
  ) {
    super();

    this.form = this.formBuilder.group({
      email: [
        { value: "test1@example.com", disabled: true },
        Validators.required,
      ],
      password: ["Test@12345", Validators.required],
      token: ["", Validators.required],
    });
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

    this.form.patchValue({
      email,
      token,
    });
  }

  onSubmit() {
    this.resetPasswordClicked = true;
    this.setLoading(true);
    this.loadingMessage = "Verifying your email...";

    this.authService
      .resetPassword(this.form.getRawValue())
      .pipe(
        take(1),
        takeUntil(this.onDestroy$),
        catchError((error: any) => {
          this.setErrorState(
            true,
            error.error?.error?.details || "Failed to verify email"
          );
          return of(null);
        }),
        finalize(() => this.setLoadingState(false, ""))
      )
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

        this.setSuccessState(
          true,
          response.message || "Password reset successfully!"
        );

        setTimeout(() => {
          this.router.navigate(["/auth/login"]);
        }, 1000);
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

  resendForgotPasswordEmail() {
    this.resendForgotPasswordClicked = true;
    this.setLoadingState(true, "Resending verification email...");
    this.isError = false;

    const email = this.form.get("email")?.getRawValue();

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
      .forgotPassword(email)
      .pipe(
        take(1),
        takeUntil(this.onDestroy$),
        catchError((error: any) => {
          this.setErrorState(
            true,
            error.error?.message || "Failed to resend forgot password email"
          );
          return of(null);
        }),
        finalize(() => this.setLoadingState(false, ""))
      )
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

        this.setSuccessState(
          true,
          response.message || "Forgot password email sent successfully!"
        );

        setTimeout(() => {
          this.router.navigate(["/auth/login"]);
        }, 1000);
      });
  }
}
