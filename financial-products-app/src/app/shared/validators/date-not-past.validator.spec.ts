import { FormControl, Validators } from '@angular/forms';
import { dateNotPastValidator } from './date-not-past.validator';

describe('dateNotPastValidator', () => {
  it('should return null for today\'s date', () => {
    const today = new Date().toISOString().split('T')[0];
    const control = new FormControl(today, [dateNotPastValidator()]);
    control.updateValueAndValidity();
    expect(control.errors).toBeNull();
  });

  it('should return null for future date', () => {
    const futureDate = '2099-12-31';
    const control = new FormControl(futureDate, [dateNotPastValidator()]);
    control.updateValueAndValidity();
    expect(control.errors).toBeNull();
  });

  it('should return error for past date', () => {
    const control = new FormControl('2020-01-01', [dateNotPastValidator()]);
    control.updateValueAndValidity();
    expect(control.errors).toEqual({ dateNotPast: true });
  });

  it('should return null for empty value', () => {
    const control = new FormControl('', [dateNotPastValidator()]);
    control.updateValueAndValidity();
    expect(control.errors).toBeNull();
  });
});
