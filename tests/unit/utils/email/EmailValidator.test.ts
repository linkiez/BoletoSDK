import { isValidEmail, filterValidEmails } from '@utils/email/EmailValidator';

describe('isValidEmail', () => {
  it('should accept a standard email address', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('should accept email with subdomains', () => {
    expect(isValidEmail('user@mail.example.co.uk')).toBe(true);
  });

  it('should accept email with plus addressing', () => {
    expect(isValidEmail('user+tag@example.com')).toBe(true);
  });

  it('should accept email with dots in local part', () => {
    expect(isValidEmail('first.last@example.com')).toBe(true);
  });

  it('should reject empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('should reject string without @', () => {
    expect(isValidEmail('invalidemail')).toBe(false);
  });

  it('should reject string missing domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('should reject string missing TLD', () => {
    expect(isValidEmail('user@domain')).toBe(false);
  });

  it('should reject string missing local part', () => {
    expect(isValidEmail('@example.com')).toBe(false);
  });
});

describe('filterValidEmails', () => {
  it('should return only valid emails from a mixed list', () => {
    const emails = ['good@example.com', 'bad', 'also@good.com', ''];
    expect(filterValidEmails(emails)).toEqual(['good@example.com', 'also@good.com']);
  });

  it('should return empty array when all are invalid', () => {
    expect(filterValidEmails(['bad', 'also-bad'])).toEqual([]);
  });

  it('should return all when all are valid', () => {
    const emails = ['a@b.com', 'c@d.org'];
    expect(filterValidEmails(emails)).toEqual(emails);
  });
});
