import { AsyncPipe, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ClrDropdownModule, ClrFormsModule } from "@clr/angular";
import { AuthService } from "../../../services/auth/auth.service";
import { BaseComponent } from "../../../components/base-component/base-component.component";
import { catchError, finalize, of, take, takeUntil } from "rxjs";
import { LocalStorageService } from "../../../services/storage/local-storage.service";
import { AlertComponent } from "../../../components/alert/alert.component";

@Component({
  selector: "app-signup-page",
  standalone: true,
  imports: [
    ClrFormsModule,
    ClrDropdownModule,
    FormsModule,
    RouterLink,
    NgIf,
    ReactiveFormsModule,
    // @ts-ignore
    BaseComponent,
    AlertComponent,
  ],
  templateUrl: "./signup-page.component.html",
  styleUrl: "./signup-page.component.scss",
})
export class SignupPageComponent extends BaseComponent {
  form!: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    phoneNumber: FormControl<string>;
    rememberMe: FormControl<boolean>;
  }>;

  errorMessage = "";
  successMessage = "";

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    super();

    this.form = this.formBuilder.group({
      name: ["Test 4", Validators.required],
      email: ["test4@example.com", Validators.required],
      password: ["Test@12345", Validators.required],
      phoneNumber: [""],
      rememberMe: [false],
    });
  }

  onSubmit() {
    this.errorMessage = "";
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.setLoading(true);

    this.authService
      .register(this.form.getRawValue())
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
