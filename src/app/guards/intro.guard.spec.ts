import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { IntroGuard } from './intro.guard';

describe('introGuard', () => {
  let executeGuard: CanActivateFn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    executeGuard = TestBed.runInInjectionContext(() => IntroGuard);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
