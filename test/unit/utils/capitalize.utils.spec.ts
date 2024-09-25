import { capitalizeFirstCharacter } from '../../../src/utils/capitalize.utils';

describe('capitalizeFirstCharacter', () => {
  it('capitalizes the first character of a string', () => {
    expect(capitalizeFirstCharacter('hello')).toBe('Hello');
  });

  it('returns the same string if the first character is already capitalized', () => {
    expect(capitalizeFirstCharacter('Hello')).toBe('Hello');
  });

  it('returns the same string if the first character is uppercase', () => {
    expect(capitalizeFirstCharacter('A')).toBe('A');
  });

  it('returns an empty string if the input is empty', () => {
    expect(capitalizeFirstCharacter('')).toBe('');
  });

  it('returns the same string if input is a single character', () => {
    expect(capitalizeFirstCharacter('a')).toBe('A');
    expect(capitalizeFirstCharacter('Z')).toBe('Z');
  });

  it('does not alter the string if it contains special characters at the start', () => {
    expect(capitalizeFirstCharacter('@hello')).toBe('@hello');
  });
});
