import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateDisplay', standalone: true })
export class DateDisplayPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }
}
