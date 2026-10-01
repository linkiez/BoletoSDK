import type { MessageFrontRecord } from '../../types/cnab400';
import { padRight } from '../../utils/generators';

/**
 * Generates a 400-character CNAB400 front-message record.
 *
 * @param record - Front-message fields and sequence number.
 * @returns Fixed-width record type 7.
 */
export function generateMessageFrontRecord(record: MessageFrontRecord): string {
  const formatMessageLine = (
    message: string | undefined,
    lineNumber: number | undefined,
    width: number,
  ): string => {
    const formattedLineNumber = String(message?.trim() ? (lineNumber ?? 1) : 0).padStart(2, '0');

    return `${formattedLineNumber}${padRight(message ?? '', width, ' ')}`;
  };

  const flashCode = padRight(record.flashCode ?? '', 3, ' ');
  const firstLine = formatMessageLine(record.message1, record.lineNumber1, 128);
  const secondLine = formatMessageLine(record.message2, record.lineNumber2, 128);
  const thirdLine = formatMessageLine(record.message3, record.lineNumber3, 127);
  const destinationCode = padRight(record.destinationCode ?? '', 1, ' ');
  const sequentialNumber = String(record.sequentialNumber).padStart(6, '0');

  return `7${flashCode}${firstLine}${secondLine}${thirdLine}${destinationCode}${sequentialNumber}`;
}
