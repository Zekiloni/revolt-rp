import { AbstractControl } from '@angular/forms';

export const CHARACTER_MIN_AGE = 18, CHARACTER_MAX_AGE = 90;

export function characterAgeValidator(control: AbstractControl) {
  if (!control.value) {
    return null;
  }

  const birthDate: Date = new Date(control.value);
  const currentDate: Date = new Date();
  const age: number = currentDate.getFullYear() - birthDate.getFullYear();

  if (age < CHARACTER_MIN_AGE || age > CHARACTER_MAX_AGE) {
    return { 'characterAge': true };
  }

  return null;
};
