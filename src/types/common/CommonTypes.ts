/**
 * Common TypeScript types and interfaces for CNAB processing
 * @module types/common
 */

/**
 * Brazilian postal address
 */
export interface Address {
  /** Street name and number */
  street: string;
  /** Additional address details (apartment, building, etc.) */
  complement?: string;
  /** Neighborhood/district */
  district: string;
  /** City name */
  city: string;
  /** State code (2 letters) */
  state: string;
  /** Postal code (CEP) - 8 digits */
  postalCode: string;
}

/**
 * Brazilian tax identification document (CPF or CNPJ)
 */
export interface TaxId {
  /** Type of document */
  type: 'CPF' | 'CNPJ';
  /** Document number (11 digits for CPF, 14 for CNPJ) */
  number: string;
}

/**
 * Bank account information
 */
export interface BankAccount {
  /** Bank code (3 digits) */
  bankCode: string;
  /** Branch/agency number */
  branch: string;
  /** Branch check digit (optional) */
  branchDigit?: string;
  /** Account number */
  account: string;
  /** Account check digit */
  accountDigit: string;
}

/**
 * Beneficiary (creditor) information
 * The party receiving the payment
 */
export interface Beneficiary {
  /** Legal or trade name */
  name: string;
  /** Tax identification (CPF or CNPJ) */
  taxId: TaxId;
  /** Bank account information */
  bankAccount: BankAccount;
  /** Mailing address */
  address: Address;
}

/**
 * Payer (debtor) information
 * The party making the payment
 */
export interface Payer {
  /** Full name or company name */
  name: string;
  /** Tax identification (CPF or CNPJ) */
  taxId: TaxId;
  /** Mailing address */
  address: Address;
  /** Email address (optional) */
  email?: string;
  /** Phone number (optional) */
  phone?: string;
}

/**
 * Bank slip (boleto) discount configuration
 */
export interface Discount {
  /** Discount type */
  type: 'fixed' | 'percentage';
  /** Discount value (amount or percentage) */
  value: number;
  /** Date until which discount is valid */
  dueDate: Date;
}

/**
 * Bank slip (boleto) fee configuration
 */
export interface Fee {
  /** Fee type */
  type: 'fixed' | 'percentage';
  /** Fee value (amount or percentage) */
  value: number;
  /** Date from which fee applies */
  startDate?: Date;
}

/**
 * Bank slip (boleto) fine configuration
 */
export interface Fine {
  /** Fine type */
  type: 'fixed' | 'percentage';
  /** Fine value (amount or percentage) */
  value: number;
  /** Date from which fine applies */
  startDate: Date;
}

/**
 * Bank slip (boleto) interest configuration
 */
export interface Interest {
  /** Interest type */
  type: 'monthly' | 'daily';
  /** Interest rate (percentage) */
  rate: number;
  /** Date from which interest applies */
  startDate?: Date;
}
