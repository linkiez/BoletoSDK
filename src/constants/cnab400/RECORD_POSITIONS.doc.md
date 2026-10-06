# RECORD_POSITIONS

## Visão geral

Expõe os intervalos de posições dos registros CNAB400 em índices iniciados em 1.

## Responsabilidades

- Centralizar os limites dos campos usados pelos geradores e parsers.
- Descrever o registro de multa Itaú tipo 2 conforme seu código, data, valor e sequência.

## Entradas e saídas

- Entrada: nenhum parâmetro para os mapas constantes; `validatePositions` recebe um mapa de intervalos.
- Saída: mapas de posições e resultado booleano de validação de cobertura/continuidade.

## Fluxo principal

O registro de multa usa posições 001 para tipo, 002 para código, 003–010 para data, 011–023 para valor, 024–394 para complemento e 395–400 para sequência.

## Tratamento de erros e casos-limite

- Os mapas usam posições CNAB de base 1; conversões para `substring` devem subtrair 1 do início.
- Os limites devem cobrir os 400 caracteres sem lacunas nem sobreposições.

## Exemplos

```ts
const penaltyCodeStart = PENALTY_RECORD_POSITIONS.PENALTY_CODE.start;
```

## Dependências e integrações

- Geradores e parsers de registros CNAB400
