import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RolesPageComponent } from "./roles-page.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RoleService } from "../../../services/role/role.service";

describe("RolesPageComponent", () => {
  let component: RolesPageComponent;
  let fixture: ComponentFixture<RolesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoleService],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
