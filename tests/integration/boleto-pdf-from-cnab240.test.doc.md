# boleto-pdf-from-cnab240.test.ts

## Overview

Integration test that parses CNAB240 content and generates boleto PDF using the parsed data.

## Responsibilities

- Validate CNAB240 parsing + PDF generation flow.
- Ensure generated output is a valid PDF buffer.

## Inputs and outputs

- Inputs: In-memory minimal CNAB240 content.
- Outputs: PDF buffer validated by magic header and non-empty length.

## Dependencies and integrations

- `parseCnab240` from parser module.
- `generateBoletoPdfBuffer` from PDF generator module.
- Test helper mapper `mapCnab240ToBoletoTemplateData`.
