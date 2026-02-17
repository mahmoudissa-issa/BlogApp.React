import { add, multiply, isEven } from "./math";

describe('Math Utilities', () => {
  describe('add', () => {
    it('should add two positive numbers correctly', () => {
      const result = add(2, 3);
      expect(result).toBe(5);
    });

    it('should add negative numbers correctly', () => {
      const result = add(-2, -3);
      expect(result).toBe(-5);
    });

    it('should add a positive and a negative number correctly', () => {
      const result = add(5, -3);
      expect(result).toBe(2);
    });

    it('should add zero correctly', () => {
      const result = add(5, 0);
      expect(result).toBe(5);
    });

    it('should add decimal numbers correctly', () => {
      const result = add(2.5, 3.1);
      expect(result).toBeCloseTo(5.6);
    });

    it('should add large numbers correctly', () => {
      const result = add(1e10, 1e10);
      expect(result).toBe(2e10);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers correctly', () => {
      const result = multiply(4, 3);
      expect(result).toBe(12);
    });

    it('should multiply with zero', () => {
      const result = multiply(5, 0);
      expect(result).toBe(0);
    });

    it('should multiply negative numbers correctly', () => {
      const result = multiply(-2, 3);
      expect(result).toBe(-6);
    });

    it('should multiply two negative numbers', () => {
      const result = multiply(-2, -3);
      expect(result).toBe(6);
    });

    it('should multiply decimal numbers', () => {
      const result = multiply(2.5, 4);
      expect(result).toBeCloseTo(10);
    });
  });

  describe('isEven', () => {
    it('should return true for even positive numbers', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(100)).toBe(true);
      expect(isEven(0)).toBe(true);
    });

    it('should return false for odd positive numbers', () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
      expect(isEven(99)).toBe(false);
    });

    it('should return true for even negative numbers', () => {
      expect(isEven(-2)).toBe(true);
      expect(isEven(-4)).toBe(true);
    });

    it('should return false for odd negative numbers', () => {
      expect(isEven(-1)).toBe(false);
      expect(isEven(-3)).toBe(false);
    });

    it('should handle decimal numbers', () => {
      expect(isEven(2.0)).toBe(true);
      expect(isEven(1.5)).toBe(false);
    });
  });
});