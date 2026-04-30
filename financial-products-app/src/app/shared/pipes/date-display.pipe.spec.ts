import { DateDisplayPipe } from './date-display.pipe';

describe('DateDisplayPipe', () => {
  let pipe: DateDisplayPipe;

  beforeEach(() => {
    pipe = new DateDisplayPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform YYYY-MM-DD to DD/MM/YYYY', () => {
    expect(pipe.transform('2026-06-01')).toBe('01/06/2026');
  });

  it('should transform another valid date', () => {
    expect(pipe.transform('2023-12-31')).toBe('31/12/2023');
  });

  it('should handle single-digit day and month with zero padding', () => {
    expect(pipe.transform('2026-01-05')).toBe('05/01/2026');
  });

  it('should return empty string for falsy value', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should handle date at the beginning of the year', () => {
    expect(pipe.transform('2026-01-01')).toBe('01/01/2026');
  });

  it('should handle date at the end of the year', () => {
    expect(pipe.transform('2026-12-31')).toBe('31/12/2026');
  });

  it('should handle leap year date', () => {
    expect(pipe.transform('2028-02-29')).toBe('29/02/2028');
  });
});
