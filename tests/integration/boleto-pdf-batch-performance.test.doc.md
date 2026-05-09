# boleto-pdf-batch-performance.test.ts

## Overview

Integration tests for large-batch PDF generation and performance timing.

## Responsibilities

- Validate stream-based PDF generation for 1000+ boletos.
- Measure and assert bounded execution time for a 100-boleto benchmark run.

## Inputs and outputs

- Inputs: Generated in-memory boleto batches.
- Outputs: PDF buffers and elapsed time measurements.

## Dependencies and integrations

- `generateBoletosPdfStream` from PDF generator public API.
- `createBoletoTemplateDataBatch` helper.
