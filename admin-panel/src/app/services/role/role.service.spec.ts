import { TestBed } from "@angular/core/testing";

import { RoleService } from "./role.service";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";

describe("RoleService", () => {
  let service: RoleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoleService],
    });
    service = TestBed.inject(RoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
