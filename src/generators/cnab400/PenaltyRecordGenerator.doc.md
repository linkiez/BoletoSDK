# PenaltyRecordGenerator (CNAB400 Itaú)

## Visão geral

Serializa um registro opcional tipo 2 de multa para remessa CNAB400 Itaú.

## Entradas e saídas

- Entrada: `PenaltyRecord` validado.
- Saída: linha de 400 caracteres.

## Posições serializadas

- Posição 001: tipo de registro `2`.
- Posição 002: código Itaú (`0` = sem multa, `1` = valor fixo, `2` = percentual).
- Posições 003-010: data de início da multa no formato `DDMMYYYY`, ou zeros.
- Posições 011-023: valor/percentual com duas casas decimais, ou zeros.
- Posições 024-394: espaços.
- Posições 395-400: número sequencial com seis dígitos.

## Associação

`generateCnab400` valida a associação do registro tipo 2 ao detalhe tipo 1 e o coloca imediatamente após esse detalhe. O campo `detailCompanyControl` é usado apenas para essa associação e não faz parte da linha serializada.
