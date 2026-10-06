# PenaltyRecord (CNAB400 Itaú)

## Visão geral

Define o registro opcional tipo 2 que informa a multa vinculada a um registro detalhe tipo 1.

## Campos

- `penaltyCode`: `0` não registra multa, `1` registra valor fixo e `2` registra percentual.
- `penaltyDate`: data a partir da qual a multa incide; quando ausente, o gerador serializa zeros.
- `penaltyValue`: valor fixo ou percentual conforme `penaltyCode`; quando ausente, o gerador serializa zeros.
- `detailCompanyControl`: identifica o título tipo 1 correspondente e não é serializado.
- `detailIndex`: índice zero-based do detalhe associado, inferido pelo parser e não serializado.
- `sequentialNumber`: sequência do registro tipo 2 no arquivo.

## Associação

Na remessa, o parser associa o registro tipo 2 ao detalhe tipo 1 imediatamente anterior. Quando existe `companyControl`, a associação também é exposta em `detailCompanyControl`; `detailIndex` preserva a associação mesmo quando o arquivo deixa esse campo em branco. Ambos são metadados e não são serializados. O gerador emite a multa após o detalhe associado e rejeita referências inválidas ou ambíguas.

## Dependências e integrações

- `PenaltyRecordSchema` valida o tipo de registro e os códigos Itaú suportados.
- `generatePenaltyRecord` serializa a linha de 400 caracteres.
- `generateCnab400` posiciona o registro tipo 2 junto ao detalhe associado.
