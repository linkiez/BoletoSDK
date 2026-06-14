import type { BoletoTemplate, BoletoTemplateData } from './BoletoTemplate';
import { renderI2of5Svg } from '@generators/barcode/BarcodeRenderer';

export class IndustrialIntegrityTemplate implements BoletoTemplate {
  public render(data: BoletoTemplateData): string {
    const dueDate = formatDateBr(data.payment.dueDate);
    const amount = formatMoney(data.payment.amount);
    const instructions = (data.instructions ?? [])
      .slice(0, 3)
      .map((item) => `<p>${escapeHtml(item)}</p>`)
      .join('');
    const payerAddress = escapeHtml(data.payer.address || '-');
    const bankCode = escapeHtml(data.bank.code);
    const digitableLine = escapeHtml(data.payment.digitableLine);
    const barcodeSvg = renderI2of5Svg(data.payment.barcode, {
      height: 56,
      narrowWidth: 2,
      wideWidth: 4,
      quietZone: 12,
    });
    const pixPayload = data.payment.pix?.payload ? escapeHtml(data.payment.pix.payload) : null;
    const pixQrCodeSvg = data.payment.pix?.qrCodeSvg ?? null;

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Industrial Integrity - Ficha de Compensacao</title>
  <style>
    body { background: #f8f9fa; margin: 0; font-family: Inter, Arial, sans-serif; color: #000; }
    .page { width: 210mm; min-height: 297mm; margin: 10mm auto; padding: 16mm; background: #fff; color: #000; }
    .top { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px dashed #c7c6cb; padding-bottom: 12px; margin-bottom: 14px; }
    .brand { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; }
    .subtitle { font-size: 11px; color: #000; letter-spacing: 0.08em; }
    .bank-chip { background: #27272a; color: #fff; padding: 3px 8px; border-radius: 3px; font-weight: 700; }
    .grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; border: 1px solid #77767b; margin-bottom: 18px; }
    .cell { border-right: 1px solid #77767b; border-bottom: 1px solid #77767b; padding: 8px; }
    .cell:nth-child(4n) { border-right: none; }
    .label { display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: #000; margin-bottom: 4px; }
    .value { font-size: 13px; font-weight: 600; }
    .cut { border-top: 2px dashed #c7c6cb; margin: 18px 0; }
    .line { border: 2px solid #000; border-bottom: none; padding: 8px 10px; font-size: 20px; font-weight: 700; letter-spacing: 0.02em; }
    .table { width: 100%; border-collapse: collapse; border: 2px solid #000; border-top: none; }
    .table td { border: 1px solid #77767b; padding: 6px; vertical-align: top; }
    .table .label { font-size: 8px; margin-bottom: 2px; }
    .table .value { font-size: 12px; }
    .instructions p { margin: 4px 0; font-size: 12px; }
    .barcode-box { border: 1px solid #77767b; margin-top: 20px; padding: 10px; }
    .barcode-image { display: flex; justify-content: center; overflow: hidden; }
    .barcode-image svg { max-width: 100%; height: auto; }
    .barcode-text { font-family: 'Courier New', monospace; font-size: 13px; letter-spacing: 1px; text-align: center; }
    .pix-box { border: 1px solid #77767b; margin-top: 12px; padding: 10px; }
    .pix-content { display: flex; gap: 12px; align-items: center; }
    .pix-qr { width: 180px; height: 180px; display: flex; align-items: center; justify-content: center; }
    .pix-qr svg { width: 100%; height: 100%; }
    .pix-payload { font-family: 'Courier New', monospace; font-size: 11px; word-break: break-all; }
    .footer { font-size: 10px; color: #000; text-align: right; margin-top: 8px; }
  </style>
</head>
<body>
  <main class="page">
    <header class="top">
      <div>
        <div class="brand">INDUSTRIAL INTEGRITY</div>
        <div class="subtitle">FICHA DE COMPENSACAO</div>
      </div>
      <div>
        <span class="bank-chip">${bankCode}</span>
        <span style="margin-left: 8px; font-weight: 700">${escapeHtml(data.bank.name)}</span>
      </div>
    </header>

    <section class="grid">
      <div class="cell" style="grid-column: span 2">
        <span class="label">Beneficiario</span>
        <span class="value">${escapeHtml(data.beneficiary.name)} - ${escapeHtml(data.beneficiary.document)}</span>
      </div>
      <div class="cell">
        <span class="label">Vencimento</span>
        <span class="value">${escapeHtml(dueDate)}</span>
      </div>
      <div class="cell">
        <span class="label">Valor</span>
        <span class="value">${escapeHtml(amount)}</span>
      </div>
      <div class="cell" style="grid-column: span 2">
        <span class="label">Pagador</span>
        <span class="value">${escapeHtml(data.payer.name)} - ${escapeHtml(data.payer.document)}</span>
      </div>
      <div class="cell" style="grid-column: span 2">
        <span class="label">Endereco</span>
        <span class="value">${payerAddress}</span>
      </div>
    </section>

    <div class="cut"></div>

    <div class="line">${digitableLine}</div>
    <table class="table">
      <tr>
        <td colspan="3"><span class="label">Local de Pagamento</span><span class="value">Pagavel em qualquer banco ate o vencimento.</span></td>
        <td><span class="label">Vencimento</span><span class="value">${escapeHtml(dueDate)}</span></td>
      </tr>
      <tr>
        <td colspan="3"><span class="label">Beneficiario</span><span class="value">${escapeHtml(data.beneficiary.name)} - ${escapeHtml(data.beneficiary.document)}</span></td>
        <td><span class="label">Nosso Numero</span><span class="value">${escapeHtml(data.payment.ourNumber)}</span></td>
      </tr>
      <tr>
        <td><span class="label">Data Doc.</span><span class="value">${escapeHtml(dueDate)}</span></td>
        <td><span class="label">Numero Doc.</span><span class="value">${escapeHtml(data.payment.documentNumber)}</span></td>
        <td><span class="label">Carteira</span><span class="value">${escapeHtml(data.additionalInfo?.Carteira ?? '-')}</span></td>
        <td><span class="label">Valor Documento</span><span class="value">${escapeHtml(amount)}</span></td>
      </tr>
      <tr>
        <td colspan="4" class="instructions"><span class="label">Instrucoes</span>${instructions || '<p>Sem instrucoes.</p>'}</td>
      </tr>
    </table>

    <section class="barcode-box">
      <div class="barcode-image">${barcodeSvg}</div>
      <div class="barcode-text">${escapeHtml(data.payment.barcode)}</div>
      <div class="footer">AUTENTICACAO MECANICA - FICHA DE COMPENSACAO</div>
    </section>
    ${
      pixPayload
        ? `<section class="pix-box">
      <span class="label">PIX Copia e Cola</span>
      <div class="pix-content">
        <div class="pix-qr">${pixQrCodeSvg ?? '<span class="label">Sem QR</span>'}</div>
        <div class="pix-payload">${pixPayload}</div>
      </div>
    </section>`
        : ''
    }
  </main>
</body>
</html>`;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDateBr(value: Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}
