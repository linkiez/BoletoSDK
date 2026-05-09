# Release Notes - v1.0.0

Release date: 2026-05-09

## Highlights

- Complete support for CNAB400 parsing, generation, validation, and schemas.
- Complete support for CNAB240 for file and batch structures with segments P, Q, and R.
- Boleto generation in HTML and PDF, including barcode (I2of5) and PIX QR support.
- PIX payload-only support for HTML and PDF rendering flows.
- In-memory PDF streaming with improved error propagation for batch generation.
- Email utilities for boleto delivery with PDF and HTML attachments.

## Quality and Stability

- Full test suite passing (unit and integration).
- Cross-format CNAB integration coverage and batch performance tests validated.
- CRLF normalization improvements for Windows fixture stability.
- Release package metadata and exports map configured for npm distribution.

## Documentation

- API reference expanded with PIX payload-only HTML helper and stream behavior notes.
- Boleto generation guide updated with PIX and stream error-handling examples.

## Known Notes

- Security audit is evaluated with production-focused severity gating.
- Runtime release checks validated with no high/critical vulnerabilities in production dependency paths.
