import { generateBarcode } from '../../src/generators/barcode/BarcodeGenerator';
import type { BoletoTemplateData } from '../../src/templates/BoletoTemplate';
import type { Cnab240File } from '../../src/types';
import type { Cnab400File } from '../../src/types/cnab400';

const DEFAULT_FREE_FIELD = '1234567890123456789012345';

function createSafeBarcodeData(
  bankCode: string,
  dueDate: Date,
  amount: number,
): {
  barcode: string;
  digitableLine: string;
} {
  try {
    return generateBarcode({
      bankCode,
      dueDate,
      amount,
      freeField: DEFAULT_FREE_FIELD,
    });
  } catch {
    // Fallback for due dates outside the 4-digit factor window.
    return generateBarcode(
      {
        bankCode,
        dueDate,
        amount,
        freeField: DEFAULT_FREE_FIELD,
      },
      { baseDate: dueDate },
    );
  }
}

/**
 * Maps a parsed CNAB400 file to boleto template data using the first detail record.
 */
export function mapCnab400ToBoletoTemplateData(cnab: Cnab400File): BoletoTemplateData {
  const detail = cnab.details[0];
  if (!detail) {
    throw new Error('CNAB400 file does not contain detail records');
  }

  const dueDate = detail.dueDate ?? new Date();
  const amount = detail.amount ?? 0;
  const barcodeData = createSafeBarcodeData(cnab.header.bankCode, dueDate, amount);

  return {
    beneficiary: {
      name: cnab.header.companyName || 'Beneficiary',
      document: detail.companyRegistrationNumber || '-',
      address: 'Address not provided',
    },
    payer: {
      name: detail.payerName || 'Payer',
      document: detail.payerRegistrationNumber || '-',
      address: detail.payerAddress || 'Address not provided',
    },
    payment: {
      documentNumber: detail.documentNumber || 'DOC-001',
      ourNumber: detail.ourNumber,
      amount,
      dueDate,
      barcode: barcodeData.barcode,
      digitableLine: barcodeData.digitableLine,
    },
    bank: {
      code: cnab.header.bankCode,
      name: cnab.header.bankName,
    },
    additionalInfo: {
      cidadeUfCepSacado: [detail.payerCity || '-', detail.payerState || '-'].join(' / '),
    },
  };
}

/**
 * Maps a parsed CNAB240 file to boleto template data using the first batch/detail.
 */
export function mapCnab240ToBoletoTemplateData(cnab: Cnab240File): BoletoTemplateData {
  const firstBatch = cnab.batches[0];
  if (!firstBatch) {
    throw new Error('CNAB240 file does not contain batches');
  }

  const firstDetail = firstBatch.details[0];
  if (!firstDetail) {
    throw new Error('CNAB240 batch does not contain detail records');
  }

  const segmentP = firstDetail.segmentP;
  const segmentQ = firstDetail.segmentQ;
  const barcodeData = createSafeBarcodeData(segmentP.bankCode, segmentP.dueDate, segmentP.amount);

  return {
    beneficiary: {
      name: cnab.fileHeader.companyName,
      document: cnab.fileHeader.companyRegistrationNumber,
      address: 'Address not provided',
    },
    payer: {
      name: segmentQ.payerName,
      document: segmentQ.payerTaxId,
      address: segmentQ.payerAddress || 'Address not provided',
    },
    payment: {
      documentNumber: segmentP.documentNumber,
      ourNumber: segmentP.ourNumber,
      amount: segmentP.amount,
      dueDate: segmentP.dueDate,
      barcode: barcodeData.barcode,
      digitableLine: barcodeData.digitableLine,
    },
    bank: {
      code: segmentP.bankCode,
      name: cnab.fileHeader.bankName,
    },
    additionalInfo: {
      cidadeUfCepSacado: [segmentQ.payerCity, segmentQ.payerState].join(' / '),
    },
  };
}
