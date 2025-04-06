import { AsyncPipe, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ClrDropdownModule, ClrFormsModule } from "@clr/angular";
import { AuthService } from "../../../services/auth/auth.service";
import { BaseComponent } from "../../../components/base-component/base-component.component";
import { finalize, of, takeUntil, catchError, take } from "rxjs";
import { Store } from "@ngrx/store";
import { loginSuccess } from "../../../store/auth/auth.actions";
import { selectIsAuthenticated } from "../../../store/auth/auth.selectors";

@Component({
  selector: "app-login-page",
  standalone: true,
  imports: [
    ClrFormsModule,
    ClrDropdownModule,
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: "./login-page.component.html",
  styleUrl: "./login-page.component.scss",
})
export class LoginPageComponent extends BaseComponent implements OnInit {
  form!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    rememberMe: FormControl<boolean>;
  }>;

  errorMessage = "";

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {
    super();

    this.form = this.formBuilder.group({
      email: ["test1@example.com", Validators.required],
      password: ["Test@12345", Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    this.store
      .select(selectIsAuthenticated)
      .pipe(take(1), takeUntil(this.onDestroy$))
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl("/user/first-page");
        }
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
      .login(this.form.getRawValue())
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

        this.store.dispatch(
          loginSuccess({
            token: res.data.token,
            user: res.data.user,
          })
        );

        this.router.navigateByUrl("/user/first-page");
      });
  }
}
