import { TestBed } from '@angular/core/testing';

import { DefaultApiService } from 'apps/test/src/app/services/default-api.service';

describe('DefaultService', () => {
  let service: DefaultApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
