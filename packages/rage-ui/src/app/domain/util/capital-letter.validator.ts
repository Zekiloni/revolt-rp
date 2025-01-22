import { AbstractControl, ValidationErrors } from '@angular/forms';

export function capitalLetterValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (value && !/^[A-Z]/.test(value)) {
    return { startsWithCapitalLetter: true };
  }
  return null;
}
