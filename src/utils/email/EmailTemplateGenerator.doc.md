# EmailTemplateGenerator

## Overview

Builds a ready-to-send boleto email payload with HTML body and optional PDF/HTML attachments.

## Responsibilities

- Validate recipient email addresses before generating the message.
- Build the email subject, body, and attachments.
- Escape user-supplied content to avoid HTML injection.
- Format boleto values such as amount and due date.

## Inputs and outputs

- Inputs:
  - Recipient email address.
  - `BoletoTemplateData`.
  - Optional PDF buffer and HTML content.
- Outputs:
  - An `EmailTemplate` object.

## API / Signature

```ts
export interface EmailTemplate {
  to: string;
  subject: string;
  body: string;
  attachments: EmailAttachment[];
}

export interface BoletoEmailOptions {
  to: string;
  boleto: BoletoTemplateData;
  pdfBuffer?: Buffer;
  htmlContent?: string;
  subjectPrefix?: string;
  pdfFilename?: string;
  htmlFilename?: string;
}

export function generateBoletoEmail(options: BoletoEmailOptions): EmailTemplate;
```

## Error handling and edge cases

- Throws when the recipient email is invalid.
- Uses UTC date accessors to avoid timezone shifts.
- Returns no attachments when optional content is omitted.

## Examples

```ts
import { generateBoletoEmail } from '@utils/email';

const email = generateBoletoEmail({
  to: 'customer@example.com',
  boleto: boletoData,
  pdfBuffer,
});
```
