const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F'] as const;
type HexDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | typeof LETTERS[number];

// 1. Checks if all characters are valid hex digits and total length is 3 or 6
type IsValidHex<S extends string, Count extends any[] = []> = 
  S extends `${infer Char}${infer Rest}`
    ? Char extends HexDigit
      ? IsValidHex<Rest, [...Count, any]>
      : false
    : Count['length'] extends 3 | 6 ? true : false;

// 2. The clean, user-friendly HexColor type
type HexColor<T extends string> = T extends `#${infer Code}` 
  ? IsValidHex<Code> extends true 
    ? T 
    : "Error: Must be a valid 3 or 6-digit hex color"
  : "Error: Must start with #";


// Generic factory function for validation
const createHexColor = <T extends string>(value: T & ValidateHEX<T>): T => value;

declare interface NotificationMetadata {
    Title: string
    Content: string
}