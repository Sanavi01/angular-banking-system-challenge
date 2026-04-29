export class DateUtil {
  static addOneYear(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const isLeapDay = month === 2 && day === 29;
    if (isLeapDay && !DateUtil.isLeapYear(year + 1)) {
      return `${year + 1}-02-28`;
    }
    return `${year + 1}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  private static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
}
