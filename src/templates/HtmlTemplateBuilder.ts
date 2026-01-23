import { formatMoney } from '@utils/formatters';
import type { BoletoTemplateData } from './BoletoTemplate';

export interface BoletoHtmlTemplateOptions {
  title?: string;
  heading?: string;
  bankLabel?: string;
  bankCodeLabel?: string;
  showBankName?: boolean;
}

export function buildBoletoHtml(
  data: BoletoTemplateData,
  options: BoletoHtmlTemplateOptions = {},
): string {
  const title = options.title ?? 'Boleto';
  const heading = options.heading ?? 'Boleto';
  const bankLabel = options.bankLabel ?? 'Banco';
  const bankCodeLabel = options.bankCodeLabel ?? 'Código do banco';
  const showBankName = options.showBankName ?? true;

  const bankName = showBankName ? ` - ${data.bank.name}` : '';
  const logoHtml = data.bank.logo
    ? `<img class="bank-logo" src="${data.bank.logo}" alt="Logo do banco" />`
    : '';

  const instructionsHtml = buildList(data.instructions);
  const additionalInfoHtml = buildKeyValueList(data.additionalInfo);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #111; background: #fff; }
    .boleto-page { width: min(780px, 100%); margin: 24px auto; padding: 24px; border: 1px solid #111; }
    .boleto-header { display: grid; grid-template-columns: 1fr auto; gap: 16px; border-bottom: 3px solid #111; padding-bottom: 12px; }
    .bank-info { display: flex; flex-direction: column; gap: 4px; }
    .bank-logo { max-height: 48px; max-width: 160px; object-fit: contain; }
    .heading { font-weight: 700; font-size: 16px; }
    .bank-code { font-weight: 700; font-size: 18px; }
    .digitable-line { font-weight: 600; text-align: right; font-size: 16px; }
    .section { margin-top: 16px; }
    .section-title { font-weight: 700; text-transform: uppercase; font-size: 12px; margin-bottom: 8px; letter-spacing: 0.4px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
    .field { border: 1px solid #111; padding: 8px; min-height: 54px; }
    .label { display: block; font-size: 11px; text-transform: uppercase; font-weight: 700; margin-bottom: 6px; }
    .value { font-size: 14px; }
    .barcode { margin-top: 12px; padding: 12px; border: 1px solid #111; display: flex; flex-direction: column; gap: 6px; }
    .barcode-text { font-family: 'Courier New', monospace; font-size: 12px; }
    .instructions { min-height: 80px; }
    .list { margin: 0; padding-left: 16px; }
    .footer-note { margin-top: 16px; font-size: 10px; color: #333; }
    @media (max-width: 720px) {
      .boleto-page { padding: 16px; }
      .boleto-header { grid-template-columns: 1fr; }
      .digitable-line { text-align: left; }
    }
    @media print {
      body { background: #fff; }
      .boleto-page { margin: 0; border: none; page-break-after: always; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="boleto-page">
    <header class="boleto-header">
      <div class="bank-info">
        <div class="heading">${heading}</div>
        <div class="bank-code">${bankCodeLabel}: ${data.bank.code}${bankName}</div>
        ${logoHtml}
      </div>
      <div class="digitable-line">Linha digitável: ${data.payment.digitableLine}</div>
    </header>

    <section class="section">
      <div class="section-title">Partes</div>
      <div class="grid">
        <div class="field">
          <span class="label">${bankLabel}</span>
          <span class="value">${data.bank.name}</span>
        </div>
        <div class="field">
          <span class="label">Beneficiário</span>
          <span class="value">${data.beneficiary.name}</span>
        </div>
        <div class="field">
          <span class="label">Pagador</span>
          <span class="value">${data.payer.name}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-title">Pagamento</div>
      <div class="grid">
        <div class="field">
          <span class="label">Número do documento</span>
          <span class="value">${data.payment.documentNumber}</span>
        </div>
        <div class="field">
          <span class="label">Nosso número</span>
          <span class="value">${data.payment.ourNumber}</span>
        </div>
        <div class="field">
          <span class="label">Valor</span>
          <span class="value">${formatMoney(data.payment.amount)}</span>
        </div>
        <div class="field">
          <span class="label">Vencimento</span>
          <span class="value">${formatDateIso(data.payment.dueDate)}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-title">Instruções</div>
      <div class="field instructions">
        ${instructionsHtml || '<span class="value">Sem instruções</span>'}
      </div>
    </section>

    <section class="section">
      <div class="section-title">Informações adicionais</div>
      <div class="field">
        ${additionalInfoHtml || '<span class="value">Sem informações adicionais</span>'}
      </div>
    </section>

    <section class="section">
      <div class="section-title">Código de barras</div>
      <div class="barcode" data-barcode="${data.payment.barcode}">
        <span class="barcode-text">${data.payment.barcode}</span>
      </div>
    </section>

    <p class="footer-note">${heading}</p>
  </div>
</body>
</html>`;
}

function buildList(items?: string[]): string {
  if (!items || items.length === 0) {
    return '';
  }

  const listItems = items.map((item) => `<li>${item}</li>`).join('');
  return `<ul class="list">${listItems}</ul>`;
}

function buildKeyValueList(items?: Record<string, string>): string {
  if (!items || Object.keys(items).length === 0) {
    return '';
  }

  const listItems = Object.entries(items)
    .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
    .join('');

  return `<ul class="list">${listItems}</ul>`;
}

function formatDateIso(value: Date): string {
  return value.toISOString().slice(0, 10);
}
