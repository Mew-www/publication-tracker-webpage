/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ThemoviedbService } from './themoviedb.service';

describe('ThemoviedbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemoviedbService]
    });
  });

  it('should ...', inject([ThemoviedbService], (service: ThemoviedbService) => {
    expect(service).toBeTruthy();
  }));
});
