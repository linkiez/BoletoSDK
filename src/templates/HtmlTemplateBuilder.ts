import { validatePixPayload } from '@generators/qrcode/PixPayloadValidator';
import { renderPixQrCodeSvg } from '@generators/qrcode/QRCodeRenderer';
import { formatMoney } from '@utils/formatters';
import { getBankCodeWithCheckDigit } from '@constants/bancos';
import type { BoletoTemplateData } from './BoletoTemplate';

export interface BoletoHtmlTemplateOptions {
  title?: string;
  heading?: string;
  bankLabel?: string;
  bankCodeLabel?: string;
  showBankName?: boolean;
  layout?: 'simple' | 'instructions' | 'detailed';
}

export interface BoletoHtmlPixDependencies {
  renderPixQrCodeSvg?: typeof renderPixQrCodeSvg;
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

  const layout = options.layout ?? 'detailed';
  const showInstructions = layout !== 'simple';
  const showAdditionalInfo = layout === 'detailed';

  const bankName = showBankName ? data.bank.name : '';
  const logoHtml = data.bank.logo
    ? `<img src="${escapeHtml(data.bank.logo)}" alt="Logo do banco" style="max-height: 10mm; max-width: 100%; object-fit: contain" />`
    : `<span style="font-size: 2.6mm; font-family: arial, verdana; font-weight: bold">${escapeHtml(bankName || heading)}</span>`;

  const localPayment = getAdditionalInfo(
    data.additionalInfo,
    'localPagamento',
    'Pagável preferencialmente na rede bancária até o vencimento',
  );
  const agencyCode = getAdditionalInfo(data.additionalInfo, 'agenciaCodigoCedente', '-');
  const wallet = getAdditionalInfo(data.additionalInfo, 'carteira', 'SR');
  const specie = getAdditionalInfo(data.additionalInfo, 'especie', 'RC');
  const accept = getAdditionalInfo(data.additionalInfo, 'aceite', 'N');
  const documentDate = getAdditionalInfo(
    data.additionalInfo,
    'dataDocumento',
    formatDateBr(data.payment.dueDate),
  );
  const processingDate = getAdditionalInfo(
    data.additionalInfo,
    'dataProcessamento',
    formatDateBr(data.payment.dueDate),
  );
  const payerAddressLine = getAdditionalInfo(
    data.additionalInfo,
    'enderecoSacado',
    data.payer.address,
  );
  const payerCityLine = getAdditionalInfo(data.additionalInfo, 'cidadeUfCepSacado', '-');
  const guarantorName = getAdditionalInfo(data.additionalInfo, 'sacadorAvalista', '-');
  const barcodeImage = getAdditionalInfo(data.additionalInfo, 'barcodeImage', '');
  const instructionList = showInstructions ? buildInstructionList(data.instructions) : '';
  const instructionBody = showInstructions
    ? buildInstructionBody(data.instructions, data.additionalInfo, showAdditionalInfo)
    : '&nbsp;';
  const instructionTitle = showInstructions ? 'Instruções' : '&nbsp;';

  const fallbackDigit = getAdditionalInfo(data.additionalInfo, 'bankCheckDigit', '0');
  const bankCodeWithDigit = escapeHtml(getBankCodeWithCheckDigit(data.bank.code, fallbackDigit));
  const digitableLine = escapeHtml(data.payment.digitableLine);
  const dueDate = escapeHtml(formatDateBr(data.payment.dueDate));
  const beneficiaryName = escapeHtml(data.beneficiary.name);
  const documentNumber = escapeHtml(data.payment.documentNumber);
  const ourNumber = escapeHtml(data.payment.ourNumber);
  const amount = escapeHtml(formatMoney(data.payment.amount));
  const payerName = escapeHtml(data.payer.name);
  const payerDocument = escapeHtml(data.payer.document);
  const barcodeValue = escapeHtml(data.payment.barcode);
  const pixPanel = buildPixPanel(data.payment.pix);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { margin: 0; background: #fff; }
    table.Boleto { margin: 0 auto; width: 19cm; border-collapse: collapse; }
    td.BoletoCodigoBanco {font-size: 6mm; font-family: arial, verdana; font-weight : bold;
      font-style: italic; text-align: center; vertical-align: bottom;
      border-bottom: 0.15mm solid #000000; border-right: 0.15mm solid #000000;
      padding-bottom : 1mm}
    td.BoletoLogo { border-bottom: 0.15mm solid #000000; border-right: 0.15mm solid #000000;
      text-align: center; height: 10mm}
    td.BoletoLinhaDigitavel {font-size: 4mm; font-family: arial, verdana; font-weight : bold;
      text-align: center; vertical-align: bottom;
      border-bottom: 0.15mm solid #000000; padding-bottom : 1mm; }
    td.BoletoTituloEsquerdo{font-size: 0.2cm; font-family: arial, verdana; padding-left : 0.15mm;
      border-right: 0.15mm solid #000000; text-align: left}
    td.BoletoTituloDireito{font-size: 2mm; font-family: arial, verdana; padding-left : 0.15mm;
      text-align: left}
    td.BoletoValorEsquerdo{font-size: 3mm; font-family: arial, verdana; text-align: center;
      border-right: 0.15mm solid #000000; font-weight: bold;
      border-bottom: 0.15mm solid #000000; padding-top: 0.5mm}
    td.BoletoValorDireito{font-size: 3mm; font-family: arial, verdana; text-align:right;
      padding-right: 3mm; padding-top: 0.8mm; border-bottom: 0.15mm solid #000000;
      font-weight: bold;}
    td.BoletoTituloSacado{font-size: 2mm; font-family: arial, verdana; padding-left : 0.15mm;
      vertical-align: top; padding-top : 0.15mm; text-align: left}
    td.BoletoValorSacado{font-size: 3mm; font-family: arial, verdana; font-weight: bold;
      text-align : left}
    td.BoletoTituloSacador{font-size: 2mm; font-family: arial, verdana; padding-left : 0.15mm;
      vertical-align: bottom; padding-bottom : 0.8mm;
      border-bottom: 0.15mm solid #000000}
    td.BoletoValorSacador{font-size: 3mm; font-family: arial, verdana; vertical-align: bottom;
      padding-bottom : 0.15mm; border-bottom: 0.15mm solid #000000;
      font-weight: bold; text-align: left}
    td.BoletoPontilhado{border-top: 0.3mm dashed #000000; font-size: 1mm}
    ul.BoletoInstrucoes{font-size : 3mm; font-family : verdana, arial; margin: 0 0 0 0.3cm; padding-left: 0.35cm}
    .BoletoCodBarrasTexto{font-family: 'Courier New', monospace; font-size: 2.4mm; letter-spacing: 0.2mm; padding: 0.2cm 0}
    .BoletoPix { margin-top: 0.15cm; border: 0.15mm solid #000; padding: 0.2cm; font-size: 2.2mm; font-family: arial, verdana; }
    .BoletoPixPayload { font-family: 'Courier New', monospace; font-size: 2.1mm; word-break: break-all; }
    @media (max-width: 820px) {
      table.Boleto { width: 100%; }
      ul.BoletoInstrucoes { font-size: 2.8mm; }
    }
    @media print {
      body { margin: 0; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <p align="center">
    <table cellspacing="0" cellpadding="0" border="0" class="Boleto">
      <tr>
        <td style="width: 0.9cm"></td>
        <td style="width: 1cm"></td>
        <td style="width: 1.9cm"></td>
        <td style="width: 0.5cm"></td>
        <td style="width: 1.3cm"></td>
        <td style="width: 0.8cm"></td>
        <td style="width: 1cm"></td>
        <td style="width: 1.9cm"></td>
        <td style="width: 1.9cm"></td>
        <td style="width: 3.8cm"></td>
        <td style="width: 3.8cm"></td>
      </tr>
      ${instructionList}
      <tr><td colspan="11" class="BoletoPontilhado">&nbsp;</td></tr>
      ${buildSlipSection({
        logoHtml,
        bankCodeWithDigit,
        digitableLine,
        localPayment: escapeHtml(localPayment),
        dueDate,
        beneficiaryName,
        agencyCode: escapeHtml(agencyCode),
        documentDate: escapeHtml(documentDate),
        documentNumber,
        specie: escapeHtml(specie),
        accept: escapeHtml(accept),
        processingDate: escapeHtml(processingDate),
        ourNumber,
        wallet: escapeHtml(wallet),
        amount,
        instructionTitle,
        instructionBody,
        payerName,
        payerDocument,
        payerAddressLine: escapeHtml(payerAddressLine),
        payerCityLine: escapeHtml(payerCityLine),
        guarantorName: escapeHtml(guarantorName),
        rightFooter: `${escapeHtml(heading)} - Recibo do Sacado - Autenticação Mecânica`,
        bottomContent: '&nbsp;',
      })}
      <tr><td colspan="11" class="BoletoPontilhado">&nbsp;</td></tr>
      ${buildSlipSection({
        logoHtml,
        bankCodeWithDigit,
        digitableLine,
        localPayment: escapeHtml(localPayment),
        dueDate,
        beneficiaryName,
        agencyCode: escapeHtml(agencyCode),
        documentDate: escapeHtml(documentDate),
        documentNumber,
        specie: escapeHtml(specie),
        accept: escapeHtml(accept),
        processingDate: escapeHtml(processingDate),
        ourNumber,
        wallet: escapeHtml(wallet),
        amount,
        instructionTitle,
        instructionBody,
        payerName,
        payerDocument,
        payerAddressLine: escapeHtml(payerAddressLine),
        payerCityLine: escapeHtml(payerCityLine),
        guarantorName: escapeHtml(guarantorName),
        rightFooter: `${escapeHtml(heading)} - Ficha de Compensação - Autenticação Mecânica`,
        bottomContent: buildBarcodeBlock(barcodeImage, barcodeValue),
      })}
      ${pixPanel}
      <tr><td colspan="11" class="BoletoPontilhado">&nbsp;</td></tr>
      <tr>
        <td colspan="11" style="font-size: 2mm; font-family: arial, verdana; text-align: right; padding: 0.05cm 0.1cm 0.15cm 0">
          ${escapeHtml(bankLabel)}: ${escapeHtml(bankName || '-')}&nbsp;&nbsp;|&nbsp;&nbsp;${escapeHtml(bankCodeLabel)}: ${escapeHtml(data.bank.code)}
        </td>
      </tr>
    </table>
  </p>
</body>
</html>`;
}

export async function buildBoletoHtmlWithPixQrCode(
  data: BoletoTemplateData,
  options: BoletoHtmlTemplateOptions = {},
  dependencies: BoletoHtmlPixDependencies = {},
): Promise<string> {
  const pix = data.payment.pix;
  if (!pix || pix.qrCodeSvg) {
    return buildBoletoHtml(data, options);
  }

  validatePixPayload(pix.payload);

  const renderer = dependencies.renderPixQrCodeSvg ?? renderPixQrCodeSvg;
  const qrCodeSvg = await renderer(pix.payload);

  return buildBoletoHtml(
    {
      ...data,
      payment: {
        ...data.payment,
        pix: {
          ...pix,
          qrCodeSvg,
        },
      },
    },
    options,
  );
}

function buildInstructionList(items?: string[]): string {
  if (!items || items.length === 0) {
    return '';
  }

  const listItems = items
    .slice(0, 4)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  return `<tr><td colspan="11"><ul class="BoletoInstrucoes">${listItems}</ul></td></tr>`;
}

function buildInstructionBody(
  items?: string[],
  additionalInfo?: Record<string, string>,
  showAdditionalInfo = true,
): string {
  const instructionItems = (items ?? []).slice(0, 6).map((item) => escapeHtml(item));
  const additionalItems = showAdditionalInfo
    ? Object.entries(additionalInfo ?? {})
        .slice(0, 4)
        .map(([key, value]) => `${escapeHtml(key)}: ${escapeHtml(String(value))}`)
    : [];

  const lines = [...instructionItems, ...additionalItems];
  if (lines.length === 0) {
    return '&nbsp;';
  }

  return lines.join('<br />');
}

interface SlipSectionData {
  logoHtml: string;
  bankCodeWithDigit: string;
  digitableLine: string;
  localPayment: string;
  dueDate: string;
  beneficiaryName: string;
  agencyCode: string;
  documentDate: string;
  documentNumber: string;
  specie: string;
  accept: string;
  processingDate: string;
  ourNumber: string;
  wallet: string;
  amount: string;
  instructionTitle: string;
  instructionBody: string;
  payerName: string;
  payerDocument: string;
  payerAddressLine: string;
  payerCityLine: string;
  guarantorName: string;
  rightFooter: string;
  bottomContent: string;
}

function buildSlipSection(data: SlipSectionData): string {
  return `
  <tr>
    <td colspan="4" class="BoletoLogo">${data.logoHtml}</td>
    <td colspan="2" class="BoletoCodigoBanco">${data.bankCodeWithDigit}</td>
    <td colspan="5" class="BoletoLinhaDigitavel">${data.digitableLine}</td>
  </tr>
  <tr>
    <td colspan="10" class="BoletoTituloEsquerdo">Local de Pagamento</td>
    <td class="BoletoTituloDireito">Vencimento</td>
  </tr>
  <tr>
    <td colspan="10" class="BoletoValorEsquerdo" style="text-align: left; padding-left: 0.1cm">${data.localPayment}</td>
    <td class="BoletoValorDireito">${data.dueDate}</td>
  </tr>
  <tr>
    <td colspan="10" class="BoletoTituloEsquerdo">Cedente</td>
    <td class="BoletoTituloDireito">Agência/Código do Cedente</td>
  </tr>
  <tr>
    <td colspan="10" class="BoletoValorEsquerdo" style="text-align: left; padding-left: 0.1cm">${data.beneficiaryName}</td>
    <td class="BoletoValorDireito">${data.agencyCode}</td>
  </tr>
  <tr>
    <td colspan="3" class="BoletoTituloEsquerdo">Data do Documento</td>
    <td colspan="4" class="BoletoTituloEsquerdo">Número do Documento</td>
    <td class="BoletoTituloEsquerdo">Espécie</td>
    <td class="BoletoTituloEsquerdo">Aceite</td>
    <td class="BoletoTituloEsquerdo">Data do Processamento</td>
    <td class="BoletoTituloDireito">Nosso Número</td>
  </tr>
  <tr>
    <td colspan="3" class="BoletoValorEsquerdo">${data.documentDate}</td>
    <td colspan="4" class="BoletoValorEsquerdo">${data.documentNumber}</td>
    <td class="BoletoValorEsquerdo">${data.specie}</td>
    <td class="BoletoValorEsquerdo">${data.accept}</td>
    <td class="BoletoValorEsquerdo">${data.processingDate}</td>
    <td class="BoletoValorDireito">${data.ourNumber}</td>
  </tr>
  <tr>
    <td colspan="3" class="BoletoTituloEsquerdo">Uso do Banco</td>
    <td colspan="2" class="BoletoTituloEsquerdo">Carteira</td>
    <td colspan="2" class="BoletoTituloEsquerdo">Moeda</td>
    <td colspan="2" class="BoletoTituloEsquerdo">Quantidade</td>
    <td class="BoletoTituloEsquerdo">(x) Valor</td>
    <td class="BoletoTituloDireito">(=) Valor do Documento</td>
  </tr>
  <tr>
    <td colspan="3" class="BoletoValorEsquerdo">&nbsp;</td>
    <td colspan="2" class="BoletoValorEsquerdo">${data.wallet}</td>
    <td colspan="2" class="BoletoValorEsquerdo">R$</td>
    <td colspan="2" class="BoletoValorEsquerdo">&nbsp;</td>
    <td class="BoletoValorEsquerdo">&nbsp;</td>
    <td class="BoletoValorDireito">${data.amount}</td>
  </tr>
  <tr>
    <td colspan="10" class="BoletoTituloEsquerdo">${data.instructionTitle}</td>
    <td class="BoletoTituloDireito">(-) Desconto</td>
  </tr>
  <tr>
    <td colspan="10" rowspan="9" class="BoletoValorEsquerdo" style="text-align: left; vertical-align: top; padding-left: 0.1cm">${data.instructionBody}</td>
    <td class="BoletoValorDireito">&nbsp;</td>
  </tr>
  <tr><td class="BoletoTituloDireito">(-) Outras Deduções/Abatimento</td></tr>
  <tr><td class="BoletoValorDireito">&nbsp;</td></tr>
  <tr><td class="BoletoTituloDireito">(+) Mora/Multa/Juros</td></tr>
  <tr><td class="BoletoValorDireito">&nbsp;</td></tr>
  <tr><td class="BoletoTituloDireito">(+) Outros Acréscimos</td></tr>
  <tr><td class="BoletoValorDireito">&nbsp;</td></tr>
  <tr><td class="BoletoTituloDireito">(=) Valor Cobrado</td></tr>
  <tr><td class="BoletoValorDireito">&nbsp;</td></tr>
  <tr>
    <td rowspan="3" class="BoletoTituloSacado">Sacado:</td>
    <td colspan="8" class="BoletoValorSacado">${data.payerName}</td>
    <td colspan="2" class="BoletoValorSacado">${data.payerDocument}</td>
  </tr>
  <tr><td colspan="10" class="BoletoValorSacado">${data.payerAddressLine}</td></tr>
  <tr><td colspan="10" class="BoletoValorSacado">${data.payerCityLine}</td></tr>
  <tr>
    <td colspan="2" class="BoletoTituloSacador">Sacador / Avalista:</td>
    <td colspan="9" class="BoletoValorSacador">${data.guarantorName}</td>
  </tr>
  <tr>
    <td colspan="11" class="BoletoTituloDireito" style="text-align: right; padding-right: 0.1cm">${data.rightFooter}</td>
  </tr>
  <tr>
    <td colspan="11" height="60" valign="top">${data.bottomContent}</td>
  </tr>`;
}

function buildBarcodeBlock(barcodeImage: string, barcodeValue: string): string {
  const imageHtml = barcodeImage
    ? `<img src="${escapeHtml(barcodeImage)}" alt="Código de barras" style="max-width: 100%; height: auto" />`
    : '';

  return `
    ${imageHtml}
    <div class="BoletoCodBarrasTexto" data-barcode="${barcodeValue}">${barcodeValue}</div>
  `;
}

function buildPixPanel(pix?: { payload: string; qrCodeSvg?: string }): string {
  if (!pix) {
    return '';
  }

  const qrCode = pix.qrCodeSvg ? `<div style="margin-bottom: 0.12cm">${pix.qrCodeSvg}</div>` : '';

  return `
    <tr>
      <td colspan="11">
        <div class="BoletoPix">
          <strong>PIX</strong><br />
          ${qrCode}
          <div class="BoletoPixPayload">${escapeHtml(pix.payload)}</div>
        </div>
      </td>
    </tr>
  `;
}

function getAdditionalInfo(
  data: Record<string, string> | undefined,
  key: string,
  fallback: string,
): string {
  const value = data?.[key];
  return value && value.trim().length > 0 ? value : fallback;
}

function formatDateBr(value: Date): string {
  const day = String(value.getUTCDate()).padStart(2, '0');
  const month = String(value.getUTCMonth() + 1).padStart(2, '0');
  const year = String(value.getUTCFullYear());
  return `${day}/${month}/${year}`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
