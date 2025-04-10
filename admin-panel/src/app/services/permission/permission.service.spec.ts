import { TestBed } from "@angular/core/testing";

import { PermissionService } from "./permission.service";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";

describe("PermissionService", () => {
  let service: PermissionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PermissionService],
    });
    service = TestBed.inject(PermissionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
