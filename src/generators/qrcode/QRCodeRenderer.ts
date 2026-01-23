import QRCode from 'qrcode';

export interface QRCodeRenderOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export async function renderPixQrCodeSvg(
  payload: string,
  options: QRCodeRenderOptions = {},
): Promise<string> {
  return QRCode.toString(payload, {
    type: 'svg',
    width: options.width,
    margin: options.margin,
    errorCorrectionLevel: options.errorCorrectionLevel,
  });
}

export async function renderPixQrCodePng(
  payload: string,
  options: QRCodeRenderOptions = {},
): Promise<Buffer> {
  return QRCode.toBuffer(payload, {
    type: 'png',
    width: options.width,
    margin: options.margin,
    errorCorrectionLevel: options.errorCorrectionLevel,
  });
}
