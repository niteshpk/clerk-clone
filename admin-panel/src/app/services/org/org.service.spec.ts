import { TestBed } from "@angular/core/testing";

import { OrgService } from "./org.service";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";

describe("OrgService", () => {
  let service: OrgService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrgService],
    });
    service = TestBed.inject(OrgService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
