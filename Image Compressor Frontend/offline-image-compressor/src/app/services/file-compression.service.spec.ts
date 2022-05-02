/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FileCompressionService } from './file-compression.service';

describe('Service: FileCompression', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileCompressionService]
    });
  });

  it('should ...', inject([FileCompressionService], (service: FileCompressionService) => {
    expect(service).toBeTruthy();
  }));
});
