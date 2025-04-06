import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ForgotPasswordPageComponent } from "./forgot-password-page.component";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

describe("ForgotPasswordPageComponent", () => {
  let component: ForgotPasswordPageComponent;
  let fixture: ComponentFixture<ForgotPasswordPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
