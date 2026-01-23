/**
 * Common enums for CNAB processing
 * @module enums/common
 */

/**
 * Brazilian bank codes
 * Based on FEBRABAN standards
 */
export enum BankCode {
  /** Banco do Brasil */
  BANCO_DO_BRASIL = '001',
  /** Banco Santander */
  SANTANDER = '033',
  /** Caixa Econômica Federal */
  CAIXA = '104',
  /** Bradesco */
  BRADESCO = '237',
  /** C6 Bank */
  C6_BANK = '336',
  /** Itaú Unibanco */
  ITAU = '341',
}

/**
 * Document type identifiers
 */
export enum DocumentType {
  /** CPF - Cadastro de Pessoa Física (Individual taxpayer) */
  CPF = 'CPF',
  /** CNPJ - Cadastro Nacional da Pessoa Jurídica (Corporate taxpayer) */
  CNPJ = 'CNPJ',
}

/**
 * Bank slip species codes
 * Types of financial instruments
 */
export enum SpeciesCode {
  /** Duplicata Mercantil */
  DM = 'DM',
  /** Duplicata de Serviço */
  DS = 'DS',
  /** Nota Promissória */
  NP = 'NP',
  /** Nota de Seguro */
  NS = 'NS',
  /** Recibo */
  RC = 'RC',
  /** Letra de Câmbio */
  LC = 'LC',
  /** Warrant */
  WT = 'WT',
  /** Cheque */
  CH = 'CH',
  /** Duplicata Mercantil Indicação */
  DM_I = 'DM_I',
  /** Duplicata de Serviço Indicação */
  DS_I = 'DS_I',
  /** Diversos */
  DIV = 'DIV',
}

/**
 * Bank slip acceptance types
 */
export enum AcceptanceType {
  /** Accepted */
  ACCEPTED = 'A',
  /** Not accepted */
  NOT_ACCEPTED = 'N',
}

/**
 * Currency codes
 */
export enum CurrencyCode {
  /** Brazilian Real */
  BRL = 'BRL',
  /** US Dollar */
  USD = 'USD',
}

/**
 * CNAB file types
 */
export enum CnabType {
  /** CNAB 240 - 240 bytes per line */
  CNAB240 = '240',
  /** CNAB 400 - 400 bytes per line */
  CNAB400 = '400',
}

/**
 * File movement types
 */
export enum MovementType {
  /** Remittance file (outgoing) */
  REMESSA = 'REMESSA',
  /** Return file (incoming) */
  RETORNO = 'RETORNO',
}

/**
 * Instruction codes for bank slips
 */
export enum InstructionCode {
  /** No instruction */
  NONE = '00',
  /** Protest after N days overdue */
  PROTEST = '01',
  /** Do not protest */
  DO_NOT_PROTEST = '02',
  /** Return after N days overdue */
  RETURN = '03',
  /** Do not charge interest */
  NO_INTEREST = '04',
  /** Charge interest */
  CHARGE_INTEREST = '05',
  /** Do not charge fine */
  NO_FINE = '06',
  /** Charge fine */
  CHARGE_FINE = '07',
}
