/**
 * Validates an email address using a standard RFC 5322 simplified pattern.
 *
 * @param email - The email address string to validate.
 * @returns `true` if the email format is valid, `false` otherwise.
 *
 * @example
 * isValidEmail('user@example.com'); // true
 * isValidEmail('invalid-email');    // false
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string' || email.length === 0) {
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u;
  return emailRegex.test(email.trim());
}

/**
 * Validates a list of email addresses and returns only valid ones.
 *
 * @param emails - Array of email address strings to filter.
 * @returns Array containing only valid email addresses.
 *
 * @example
 * filterValidEmails(['good@example.com', 'bad', 'also@good.com']);
 * // ['good@example.com', 'also@good.com']
 */
export function filterValidEmails(emails: string[]): string[] {
  return emails.filter(isValidEmail);
}
