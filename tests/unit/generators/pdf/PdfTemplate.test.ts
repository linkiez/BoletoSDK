import { derivePdfLayoutFlags, resolvePdfTemplateOptions } from '@generators/pdf/PdfTemplate';

describe('resolvePdfTemplateOptions', () => {
  it('should apply default values when options are omitted', () => {
    const options = resolvePdfTemplateOptions();

    expect(options).toEqual({
      title: 'Boleto',
      author: 'BoletoSDK',
      subject: '',
      keywords: '',
      creator: 'BoletoSDK',
      includePixQr: false,
      includeBarcode: true,
      barcode: { width: 350, height: 50 },
      pageSize: 'A4',
      layout: 'detailed',
      compress: true,
      boletosPerPage: 1,
      sectionSpacing: 0,
      margins: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40,
      },
      bleed: 0,
      fonts: {},
    });
  });

  it('should preserve custom values when provided', () => {
    const options = resolvePdfTemplateOptions({
      title: 'Boleto - Bradesco',
      author: 'ACME',
      includePixQr: true,
      pageSize: [300, 500],
      layout: 'simple',
      compress: false,
      boletosPerPage: 3,
      sectionSpacing: 24,
      margins: {
        top: 20,
        right: 10,
        bottom: 25,
        left: 15,
      },
      bleed: 3,
      fonts: {
        regularPath: '/tmp/font-regular.ttf',
        boldPath: '/tmp/font-bold.ttf',
      },
    });

    expect(options).toEqual({
      title: 'Boleto - Bradesco',
      author: 'ACME',
      subject: '',
      keywords: '',
      creator: 'BoletoSDK',
      includePixQr: true,
      includeBarcode: true,
      barcode: { width: 350, height: 50 },
      pageSize: [300, 500],
      layout: 'simple',
      compress: false,
      boletosPerPage: 3,
      sectionSpacing: 24,
      margins: {
        top: 20,
        right: 10,
        bottom: 25,
        left: 15,
      },
      bleed: 3,
      fonts: {
        regularPath: '/tmp/font-regular.ttf',
        boldPath: '/tmp/font-bold.ttf',
        monoPath: undefined,
      },
    });
  });

  it('should default subject, keywords and creator when omitted', () => {
    const options = resolvePdfTemplateOptions();

    expect(options.subject).toBe('');
    expect(options.keywords).toBe('');
    expect(options.creator).toBe('BoletoSDK');
  });

  it('should preserve custom subject, keywords and creator', () => {
    const options = resolvePdfTemplateOptions({
      subject: 'Monthly invoice',
      keywords: 'boleto,invoice,payment',
      creator: 'MyApp v2',
    });

    expect(options.subject).toBe('Monthly invoice');
    expect(options.keywords).toBe('boleto,invoice,payment');
    expect(options.creator).toBe('MyApp v2');
  });

  it('should normalize invalid pagination values to defaults', () => {
    const options = resolvePdfTemplateOptions({
      boletosPerPage: 0,
      sectionSpacing: -10,
    });

    expect(options.boletosPerPage).toBe(1);
    expect(options.sectionSpacing).toBe(0);
    expect(options.bleed).toBe(0);
  });

  it('should default includeBarcode to true and use default barcode dimensions', () => {
    const options = resolvePdfTemplateOptions();

    expect(options.includeBarcode).toBe(true);
    expect(options.barcode).toEqual({ width: 350, height: 50 });
  });

  it('should accept includeBarcode false', () => {
    const options = resolvePdfTemplateOptions({ includeBarcode: false });

    expect(options.includeBarcode).toBe(false);
  });

  it('should accept custom barcode dimensions', () => {
    const options = resolvePdfTemplateOptions({
      barcode: { width: 200, height: 30 },
    });

    expect(options.barcode).toEqual({ width: 200, height: 30 });
  });

  it('should fall back to defaults for invalid barcode dimensions', () => {
    const options = resolvePdfTemplateOptions({
      barcode: { width: -10, height: 0 },
    });

    expect(options.barcode).toEqual({ width: 350, height: 50 });
  });

  it('should normalize margins from single numeric value', () => {
    const options = resolvePdfTemplateOptions({
      margins: 12,
    });

    expect(options.margins).toEqual({
      top: 12,
      right: 12,
      bottom: 12,
      left: 12,
    });
  });

  it('should normalize invalid custom margins values to defaults', () => {
    const options = resolvePdfTemplateOptions({
      margins: {
        top: -5,
        right: 10,
      },
    });

    expect(options.margins).toEqual({
      top: 40,
      right: 10,
      bottom: 40,
      left: 40,
    });
  });
});

describe('derivePdfLayoutFlags', () => {
  it('should enable both optional sections for detailed layout', () => {
    expect(derivePdfLayoutFlags('detailed')).toEqual({
      showInstructions: true,
      showAdditionalInfo: true,
    });
  });

  it('should disable additional info for instructions layout', () => {
    expect(derivePdfLayoutFlags('instructions')).toEqual({
      showInstructions: true,
      showAdditionalInfo: false,
    });
  });

  it('should disable optional sections for simple layout', () => {
    expect(derivePdfLayoutFlags('simple')).toEqual({
      showInstructions: false,
      showAdditionalInfo: false,
    });
  });
});
