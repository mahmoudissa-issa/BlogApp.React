/**
 * Basic math utility functions
 */

/**
 * Adds two numbers
 * @param a - First number
 * @param b - Second number
 * @returns Sum of a and b
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * Multiplies two numbers
 * @param a - First number
 * @param b - Second number
 * @returns Product of a and b
 */
export function multiply(a: number, b: number): number {
  return a * b;
}

/**
 * Checks if a number is even
 * @param n - Number to check
 * @returns True if the number is even, false otherwise
 */
export function isEven(n: number): boolean {
  return n % 2 === 0;
}