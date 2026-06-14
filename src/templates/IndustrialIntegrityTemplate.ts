import type { BoletoTemplate, BoletoTemplateData } from './BoletoTemplate';
import { renderI2of5Svg } from '@generators/barcode/BarcodeRenderer';

export class IndustrialIntegrityTemplate implements BoletoTemplate {
  public render(data: BoletoTemplateData): string {
    const dueDate = formatDateBr(data.payment.dueDate);
    const amount = formatMoney(data.payment.amount);
    const documentDate = escapeHtml(data.additionalInfo?.dataDocumento ?? dueDate);
    const processingDate = escapeHtml(data.additionalInfo?.dataProcessamento ?? dueDate);
    const agencyCode = escapeHtml(data.additionalInfo?.agenciaCodigoCedente ?? '-');
    const wallet = escapeHtml(
      data.additionalInfo?.Carteira ?? data.additionalInfo?.carteira ?? '-',
    );
    const bankCode = escapeHtml(data.bank.code);
    const bankCheckDigit = escapeHtml(data.additionalInfo?.bankCheckDigit ?? '7');
    const bankDisplayCode = `${bankCode}-${bankCheckDigit}`;
    const beneficiaryName = escapeHtml(data.beneficiary.name);
    const beneficiaryDoc = escapeHtml(data.beneficiary.document);
    const payerName = escapeHtml(data.payer.name);
    const payerDoc = escapeHtml(data.payer.document);
    const payerAddress = escapeHtml(data.payer.address || '-');
    const digitavel = escapeHtml(data.payment.digitableLine);
    const barcodeSvg = renderI2of5Svg(data.payment.barcode, {
      height: 72,
      narrowWidth: 2,
      wideWidth: 4,
      quietZone: 1,
    });
    const pixPayload = data.payment.pix?.payload ? escapeHtml(data.payment.pix.payload) : null;
    const pixQrCodeSvg = data.payment.pix?.qrCodeSvg ?? null;
    const instructionItems = (data.instructions ?? [])
      .slice(0, 3)
      .map((item) => `<p class="font-body-md text-sm">${escapeHtml(item)}</p>`)
      .join('');

    return `<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>INDUSTRIAL INTEGRITY - Ficha de Compensação</title>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&amp;family=Inter:wght@400;500;600&amp;family=JetBrains+Mono:wght@400;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-primary": "#ffffff",
                    "inverse-on-surface": "#f0f1f2",
                    "tertiary-container": "#27272d",
                    "on-tertiary": "#ffffff",
                    "surface-container-lowest": "#ffffff",
                    "surface-dim": "#d9dadb",
                    "error": "#ba1a1a",
                    "on-tertiary-fixed-variant": "#46464d",
                    "on-secondary": "#ffffff",
                    "on-secondary-container": "#fffbff",
                    "primary-fixed-dim": "#c8c6c9",
                    "on-primary-fixed-variant": "#47464a",
                    "primary-fixed": "#e4e1e5",
                    "tertiary-fixed": "#e3e1ea",
                    "on-error": "#ffffff",
                    "surface": "#f8f9fa",
                    "tertiary-fixed-dim": "#c7c5ce",
                    "secondary": "#bb0112",
                    "tertiary": "#121218",
                    "on-secondary-fixed-variant": "#93000b",
                    "on-tertiary-container": "#8f8d96",
                    "primary-container": "#27272a",
                    "on-primary-fixed": "#1b1b1e",
                    "on-primary-container": "#8f8e91",
                    "surface-container-high": "#e7e8e9",
                    "outline": "#77767b",
                    "surface-alt": "#F4F4F5",
                    "on-background": "#191c1d",
                    "on-error-container": "#93000a",
                    "outline-variant": "#c7c6cb",
                    "surface-variant": "#e1e3e4",
                    "on-surface": "#191c1d",
                    "error-container": "#ffdad6",
                    "secondary-fixed": "#ffdad6",
                    "surface-container": "#edeeef",
                    "surface-container-low": "#f3f4f5",
                    "background": "#f8f9fa",
                    "surface-container-highest": "#e1e3e4",
                    "on-surface-variant": "#46464b",
                    "on-tertiary-fixed": "#1b1b21",
                    "secondary-fixed-dim": "#ffb4ab",
                    "iron-gray": "#3F3F46",
                    "primary": "#121315",
                    "surface-bright": "#f8f9fa",
                    "on-secondary-fixed": "#410002",
                    "industrial-red": "#DC2626",
                    "surface-tint": "#5f5e61",
                    "slate-steel": "#27272A",
                    "inverse-surface": "#2e3132",
                    "inverse-primary": "#c8c6c9",
                    "secondary-container": "#e02928"
            },
            "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
            },
            "fontFamily": {
                    "headline-md": ["Hanken Grotesk"],
                    "headline-lg-mobile": ["Hanken Grotesk"],
                    "body-md": ["Inter"],
                    "code-sm": ["JetBrains Mono"],
                    "headline-lg": ["Hanken Grotesk"],
                    "body-lg": ["Inter"],
                    "label-caps": ["JetBrains Mono"]
            }
          }
        }
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        @media print {
            .no-print { display: none !important; }
            body { background: white !important; margin: 0; padding: 0; }
            .a4-page {
                box-shadow: none !important;
                margin: 0 !important;
                border: none !important;
                width: 210mm !important;
                height: 297mm !important;
            }
            .print-border-black { border-color: #000 !important; }
            * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .a4-page {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 2rem auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .a4-page {
          --boleto-border-color: #8f8f95;
        }
        .a4-page .border,
        .a4-page .border-t,
        .a4-page .border-r,
        .a4-page .border-b,
        .a4-page .border-l,
        .a4-page .border-x,
        .a4-page .border-y {
          border-color: var(--boleto-border-color) !important;
        }
        .boleto-table {
            border-collapse: collapse;
            width: 100%;
          border-color: var(--boleto-border-color);
        }
        .boleto-table td, .boleto-table th {
          border: 1px solid var(--boleto-border-color);
            padding: 4px 8px;
            vertical-align: top;
        }
        .a4-page .border-black {
          border-color: #000 !important;
        }
        .label-text {
            font-family: 'JetBrains Mono', monospace;
            font-size: 8px;
            text-transform: uppercase;
            color: #46464b;
            display: block;
            margin-bottom: 2px;
        }
        .data-text {
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            font-weight: 600;
            color: #121315;
        }
        .barcode-svg {
            width: 100%;
            height: 50px;
        }
        .barcode-area svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        body, body * {
            color: #000 !important;
        }
    </style>
</head>
<body class="bg-surface-container-low font-body-md">
<div class="no-print bg-slate-steel text-white py-3 px-4 sticky top-0 z-50 flex justify-between items-center shadow-lg">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined">print</span>
<span class="font-semibold">Visualização de Impressão</span>
</div>
<div class="flex gap-4">
<button class="bg-industrial-red hover:bg-secondary-container px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all" onclick="window.print()">
<span class="material-symbols-outlined">print</span> IMPRIMIR BOLETO
            </button>
<button class="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm border border-white/20 transition-all" onclick="copyCode()">
                Copiar Linha Digitável
            </button>
</div>
</div>
<div class="a4-page relative flex flex-col">
<header class="flex justify-between items-end mb-4 border-b-2 border-dashed border-outline-variant pb-6">
<div class="flex flex-col">
<h2 class="font-headline-md text-primary text-2xl tracking-tighter">INDUSTRIAL INTEGRITY</h2>
<span class="font-label-caps text-[10px] text-on-surface-variant">SOLUÇÕES INDUSTRIAIS</span>
</div>
<div class="text-right">
<p class="font-label-caps text-on-surface-variant text-xs">RECIBO DO PAGADOR</p>
<div class="flex items-center gap-2 mt-1">
<div class="bg-slate-steel px-2 py-1 font-bold rounded" style="color: #fff !important;">${bankDisplayCode}</div>
<span class="font-body-md font-bold">${escapeHtml(data.bank.name)}</span>
</div>
</div>
</header>
<div class="grid grid-cols-4 border border-outline mb-12">
<div class="col-span-3 border-r border-outline p-2">
<span class="label-text">Beneficiario</span>
<span class="data-text">${beneficiaryName} - ${formatDocumentLabel(beneficiaryDoc)}: ${beneficiaryDoc}</span>
</div>
<div class="p-2">
<span class="label-text">Vencimento</span>
<span class="data-text">${escapeHtml(dueDate)}</span>
</div>
<div class="col-span-2 border-t border-r border-outline p-2">
<span class="label-text">Pagador</span>
<span class="data-text">${payerName}</span>
</div>
<div class="border-t border-r border-outline p-2">
<span class="label-text">Agência/Código Beneficiário</span>
<span class="data-text">${agencyCode}</span>
</div>
<div class="border-t border-outline p-2">
<span class="label-text">Valor do Documento</span>
<span class="data-text">${escapeHtml(amount)}</span>
</div>
</div>
<div class="border-b-2 border-dashed border-outline-variant mb-12 relative">
<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 font-label-caps text-[10px] text-outline">Corte na linha pontilhada</span>
</div>
<div class="flex items-center mb-0">
<div class="w-24 h-12 flex items-center justify-center border-r-2 border-black mr-4">
<span class="font-bold text-2xl">${bankDisplayCode}</span>
</div>
<div class="flex-1 flex items-center justify-between px-4 border-b-2 border-black h-12">
<span class="font-bold text-xl tracking-tight" id="digitavel">${digitavel}</span>
</div>
</div>
<table class="boleto-table mb-0 border-t-0">
<tbody>
<tr>
<td class="w-3/4" colspan="4">
<span class="label-text">Local de Pagamento</span>
<span class="data-text">Pagável em qualquer banco até o vencimento.</span>
</td>
<td>
<span class="label-text">Vencimento</span>
<span class="data-text">${escapeHtml(dueDate)}</span>
</td>
</tr>
<tr>
<td colspan="4">
<span class="label-text">Beneficiario</span>
<span class="data-text">${beneficiaryName} - ${formatDocumentLabel(beneficiaryDoc)}: ${beneficiaryDoc}</span>
</td>
<td>
<span class="label-text">Agência / Código Beneficiário</span>
<span class="data-text">${agencyCode}</span>
</td>
</tr>
<tr>
<td class="w-1/6">
<span class="label-text">Data do Doc.</span>
<span class="data-text">${documentDate}</span>
</td>
<td class="w-1/6">
<span class="label-text">Nº do Documento</span>
<span class="data-text">${escapeHtml(data.payment.documentNumber)}</span>
</td>
<td class="w-1/6">
<span class="label-text">Espécie Doc.</span>
<span class="data-text">DM</span>
</td>
<td class="w-1/6">
<span class="label-text">Aceite</span>
<span class="data-text">N</span>
</td>
<td>
<span class="label-text">Data Processamento</span>
<span class="data-text">${processingDate}</span>
</td>
</tr>
<tr>
<td class="w-1/6">
<span class="label-text">Uso do Banco</span>
<span class="data-text"></span>
</td>
<td class="w-1/6">
<span class="label-text">Carteira</span>
<span class="data-text">${wallet}</span>
</td>
<td class="w-1/6">
<span class="label-text">Espécie</span>
<span class="data-text">R$</span>
</td>
<td class="w-1/6">
<span class="label-text">Quantidade</span>
<span class="data-text"></span>
</td>
<td>
<span class="label-text">(=) Valor do Documento</span>
<span class="data-text">${escapeHtml(amount)}</span>
</td>
</tr>
<tr>
<td colspan="4" rowspan="5">
<span class="label-text">Instruções (Texto de responsabilidade do beneficiário)</span>
<div class="mt-2 flex flex-col gap-2">
${instructionItems || '<p class="font-body-md text-sm">Sem instruções.</p>'}
</div>
</td>
<td><span class="label-text">(-) Descontos / Abatimento</span><span class="data-text"></span></td>
</tr>
<tr><td><span class="label-text">(-) Outras Deduções</span><span class="data-text"></span></td></tr>
<tr><td><span class="label-text">(+) Mora / Multa</span><span class="data-text"></span></td></tr>
<tr><td><span class="label-text">(+) Outros Acréscimos</span><span class="data-text"></span></td></tr>
<tr><td><span class="label-text">(=) Valor Cobrado</span><span class="data-text"></span></td></tr>
<tr>
<td colspan="5">
<div class="flex flex-col">
<span class="label-text">Pagador</span>
<span class="data-text">${payerName} - ${formatDocumentLabel(payerDoc)}: ${payerDoc}</span>
<span class="data-text font-normal text-xs">${payerAddress}</span>
</div>
</td>
</tr>
</tbody>
</table>
<div class="mt-0 pt-0">
<div class="border-x border-b border-outline border-t-0 bg-white w-full -mt-px">
<div class="p-0">
<div class="barcode-area h-20 overflow-hidden bg-white w-full px-2 py-1">
${barcodeSvg}
</div>
<div class="flex justify-center py-1 text-center">
<span class="font-label-caps text-[8px] text-outline-variant">AUTENTICAÇÃO MECÂNICA - FICHA DE COMPENSAÇÃO</span>
</div>
</div>
${
  pixPayload
    ? `<div class="border-t border-outline p-3 mt-0">
<span class="label-text">PIX Copia e Cola</span>
<div class="mt-2 flex items-start gap-4">
<div class="w-28 h-28 border border-outline flex items-center justify-center bg-white">${pixQrCodeSvg ?? ''}</div>
<div class="flex-1">
<p class="data-text text-xs break-all">${pixPayload}</p>
</div>
</div>
</div>`
    : ''
}
</div>
</div>
<div class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-steel text-white px-6 py-3 rounded-full font-body-md shadow-lg transform translate-y-32 opacity-0 transition-all duration-300" id="toast">
        Código copiado para a área de transferência!
    </div>
<script>
        function copyCode() {
            const codeText = document.getElementById('digitavel').innerText;
            navigator.clipboard.writeText(codeText).then(() => {
                const toast = document.getElementById('toast');
                toast.classList.remove('translate-y-32', 'opacity-0');
                toast.classList.add('translate-y-0', 'opacity-100');

                setTimeout(() => {
                    toast.classList.add('translate-y-32', 'opacity-0');
                    toast.classList.remove('translate-y-0', 'opacity-100');
                }, 3000);
            });
        }
    </script>
</body></html>`;
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

function formatDocumentLabel(document: string): 'CPF' | 'CNPJ' {
  const digits = document.replace(/\D+/g, '');
  return digits.length > 11 ? 'CNPJ' : 'CPF';
}
