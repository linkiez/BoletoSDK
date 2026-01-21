/**
 * CNAB240 Service Type Codes
 *
 * Identifies the type of service being performed in the batch.
 *
 * @see FEBRABAN CNAB240 Specification
 */
export enum ServiceType {
  /**
   * Cobrança Simples (Simple Collection)
   * Standard bank slip collection service
   */
  SIMPLE_COLLECTION = '01',

  /**
   * Cobrança Vinculada (Linked Collection)
   * Collection linked to a specific agreement
   */
  LINKED_COLLECTION = '02',

  /**
   * Cobrança Caucionada (Guaranteed Collection)
   * Collection with guarantee/collateral
   */
  GUARANTEED_COLLECTION = '03',

  /**
   * Cobrança Descontada (Discounted Collection)
   * Collection with discount (factoring)
   */
  DISCOUNTED_COLLECTION = '04',

  /**
   * Outros Serviços (Other Services)
   * Bank-specific services
   */
  OTHER_SERVICES = '98',
}
