import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrgsPageComponent } from "./orgs-page.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { OrgService } from "@services/org/org.service";

describe("OrgsPageComponent", () => {
  let component: OrgsPageComponent;
  let fixture: ComponentFixture<OrgsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrgService],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
