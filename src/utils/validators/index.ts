/**
 * Validate Brazilian tax ID (CPF or CNPJ)
 * Performs checksum validation using modulo 11 algorithm
 *
 * @param taxId - Tax ID string (formatted or unformatted)
 * @returns true if valid, false otherwise
 *
 * @example
 * ```typescript
 * validateTaxId('111.444.777-35'); // Returns true
 * validateTaxId('11222333000181'); // Returns true
 * validateTaxId('11111111111'); // Returns false (all same digits)
 * ```
 */
export function validateTaxId(taxId: string): boolean {
  if (!taxId) return false;

  // Remove formatting
  const digits = taxId.replace(/\D/g, '');

  // Validate contains only numeric
  if (!/^\d+$/.test(digits)) return false;

  // CPF validation (11 digits)
  if (digits.length === 11) {
    return validateCPF(digits);
  }

  // CNPJ validation (14 digits)
  if (digits.length === 14) {
    return validateCNPJ(digits);
  }

  return false;
}

/**
 * Validate CPF using modulo 11 algorithm
 */
function validateCPF(cpf: string): boolean {
  // Reject CPF with all same digits
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Calculate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cpf[i]) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 > 9) digit1 = 0;

  // Calculate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cpf[i]) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 > 9) digit2 = 0;

  // Verify check digits
  return Number.parseInt(cpf[9]) === digit1 && Number.parseInt(cpf[10]) === digit2;
}

/**
 * Validate CNPJ using modulo 11 algorithm
 */
function validateCNPJ(cnpj: string): boolean {
  // Reject CNPJ with all same digits
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Calculate first check digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number.parseInt(cnpj[i]) * weights1[i];
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 > 9) digit1 = 0;

  // Calculate second check digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += Number.parseInt(cnpj[i]) * weights2[i];
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 > 9) digit2 = 0;

  // Verify check digits
  return Number.parseInt(cnpj[12]) === digit1 && Number.parseInt(cnpj[13]) === digit2;
}
