# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

## [1.0.0] - 2026-05-09

### Added

- Complete CNAB400 parsing, generation, validation, and schemas.
- Complete CNAB240 support for file and batch structures with segments P/Q/R.
- Boleto generation for barcode (I2of5), PIX QR payload and rendering, HTML, and PDF.
- PIX-aware HTML helper supporting payload-only input.
- PDF generation with in-memory stream support and error propagation.
- Email template utilities with boleto attachments.
- Cross-format integration tests and batch performance tests.

### Changed

- CNAB format detection and fixture-based tests are now CRLF-safe on Windows.
- Public API docs and boleto generation docs updated with release-level examples.

### Fixed

- Fixed CNAB400 line-length instability caused by CRLF fixtures in parser and integration tests.
- Fixed PDF stream robustness when renderer dependencies throw errors.
