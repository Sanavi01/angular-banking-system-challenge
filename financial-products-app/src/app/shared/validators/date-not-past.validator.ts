import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateNotPastValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(control.value + 'T00:00:00');
    return inputDate >= today ? null : { dateNotPast: true };
  };
}
