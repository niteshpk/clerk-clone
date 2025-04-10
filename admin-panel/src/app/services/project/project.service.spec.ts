import { TestBed } from "@angular/core/testing";

import { ProjectService } from "./project.service";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";

describe("ProjectService", () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService],
    });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
