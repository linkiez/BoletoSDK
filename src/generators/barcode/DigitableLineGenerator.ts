import { calculateModulo10 } from '@utils/generators';
import { assertNumeric, BARCODE_LENGTH } from './BarcodeUtils';

export function generateDigitableLine(barcode: string): string {
  assertNumeric(barcode, 'Barcode', BARCODE_LENGTH);

  const bankCode = barcode.slice(0, 3);
  const currencyCode = barcode[3];
  const generalDigit = barcode[4];
  const dueDateFactor = barcode.slice(5, 9);
  const amount = barcode.slice(9, 19);
  const freeField = barcode.slice(19);

  const field1Data = `${bankCode}${currencyCode}${freeField.slice(0, 5)}`;
  const field2Data = freeField.slice(5, 15);
  const field3Data = freeField.slice(15, 25);

  const field1 = `${field1Data}${calculateModulo10(field1Data)}`;
  const field2 = `${field2Data}${calculateModulo10(field2Data)}`;
  const field3 = `${field3Data}${calculateModulo10(field3Data)}`;

  const formattedField1 = `${field1.slice(0, 5)}.${field1.slice(5)}`;
  const formattedField2 = `${field2.slice(0, 5)}.${field2.slice(5)}`;
  const formattedField3 = `${field3.slice(0, 5)}.${field3.slice(5)}`;
  const field5 = `${dueDateFactor}${amount}`;

  return `${formattedField1} ${formattedField2} ${formattedField3} ${generalDigit} ${field5}`;
}
