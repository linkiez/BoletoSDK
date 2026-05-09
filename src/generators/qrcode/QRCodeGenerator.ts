import { generatePixPayload, PixPayloadData } from './PixPayloadGenerator';
import { validatePixPayload } from './PixPayloadValidator';

export interface PixQRCodeOptions {
  renderer?: (payload: string) => string;
}

export interface PixQRCodeResult {
  payload: string;
  qrCode?: string;
}

export function generatePixQRCode(
  data: PixPayloadData,
  options: PixQRCodeOptions = {},
): PixQRCodeResult {
  const payload = generatePixPayload(data);
  validatePixPayload(payload);

  return {
    payload,
    qrCode: options.renderer ? options.renderer(payload) : undefined,
  };
}
