import { DateUtil } from './date.util';

describe('DateUtil', () => {
  describe('addOneYear', () => {
    it('should add exactly one year', () => {
      expect(DateUtil.addOneYear('2026-04-29')).toBe('2027-04-29');
    });

    it('should handle year transition', () => {
      expect(DateUtil.addOneYear('2026-12-31')).toBe('2027-12-31');
    });

    it('should handle leap year Feb 29 → next year not leap', () => {
      expect(DateUtil.addOneYear('2028-02-29')).toBe('2029-02-28');
    });

    it('should handle leap year Feb 29 → next year is leap', () => {
      expect(DateUtil.addOneYear('2024-02-29')).toBe('2025-02-28');
    });

    it('should handle normal Feb 28', () => {
      expect(DateUtil.addOneYear('2026-02-28')).toBe('2027-02-28');
    });

    it('should handle Feb 28 in leap year', () => {
      expect(DateUtil.addOneYear('2028-02-28')).toBe('2029-02-28');
    });

    it('should return empty string for empty input', () => {
      expect(DateUtil.addOneYear('')).toBe('');
    });

    it('should pad month and day with zeros', () => {
      expect(DateUtil.addOneYear('2026-01-05')).toBe('2027-01-05');
    });
  });
});
