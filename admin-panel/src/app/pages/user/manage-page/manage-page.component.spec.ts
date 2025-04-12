import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ManagePageComponent } from "./manage-page.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ProjectService } from "@services/project/project.service";

describe("ManagePageComponent", () => {
  let component: ManagePageComponent;
  let fixture: ComponentFixture<ManagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
