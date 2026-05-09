import type { BoletoTemplateData } from '../../src/templates/BoletoTemplate';

/**
 * Creates deterministic boleto template data for tests and benchmarks.
 *
 * @param index - Sequence number used to vary document identifiers.
 * @returns Boleto template payload.
 */
export function createBoletoTemplateData(index = 1): BoletoTemplateData {
  const doc = String(index).padStart(4, '0');

  return {
    beneficiary: {
      name: 'ACME Corp',
      document: '12345678000195',
      address: 'Main Avenue, 1000',
    },
    payer: {
      name: `Customer ${doc}`,
      document: '12345678901',
      address: `Sunset Street, ${index}`,
    },
    payment: {
      documentNumber: `DOC-${doc}`,
      ourNumber: `12345${doc}`,
      amount: 150.5,
      dueDate: new Date('2026-02-10T00:00:00.000Z'),
      barcode: '34100000000000000000000000000000000000000000',
      digitableLine: '34190.00000 00000.000000 00000.000000 0 00000000000000',
    },
    bank: {
      code: '341',
      name: 'ITAU UNIBANCO SA',
    },
    instructions: ['Pay before due date'],
    additionalInfo: {
      Reference: `INV-${doc}`,
    },
  };
}

/**
 * Creates a list of boleto template data for batch scenarios.
 *
 * @param count - Number of boleto items to generate.
 * @returns Boleto template data list.
 */
export function createBoletoTemplateDataBatch(count: number): BoletoTemplateData[] {
  return Array.from({ length: count }, (_, index) => createBoletoTemplateData(index + 1));
}
