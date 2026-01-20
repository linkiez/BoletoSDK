# COBRANÇA BANCÁRIA

# COM MENSAGEM

# Intercâmbio Eletrônico de Arquivos

## Layout de Arquivos - CNAB

## Índice

##### 1. Noções Básicas ...................................................................................................... 3

##### 1.1 – Apresentação ............................................................................................. 3

##### 1.2 – Cobrança Itaú ............................................................................................. 3

##### 1.3 – Cobrança Mensagem ................................................................................. 3

##### 2. Informações Técnicas ............................................................................................ 5

##### 2.1 – Meios de intercâmbio ................................................................................. 5

##### 2.2 – Explicações gerais sobre o arquivo ............................................................ 5

##### 3. Layout do Arquivo .................................................................................................. 7

##### 3.1 – Arquivo Remessa ....................................................................................... 7

##### 3.1.1 - Registro mensagem FRENTE (Obrigatório) ........................................... 11

##### 3.1.2 - Registro mensagem VERSO (Opcional) ................................................ 11

##### 3.2 – Arquivo Retorno........................................................................................ 12

##### 4. Notas ..................................................................................................................... 16

##### 5. Condições Personalizadas .................................................................................. 38

##### 6. Testes e Operações ............................................................................................. 41

##### 7. Anexo A ................................................................................................................. 42

##### 7.1 – Explicações gerais sobre o arquivo .......................................................... 42

##### 7.2 – Layout do Arquivo..................................................................................... 43

##### 9. Anexo C ................................................................................................................. 47

NOVO CÓDIGO DE RETORNO DE ENTRADA EM COBRANÇA (Jan/2017)

```
Foi incluído um novo código de retorno indicando que o boleto não liquidado no Desconto de
Duplicatas foi transferido para Cobrança Simples. Código disponível na Tabela 10 da Nota 20.
```

IMPORTANTE

```
Conforme determinado pelo Banco Central do Brasil, a partir de 02/04/2013 os boletos passam a
vigorar com as seguintes alterações:
```

```
CEDENTE passa a ser denominado BENEFICIÁRIO
SACADO passa a ser denominado PAGADOR
```

ATENÇÃO

```
Para utilizar as carteiras 103, 173 e 195 (boletos impressos pelo banco, sem que os títulos
fiquem registrados no Itaú) utilize arquivo remessa com layout conforme Anexo A.
Para as demais carteiras, utilize arquivo remessa com layout conforme item 3.1.
```

###### O arquivo retorno, nos dois casos, segue o layout do item 3.2 – Arquivo Retorno

TESTE / VALIDAÇÃO DE LAYOUT DE ARQUIVOS

```
Após o desenvolvimento do seu arquivo utilize o Validador de Layout de Arquivos (Resultado
da validação On-line). Acesse no Itaú Empresas na Internet no menu Transmissão de arquivos
> Validação.
```

Para maiores detalhes consulte o item 6. Testes e Operações.

```
Qualquer dúvida sobre o conteúdo deste manual consulte:
Itaú Empresas no Telefone:
0300 100 7575
```

### 1. Noções Básicas

#### 1.1 – Apresentação

O Banco Itaú S.A. adota o Intercâmbio Eletrônico de Arquivos para fornecer maior comodidade, rapidez

e segurança no serviço de cobrança de títulos prestado aos seus clientes; com ele sua empresa

encontrará grandes vantagens, tais como: maior confiabilidade, velocidade no processamento,

eliminação de controles manuais e redução de custos.

Este manual esclarece tecnicamente o Intercâmbio Eletrônico de Arquivos de cobrança e estabelece as

condições básicas para sua utilização.

#### 1.2 – Cobrança Itaú

O Banco Itaú possui a cobrança adequada à necessidade de sua empresa. Existem várias modalidades

de cobrança, cujas características são identificadas pelo código e número da carteira de cobrança. As

principais características são:

```
 os títulos podem ou não ser registrados no Banco Itaú;
 os boletos podem ser emitidos integralmente pelo Banco Itaú e encaminhados para o pagador;
 em impressora laser ou jato de tinta, sua empresa poderá emitir integralmente o boleto de cobrança,
desde que respeitadas especificações definidas pelo Banco Itaú;
```

Sua empresa pode encaminhar ou receber os arquivos pelo Itaú Empresas na Internet.

Converse com seu gerente do Banco Itaú para verificar a carteira e o meio de envio de informações

mais adequado.

#### 1. 3 – Cobrança Mensagem

A Cobrança Mensagem destina-se às empresas que necessitam enviar informações específicas do seu

ramo de atividade aos pagadores.

Este manual esclarece tecnicamente o Intercâmbio Eletrônico de Arquivos de cobrança e estabelece as

condições básicas para sua utilização.

#### 1. 3. 1 – Boleto

O boleto possui áreas livres e área de constantes com layout específico.

#### 1. 3. 1 .1 – Frente

Composto de 2 partes separadas por serrilha:

a) Área Livre / Recibo do Pagador

Composta de até 27 registros (cada registro contempla 03 mensagens, totalizando 81 linhas

de mensagem de 128 posições cada). Deverá ser utilizada para impressão de

informações/recibos de pagamentos personalizados. Poderá conter o logotipo da empresa.

O Recibo do pagador deve conter informações do Beneficiário e/ou do Sacador Avalista¹:

nome, endereço e número de inscrição no Cadastro de Pessoas Físicas – CPF ou no

Cadastro Nacional de Pessoa Jurídica – CNPJ do fornecedor do produto ou serviço.

¹ Sacador Avalista – nos casos que se aplica

b) Ficha de Compensação

#### 1. 3. 1 .2 – Verso

Composto de 3 partes separadas pelo dobramento carta:

a) Área Livre

Composta de até 12 registros (cada registro contempla 02 mensagens, totalizando 24 linhas

de mensagem de até 140 posições cada). Poderão ser utilizadas para impressão de

demonstrativo, mensagens, etc.

b) Endereçamento

Remetente - poderá conter o logotipo da empresa e deverá conter o nome e endereço do

remetente.

Destinatário - deverá conter o nome e endereço do destinatário.

c) Uso do correio/constantes

Uso do correio.

### 2. Informações Técnicas

#### 2.1 – Meios de intercâmbio

```
Recomenda-se o Itaú 30 Horas na Internet e o Itaú Empresas na Internet como melhor alternativa para
troca de arquivos, por ser um meio moderno de comunicação com processos automatizados e pela alta
confiabilidade, rapidez e segurança.
```

Para sua implantação, basta sua empresa possuir um computador com acesso a internet.

```
O arquivo deve ser do tipo texto, contendo um registro por linha. Não deve ser utilizado nenhum tipo
de compactador de arquivos.
```

#### 2 .2 – Explicações gerais sobre o arquivo

O layout do arquivo segue padronização estabelecida pelo CNAB (Centro Nacional de Automação

Bancária), órgão técnico da FEBRABAN (Federação Brasileira de Bancos), com algumas adaptações às

necessidades do Itaú.

Cada arquivo é composto dos seguintes registros:

```
 Um registro Header de Arquivo;
 Registro de Detalhe;
 Um registro Trailer de Arquivo.
```

Representando graficamente, o arquivo é composto da seguinte maneira:

Arquivo

Registro Header do Arquivo => { Reg. = 0 }

| Registro de Detalhe (Obrig.) => { Reg. = 1 }

| Registro de Detalhe Sacador Avalista (Opc.) => { Reg. = 5 }

| Registro de Detalhe Frente (Obrig.) => { Reg. = 7 }

| Registro de Detalhe Verso (Opc.) => { Reg. = 8 }

Registro Trailer do Arquivo => { Reg. = 9 }

Cada registro é formado por campos que são apresentados em dois formatos:

```
 Alfanumérico (picture X): alinhados à esquerda com brancos à direita. Preferencialmente, todos os
caracteres devem ser maiúsculos. Aconselha-se a não utilização de caracteres especiais (ex.: “Ç”,
“?”,, etc) e acentuação gráfica (ex.: “Á”, “É”, “Ê”, etc) e os campos não utilizados deverão ser
preenchidos com brancos.
```

```
 Numérico (picture 9): alinhado à direita com zeros à esquerda e os campos não utilizados deverão
ser preenchidos com zeros.
```

- Vírgula assumida (picture V): indica a posição da vírgula dentro de um campo numérico.
Exemplo: num campo com picture “9(5)V9(2)”, o número “876,54” será representado por “0087654”.

#### 2 .2.1 – Operacionalização

#### 2.2.1.1 – Condições Mínimas

Cobrança por meios eletrônicos - Padrão CNAB.

#### 2 .2.1.2 – Flash

A empresa deverá enviar layout especificando as áreas livres e o conteúdo da área de

constantes para ser elaborado o flash do boleto, ao qual será atribuído um código

específico que constará do cadastro de troca de arquivos magnéticos.

#### 2 .2.1.3 – Arquivo Remessa

As informações das áreas livres deverão ser enviadas junto com as entradas em

registros específicos, no formato imagem de impressão. Para os clientes com FLASH

cadastrado, será exigido pelo menos um registro de mensagem, caso contrário a

entrada será rejeitada.

#### 2.2.1.4 – SUBCARTEIRA

Cobrança com impressão e entrega pelo Banco.

É um arquivo enviado pelo cliente ao Itaú para:

```
 Dar entrada em títulos;
 Comandar instruções sobre os títulos já em carteira;
 Comandar a impressão de boletos em carteiras específicas da modalidade sem
registro (neste caso, o layout dos arquivos deverá ser conforme o anexo A. Nos
demais casos, o layout segue padrão do item 3.1).
```

Podem ser enviados vários arquivos por dia, que todos serão tratados.

#### 2.2.1.5 – Arquivo retorno

#### 2.2. 1 .5.1 – Diário

É um arquivo enviado pelo Itaú ao cliente para:

```
 Informar as liquidações ocorridas;
 Confirmar o recebimento dos títulos e das instruções comandadas pelo cliente;
```

```
 Informar a execução de comandos previamente agendados (por exemplo,
informar a baixa de um título quando completa 120 dias em carteira);
 Informar alegações dos pagadores;
 Informar erros cometidos no arquivo remessa, rejeitando entradas ou instruções.
```

O arquivo retorno é gerado sempre que ocorrer qualquer evento que movimente algum

registro em nosso sistema. Se nenhum evento ocorrer, o retorno não é gerado.

O layout do arquivo retorno obedece à mesma padronização independente da carteira

utilizada. Se os títulos não permanecerem registrados no Itaú, apenas as liquidações

e as rejeições de comando para impressão serão informadas no arquivo retorno.

#### 2.2.1.5.2 – Mensal

```
Adicionalmente, também pode ser gerado, mediante cadastro prévio, um arquivo
mensal contendo a posição de todos os títulos em carteira no Itaú. Basta solicitar
prévio cadastramento.
```

#### 2.2.1.5.3 – Ordenação dos registros no arquivo retorno

Os registros estão listados em ordem crescente de agência / conta corrente / carteira

de cobrança e código de ocorrência.

### 3. Layout do Arquivo

#### 3.1 – Arquivo Remessa

ARQUIVO REMESSA REGISTRO HEADER DE ARQUIVO TAMANHO DO REGISTRO = 400 Bytes

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

```
TIPO DE REGISTRO IDENTIFICAÇÃO DO REGISTRO HEADER 001 001 9(01) 0
```

```
OPERAÇÃO TIPO DE OPERAÇÃO - REMESSA 002 002 9(01) 1
```

```
LITERAL DE REMESSA IDENTIFICAÇÃO POR EXTENSO DO MOVIMENTO 003 009 X(07) REMESSA
```

```
CÓDIGO DO SERVIÇO IDENTIFICAÇÃO DO TIPO DE SERVIÇO 010 011 9(02) 01
```

```
LITERAL DE SERVIÇO IDENTIFICAÇÃO POR EXTENSO DO TIPO DE SERVIÇO 012 026 X(15) COBRANCA
```

```
AGÊNCIA AGÊNCIA MANTENEDORA DA CONTA 027 030 9(04)
```

```
ZEROS COMPLEMENTO DE REGISTRO 031 032 9(02) 00
```

```
CONTA NÚMERO DA CONTA CORRENTE DA EMPRESA 033 037 9(05)
```

```
DAC DÍGITO DE AUTO CONFERÊNCIA AG/CONTA EMPRESA 038 038 9(01)
```

```
BRANCOS COMPLEMENTO DO REGISTRO 039 046 X(08)
```

```
NOME DA EMPRESA NOME POR EXTENSO DA "EMPRESA MÃE" 047 076 X(30)
```

```
CÓDIGO DO BANCO Nº DO BANCO NA CÂMARA DE COMPENSAÇÃO 077 079 9(03) 341
```

```
NOME DO BANCO NOME POR EXTENSO DO BANCO COBRADOR 080 094 X(15) BANCO ITAU SA
```

```
DATA DE GERAÇÃO DATA DE GERAÇÃO DO ARQUIVO 095 100 9(06) DDMMAA
```

```
BRANCOS COMPLEMENTO DO REGISTRO 101 394 X(294)
```

```
NÚMERO SEQÜENCIAL NÚMERO SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400 9(06) 000001
```

```
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA
```

(^) ARQUIVO REMESSA REGISTRO DETALHE
(OBRIGATÓRIO)
TAMANHO DO REGISTRO = 400 Bytes
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
TIPO DE REGISTRO IDENTIFICAÇÃO DO REGISTRO TRANSAÇÃO 001 001 9(01) 1
CÓDIGO DE INSCRIÇÃO TIPO DE INSCRIÇÃO DA EMPRESA 002 003 9(02) NOTA 1
NÚMERO DE INSCRIÇÃO Nº DE INSCRIÇÃO DA EMPRESA (CPF/CNPJ) 004 017 9(14) NOTA 1
AGÊNCIA AGÊNCIA MANTENEDORA DA CONTA 018 021 9(04)
ZEROS COMPLEMENTO DE REGISTRO 022 023 9(02) “00”
CONTA NÚMERO DA CONTA CORRENTE DA EMPRESA 024 028 9(05)
DAC DÍGITO DE AUTO CONFERÊNCIA AG/CONTA EMPRESA 029 029 9(01)
BRANCOS COMPLEMENTO DE REGISTRO 030 033 X(04)
INSTRUÇÃO/ALEGAÇÃO CÓD.INSTRUÇÃO/ALEGAÇÃO A SER CANCELADA 034 037 9(04) NOTA 27
USO DA EMPRESA IDENTIFICAÇÃO DO TÍTULO NA EMPRESA 038 062 X(25) NOTA 2
NOSSO NÚMERO IDENTIFICAÇÃO DO TÍTULO NO BANCO 063 070 9(08) NOTA 3
QTDE DE MOEDA QUANTIDADE DE MOEDA VARIÁVEL 071 083 9(08)V9(5) NOTA 4
Nº DA CARTEIRA NÚMERO DA CARTEIRA NO BANCO 084 086 9(03) NOTA 5
USO DO BANCO IDENTIFICAÇÃO DA OPERAÇÃO NO BANCO 087 107 X(21)
CARTEIRA CÓDIGO DA CARTEIRA 108 108 X(01) NOTA 5
CÓD. DE OCORRÊNCIA IDENTIFICAÇÃO DA OCORRÊNCIA 109 110 9(02) NOTA 6
Nº DO DOCUMENTO Nº DO DOCUMENTO DE COBRANÇA (DUPL.,NP ETC.) 111 120 X(10) NOTA 18
VENCIMENTO DATA DE VENCIMENTO DO TÍTULO 121 126 9(06) NOTA 7
VALOR DO TÍTULO VALOR NOMINAL DO TÍTULO 127 139 9(11)V9(2) NOTA 8
CÓDIGO DO BANCO Nº DO BANCO NA CÂMARA DE COMPENSAÇÃO 140 142 9(03) 341
AGÊNCIA COBRADORA AGÊNCIA ONDE O TÍTULO SERÁ COBRADO 143 147 9(05) NOTA 9
ESPÉCIE ESPÉCIE DO TÍTULO 148 149 X(02) NOTA 10
ACEITE IDENTIFICAÇÃO DE TÍTULO ACEITO OU NÃO ACEITO 150 150 X(01) A=ACEITE
N=NÃO ACEITE
DATA DE EMISSÃO DATA DA EMISSÃO DO TÍTULO 151 156 9(06) NOTA 31
INSTRUÇÃO 1 1ª INSTRUÇÃO DE COBRANÇA 157 158 X(02) NOTA 11
INSTRUÇÃO 2 2ª INSTRUÇÃO DE COBRANÇA 159 160 X(02) NOTA 11
JUROS DE 1 DIA VALOR DE MORA POR DIA DE ATRASO 161 173 9(11)V9(2) NOTA 12
DESCONTO ATÉ DATA LIMITE PARA CONCESSÃO DE DESCONTO 174 179 9(06) DDMMAA
VALOR DO DESCONTO VALOR DO DESCONTO A SER CONCEDIDO 180 192 9(11)V9(2) NOTA 13
VALOR DO I.O.F. VALOR DO I.O.F. RECOLHIDO P/ NOTAS SEGURO 193 205 9(11)V((2) NOTA 14
ABATIMENTO VALOR DO ABATIMENTO A SER CONCEDIDO 206 218 9(11)V9(2) NOTA 13
CÓDIGO DE INSCRIÇÃO IDENTIFICAÇÃO DO TIPO DE INSCRIÇÃO/PAGADOR 219 220 9(02) 01=CPF
02=CNPJ
NÚMERO DE INSCRIÇÃO Nº DE INSCRIÇÃO DO PAGADOR (CPF/CNPJ) 221 234 9(14)
NOME NOME DO PAGADOR 235 264 X(30) NOTA 15
BRANCOS COMPLEMENTO DE REGISTRO 265 274 X(10) NOTA 15
LOGRADOURO RUA, NÚMERO E COMPLEMENTO DO PAGADOR 275 314 X(40)
BAIRRO BAIRRO DO PAGADOR 315 326 X(12)
CEP CEP DO PAGADOR 327 334 9(08)
CIDADE CIDADE DO PAGADOR 335 349 X(15)
ESTADO UF DO PAGADOR 350 351 X(02)
SACADOR/AVALISTA NOME DO SACADOR OU AVALISTA 352 381 X(30) NOTA 16
BRANCOS COMPLEMENTO DO REGISTRO 382 385 X(04)
DATA DE MORA DATA DE MORA 386 391 9(06) DDMMAA
PRAZO QUANTIDADE DE DIAS 392 393 9(02) NOTA 11 (A)
BRANCOS COMPLEMENTO DO REGISTRO 394 394 X(01)
NÚMERO SEQÜENCIAL Nº SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400 9(06)
(^) X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA

ARQUIVO REMESSA REGISTRO DETALHE

**(OPCIONAL – COMPLEMENTO DETALHE - MULTA)**

```
TAMANHO DO REGISTRO = 400 BYTES
```

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

TIPO DE REGISTRO (^) IDENTIFICAÇÃO DO REGISTRO TRANSAÇÃO 001 001 9(001) 2
COD. MULTA (^) CODIGO DA MULTA 002 002 X(001) NOTA 38
DATA DA MULTA (^) DATA DA MULTA 003 010 9(008) NOTA 38
MULTA (^) VALOR/PERCENTUAL A SER APLICADO 011 023 9(013) NOTA 38
BRANCOS (^) COMPLEMENTO DE REGISTRO 024 394 X(370) (^)
NUMERO SEQUENCIAL (^) NUMERO SEQUENCIAL DO REGISTRO NO ARQUIVO 395 400 9(006)
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA

###### Importante

######  Este registro 2 é Opcional e deverá ser enviado apenas quando o beneficiário desejar registrar

###### ou alterar valores/percentuais de multas diferentes para o título. Válido somente para Carteiras

###### com Registro, pode ser utilizado a qualquer momento sem necessidade de cadastro prévio junto

###### ao Banco

######  Sempre que o registro 2 for informado, deverá seguir a sequência lógica de registro de

###### cobrança (Ex. Código de Registro tipo “1” – obrigatório e assim por diante )

######  O registro tipo 2 não será devolvido no arquivo retorno. Qualquer erro sobre o registro tipo 2

###### será gerado no retorno do registro tipo 1

######  Não pode ser enviado mais de um tipo de registro 2 para o mesmo título. Se isso ocorrer o

###### cliente receberá o registro tipo 1 com erro - Registro Inválido

######  Qualquer erro encontrado no registro tipo 2 será retornado para o cliente com erro no registro

###### tipo 1. Registro inválido

ARQUIVO REMESSA REGISTRO DETALHE

(OPCIONAL **–** DADOS DO SACADOR AVALISTA)

```
TAMANHO DO REGISTRO = 400 BYTES
```

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

TIPO DE REGISTRO (^) IDENTIFICAÇÃO DO REGISTRO TRANSAÇÃO 001 001 9(001) 5
BRANCOS (^) COMPLEMENTO DE REGISTRO 002 121 X(120) (^) BRANCOS
CÓDIGO DE INSCRIÇÃO (^) IDENT. DO TIPO DE INSCRIÇÃO DO SACADOR/AVALISTA 122 123 9(002) (^) NOTA 30
NÚMERO DE INSCRIÇÃO (^) NÚMERO DE INSCRIÇÃO DO SACADOR AVALISTA 124 137 9(014) (^) NOTA 30
LOGRADOURO (^) RUA, Nº E COMPLEMENTO DO SACADOR AVALISTA 138 177 X(040) (^) NOTA 30
BAIRRO (^) BAIRRO DO SACADOR AVALISTA 178 189 X(012) (^) NOTA 30
CEP (^) CEP DO SACADOR AVALISTA 190 197 9(008) (^) NOTA 30
CIDADE (^) CIDADE DO SACADOR AVALISTA 198 212 X(015) (^) NOTA 30
ESTADO (^) UF (ESTADO) DO SACADOR AVALISTA 213 214 X(002) (^) NOTA 30
BRANCOS (^) COMPLEMENTO DE REGISTRO 215 394 X(180) (^) BRANCOS
NÚMERO SEQUENCIAL (^) NÚMERO SEQUENCIAL DO REGISTRO NO ARQUIVO 395 400 9(006)
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA

#### IMPORTANTE

Este registro é opcional e deverá ser enviado apenas quando o Beneficiário desejar complemento dos dados

referentes ao Sacador/Avalista, quando de sua existência; e

```
 Sempre que for informado, deverá ser na seqüência do registro obrigatório de cobrança (Código de Registro
‘1’) a que seus dados se referem;
 As informações constantes neste registro não são informadas no “arquivo retorno”;
```

####  Quando as informações referentes ao "Sacador / Avalista" tiverem sido indicadas nos registros “1” e “5”

#### prevalecerá sempre a do registro “5"

#### 3.1.1 - Registro mensagem FRENTE (Obrigatório)

Deverão ser enviado até 27 registros (cada registro contempla 03 mensagens, totalizando 81 linhas de

mensagem) para imprimir a parte da frente do boleto. Só deverão ser enviadas as linhas com conteúdo, já no

formato impressão, inclusive com espaços em branco.

ARQUIVO REMESSA^ REGISTRO DETALHE FRENTE (OBRIGATÓRIO)^ TAMANHO DO REGISTRO = 400 BYTES^

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO^
```

CÓDIGO DO REGISTRO IDENTIFICAÇÃO DO REGISTRO MENSAGEM (FRENTE) 001 001 9(001) 7

FLASH CÓDIGO DO FLASH 002 004 X(003) NOTA 35^

Nº DA LINHA 1 NÚMERO DA 1ª LINHA A SER IMPRESSA 005 006 9(002)

TEXTO 1 CONTEÚDO DA LINHA 1 007 134 X(128) NOTA 37^

Nº DA LINHA 2 NÚMERO DA 2ª LINHA A SER IMPRESSA 135 136 9(002)

TEXTO 2 CONTEÚDO DA LINHA 2 137 264 X(128) NOTA 37^

Nº DA LINHA 3 NÚMERO DA 3ª LINHA A SER IMPRESSA 265 266 9(002)

TEXTO 3 CONTEÚDO DA LINHA 3 267 393 X(127) NOTA 37^

DESTINO BOLETO IDENTIFICA O DESTINO DO BOLETO 394 394 X(001) NOTA 36^

NÚMERO SEQUENCIAL NÚMERO SEQUENCIAL DO REGISTRO NO ARQUIVO 395 400 9(006)

```
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA
```

#### 3. 1 .2 - Registro mensagem VERSO (Opcional)

Deverão ser enviado até 12 registros (cada registro contempla 02 linhas de mensagens, totalizando 24 linhas

de mensagem) para imprimir a parte do verso do boleto. Só deverão ser enviadas as linhas com conteúdo, já

no formato impressão, inclusive com espaços em branco.

ARQUIVO REMESSA REGISTRO DETALHE VERSO (OPICIONAL) TAMANHO DO REGISTRO = 400 BYTES

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

CÓDIGO DO REGISTRO IDENTIFICAÇÃO DO REGISTRO MENSAGEM (VERSO) 001 001 9(001) 8

Nº DA LINHA 1 NÚMERO DA 1ª LINHA A SER IMPRESSA 002 003 9(002)

TEXTO 1 CONTEÚDO DA LINHA 1 004 143 X(140) NOTA 37

BRANCOS COMPLEMENTAÇÃO DO REGISTRO 144 193 X(050)

Nº DA LINHA 2 NÚMERO DA 2ª LINHA A SER IMPRESSA 194 195 9(002)

TEXTO 2 CONTEÚDO DA LINHA 2 196 335 X(140) NOTA 37

BRANCOS COMPLEMENTAÇÃO DO REGISTRO 336 394 X(059)

NÚMERO SEQUENCIAL NÚMERO SEQUENCIAL DO REGISTRO NO ARQUIVO 395 400 9(006)

```
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA
```

```
ARQUIVO REMESSA REGISTRO TRAILER DE ARQUIVO TAMANHO DO REGISTRO = 400 BYTES
```

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

TIPO DE REGISTRO (^) IDENTIFICAÇÃO DO REGISTRO TRAILER 001 001 9(01) 9
BRANCOS (^) COMPLEMENTO DO REGISTRO 002 394 X(393)
NÚMERO SEQÜENCIAL NÚMERO SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400^ 9(06)^
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA

#### 3.2 – Arquivo Retorno

```
ARQUIVO RETORNO REGISTRO HEADER DE ARQUIVO TAMANHO DO REGISTRO = 400 BYTES
```

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

TIPO DE REGISTRO (^) IDENTIFICAÇÃO DO REGISTRO HEADER 001 001 9(01) 0
CÓDIGO DE RETORNO (^) IDENTIFICAÇÃO DO ARQUIVO RETORNO 002 002 9(01) 2
LITERAL DE RETORNO IDENTIFICAÇÃO. POR EXTENSO DO TIPO DE MOVIMENTO 003 009 X(07) RETORNO
CÓDIGO DO SERVIÇO (^) IDENTIFICAÇÃO DO TIPO DE SERVIÇO 010 011 9(02) 01
LITERAL DE SERVIÇO (^) IDENTIFICAÇÃO POR EXTENSO DO TIPO DE SERVIÇO 012 026 X(15) COBRANCA
AGÊNCIA (^) AGÊNCIA MANTENEDORA DA CONTA 027 030 9(04)
ZEROS (^) COMPLEMENTO DE REGISTRO 031 032 9(02) “00”
CONTA (^) NÚMERO DA CONTA CORRENTE DA EMPRESA 033 037 9(05)
DAC (^) DÍGITO DE AUTO CONFERÊNCIA AG/CONTA EMPRESA 038 038 9(01)
BRANCOS (^) COMPLEMENTO DO REGISTRO 039 046 X(08)
NOME DA EMPRESA (^) NOME POR EXTENSO DA "EMPRESA MÃE” 047 076 X(30)
CÓDIGO DO BANCO (^) NÚMERO DO BANCO NA CÂMARA DE COMPENSAÇÃO 077 079 9(03) 341
NOME DO BANCO (^) NOME POR EXTENSO DO BANCO COBRADOR 080 094 X(15) BANCO ITAU SA
DATA DE GERAÇÃO (^) DATA DE GERAÇÃO DO ARQUIVO 095 100 9(06) DDMMAA
DENSIDADE (^) UNIDADE DA DENSIDADE 101 105 9(05)
UNIDADE DE DENSID. (^) DENSIDADE DE GRAVAÇÃO DO ARQUIVO 106 108 X(03) BPI
Nº SEQ. ARQUIVO RET. (^) NÚMERO SEQÜENCIAL DO ARQUIVO RETORNO 109 113 9(05)
DATA DE CRÉDITO (^) DATA DE CRÉDITO DOS LANÇAMENTOS 114 119 9(06) DDMMAA
BRANCOS (^) COMPLEMENTO DO REGISTRO 120 394 X(275)
NÚMERO SEQÜENCIAL (^) NÚMERO SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400 9(06) 000001
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA

```
ARQUIVO RETORNO REGISTRO DETALHE DE ARQUIVO TAMANHO DO REGISTRO = 400 BYTES
```

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

TIPO DE REGISTRO (^) IDENTIFICAÇÃO DO REGISTRO TRANSAÇÃO 001 001 9(01) 1
CÓDIGO DE INSCRIÇÃO (^) IDENTIFICAÇÃO DO TIPO DE INSCRIÇÃO/EMPRESA 002 003 9(02) (^) 01=CPF 02=CNPJ
NÚMERO DE INSCRIÇÃO (^) NÚMERO DE INSCRIÇÃO DA EMPRESA (CPF/CNPJ) 004 017 9(14)
AGÊNCIA (^) AGÊNCIA MANTENEDORA DA CONTA 018 021 9(04)
ZEROS (^) COMPLEMENTO DE REGISTRO 022 023 9(02) “00”
CONTA (^) NÚMERO DA CONTA CORRENTE DA EMPRESA 024 028 9(05)
DAC (^) DÍGITO DE AUTO CONFERÊNCIA AG/CONTA EMPRESA 029 029 9(01)
BRANCOS (^) COMPLEMENTO DE REGISTRO 030 037 X(08)
USO DA EMPRESA (^) IDENTIFICAÇÃO DO TÍTULO NA EMPRESA 038 062 X(25) NOTA 2
NOSSO NÚMERO (^) IDENTIFICAÇÃO DO TÍTULO NO BANCO 063 070 9(08)
BRANCOS (^) COMPLEMENTO DO REGISTRO 071 082 X(12)
CARTEIRA (^) NUMERO DA CARTEIRA 083 085 9(03) NOTA 5
NOSSO NÚMERO (^) IDENTIFICAÇÃO DO TÍTULO NO BANCO 086 093 9(08) NOTA 3
DAC NOSSO NÚMERO (^) DAC DO NOSSO NÚMERO 094 094 9(01) NOTA 3
BRANCOS (^) COMPLEMENTO DO REGISTRO 095 107 X(13)
CARTEIRA (^) CÓDIGO DA CARTEIRA 108 108 X(01) NOTA 5
CÓD. DE OCORRÊNCIA (^) IDENTIFICAÇÃO DA OCORRÊNCIA 109 110 9(02) NOTA 17
DATA DE OCORRÊNCIA (^) DATA DE OCORRÊNCIA NO BANCO 111 116 9(06) DDMMAA
Nº DO DOCUMENTO (^) Nº DO DOCUMENTO DE COBRANÇA (DUPL, NP ETC) 117 126 X(10) NOTA 18
NOSSO NÚMERO (^) CONFIRMAÇÃO DO NÚMERO DO TÍTULO NO BANCO 127 134 9(08)
BRANCOS (^) COMPLEMENTO DO REGISTRO 135 146 X(12)
VENCIMENTO (^) DATA DE VENCIMENTO DO TÍTULO 147 152 9(06) DDMMAA
VALOR DO TÍTULO (^) VALOR NOMINAL DO TÍTULO 153 165 9(11)V9(2)
CÓDIGO DO BANCO (^) NÚMERO DO BANCO NA CÂMARA DE COMPENSAÇÃO 166 168 9(03)
AGÊNCIA COBRADORA (^) AG. COBRADORA, AG. DE LIQUIDAÇÃO OU BAIXA 169 172 9(04) NOTA 9
DAC AG. COBRADORA (^) DAC DA AGÊNCIA COBRADORA 173 173 9(01)
ESPÉCIE (^) ESPÉCIE DO TÍTULO 174 175 9(02) NOTA 10
TARIFA DE COBRANÇA (^) VALOR DA DESPESA DE COBRANÇA 176 188 9(11)V9(2)
BRANCOS (^) COMPLEMENTO DO REGISTRO 189 214 X(26)
VALOR DO IOF VALOR DO IOF A SER RECOLHIDO (NOTAS SEGURO) 215 227 9(11)V9(2) BRANCOS
VALOR ABATIMENTO (^) VALOR DO ABATIMENTO CONCEDIDO 228 240 9(11)V((2) NOTA 19
DESCONTOS (^) VALOR DO DESCONTO CONCEDIDO 241 253 9(11)V9(2) NOTA 19
VALOR PRINCIPAL (^) VALOR LANÇADO EM CONTA CORRENTE 254 266 9(11)V9(2)
JUROS DE MORA/MULTA (^) VALOR DE MORA E MULTA 267 279 9(11)V9(2)
OUTROS CRÉDITOS (^) VALOR DE OUTROS CRÉDITOS 280 292 9(11)V9(2)
BOLETO DDA (^) INDICADOR DE BOLETO DDA 293 293 X(01) NOTA 34
BRANCOS (^) COMPLEMENTO DO REGISTRO 294 295 X(02)
DATA CRÉDITO (^) DATA DE CRÉDITO DESTA LIQUIDAÇÃO 296 301 X(06) DDMMAA
INSTR.CANCELADA (^) CÓDIGO DA INSTRUÇÃO CANCELADA 302 305 9(04) NOTA 20
BRANCOS (^) COMPLEMENTO DE REGISTRO 306 311 X(06)
ZEROS (^) COMPLEMENTO DE REGISTRO 312 324 9(13)
NOME DO PAGADOR (^) NOME DO PAGADOR 325 354 X(30)
BRANCOS (^) COMPLEMENTO DO REGISTRO 355 377 X(23)
ERROS / MENSAGEM INFORMATIVA REGISTROS REJEITADOS OU ALEGAÇÃO DO PAGADOR OU
REGISTRO DE MESAGEM INFORMATIVA
378 385 X(08) NOTA 20
BRANCOS (^) COMPLEMENTO DO REGISTRO 386 392 X(07)
CÓD. DE LIQUIDAÇÃO (^) MEIO PELO QUAL O TÍTULO FOI LIQUIDADO 393 394 X(02) NOTA 28
NÚMERO SEQÜENCIAL (^) NÚMERO SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400 9(06)
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA

```
ARQUIVO RETORNO
```

```
REGISTRO TRANSAÇÃO
OPCIONAL – (CHEQUE DEVOLVIDO / CHEQUE COMPENSADO) TAMANHO DO REGISTRO = 400 Bytes
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

TIPO DE REGISTRO (^) IDENTIFICAÇÃO DO REGISTRO TRANSAÇÃO 001 001 9(01) 1
CÓDIGO DE INSCRIÇÃO (^) IDENTIFICAÇÃO DO TIPO DE INSCRIÇÃO/EMPRESA 002 003 9(02) (^) 01=CPF 02=CNPJ
NÚMERO DE INSCRIÇÃO (^) NÚMERO DE INSCRIÇÃO DA EMPRESA (CPF/CNPJ) 004 017 9(14)
AGÊNCIA (^) AGÊNCIA MANTENEDORA DA CONTA 018 021 9(04)
ZEROS (^) COMPLEMENTO DE REGISTRO 022 023 9(02) “00”
CONTA (^) NÚMERO DA CONTA CORRENTE DA EMPRESA 024 028 9(05)
DAC DÍGITO DE AUTO CONFERÊNCIA AG/CONTA EMPRESA 029 029 9(01)
BRANCOS (^) COMPLEMENTO DE REGISTRO 030 037 X(08)
USO DA EMPRESA (^) IDENTIFICAÇÃO DO TÍTULO NA EMPRESA 038 062 X(25) NOTA 2
NOSSO NÚMERO (^) IDENTIFICAÇÃO DO TÍTULO NO BANCO 063 070 9(08)
AGÊNCIA CONTA DO CHEQUE (^) AGÊNCIA CONTA E DAC DE DÉBITO DO CHEQUE 071 082 X(12) NOTA 33
CARTEIRA (^) NUMERO DA CARTEIRA 083 085 9(03) NOTA 5
NOSSO NÚMERO (^) IDENTIFICAÇÃO DO TÍTULO NO BANCO 086 093 9(08) NOTA 3
DAC NOSSO NÚMERO (^) DAC DO NOSSO NÚMERO 094 094 9(01) NOTA 3
BRANCOS (^) COMPLEMENTO DO REGISTRO 095 107 X(13)
CARTEIRA (^) CÓDIGO DA CARTEIRA 108 108 X(01) NOTA 5
CÓD. DE OCORRÊNCIA (^) IDENTIFICAÇÃO DA OCORRÊNCIA 109 110 9(02) NOTA 17
DATA DE OCORRÊNCIA (^) DATA DE OCORRÊNCIA NO BANCO 111 116 9(06) DDMMAA
Nº DO DOCUMENTO (^) Nº DO DOCUMENTO DE COBRANÇA (DUPL, NP ETC) 117 126 X(10) NOTA 18
NOSSO NÚMERO (^) CONFIRMAÇÃO DO NÚMERO DO TÍTULO NO BANCO 127 134 9(08)
BRANCOS (^) COMPLEMENTO DO REGISTRO 135 146 X(12)
ZEROS (^) COMPLEMENTO DO REGISTRO 147 152 9(06)
VALOR DO TÍTULO (^) VALOR NOMINAL DO TÍTULO 153 165 9(11)V9(2)
CÓDIGO DO BANCO (^) NÚMERO DO BANCO NA CÂMARA DE COMPENSAÇÃO 166 168 9(03)
AGÊNCIA COBRADORA (^) AG. COBRADORA, AG. DE LIQUIDAÇÃO OU BAIXA 169 172 9(04) NOTA 9
DAC AG. COBRADORA (^) DAC DA AGÊNCIA COBRADORA 173 173 9(01)
BRANCOS (^) COMPLEMENTO DO REGISTRO 174 175 X(02)
ZEROS (^) COMPLEMENTO DO REGISTRO 176 253 9(78)
VALOR DO CHEQUE (^) VALOR DO CHEQUE 254 266 9(11)V9(2)
ZEROS (^) COMPLEMENTO DO REGISTRO 267 292 9(26)
BRANCOS (^) COMPLEMENTO DO REGISTRO 293 301 X(09)
ZEROS (^) COMPLEMENTO DO REGISTRO 302 324 9(23)
BANDA MAGNÉTICA (^) BANDA MAGNÉTICA DO CHEQUE (CMC-7) 325 354 X(30)
BRANCOS (^) COMPLEMENTO DO REGISTRO 355 377 X(23)
MOTIVO MOTIVO DE DEVOLUÇÃO DO CHEQUE 378 379 X(02) NOTA 20
BRANCOS (^) COMPLEMENTO DO REGISTRO 380 394 X(15)
NÚMERO SEQÜENCIAL NÚMERO SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400 9(06)
X = ALFANUMÉRICO
9 = NUMÉRICO
V = VÍRGULA DECIMAL ASSUMIDA
Observações:
Registro opcional que apresenta os dados do cheque devolvido e cheque compensado, utilizado para pagamento
do título.
Este registro somente constará do arquivo retorno quando contratado o serviço junto ao Banco e é exclusivo para
informação do cheque devolvido (Código de Ocorrência “69” – Nota 17 e Nota 20 - Tabela 9) e cheque compensado
(Código de Ocorrência “76” – Nota 17).

```
ARQUIVO RETORNO REGISTRO TRAILER TAMANHO DO REGISTRO = 400 Bytes
```

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

TIPO DE REGISTRO (^) IDENTIFICAÇÃO DO REGISTRO TRAILER 001 001 9(01) 9
CÓDIGO DE RETORNO (^) IDENTIFICAÇÃO DE ARQUIVO RETORNO 002 002 9(01) 2
CÓDIGO DE SERVIÇO (^) IDENTIFICAÇÃO DO TIPO DE SERVIÇO 003 004 9(02) 01
CÓDIGO DO BANCO (^) IDENTIFICAÇÃO DO BANCO NA COMPENSAÇÃO 005 007 9(03) 341
BRANCOS (^) COMPLEMENTO DE REGISTRO 008 017 X(10)
QTDE. DE TÍTULOS (^) QTDE. DE TÍTULOS EM COBR. SIMPLES 018 025 9(08) NOTA 21
VALOR TOTAL (^) VR TOTAL DOS TÍTULOS EM COBRANÇA SIMPLES 026 039 9(12)V9(2) NOTA 21
AVISO BANCÁRIO (^) REFERÊNCIA DO AVISO BANCÁRIO 040 047 X(08) NOTA 22
BRANCOS (^) COMPLEMENTO DO REGISTRO 048 057 X(10)
QTDE. DE TÍTULOS (^) QTDE DE TÍTULOS EM COBRANÇA/VINCULADA 058 065 9(08) NOTA 21
VALOR TOTAL (^) VR TOTAL DOS TÍTULOS EM COBRANÇA/VINCULADA 066 079 9(12)V9(2) NOTA 21
AVISO BANCÁRIO (^) REFERÊNCIA DO AVISO BANCÁRIO 080 087 X(08) NOTA 22
BRANCOS (^) COMPLEMENTO DO REGISTRO 088 177 X(90)
QTDE. DE TÍTULOS (^) QTDE. DE TÍTULOS EM COBR. DIRETA./ESCRITURAL 178 185 9(08) NOTA 21
VALOR TOTAL (^) VR TOTAL DOS TÍTULOS EM COBR. DIRETA/ESCRIT. 186 199 9(12)V9(2) NOTA 21
AVISO BANCÁRIO (^) REFERÊNCIA DO AVISO BANCÁRIO 200 207 X(08) NOTA 22
CONTROLE DO ARQUIVO (^) NÚMERO SEQÜENCIAL DO ARQUIVO RETORNO 208 212 9(05)
QTDE DE DETALHES (^) QUANTIDADE DE REGISTROS DE TRANSAÇÃO 213 220 9(08)
VLR TOTAL INFORMADO (^) VALOR DOS TÍTULOS INFORMADOS NO ARQUIVO 221 234 9(12)V9(2)
BRANCOS (^) COMPLEMENTO DO REGISTRO 235 394 X(160)
NÚMERO SEQÜENCIAL (^) NÚMERO SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400 9(06)
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA

### 4. Notas

(1) TIPO/Nº DE INSCRIÇÃO DA EMPRESA/SACADOR

```
TIPO INSCRIÇÃO NÚMERO DE INSCRIÇÃO
```

```
01 Nº DO CPF DO BENEFICIÁRIO
```

```
02 Nº DO CNPJ DO BENEFICIÁRIO
```

```
03 N° DO CPF DO SACADOR/AVALISTA
```

```
04 N° DO CNPJ DO SACADOR/AVALISTA
```

```
Normalmente definem o tipo (CPF/CNPJ) e o número de inscrição do beneficiário.
Se o título for negociado, deverão ser utilizados para indicar o CNPJ/CPF do sacador (beneficiário original),
uma vez que os cartórios exigem essa informação para efetivação dos protestos. Para este fim, também
poderá ser utilizado o registro tipo “5”.
```

(2) USO DA EMPRESA

```
Campo não obrigatório, de livre utilização pela empresa, cuja informação não é consistida pelo Banco Itaú,
e não sai no aviso de cobrança, retornando ao beneficiário no arquivo retorno em qualquer movimento do
título (baixa, liquidação, confirmação de protesto, etc.) com o mesmo conteúdo da entrada. Para instituições
financeiras (ag: 1248/Bancorp), o conteúdo deste campo também será impresso no rodapé do boleto.
```

(3) NOSSO NÚMERO

Para carteiras com registro:

- Escriturais: é enviado zerado pela empresa e retornado pelo Banco Itaú na confirmação de entrada,

###### com exceção da carteira 115 e 138 cuja faixa de Nosso Número é de livre utilização pelo beneficiário

seguindo as regras das carteiras Diretas abaixo;

###### * Diretas: é de livre utilização pelo beneficiário, não podendo ser repetida se o número ainda estiver

```
registrado no Banco Itaú ou se transcorridos menos de 45 dias de sua baixa / liquidação no Banco Itaú.
Dependendo da carteira de cobrança utilizada a faixa de Nosso Número pode ser definida pelo Banco.
* Para todas as movimentações envolvendo o título, o “Nosso Número” deve ser informado.
```

Para carteiras sem registro:

```
* Normalmente a empresa define o “Nosso Número” e é responsável pelo seu controle e pelo cálculo do
DAC – Dígito de Auto conferência (Vide Nota 23).
```

(4) QUANTIDADE DE MOEDA VARIÁVEL

Este campo deverá ser preenchido com zeros caso a moeda seja o Real.

(5) CARTEIRAS DE COBRANÇA

```
OBS CÓD. TIPO (*) CARTEIRAS DESCRIÇÃO
```

```
D, E I D 108 DIRETA ELETRÔNICA EMISSÃO INTEGRAL – CARNÊ
D I E 104 ESCRITURAL ELETRÔNICA – CARNÊ
I E 138 ESCRITURAL ELETRÔNICA – MENSAGEM COLORIDA
I E 112 ESCRITURAL ELETRÔNICA – SIMPLES
A, B I S 173 SEM REGISTRO COM EMISSÃO E ENTREGA
B, C I S 196 SEM REGISTRO COM EMISSÃO E ENTREGA – 15 POSIÇÕES
A, B, D I S 103 SEM REGISTRO COM EMISSÃO E ENTREGA – CARNÊ
E E 147 ESCRITURAL ELETRÔNICA – DÓLAR
```

(*) A coluna 'TIPO' define a modalidade das carteiras: E _–_ Escritural / D _–_ Direta / S _–_ Sem Registro.

```
(A) No arquivo retorno é informado somente: agência, conta corrente, carteira, nosso número, data do
pagamento, multa, desconto/abatimento, tarifa, valor líquido.
(B) Carteiras sem registro, com emissão do boleto pelo Banco Itaú. São as únicas que utilizam arquivo
remessa conforme anexo A.
(C) No arquivo retorno é informado somente: agência, conta corrente, carteira, nosso número, data do
pagamento, multa, desconto/abatimento, tarifa, valor líquido e seu número.
```

```
(D) Para carteiras com impressão e montagem de carnês pelo Banco Itaú, o arquivo remessa deverá ser
ordenado por pagador e vencimento. A cada alteração no nome do pagador será emitido um carnê (limitado
a 99 parcelas), obedecendo a ordem do arquivo remessa. Quando a quantidade de parcelas de um carnê
for superior a “99”, é necessária a emissão de mais de um carnê.
(E) Somente utilizar nosso número dentro de faixa numérica definida pelo Banco Itaú.
(F) Carteira exclusiva para permitir liquidação parcial do título, conforme negociação previamente
cadastrada pelo beneficiário no Itaú 30 horas Empresa Plus. Não permite protesto de títulos que tiveram
liquidação parcial e o cliente necessita estar operando com boleto digital no site da empresa (B2B).
```

(6) CÓDIGO DE OCORRÊNCIA (ARQUIVO REMESSA)

```
OBS CÓD. OCORRÊNCIA CAMPOS NECESSÁRIOS
```

```
01 REMESSA TODOS OS CAMPOS
```

```
A 02 PEDIDO DE BAIXA
```

```
A,D 04 CONCESSÃO DE ABATIMENTO (INDICADOR 12.5) VALOR DO ABATIMENTO
```

```
A,D 05 CANCELAMENTO DE ABATIMENTO VALOR DO ABATIMENTO
```

```
A,D 06 ALTERAÇÃO DO VENCIMENTO VENCIMENTO
```

```
A,D 07 ALTERAÇÃO DO USO DA EMPRESA USO DA EMPRESA
```

```
A,D 08 ALTERAÇÃO DO SEU NÚMERO SEU NÚMERO
```

```
A,C 09 PROTESTAR
```

```
A,D 10 NÃO PROTESTAR (inibe protesto automático, quando houver instrução permanente na conta
corrente)
```

```
A,C 11 PROTESTO PARA FINS FALIMENTARES
```

```
A,F 18 SUSTAR O PROTESTO
```

```
B,D 30 EXCLUSÃO DE SACADOR AVALISTA
```

```
B,D 31 ALTERAÇÃO DE OUTROS DADOS CAMPOS A ALTERAR
```

```
A 34 BAIXA POR TER SIDO PAGO DIRETAMENTE AO BENEFICIÁRIO
```

```
B,G 35 CANCELAMENTO DE INSTRUÇÃO CÓDIGO DA INSTRUÇÃO
```

```
A 37 ALTERAÇÃO DO VENCIMENTO E SUSTAR PROTESTO VENCIMENTO
```

```
A,E 38 BENEFICIÁRIO NÃO CONCORDA COM ALEGAÇÃO DO PAGADOR CÓDIGO DA ALEGAÇÃO
```

```
A,D 47 BENEFICIÁRIO SOLICITA DISPENSA DE JUROS
```

```
B,D 49 ALTERAÇÃO DE DADOS EXTRAS (REGISTRO DE MULTA)
```

```
B,C 66 ENTRADA EM NEGATIVAÇÃO EXPRESSA
```

```
B,D 67 NÃO NEGATIVAR (INIBE A ENTRADA EM NEGATIVAÇÃO EXPRESSA)
```

```
B,F 68 EXCLUIR NEGATIVAÇÃO EXPRESSA (ATÉ 15 DIAS CORRIDOS APÓS A ENTRADA EM
NEGATIVAÇÃO EXPRESSA)
```

```
B 69 CANCELAR NEGATIVAÇÃO EXPRESSA (APÓS TÍTULO TER SIDO NEGATIVADO)
```

(A) São obrigatórios os seguintes campos, além dos indicados na tabela:

```
 Tipo de Registro  Número da Carteira
 Agência/Conta/Dac da Empresa  Código da Carteira
 Nosso Número  Valor do Título
Os demais campos devem ser preenchidos com zeros ou brancos, obedecendo a sua Picture.
```

(B) São obrigatórios os seguintes campos, além dos indicados na tabela:

```
 Tipo de Registro  Número da Carteira
 Agência/Conta/Dac da Empresa  Código da Carteira
 Nosso Número
```

```
Os campos sem alteração devem ser preenchidos com zeros ou brancos, obedecendo a sua Picture. A
alteração do valor do título deverá ser feita isoladamente, sem nenhuma outra alteração no mesmo
registro.
```

```
Para incluir, alterar ou excluir Multa de título já registrado e em aberto no banco, gerar arquivo
remessa com a ocorrência “49” no registro segmento P e Q, informando os campos obrigatórios
mencionados e o registro segmento R conforme nota 31 deste manual, Esta ocorrência permite
além da inclusão, alterar o código, a data e o conteúdo da Multa de valor para percentual e vice-
versa, sendo que independente do campos a ser alterado, devem ser informados o código, a data
e o valor ou percentual da multa. Caso algum desses campos seja informado com zeros a Multa é
cancelada/excluída,
```

```
(C) Utilizada para agendar uma negativação ou protesto futuro sendo que o prazo de início de protesto
deverá ser indicado nas posições 392 à 393, a partir do vencimento. Caso seja informado '00' no campo
prazo, o processo de protesto será acionado 02 dias (corridos) após o vencimento. No caso da
ocorrência “11”, o beneficiário passa a ter prioridade no recebimento quando o pagador estiver com
falência decretada.
```

```
(D) Somente são aceitas antes de iniciar o processo da negativação expressa ou de protesto. Se a
negativação expressa ou o protesto já estiver em andamento, deve-se primeiro excluir ou cancelar a
negativação ou sustar o protesto e em seguida comandar a instrução desejada (a exclusão,
cancelamento da negativação, a sustação e a nova instrução podem constar no mesmo arquivo).
A instrução de baixa, automaticamente, exclui ou cancela a negativação expressa e susta o protesto e
o título é baixado.
```

```
(E) O código da alegação do pagador deverá ser informado nas posições 34 a 37 do registro de transação
conforme nota 20, tabela 6, campo CÓD.
```

(F) Deve ser utilizada também quando se deseja cancelar uma instrução de negativação expressa ou

protesto comandada no registro de entrada, mesmo que o título ainda não tenha sido protestado.

```
(G) O código da instrução a ser cancelada (1156 – Não Protestar ou 2261 – Dispensar juros/comissão de
permanência) deverá ser informado nas posições 34 a 37 do registro de transação.
```

(7) VENCIMENTO

```
Conforme determinado pelo Banco Central do Brasil na circular 3.656 e 02/04/2013, todo boleto deve possuir
vencimento, não sendo permitido vencimento “à vista” ou “na apresentação”.
```

Não é mais permitido vencimento “9999999”, onde era impresso a literal “À VISTA”.

###### (8) VALOR DO TÍTULO

```
O título deverá ter seu valor expresso em reais na data de entrada, mesmo quando cobrado em moeda
variável.
```

ATENÇÃO: Conforme determinado pelo Banco Central do Brasil na circular 3.656 e 02/04/2013, todo boleto

###### deve possuir o valor expresso, não sendo permitido valor em branco ou zerado

(9) AGÊNCIA COBRADORA

```
No arquivo remessa, preencher com zeros. O Banco Itaú define a agência cobradora pelo CEP do pagador.
No arquivo retorno, poderá conter:
```

```
AGÊNCIA SIGNIFICADO
```

```
7744 PEDIDO DE BAIXA EFETUADO PELO BENEFICIÁRIO
```

```
7788 BAIXA AUTOMÁTICA DECORRENTE DE: INSTRUÇÃO CADASTRADA A NÍVEL CONTA CORRENTE, INSTRUÇÃO COMANDADA
NO REGISTRO DE ENTRADA OU PELO PADRÃO DO BANCO ITAÚ (120 DIAS APÓS O VENCIMENTO DO TÍTULO)
```

```
7777 BAIXA SOLICITADA VIA BANKLINE OU PELA AGÊNCIA VIA ESTAÇÃO ADMINISTRATIVA
```

```
9999 O BANCO ITAÚ NÃO POSSUI AGÊNCIA PARA O CEP INDICADO
```

```
OUTROS Nº DA AGÊNCIA / ÓRGÃO QUE EFETUARÁ A COBRANÇA OU QUE EXECUTOU A BAIXA / LIQUIDAÇÃO
```

(10) ESPÉCIE

```
COD. ESPÉCIE COD. ESPÉCIE
```

```
01 DUPLICATA MERCANTIL 08 DUPLICATA DE SERVIÇO
```

```
02 NOTA PROMISSÓRIA 09 LETRA DE CÂMBIO
```

```
03 NOTA DE SEGURO 13 NOTA DE DÉBITOS
```

```
04 MENSALIDADE ESCOLAR 15 DOCUMENTO DE DÍVIDA
```

```
05 RECIBO 16 ENCARGOS CONDOMINIAIS
```

```
06 CONTRATO 17 CONTA DE PRESTAÇÃO DE SERVIÇOS
```

```
07 COSSEGUROS 99 DIVERSOS
```

(11) INSTRUÇÕES DE COBRANÇA

OBS CÓD. INSTRUÇÃO

```
02 DEVOLVER APÓS 05 DIAS DO VENCIMENTO
```

```
03 DEVOLVER APÓS 30 DIAS DO VENCIMENTO
```

```
05 RECEBER CONFORME INSTRUÇÕES NO PRÓPRIO TÍTULO
```

```
06 DEVOLVER APÓS 10 DIAS DO VENCIMENTO
```

```
07 DEVOLVER APÓS 15 DIAS DO VENCIMENTO
```

```
08 DEVOLVER APÓS 20 DIAS DO VENCIMENTO
```

```
A 09 PROTESTAR
```

```
G 10 NÃO PROTESTAR (inibe protesto, quando houver instrução permanente na conta corrente)
```

```
11 DEVOLVER APÓS 25 DIAS DO VENCIMENTO
```

```
12 DEVOLVER APÓS 35 DIAS DO VENCIMENTO
```

```
13 DEVOLVER APÓS 40 DIAS DO VENCIMENTO
```

```
14 DEVOLVER APÓS 45 DIAS DO VENCIMENTO
```

```
15 DEVOLVER APÓS 50 DIAS DO VENCIMENTO
```

```
16 DEVOLVER APÓS 55 DIAS DO VENCIMENTO
```

```
17 DEVOLVER APÓS 60 DIAS DO VENCIMENTO
```

```
18 DEVOLVER APÓS 90 DIAS DO VENCIMENTO
```

```
19 NÃO RECEBER APÓS 05 DIAS DO VENCIMENTO
```

```
20 NÃO RECEBER APÓS 10 DIAS DO VENCIMENTO
```

```
21 NÃO RECEBER APÓS 15 DIAS DO VENCIMENTO
```

```
22 NÃO RECEBER APÓS 20 DIAS DO VENCIMENTO
```

```
23 NÃO RECEBER APÓS 25 DIAS DO VENCIMENTO
```

```
24 NÃO RECEBER APÓS 30 DIAS DO VENCIMENTO
```

```
25 NÃO RECEBER APÓS 35 DIAS DO VENCIMENTO
```

```
26 NÃO RECEBER APÓS 40 DIAS DO VENCIMENTO
```

```
27 NÃO RECEBER APÓS 45 DIAS DO VENCIMENTO
```

```
28 NÃO RECEBER APÓS 50 DIAS DO VENCIMENTO
```

```
29 NÃO RECEBER APÓS 55 DIAS DO VENCIMENTO
```

```
E 30 IMPORTÂNCIA DE DESCONTO POR DIA
```

```
31 NÃO RECEBER APÓS 60 DIAS DO VENCIMENTO
```

```
32 NÃO RECEBER APÓS 90 DIAS DO VENCIMENTO
```

```
I 33 CONCEDER ABATIMENTO REF. À PIS-PASEP/COFIN/CSSL, MESMO APÓS VENCIMENTO
```

A, H 34 PROTESTAR APÓS XX DIAS CORRIDOS DO VENCIMENTO (SEM AVISO AO PAGADOR)

A, H 35 PROTESTAR APÓS XX DIAS ÚTEIS DO VENCIMENTO (SEM AVISO AO PAGADOR)

```
37 RECEBER ATÉ O ÚLTIMO DIA DO MÊS DE VENCIMENTO
```

```
38 CONCEDER DESCONTO MESMO APÓS VENCIMENTO
```

```
A 39 NÃO RECEBER APÓS O VENCIMENTO
```

```
40 CONCEDER DESCONTO CONFORME NOTA DE CRÉDITO
```

```
A 42 PROTESTO PARA FINS FALIMENTARES
```

```
43 SUJEITO A PROTESTO SE NÃO FOR PAGO NO VENCIMENTO
```

```
F 44 IMPORTÂNCIA POR DIA DE ATRASO A PARTIR DE DDMMAA
```

```
45 TEM DIA DA GRAÇA
```

```
46 USO DO BANCO
```

```
47 DISPENSAR JUROS/COMISSÃO DE PERMANÊNCIA
```

```
51 RECEBER SOMENTE COM A PARCELA ANTERIOR QUITADA
```

```
52 EFETUAR O PAGAMENTO SOMENTE ATRAVÉS DESTE BOLETO E NA REDE BANCÁRIA
```

```
53 USO DO BANCO
```

```
54 APÓS VENCIMENTO PAGÁVEL SOMENTE NA EMPRESA
```

```
56 USO DO BANCO
```

```
57 SOMAR VALOR DO TÍTULO AO VALOR DO CAMPO MORA/MULTA CASO EXISTA
```

```
58 DEVOLVER APÓS 365 DIAS DE VENCIDO
```

```
59 COBRANÇA NEGOCIADA. PAGÁVEL SOMENTE POR ESTE BOLETO NA REDE BANCÁRIA
```

```
61 TÍTULO ENTREGUE EM PENHOR EM FAVOR DO BENEFICIÁRIO ACIMA
```

```
62 TÍTULO TRANSFERIDO A FAVOR DO BENEFICIÁRIO
```

```
A 66 ENTRADA EM NEGATIVAÇÃO EXPRESSA (IMPRIME: SUJEITO A NEGATIVAÇÃO APÓS O
VENCIMENTO)
```

A,G 67 NÃO NEGATIVAR (INIBE A ENTRADA EM NEGATIVAÇÃO EXPRESSA) (^)
70 A 75 USO DO BANCO
78 VALOR DA IDA ENGLOBA MULTA DE 10% PRO RATA
79 COBRAR JUROS APÓS 15 DIAS DA EMISSÃO (para títulos com vencimento à vista)
80 PAGAMENTO EM CHEQUE: SOMENTE RECEBER COM CHEQUE DE EMISSÃO DO PAGADOR
83 OPERAÇÃO REF A VENDOR
84 APÓS VENCIMENTO CONSULTAR A AGÊNCIA BENEFICIÁRIO
86 ANTES DO VENCIMENTO OU APÓS 15 DIAS, PAGÁVEL SOMENTE EM NOSSA SEDE
87 USO DO BANCO
88 NÃO RECEBER ANTES DO VENCIMENTO
89 USO DO BANCO
90 NO VENCIMENTO PAGÁVEL EM QUALQUER AGÊNCIA BANCÁRIA
A 91 NÃO RECEBER APÓS XX DIAS DO VENCIMENTO
A 92 DEVOLVER APÓS XX DIAS DO VENCIMENTO
B 93 MENSAGENS NOS BOLETOS COM 30 POSIÇÕES
C 94 MENSAGENS NOS BOLETOS COM 40 POSIÇÕES
95 A 97 USO DO BANCO
D 98 DUPLICATA / FATURA Nº
(A) (A) Informar a quantidade de dias nas posições 392 a 393. No caso da instrução “42”, o beneficiário
passa a ter prioridade no recebimento quando o pagador estiver com falência decretada. No caso da
instrução “39”, se informar “00” será impresso no boleto a literal “NÃO RECEBER APÓS O
VENCIMENTO”. A quantidade de dias será utilizada para as instruções de negativação expressa e
protesto, não sendo possível informar no arquivo remessa de entrada as instruções de negativação e
protesto, simultaneamente para o mesmo título. Se forem enviadas as duas instruções, a única a ser
considerada será a instrução da negativação. Na negativação, caso o campo quantidade de dias eja
informado com zeros, será considerado o prazo de 2 (dois) dias corridos após o vencimento.
(B) Informar a mensagem nas posições 352 a 381; o conteúdo da mensagem será informado na primeira
linha disponível no campo de “instruções” do boleto. Caso todas as linhas deste campo estejam
ocupadas, a mensagem será impressa acima do campo "Sacador / Avalista". Utilizando-se deste campo
para instrução “93”, para indicação do nome e dados do sacador / avalista, deve-se utilizar-se do
registro tipo “1” ou do registro tipo “5”.
(C) Informar a mensagem nas posições 352 a 391; o conteúdo da mensagem será informado na primeira
linha disponível no campo de “instruções” do boleto. Caso todas as linhas deste campo estejam
ocupadas, a mensagem será impressa nos campos "Sacador / Avalista" e _“data da mora_ ”. Utilizando-
se deste campo para instrução “94”, para indicação do nome e dados do sacador / avalista, deve-se
utilizar-se do registro tipo “1” ou do registro tipo “5”.
(D) Informar o número da Duplicata/Fatura nas posições 087 a 106. Se este campo estiver com brancos
ou zeros, a mensagem não será impressa.
(E) Informar o valor do desconto por dia nas posições 180 a 192.
(F) Informar o valor por dia de atraso nas posições 161 a 173 e a data nas posições 386 a 391.
(G) Pode ser cancelada pela agência, bankline ou através de arquivo, Código de Ocorrência 35, Nota 6,
(utilizando a instrução 2196). Depois de cancelada, comandar a instrução de protesto novamente.
(H) É impressa mensagem no boleto informando prazo de protesto.
(I) Informar o VALOR do abatimento (nunca em percentual) referente a PIS-PASEP/COFIN/CSSL nas
posições 206 a 218. A instrução será impressa no boleto com a literal:
“ABATIMENTO DE XXXX.XXX,XX REF. PIS-PASEP/COFIN/CSSL, MESMO APOS VCTO”.
(12) JUROS DE 1 DIA
Se o cliente optar pelo padrão do Banco Itaú ou solicitar o cadastramento permanente na conta corrente,
não haverá a necessidade de informar esse valor.
Caso seja expresso em moeda variável, deverá ser preenchido com cinco casas decimais.
(13) VALOR DO DESCONTO / ABATIMENTO

```
O sistema limita o desconto concedido a 90% do valor de entrada do título. Para um mesmo título podem
ser concedidos mais dois descontos (Nota 16).
```

(14) VALOR DO IOF

```
Indica o valor do IOF a ser retido pelo Banco Itaú e repassado à SRF.
Quando o título for expresso em moeda variável, esse campo também deverá ser expresso em
quantidades dessa moeda, com cinco casas decimais.
```

(15) NOME DO PAGADOR/BRANCOS

```
Os dois campos podem ser agrupados para registrar o nome do pagador. Se agrupados, o sistema do
Banco Itaú tentará abreviar o nome para 30 posições (ex.: Companhia = Cia), truncando o restante.
```

(16) SACADOR/AVALISTA

Normalmente deve ser preenchido com o nome do sacador/avalista. Alternativamente este campo poderá

ter dois outros usos:

a) 2º e 3º descontos: para se operar com mais de um desconto (depende de cadastramento prévio do

indicador 19.0 pelo Banco Itaú, conforme Item 5), deve-se respeitar a seguinte disposição:

 Posição 352 a 353 : Brancos

```
 Posição 354 a 359 : Data do 2º desconto (DDMMAA)
 Posição 360 a 372 : Valor do 2º desconto
 Posição 373 a 378 : Data do 3º desconto (DDMMAA)
 Posição 379 a 391 : Valor do 3º desconto
 Posição 392 a 394 : Brancos
b) Mensagens ao pagador: se utilizados as instruções 93 ou 94 (Nota 11), transcrever a mensagem
```

desejada.

(17) CÓDIGO DE OCORRÊNCIA (ARQUIVO RETORNO)

CÓD. OCORRÊNCIAS

```
02 ENTRADA CONFIRMADA COM POSSIBILIDADE DE MENSAGEM (NOTA 20 – TABELA 10)
```

```
03 ENTRADA REJEITADA (NOTA 20 - TABELA 1)
```

```
04 ALTERAÇÃO DE DADOS - NOVA ENTRADA OU ALTERAÇÃO/EXCLUSÃO DE DADOS ACATADA
```

```
05 ALTERAÇÃO DE DADOS – BAIXA
```

```
06 LIQUIDAÇÃO NORMAL
```

```
07 LIQUIDAÇÃO PARCIAL – COBRANÇA INTELIGENTE (B2B)
```

```
08 LIQUIDAÇÃO EM CARTÓRIO
```

```
09 BAIXA SIMPLES
```

```
10 BAIXA POR TER SIDO LIQUIDADO
```

```
11 EM SER (SÓ NO RETORNO MENSAL)
```

```
12 ABATIMENTO CONCEDIDO
```

```
13 ABATIMENTO CANCELADO
```

```
14 VENCIMENTO ALTERADO
```

```
15 BAIXAS REJEITADAS (NOTA 20 - TABELA 4)
```

```
16 INSTRUÇÕES REJEITADAS (NOTA 20 - TABELA 3)
```

```
17 ALTERAÇÃO/EXCLUSÃO DE DADOS REJEITADOS (NOTA 20 - TABELA 2)
```

```
18 COBRANÇA CONTRATUAL - INSTRUÇÕES/ALTERAÇÕES REJEITADAS/PENDENTES (NOTA 20 - TABELA 5)
```

```
19 CONFIRMA RECEBIMENTO DE INSTRUÇÃO DE PROTESTO
```

```
20 CONFIRMA RECEBIMENTO DE INSTRUÇÃO DE SUSTAÇÃO DE PROTESTO /TARIFA
```

```
21 CONFIRMA RECEBIMENTO DE INSTRUÇÃO DE NÃO PROTESTAR
```

```
23 TÍTULO ENVIADO A CARTÓRIO/TARIFA
```

```
24 INSTRUÇÃO DE PROTESTO REJEITADA / SUSTADA / PENDENTE (NOTA 2 0 - TABELA 7)
```

```
25 ALEGAÇÕES DO PAGADOR (NOTA 20 - TABELA 6)
```

```
26 TARIFA DE AVISO DE COBRANÇA
```

27 TARIFA DE EXTRATO POSIÇÃO (B40X)

28 TARIFA DE RELAÇÃO DAS LIQUIDAÇÕES

29 TARIFA DE MANUTENÇÃO DE TÍTULOS VENCIDOS

30 DÉBITO MENSAL DE TARIFAS (PARA ENTRADAS E BAIXAS)

32 BAIXA POR TER SIDO PROTESTADO

33 CUSTAS DE PROTESTO

34 CUSTAS DE SUSTAÇÃO

35 CUSTAS DE CARTÓRIO DISTRIBUIDOR

36 CUSTAS DE EDITAL

37 TARIFA DE EMISSÃO DE BOLETO/TARIFA DE ENVIO DE DUPLICATA

38 TARIFA DE INSTRUÇÃO

39 TARIFA DE OCORRÊNCIAS

40 TARIFA MENSAL DE EMISSÃO DE BOLETO/TARIFA MENSAL DE ENVIO DE DUPLICATA

41 DÉBITO MENSAL DE TARIFAS – EXTRATO DE POSIÇÃO (B4EP/B4OX)

42 DÉBITO MENSAL DE TARIFAS – OUTRAS INSTRUÇÕES

43 DÉBITO MENSAL DE TARIFAS – MANUTENÇÃO DE TÍTULOS VENCIDOS

44 DÉBITO MENSAL DE TARIFAS – OUTRAS OCORRÊNCIAS

45 DÉBITO MENSAL DE TARIFAS – PROTESTO

46 DÉBITO MENSAL DE TARIFAS – SUSTAÇÃO DE PROTESTO

47 BAIXA COM TRANSFERÊNCIA PARA DESCONTO

48 CUSTAS DE SUSTAÇÃO JUDICIAL

51 TARIFA MENSAL REF A ENTRADAS BANCOS CORRESPONDENTES NA CARTEIRA

52 TARIFA MENSAL BAIXAS NA CARTEIRA

53 TARIFA MENSAL BAIXAS EM BANCOS CORRESPONDENTES NA CARTEIRA

54 TARIFA MENSAL DE LIQUIDAÇÕES NA CARTEIRA

55 TARIFA MENSAL DE LIQUIDAÇÕES EM BANCOS CORRESPONDENTES NA CARTEIRA

56 CUSTAS DE IRREGULARIDADE

57 INSTRUÇÃO CANCELADA (NOTA 20 – TABELA 8)

59 BAIXA POR CRÉDITO EM C/C ATRAVÉS DO SISPAG

60 ENTRADA REJEITADA CARNÊ (NOTA 20 – TABELA 1)

61 TARIFA EMISSÃO AVISO DE MOVIMENTAÇÃO DE TÍTULOS (2154)

62 DÉBITO MENSAL DE TARIFA - AVISO DE MOVIMENTAÇÃO DE TÍTULOS (2154)

63 TÍTULO SUSTADO JUDICIALMENTE

64 ENTRADA CONFIRMADA COM RATEIO DE CRÉDITO

65 PAGAMENTO COM CHEQUE – AGUARDANDO COMPENSAÇÃO

69 CHEQUE DEVOLVIDO (NOTA 20 - TABELA 9)

71 ENTRADA REGISTRADA, AGUARDANDO AVALIAÇÃO

72 BAIXA POR CRÉDITO EM C/C ATRAVÉS DO SISPAG SEM TÍTULO CORRESPONDENTE

(^73) CONFIRMAÇÃO DE ENTRADA NA COBRANÇA SIMPLES – ENTRADA NÃO ACEITA NA COBRANÇA CONTRATUAL
74 INSTRUÇÃO DE NEGATIVAÇÃO EXPRESSA REJEITADA (NOTA 20 – TABELA 11)
75 CONFIRMAÇÃO DE RECEBIMENTO DE INSTRUÇÃO DE ENTRADA EM NEGATIVAÇÃO EXPRESSA
(^76) CHEQUE COMPENSADO
(^77) CONFIRMAÇÃO DE RECEBIMENTO DE INSTRUÇÃO DE EXCLUSÃO DE ENTRADA EM NEGATIVAÇÃO EXPRESSA
(^78) CONFIRMAÇÃO DE RECEBIMENTO DE INSTRUÇÃO DE CANCELAMENTO DE NEGATIVAÇÃO EXPRESSA
79 NEGATIVAÇÃO EXPRESSA INFORMACIONAL (NOTA 20 – TABELA 12)
80 CONFIRMAÇÃO DE ENTRADA EM NEGATIVAÇÃO EXPRESSA – TARIFA
(^82) CONFIRMAÇÃO DO CANCELAMENTO DE NEGATIVAÇÃO EXPRESSA – TARIFA
(^83) CONFIRMAÇÃO DE EXCLUSÃO DE ENTRADA EM NEGATIVAÇÃO EXPRESSA POR LIQUIDAÇÃO – TARIFA
(^85) TARIFA POR BOLETO (ATÉ 03 ENVIOS) COBRANÇA ATIVA ELETRÔNICA
86 TARIFA EMAIL COBRANÇA ATIVA ELETRÔNICA
87 TARIFA SMS COBRANÇA ATIVA ELETRÔNICA

```
88 TARIFA MENSAL POR BOLETO (ATÉ 03 ENVIOS) COBRANÇA ATIVA ELETRÔNICA
```

(^89) TARIFA MENSAL EMAIL COBRANÇA ATIVA ELETRÔNICA
(^90) TARIFA MENSAL SMS COBRANÇA ATIVA ELETRÔNICA
(^91) TARIFA MENSAL DE EXCLUSÃO DE ENTRADA DE NEGATIVAÇÃO EXPRESSA
92 TARIFA MENSAL DE CANCELAMENTO DE NEGATIVAÇÃO EXPRESSA
93 TARIFA MENSAL DE EXCLUSÃO DE NEGATIVAÇÃO EXPRESSA POR LIQUIDAÇÃO
(18) Nº DO DOCUMENTO
No arquivo remessa, sugerimos o preenchimento com o nº do documento que originou a cobrança (nº
duplicata, Nota fiscal, etc.).
No arquivo retorno, devolveremos o mesmo conteúdo que for enviado no arquivo remessa.
Excepcionalmente, nas carteiras sem registro com 15 dígitos, conterá informações capturadas na
liquidação, através do código de barras.
Para as carteiras 15 dígitos, este campo é utilizado para complementar a identificação do título. É
composto de 8 dígitos ocupando as posição 045 a 052, sendo que o 8º dígito é o DAC, calculado pelo
critério do módulo 10 (descrito abaixo).
Para as demais carteiras este campo é livre para a utilização pela da Empresa.
Exemplo: considerando-se os seguintes dados
 nº da agência : 0057
 nº da conta corrente sem o DAC : 72192
 nº da subcarteira : 198
 nosso número : 98712345
 seu número : 1108954
1º - Cálculo do DAC do "Nosso Número": conforme Nota 23 o DAC é 1.
2º - Montagem do campo "Seu Número" e multiplicação:
1 1 0 8 9 5 4
x 2 1 2 1 2 1 2
----------------------------

= 2 1 0 8 18 5 8
3º - Soma dos dígitos dos produtos (cada dígito é somado individualmente), como segue:
2+1+0 +8+1+8 +5+8 = 33
4º - Dividir o resultado da conta por 10:
33 10
3 3 10 (módulo) – 3 (resto da divisão) = 7
Resto da divisão
Portanto:
 a impressão do campo nosso número no BOLETO deve ser "198/98712345-1"

 a impressão do campo seu número no BOLETO deve ser "1108954-7"

(19) DESCONTO/ABATIMENTO

```
Se o desconto ou abatimento é concedido na entrada do título estes campos são retornados zerados
(apesar de corretamente registrados no Banco Itaú). Se concedidos após a entrada, retornam com os
valores do desconto ou abatimento.
Na liquidação, desconto e abatimento retornam somados no campo desconto; opcionalmente, mediante
cadastro prévio em nosso sistema, estes valores poderão retornar separados, conforme mostra o indicador
36.4 do Item 5 - Condições Personalizadas.
```

(20) ERROS / CANCELAMENTO DE INSTRUÇÕES / ALEGAÇÕES DO PAGADOR / MOTIVO DE

DEVOLUÇÃO DO CHEQUE

Para as confirmações de entrada (código de ocorrência 02), em determinadas situações, pode-se ler nas

posições 378 a 385, mensagem informativa referente ao título em questão, conforme tabela 10.

Para os registros rejeitados (códigos de ocorrência 03, 15, 16, 17 e 18) pode-se ler nas posições 378 a

385 até quatro códigos de erro que explicam o motivo da rejeição. O indicador 38.0 (vide capítulo 5 -

Condições Personalizadas) define quais desses registros serão gerados pelo Banco Itaú.

Para cancelamento de instruções (Ocorrência 57) é retornado na posição 302 a 305, o código da instrução

cancelada, conforme tabela 8.

```
Para as alegações do pagador (Ocorrência 25) e para ordem de protesto sustada (ocorrência 24), são
retornados os seguintes campos adicionais, conforme tabelas 6 e 7 respectivamente:
 Posição 302 a 305: código complementar da ocorrência
 Posição 306 a 311: data complementar da ocorrência do pagador
 Posição 312 a 324: valor complementar da ocorrência do pagador
```

TABELA 1 - Entradas Rejeitadas (código da ocorrência = 03 na Posição 109 a 110)

CÓD. CAMPO COM ERRO DESCRIÇÃO DO ERRO

03 AG. COBRADORA (^) NÃO FOI POSSÍVEL ATRIBUIR A AGÊNCIA PELO CEP OU CEP SEM ATENDIMENTO DE PROTESTO NO
MOMENTO
04 ESTADO SIGLA DO ESTADO INVÁLIDA
05 DATA VENCIMENTO PRAZO DA OPERAÇÃO MENOR QUE PRAZO MÍNIMO OU MAIOR QUE O MÁXIMO
07 VALOR DO TÍTULO VALOR DO TÍTULO MAIOR QUE 10.000.000,00
08 NOME DO PAGADOR NÃO INFORMADO OU DESLOCADO
09 AGENCIA/CONTA AGÊNCIA ENCERRADA
10 LOGRADOURO NÃO INFORMADO OU DESLOCADO
11 CEP CEP NÃO NUMÉRICO OU CEP INVÁLIDO
12 SACADOR / AVALISTA NOME NÃO INFORMADO OU DESLOCADO (BANCOS CORRESPONDENTES)
13 ESTADO/CEP CEP INCOMPATÍVEL COM A SIGLA DO ESTADO
14 NOSSO NÚMERO NOSSO NÚMERO JÁ REGISTRADO NO CADASTRO DO BANCO OU FORA DA FAIXA
15 NOSSO NÚMERO NOSSO NÚMERO EM DUPLICIDADE NO MESMO MOVIMENTO
18 DATA DE ENTRADA DATA DE ENTRADA INVÁLIDA PARA OPERAR COM ESTA CARTEIRA
19 OCORRÊNCIA OCORRÊNCIA INVÁLIDA
21 AG. COBRADORA CARTEIRA NÃO ACEITA DEPOSITÁRIA CORRESPONDENTE
ESTADO DA AGÊNCIA DIFERENTE DO ESTADO DO PAGADOR
AG. COBRADORA NÃO CONSTA NO CADASTRO OU ENCERRANDO
22 CARTEIRA CARTEIRA NÃO PERMITIDA (NECESSÁRIO CADASTRAR FAIXA LIVRE)
26 AGÊNCIA/CONTA AGÊNCIA/CONTA NÃO LIBERADA PARA OPERAR COM COBRANÇA
27 CNPJ INAPTO CNPJ DO BENEFICIÁRIO INAPTO
DEVOLUÇÃO DE TÍTULO EM GARANTIA
29 CÓDIGO EMPRESA CATEGORIA DA CONTA INVÁLIDA
30 ENTRADA BLOQUEADA ENTRADAS BLOQUEADAS, CONTA SUSPENSA EM COBRANÇA
31 AGÊNCIA/CONTA CONTA NÃO TEM PERMISSÃO PARA PROTESTAR (CONTATE SEU GERENTE)
35 VALOR DO IOF IOF MAIOR QUE 5%

```
36 QTDADE DE MOEDA QUANTIDADE DE MOEDA INCOMPATÍVEL COM VALOR DO TÍTULO
```

```
37 CNPJ/CPF DO PAGADOR NÃO NUMÉRICO OU IGUAL A ZEROS
```

```
42 NOSSO NÚMERO NOSSO NÚMERO FORA DE FAIXA
```

```
52 AG. COBRADORA EMPRESA NÃO ACEITA BANCO CORRESPONDENTE
```

```
53 AG. COBRADORA EMPRESA NÃO ACEITA BANCO CORRESPONDENTE - COBRANÇA MENSAGEM
```

```
54 DATA DE VENCTO BANCO CORRESPONDENTE - TÍTULO COM VENCIMENTO INFERIOR A 15 DIAS
```

```
55 DEP/BCO CORRESP CEP NÃO PERTENCE À DEPOSITÁRIA INFORMADA
```

```
56 DT VENCTO/BCO CORRESP VENCTO SUPERIOR A 180 DIAS DA DATA DE ENTRADA
```

```
57 DATA DE VENCTO CEP SÓ DEPOSITÁRIA BCO DO BRASIL COM VENCTO INFERIOR A 8 DIAS
```

```
60 ABATIMENTO VALOR DO ABATIMENTO INVÁLIDO
```

```
61 JUROS DE MORA JUROS DE MORA MAIOR QUE O PERMITIDO
```

```
63 DESCONTO DE ANTECIPAÇÃO VALOR DA IMPORTÂNCIA POR DIA DE DESCONTO (IDD) NÃO PERMITIDO
```

```
64 DATA DE EMISSÃO DATA DE EMISSÃO DO TÍTULO INVÁLIDA
```

```
65 TAXA FINANCTO TAXA INVÁLIDA (VENDOR)
```

```
66 DATA DE VENCTO INVALIDA/FORA DE PRAZO DE OPERAÇÃO (MÍNIMO OU MÁXIMO)
```

```
67 VALOR/QTIDADE VALOR DO TÍTULO/QUANTIDADE DE MOEDA INVÁLIDO
```

```
68 CARTEIRA CARTEIRA INVÁLIDA OU NÃO CADASTRADA NO INTERCÂMBIO DA COBRANÇA
```

```
69 CARTEIRA CARTEIRA INVÁLIDA PARA TÍTULOS COM RATEIO DE CRÉDITO
```

```
70 AGÊNCIA/CONTA BENEFICIÁRIO NÃO CADASTRADO PARA FAZER RATEIO DE CRÉDITO
```

```
78 AGÊNCIA/CONTA DUPLICIDADE DE AGÊNCIA/CONTA BENEFICIÁRIA DO RATEIO DE CRÉDITO
```

```
80 AGÊNCIA/CONTA QUANTIDADE DE CONTAS BENEFICIÁRIAS DO RATEIO MAIOR DO QUE O PERMITIDO (MÁXIMO DE 30
CONTAS POR TÍTULO)
```

```
81 AGÊNCIA/CONTA CONTA PARA RATEIO DE CRÉDITO INVÁLIDA / NÃO PERTENCE AO ITAÚ
```

```
82 DESCONTO/ABATI-MENTO DESCONTO/ABATIMENTO NÃO PERMITIDO PARA TÍTULOS COM RATEIO DE CRÉDITO
```

```
83 VALOR DO TÍTULO VALOR DO TÍTULO MENOR QUE A SOMA DOS VALORES ESTIPULADOS PARA RATEIO
```

```
84 AGÊNCIA/CONTA AGÊNCIA/CONTA BENEFICIÁRIA DO RATEIO É A CENTRALIZADORA DE CRÉDITO DO BENEFICIÁRIO
```

```
85 AGÊNCIA/CONTA AGÊNCIA/CONTA DO BENEFICIÁRIO É CONTRATUAL / RATEIO DE CRÉDITO NÃO PERMITIDO
```

```
86 TIPO DE VALOR CÓDIGO DO TIPO DE VALOR INVÁLIDO / NÃO PREVISTO PARA TÍTULOS COM RATEIO DE CRÉDITO
```

```
87 AGÊNCIA/CONTA REGISTRO TIPO 4 SEM INFORMAÇÃO DE AGÊNCIAS/CONTAS BENEFICIÁRIAS DO RATEIO
```

```
90 NRO DA LINHA COBRANÇA MENSAGEM - NÚMERO DA LINHA DA MENSAGEM INVÁLIDO OU QUANTIDADE DE LINHAS
EXCEDIDAS
```

```
97 SEM MENSAGEM COBRANÇA MENSAGEM SEM MENSAGEM (SÓ DE CAMPOS FIXOS), PORÉM COM REGISTRO DO TIPO
7 OU 8
```

```
98 FLASH INVÁLIDO REGISTRO MENSAGEM SEM FLASH CADASTRADO OU FLASH INFORMADO DIFERENTE DO
CADASTRADO
```

```
99 FLASH INVÁLIDO CONTA DE COBRANÇA COM FLASH CADASTRADO E SEM REGISTRO DE MENSAGEM
CORRESPONDENTE
```

```
CÓDIGOS DE ERROS PARA AS SUBCARTEIRAS 102, 103, 107, 172, 173, 195, 196
```

```
91 DAC DAC AGENCIA / CONTA CORRENTE INVÁLIDO
```

```
92 DAC DAC AGENCIA / CONTA CORRENTE / CARTEIRA / NOSSO NÚMERO INVÁLIDO
```

```
93 ESTADO SIGLA ESTADO INVÁLIDA
```

```
94 ESTADO SIGLA ESTADO INCOMPATIVEL COM O CEP DO PAGADOR
```

```
95 CEP CEP DO PAGADOR NÃO NUMÉRICO OU INVÁLIDO
```

```
96 ENDEREÇO ENDEREÇO / NOME / CIDADE DO PAGADOR INVÁLIDO
```

TABELA 2 – Alteração de dados rejeitada (código da ocorrência = 17 na Posição 109 a 110)

CÓD. CAMPO COM ERRO

```
02 AGÊNCIA COBRADORA INVÁLIDA OU COM O MESMO CONTEÚDO
```

```
04 SIGLA DO ESTADO INVÁLIDA
```

```
05 DATA DE VENCIMENTO INVÁLIDA OU COM O MESMO CONTEÚDO
```

```
06 VALOR DO TÍTULO COM OUTRA ALTERAÇÃO SIMULTÂNEA
```

```
08 NOME DO PAGADOR COM O MESMO CONTEÚDO
```

```
09 AGÊNCIA/CONTA INCORRETA
```

```
11 CEP INVÁLIDO
```

```
12 NÚMERO INSCRIÇÃO INVÁLIDO DO SACADOR AVALISTA
```

```
13 SEU NÚMERO COM O MESMO CONTEÚDO
```

```
16 ABATIMENTO/ALTERAÇÃO DO VALOR DO TÍTULO OU SOLICITAÇÃO DE BAIXA BLOQUEADA
```

```
20 ESPÉCIE INVÁLIDA
```

```
21 AGÊNCIA COBRADORA NÃO CONSTA NO CADASTRO DE DEPOSITÁRIA OU EM ENCERRAMENTO
```

```
23 DATA DE EMISSÃO DO TÍTULO INVÁLIDA OU COM MESMO CONTEÚDO
```

```
41 CAMPO ACEITE INVÁLIDO OU COM MESMO CONTEÚDO
```

```
42 ALTERAÇÃO INVÁLIDA PARA TÍTULO VENCIDO
```

```
43 ALTERAÇÃO BLOQUEADA – VENCIMENTO JÁ ALTERADO
```

```
53 INSTRUÇÃO COM O MESMO CONTEÚDO
```

```
54 DATA VENCIMENTO PARA BANCOS CORRESPONDENTES INFERIOR AO ACEITO PELO BANCO
```

```
55 ALTERAÇÕES IGUAIS PARA O MESMO CONTROLE (AGÊNCIA/CONTA/CARTEIRA/NOSSO NÚMERO)
```

```
56 CNPJ/CPF INVÁLIDO NÃO NUMÉRICO OU ZERADO
```

```
57 PRAZO DE VENCIMENTO INFERIOR A 15 DIAS
```

```
60 VALOR DE IOF – ALTERAÇÃO NÃO PERMITIDA PARA CARTEIRAS DE N.S. – MOEDA VARIÁVEL
```

```
61 TÍTULO JÁ BAIXADO OU LIQUIDADO OU NÃO EXISTE TÍTULO CORRESPONDENTE NO SISTEMA
```

```
66 ALTERAÇÃO NÃO PERMITIDA PARA CARTEIRAS DE NOTAS DE SEGUROS – MOEDA VARIÁVEL
```

```
67 NOME INVÁLIDO DO SACADOR AVALISTA
```

```
72 ENDEREÇO INVÁLIDO – SACADOR AVALISTA
```

```
73 BAIRRO INVÁLIDO – SACADOR AVALISTA
```

```
74 CIDADE INVÁLIDA – SACADOR AVALISTA
```

```
75 SIGLA ESTADO INVÁLIDO – SACADOR AVALISTA
```

```
76 CEP INVÁLIDO – SACADOR AVALISTA
```

```
81 ALTERAÇÃO BLOQUEADA – TÍTULO COM NEGATIVAÇÃO EXPRESSA OU PROTESTO
```

```
87 ALTERAÇÃO BLOQUEADA – TÍTULO COM RATEIO DE CRÉDITO
```

TABELA 3 – Instruções rejeitadas (código da ocorrência = 16 na posição 109 a 110)

CÓD. CAMPO COM ERRO

```
01 INSTRUÇÃO/OCORRÊNCIA NÃO EXISTENTE
```

```
03 CONTA NÃO TEM PERMISSÃO PARA PROTESTAR (CONTATE SEU GERENTE)
```

```
06 NOSSO NÚMERO IGUAL A ZEROS
```

```
09 CNPJ/CPF DO SACADOR/AVALISTA INVÁLIDO
```

```
10 VALOR DO ABATIMENTO IGUAL OU MAIOR QUE O VALOR DO TÍTULO
```

```
11 SEGUNDA INSTRUÇÃO/OCORRÊNCIA NÃO EXISTENTE
```

```
14 REGISTRO EM DUPLICIDADE
```

```
15 CNPJ/CPF INFORMADO SEM NOME DO SACADOR/AVALISTA
```

```
19 VALOR DO ABATIMENTO MAIOR QUE 90% DO VALOR DO TÍTULO
```

```
20 EXISTE SUSTACAO DE PROTESTO PENDENTE PARA O TITULO
```

```
21 TÍTULO NÃO REGISTRADO NO SISTEMA
```

```
22 TÍTULO BAIXADO OU LIQUIDADO
```

```
23 INSTRUÇÃO NÃO ACEITA POR TER SIDO EMITIDO ÚLTIMO AVISO AO PAGADOR
```

```
24 INSTRUÇÃO INCOMPATÍVEL - EXISTE INSTRUÇÃO DE PROTESTO PARA O TÍTULO
```

```
25 INSTRUÇÃO INCOMPATÍVEL – NÃO EXISTE INSTRUÇÃO DE PROTESTO PARA O TÍTULO
```

```
26 INSTRUÇÃO NÃO ACEITA POR JÁ TER SIDO EMITIDA A ORDEM DE PROTESTO AO CARTÓRIO
```

```
27 INSTRUÇÃO NÃO ACEITA POR NÃO TER SIDO EMITIDA A ORDEM DE PROTESTO AO CARTÓRIO
```

```
28 JÁ EXISTE UMA MESMA INSTRUÇÃO CADASTRADA ANTERIORMENTE PARA O TÍTULO
```

```
29 VALOR LÍQUIDO + VALOR DO ABATIMENTO DIFERENTE DO VALOR DO TÍTULO REGISTRADO
```

```
30 EXISTE UMA INSTRUÇÃO DE NÃO PROTESTAR ATIVA PARA O TÍTULO
```

```
31 EXISTE UMA OCORRÊNCIA DO PAGADOR QUE BLOQUEIA A INSTRUÇÃO
```

```
32 DEPOSITÁRIA DO TÍTULO = 9999 OU CARTEIRA NÃO ACEITA PROTESTO
```

```
33 ALTERAÇÃO DE VENCIMENTO IGUAL À REGISTRADA NO SISTEMA OU QUE TORNA O TÍTULO VENCIDO
```

```
34 INSTRUÇÃO DE EMISSÃO DE AVISO DE COBRANÇA PARA TÍTULO VENCIDO ANTES DO VENCIMENTO
```

```
35 SOLICITAÇÃO DE CANCELAMENTO DE INSTRUÇÃO INEXISTENTE
```

```
36 TÍTULO SOFRENDO ALTERAÇÃO DE CONTROLE (AGÊNCIA/CONTA/CARTEIRA/NOSSO NÚMERO)
```

```
37 INSTRUÇÃO NÃO PERMITIDA PARA A CARTEIRA
```

```
38 INSTRUÇÃO NÃO PERMITIDA PARA TÍTULO COM RATEIO DE CRÉDITO
```

```
40 INSTRUÇÃO INCOMPATÍVEL – NÃO EXISTE INSTRUÇÃO DE NEGATIVAÇÃO EXPRESSA PARA O TÍTULO
```

```
41 INSTRUÇÃO NÃO PERMITIDA – TÍTULO COM ENTRADA EM NEGATIVAÇÃO EXPRESSA
```

```
42 INSTRUÇÃO NÃO PERMITIDA – TÍTULO COM NEGATIVAÇÃO EXPRESSA CONCLUÍDA
```

```
43 PRAZO INVÁLIDO PARA NEGATIVAÇÃO EXPRESSA – MÍNIMO: 02 DIAS CORRIDOS APÓS O VENCIMENTO
```

```
45 INSTRUÇÃO INCOMPATÍVEL PARA O MESMO TÍTULO NESTA DATA
```

```
47 INSTRUÇÃO NÃO PERMITIDA – ESPÉCIE INVÁLIDA
```

```
48 DADOS DO PAGADOR INVÁLIDOS ( CPF / CNPJ / NOME )
```

```
49 DADOS DO ENDEREÇO DO PAGADOR INVÁLIDOS
```

```
50 DATA DE EMISSÃO DO TÍTULO INVÁLIDA
```

```
51 INSTRUÇÃO NÃO PERMITIDA – TÍTULO COM NEGATIVAÇÃO EXPRESSA AGENDADA
```

TABELA 4 - Baixas rejeitadas (código da ocorrência = 15 na Posição 109 a 110)

CÓD. CAMPO COM ERRO

```
01 CARTEIRA/Nº NÚMERO NÃO NUMÉRICO
```

```
04 NOSSO NÚMERO EM DUPLICIDADE NUM MESMO MOVIMENTO
```

```
05 SOLICITAÇÃO DE BAIXA PARA TÍTULO JÁ BAIXADO OU LIQUIDADO
```

```
06 SOLICITAÇÃO DE BAIXA PARA TÍTULO NÃO REGISTRADO NO SISTEMA
```

```
07 COBRANÇA PRAZO CURTO – SOLICITAÇÃO DE BAIXA P/ TÍTULO NÃO REGISTRADO NO SISTEMA
```

```
08 SOLICITAÇÃO DE BAIXA PARA TÍTULO EM FLOATING
```

```
10 VALOR DO TITULO FAZ PARTE DE GARANTIA DE EMPRESTIMO
```

```
11 PAGO ATRAVÉS DO SISPAG POR CRÉDITO EM C/C E NÃO BAIXADO
```

TABELA 5 - Alteração dados cobrança contratual rejeitada/pendente (código da ocorrência = 18 na

Posição 109 a 110)

OBS CÓD. CAMPO COM ERRO

```
16 ABATIMENTO/ALTERAÇÃO DO VALOR DO TÍTULO OU SOLICITAÇÃO DE BAIXA BLOQUEADOS
```

```
A 40 NÃO APROVADA DEVIDO AO IMPACTO NA ELEGIBILIDADE DE GARANTIAS
```

```
A 41 AUTOMATICAMENTE REJEITADA
```

```
A 42 CONFIRMA RECEBIMENTO DE INSTRUÇÃO – PENDENTE DE ANÁLISE
```

(A) Códigos opcionais, podem retornar desde que acordado sua utilização junto ao Banco.

TABELA 6 - Alegações do pagador (código ocorrência = 25 na Posição 109 a 110)

COMPLEMENTO

CÓD. DATA VALOR CAMPO COM ERRO

```
1313 DATA 0 SOLICITA A PRORROGAÇÃO DO VENCIMENTO PARA:
```

```
1321 0 0 SOLICITA A DISPENSA DOS JUROS DE MORA
```

```
1339 0 0 NÃO RECEBEU A MERCADORIA
```

```
1347 0 0 A MERCADORIA CHEGOU ATRASADA
```

```
1354 0 0 A MERCADORIA CHEGOU AVARIADA
```

```
1362 0 0 A MERCADORIA CHEGOU INCOMPLETA
```

```
1370 0 0 A MERCADORIA NÃO CONFERE COM O PEDIDO
```

```
1388 0 0 A MERCADORIA ESTÁ À DISPOSIÇÃO
```

```
1396 0 0 DEVOLVEU A MERCADORIA
```

```
1404 0 0 NÃO RECEBEU A FATURA
```

```
1412 0 0 A FATURA ESTÁ EM DESACORDO COM A NOTA FISCAL
```

```
1420 0 0 O PEDIDO DE COMPRA FOI CANCELADO
```

```
1438 0 0 A DUPLICATA FOI CANCELADA
```

```
1446 0 0 QUE NADA DEVE OU COMPROU
```

```
1453 0 0 QUE MANTÉM ENTENDIMENTOS COM O SACADOR
```

```
1461 DATA 0 QUE PAGARÁ O TÍTULO EM:
```

```
1479 DATA 0 QUE PAGOU O TÍTULO DIRETAMENTE AO BENEFICIÁRIO EM:
```

```
1487 DATA 0 QUE PAGARÁ O TÍTULO DIRETAMENTE AO BENEFICIÁRIO EM:
```

```
1495 DATA 0 QUE O VENCIMENTO CORRETO É:
```

```
1503 0 VALOR QUE TEM DESCONTO OU ABATIMENTO DE:
```

```
1719 0 0 PAGADOR NÃO FOI LOCALIZADO; CONFIRMAR ENDEREÇO
```

```
1727 0 0 PAGADOR ESTÁ EM REGIME DE CONCORDATA
```

```
1735 0 0 PAGADOR ESTÁ EM REGIME DE FALÊNCIA
```

```
1750 0 0 PAGADOR SE RECUSA A PAGAR JUROS BANCÁRIOS
```

```
1768 0 0 PAGADOR SE RECUSA A PAGAR COMISSÃO DE PERMANÊNCIA
```

```
1776 0 0 NÃO FOI POSSÍVEL A ENTREGA DO BOLETO AO PAGADOR
```

```
1784 0 0 BOLETO NÃO ENTREGUE, MUDOU-SE / DESCONHECIDO
```

```
1792 0 0 BOLETO NÃO ENTREGUE, CEP ERRADO / INCOMPLETO
```

```
1800 0 0 BOLETO NÃO ENTREGUE, NÚMERO NÃO EXISTE/ENDEREÇO INCOMPLETO
```

```
1818 0 0 BOLETO NÃO RETIRADO PELO PAGADOR. REENVIADO PELO CORREIO PARA CARTEIRAS COM EMISSÃO PELO
BANCO
```

```
1826 0 0 ENDEREÇO DE E-MAIL INVÁLIDO/COBRANÇA MENSAGEM. BOLETO ENVIADO PELO CORREIO
```

```
1834 0 0 BOLETO DDA, DIVIDA RECONHECIDA PELO PAGADOR
```

```
1842 0 0 BOLETO DDA, DIVIDA NÃO RECONHECIDA PELO PAGADOR
```

TABELA 7 - Ordem de protesto sustada, motivo (código de ocorrência = 24 na Posição 109 a 110)

COMPLEMENTO

CÓD. DATA VALOR SIGNIFICADO

```
1610 0 0 DOCUMENTAÇÃO SOLICITADA AO BENEFICIÁRIO
```

```
3103 0 0 INSUFICIENCIA DE DADOS NO MODELO 4 006
```

```
3111 0 0 SUSTAÇÃO SOLICITADA AG. BENEFICIÁRIO
```

```
3129 0 0 TITULO NAO ENVIADO A CARTORIO
```

```
3137 0 0 AGUARDAR UM DIA UTIL APOS O VENCTO PARA PROTESTAR
```

```
3145 0 0 DM/DMI SEM COMPROVANTE AUTENTICADO OU DECLARACAO
```

3152 0 0 FALTA CONTRATO DE SERV(AG.CED:ENVIAR)

3160 0 0 NOME DO PAGADOR INCOMPLETO/INCORRETO

3178 0 0 NOME DO BENEFICIÁRIO INCOMPLETO/INCORRETO

3186 0 0 NOME DO SACADOR INCOMPLETO/INCORRETO

3194 0 0 TIT ACEITO: IDENTIF ASSINANTE DO CHEQ

3202 0 0 TIT ACEITO: RASURADO OU RASGADO

3210 0 0 TIT ACEITO: FALTA TIT.(AG.CED:ENVIAR)

3228 0 0 ATOS DA CORREGEDORIA ESTADUAL

3236 0 0 NAO FOI POSSIVEL EFETUAR O PROTESTO

3244 0 0 PROTESTO SUSTADO / BENEFICIÁRIO NÃO ENTREGOU A DOCUMENTAÇÃO

3251 0 0 DOCUMENTACAO IRREGULAR

3269 0 0 DATA DE EMISSÃO DO TÍTULO INVÁLIDA / IRREGULAR

3277 0 0 ESPECIE INVALIDA PARA PROTESTO

3285 0 0 PRAÇA NÃO ATENDIDA PELA REDE BANCÁRIA

3293 0 0 CENTRALIZADORA DE PROTESTO NAO RECEBEU A DOCUMENTACAO

3301 0 0 CNPJ/CPF DO PAGADOR INVÁLIDO / INCORRETO

3319 0 0 SACADOR/AVALISTA E PESSOA FÍSICA

3327 0 0 CEP DO PAGADOR INCORRETO

3335 0 0 DEPOSITÁRIA INCOMPATÍVEL COM CEP DO PAGADOR

3343 0 0 CNPJ/CPF SACADOR INVALIDO / INCORRETO

3350 0 0 ENDEREÇO DO PAGADOR INSUFICIENTE

3368 0 0 PRAÇA PAGTO INCOMPATÍVEL COM ENDEREÇO

3376 0 0 FALTA NÚMERO/ESPÉCIE DO TÍTULO

3384 0 0 TÍTULO ACEITO S/ ASSINATURA DO SACADOR

3392 0 0 TÍTULO ACEITO S/ ENDOSSO BENEFICIÁRIO OU IRREGULAR

3400 0 0 TÍTULO SEM LOCAL OU DATA DE EMISSÃO

3418 0 0 TÍTULO ACEITO COM VALOR EXTENSO DIFERENTE DO NUMÉRICO

3426 0 0 TÍTULO ACEITO DEFINIR ESPÉCIE DA DUPLICATA

3434 0 0 DATA EMISSÃO POSTERIOR AO VENCIMENTO

3442 0 0 TÍTULO ACEITO DOCUMENTO NÃO PROTESTÁVEL

3459 0 0 TÍTULO ACEITO EXTENSO VENCIMENTO IRREGULAR

3467 0 0 TÍTULO ACEITO FALTA NOME FAVORECIDO

3475 0 0 TÍTULO ACEITO FALTA PRAÇA DE PAGAMENTO

3483 0 0 TÍTULO ACEITO FALTA CPF ASSINANTE CHEQUE

3491 0 0 FALTA NÚMERO DO TÍTULO (SEU NÚMERO)

3509 0 0 CARTÓRIO DA PRAÇA COM ATIVIDADE SUSPENSA

3517 0 0 DATA APRESENTACAO MENOR QUE A DATA VENCIMENTO

3525 0 0 FALTA COMPROVANTE DA PRESTACAO DE SERVICO

3533 0 0 CNPJ/CPF PAGADOR INCOMPATIVEL C/ TIPO DE DOCUMENTO

3541 0 0 CNPJ/CPF SACADOR INCOMPATIVEL C/ ESPECIE

3558 0 0 TIT ACEITO: S/ ASSINATURA DOPAGADOR

3566 0 0 FALTA DATA DE EMISSAO DO TITULO

3574 0 0 SALDO MAIOR QUE O VALOR DO TITULO

3582 0 0 TIPO DE ENDOSSO INVALIDO

3590 0 0 DEVOLVIDO POR ORDEM JUDICIAL

3608 0 0 DADOS DO TITULO NAO CONFEREM COM DISQUETE

3616 0 0 PAGADOR E SACADOR AVALISTA SÃO A MESMA PESSOA

3624 0 0 COMPROVANTE ILEGIVEL PARA CONFERENCIA E MICROFILMAGEM

```
3632 0 0 CONFIRMAR SE SAO DOIS EMITENTES
```

```
3640 0 0 ENDERECO DO PAGADOR IGUAL AO DO SACADOR OU DO PORTADOR
```

```
3657 0 0 ENDERECO DO BENEFICIÁRIO INCOMPLETO OU NAO INFORMADO
```

```
3665 0 0 ENDERECO DO EMITENTE NO CHEQUE IGUAL AO DO BANCO PAGADOR
```

```
3673 0 0 FALTA MOTIVO DA DEVOLUCAO NO CHEQUE OU ILEGIVEL
```

```
3681 0 0 TITULO COM DIREITO DE REGRESSO VENCIDO
```

```
3699 0 0 TITULO APRESENTADO EM DUPLICIDADE
```

```
3707 0 0 LC EMITIDA MANUALMENTE(TITULO DO BANCO/CA)
```

```
3715 0 0 NAO PROTESTAR LC(TITULO DO BANCO/CA)
```

```
3723 0 0 ELIMINAR O PROTESTO DA LC(TITULO DO BANCO/CA)
```

```
3731 0 0 TITULO JA PROTESTADO
```

```
3749 0 0 TITULO - FALTA TRADUCAO POR TRADUTOR PUBLICO
```

```
3756 0 0 FALTA DECLARACAO DE SALDO ASSINADA NO TITULO
```

```
3764 0 0 CONTRATO DE CAMBIO - FALTA CONTA GRAFICA
```

```
3772 0 0 PAGADOR FALECIDO
```

```
3780 0 0 ESPECIE DE TITULO QUE O BANCO NAO PROTESTA
```

```
3798 0 0 AUSENCIA DO DOCUMENTO FISICO
```

```
3806 0 0 ORDEM DE PROTESTO SUSTADA, MOTIVO
```

```
3814 0 0 PAGADOR APRESENTOU QUITAÇÃO DO TÍTULO
```

```
3822 0 0 PAGADOR IRÁ NEGOCIAR COM BENEFICIÁRIO
```

```
3830 0 0 CPF INCOMPATÍVEL COM A ESPÉCIE DO TÍTULO
```

```
3848 0 0 TÍTULO DE OUTRA JURISDIÇÃO TERRITORIAL
```

```
3855 0 0 TÍTULO COM EMISSÃO ANTERIOR A CONCORDATA DO PAGADOR
```

```
3863 0 0 PAGADOR CONSTA NA LISTA DE FALÊNCIA
```

```
3871 0 0 APRESENTANTE NÃO ACEITA PUBLICAÇÃO DE EDITAL
```

```
3889 0 0 CARTÓRIO COM PROBLEMAS OPERACIONAIS
```

```
3897 0 0 ENVIO DE TITULOS PARA PROTESTO TEMPORARIAMENTE PARALISADO
```

```
3905 0 0 BENEFICIÁRIO COM CONTA EM COBRANCA SUSPENSA
```

```
3913 0 0 CEP DO PAGADOR E UMA CAIXA POSTAL
```

```
3921 0 0 ESPÉCIE NÃO PROTESTÁVEL NO ESTADO
```

```
3939 0 0 FALTA ENDEREÇO OU DOCUMENTO DO SACADOR AVALISTA
```

```
3947 0 0 CORRIGIR A ESPECIE DO TITULO
```

```
3954 0 0 ERRO DE PREENCHIMENTO DO TITULO
```

```
3962 0 0 VALOR DIVERGENTE ENTRE TITULO E COMPROVANTE
```

```
3970 0 0 CONDOMINIO NAO PODE SER PROTESTADO P/ FINS FALIMENTARES
```

```
3988 0 0 VEDADA INTIMACAO POR EDITAL PARA PROTESTO FALIMENTAR
```

TABELA 8 – Instrução cancelada (código de ocorrência = 57 na Posição 109 a 110)

CÓD. OCORRÊNCIAS

```
1156 NÃO PROTESTAR
```

```
2261 DISPENSAR JUROS/COMISSÃO DE PERMANÊNCIA
```

TABELA 9 – Motivo de devolução do cheque devolvido utilizado para pagamento do título (código de

ocorrência = 69 na Posição 109 a 110)

MOT DESCRIÇÃO

```
PASSÍVEL DE
REAPRESENTAÇÃO
```

```
11 CHEQUE SEM FUNDOS - PRIMEIRA APRESENTAÇÃO. SIM
```

```
12 CHEQUE SEM FUNDOS - SEGUNDA APRESENTAÇÃO. NÃO
```

```
13 CONTA ENCERRADA. NÃO
```

```
14 PRÁTICA ESPÚRIA. NÃO
```

```
20 FOLHA DE CHEQUE CANCELADA POR SOLICITAÇÃO DO CORRENTISTA. NÃO
```

```
21 CONTRA-ORDEM (OU REVOGAÇÃO) OU OPOSIÇÃO (OU SUSTAÇÃO) AO PAGAMENTO PELO EMITENTE OU
PELO PORTADOR.
```

```
SIM
```

```
22 DIVERGÊNCIA OU INSUFICIÊNCIA DE ASSINATURA. SIM
```

```
23 CHEQUES EMITIDOS POR ENTIDADES E ÓRGÃOS DA ADMINISTRAÇÃO PÚBLICA FEDERAL DIRETA E
INDIRETA, EM DESACORDO COM OS REQUISITOS CONSTANTES DO ARTIGO 74, § 2º, DO DECRETO-LEI Nº
200, DE 25.02.1967.
```

```
SIM
```

```
24 BLOQUEIO JUDICIAL OU DETERMINAÇÃO DO BANCO CENTRAL DO BRASIL. SIM
```

```
25 CANCELAMENTO DE TALONÁRIO PELO BANCO PAGADOR. NÃO
```

```
28 CONTRA-ORDEM (OU REVOGAÇÃO) OU OPOSIÇÃO (OU SUSTAÇÃO) AO PAGAMENTO OCASIONADA POR
FURTO OU ROUBO.
```

```
NÃO
```

```
29 CHEQUE BLOQUEADO POR FALTA DE CONFIRMAÇÃO DO RECEBIMENTO DO TALONÁRIO PELO
CORRENTISTA.
```

```
SIM
```

```
30 FURTO OU ROUBO DE MALOTES. NÃO
```

```
31 ERRO FORMAL (SEM DATA DE EMISSÃO, COM O MÊS GRAFADO NUMERICAMENTE, AUSÊNCIA DE
ASSINATURA, NÃO-REGISTRO DO VALOR POR EXTENSO).
```

```
SIM
```

```
32 AUSÊNCIA OU IRREGULARIDADE NA APLICAÇÃO DO CARIMBO DE COMPENSAÇÃO. SIM
```

```
33 DIVERGÊNCIA DE ENDOSSO. SIM
```

```
34 CHEQUE APRESENTADO POR ESTABELECIMENTO BANCÁRIO QUE NÃO O INDICADO NO CRUZAMENTO EM
PRETO, SEM O ENDOSSO-MANDATO.
```

```
SIM
```

```
35 CHEQUE FRAUDADO, EMITIDO SEM PRÉVIO CONTROLE OU RESPONSABILIDADE DO ESTABELECIMENTO
BANCÁRIO ("CHEQUE UNIVERSAL"), OU AINDA COM ADULTERAÇÃO DA PRAÇA SACADA.
```

```
NÃO
```

```
36 CHEQUE EMITIDO COM MAIS DE UM ENDOSSO. SIM
```

```
40 MOEDA INVÁLIDA. NÃO
```

```
41 CHEQUE APRESENTADO A BANCO QUE NÃO O PAGADOR. SIM
```

```
42 CHEQUE NÃO-COMPENSÁVEL NA SESSÃO OU SISTEMA DE COMPENSAÇÃO EM QUE FOI APRESENTADO. SIM
```

```
43 CHEQUE, DEVOLVIDO ANTERIORMENTE PELOS MOTIVOS 21, 22, 23, 24, 31 OU 34, NÃO-PASSÍVEL DE
REAPRESENTAÇÃO EM VIRTUDE DE PERSISTIR O MOTIVO DA DEVOLUÇÃO.
```

```
NÃO
```

```
44 CHEQUE PRESCRITO. NÃO
```

```
45 CHEQUE EMITIDO POR ENTIDADE OBRIGADA A REALIZAR MOVIMENTAÇÃO E UTILIZAÇÃO DE RECURSOS
FINANCEIROS DO TESOURO NACIONAL MEDIANTE ORDEM BANCÁRIA.
```

```
NÃO
```

```
48 CHEQUE DE VALOR SUPERIOR AO ESTABELECIDO, EMITIDO SEM A IDENTIFICAÇÃO DO BENEFICIÁRIO,
DEVENDO SER DEVOLVIDO A QUALQUER TEMPO.
```

```
SIM
```

```
49 REMESSA NULA, CARACTERIZADA PELA REAPRESENTAÇÃO DE CHEQUE DEVOLVIDO PELOS MOTIVOS 12,
13, 14, 20, 25, 28, 30, 35, 43, 44 E 45, PODENDO A SUA DEVOLUÇÃO OCORRER A QUALQUER TEMPO.
```

```
NÃO
```

OBS.: Eventualmente, por determinação do Banco Central do Brasil, os motivos de devolução de cheques

podem sofrer atualizações. Caso seja apresentado motivo de devolução não listado nesta tabela, a

respectiva descrição pode ser obtida junto ao gerente da sua conta.

TABELA 10 – Mensagem Informativa (código de ocorrência = 02 na Posição 109 a 110)

CÓD. MENSAGEM INFORMATIVA

```
01 CEP SEM ATENDIMENTO DE PROTESTO NESSE MOMENTO
```

```
02 ESTADO COM DETERMINAÇÃO LEGAL QU EIMPEDE A INSCRIÇÃO DE INADIMPLENTES NOS CADASTROS DE PROTEÇÃO AO CRÉDITO
NO PRAZO SOLICITADO – PRAZO SUPERIOR AO SOLICITADO
```

```
03 BOLETO NÃO LIQUIDADO NO DESCONTO DE DUPLICATAS E TRANSFERIDO PARA COBRANÇA SIMPLES
```

TABELA 11 **–** Instrução de Negativação Expressa rejeitada (código de ocorrência = 74 na Posição 109 a 110)

CÓD. OCORRÊNCIA

```
6007 INCLUSÃO BLOQUEADA FACE A DETERMINAÇÃO JUDICIAL
```

```
6015 INCONSISTÊNCIAS NAS INFORMAÇÕES DE ENDEREÇO
```

```
6023 TÍTULO JÁ DECURSADO
```

```
6031 INCLUSÃO CONDICIONADA A APRESENTAÇÃO DE DOCUMENTO DE DÍVIDA
```

```
6163 EXCLUSÃO NÃO PERMITIDA, REGISTRO SUSPENSO
```

```
6171 EXCLUSÃO PARA REGISTRO INEXISTENTE
```

```
6379 REJEIÇÃO POR DADO(S) INCONSISTENTE(S)
```

TABELA 1 2 – Negativação Expressa informacional (código de ocorrência = 79 na Posição 109 a 110)

CÓD. OCORRÊNCIA

```
6049 INFORMAÇÃO DOS CORREIOS – MUDOU-SE
```

```
6056 INFORMAÇÃO DOS CORREIOS – DEVOLVIDO POR INFORMAÇÃO PRESTADA PELO SINDICO OU PORTEIRO
```

```
6064 INFORMAÇÃO DOS CORREIOS – DEVOLVIDO POR INCONSISTÊNCIA NO ENDEREÇO
```

```
6072 INFORMAÇÃO DOS CORREIOS – DESCONHECIDO
```

```
6080 INFORMAÇÃO DOS CORREIOS – RECUSADO
```

```
6098 INFORMAÇÃO DOS CORREIOS – AUSENTE
```

```
6106 INFORMAÇÃO DOS CORREIOS – NÃO PROCURADO
```

```
6114 INFORMAÇÃO DOS CORREIOS – FALECIDO
```

```
6122 INFORMAÇÃO DOS CORREIOS – NÃO ESPECIFICADO
```

```
6130 INFORMAÇÃO DOS CORREIOS – CAIXA POSTAL INEXISTENTE
```

```
6148 INFORMAÇÃO DOS CORREIOS – DEVOLUÇÃO DO COMUNICADO DO CORREIO
```

```
6155 INFORMAÇÃO DOS CORREIOS – OUTROS MOTIVOS
```

(21) QUANTIDADE E VALOR TOTAL DE TÍTULOS

```
Esses campos referem-se às quantidades e valores dos títulos à vencer registrados no Banco Itaú, nas
diversas modalidades de cobrança.
```

(22) AVISO BANCÁRIO

Refere-se ao código do extrato de Movimentação de Títulos (MT) associado a esse movimento. Quando

se tratar de cobrança sem registro estes campos virão zerados.

(23) NÚMERO DO TÍTULO/USO DO BANCO ITAÚ (ANEXO A)

Para efetuar corretamente o recebimento de um título, o Banco Itaú necessita que o campo "Nosso

Número" do BOLETO de cobrança esteja preenchido com o número da carteira de cobrança, o número do

título e seu DAC - Dígito de Auto Conferência (formato: CCC/NNNNNNNN-D).

O próprio Banco se encarrega do cálculo do DAC e sua impressão, quando se tratar de cobrança com

registro ou fornecer BOLETOs parcialmente preenchidos.

Quando sua empresa imprimir completamente o BOLETO ou quando solicitar sua impressão ao Banco

Itaú nas carteiras sem registro necessitará calcular o DAC, pelo critério do módulo 10.

Para todas as carteiras de cobrança do Banco Itaú o DAC do "Nosso Número" é calculado a partir dos

campos : Agência, Conta do beneficiário (sem DAC), Número da carteira e "Nosso Número", exceto as

carteiras escriturais e na modalidade direta as carteiras 126, 131, 145, 150 e 168, cujo DAC do "Nosso

Número" e composto apenas dos campos : Carteira e Nosso Número, mas todos calculados através do

Módulo 10, cuja explicação vem a seguir.

Multiplica-se cada algarismo do número formado pela composição dos campos acima pela seqüência de

multiplicadores 2, 1, 2, 1, 2, 1, 2 (posicionados da direita para a esquerda). A seguir, somam-se os

algarismos dos produtos e o total obtido é dividido por 10. O DAC é a diferença entre o divisor (10) e o

resto da divisão:

10 - (RESTO DA DIVISÃO) = DAC. Se o resto da divisão for zero, o DAC será zero.

Exemplo, considerando-se os seguintes dados:

```
 nº da agência: 0057  nº da conta corrente, sem o DAC: 72192
 nº da subcarteira: 198  nosso número: 98712345
```

1º - Montagem do campo e multiplicação:

Agência C/C Cart. Nosso Número

0 0 5 7 / 7 2 1 9 2 / 1 9 8 / 9 8 7 1 2 3 4 5

x 1 2 1 2 1 2 1 2 1 2 1 2 1 2 1 2 1 2 1 2

-------------------------------------------------------------------------------

= 0 0 5 14 7 4 1 18 2 2 9 16 9 16 7 2 2 6 4 10

2º - Soma dos dígitos dos produtos (cada dígito é somado individualmente), como segue:

0 + 0 + 5 + 1 + 4 + 7 + 4 + 1 + 1 + 8 + 2 + 2 + 9 + 1 + 6 + 9 + 1 + 6 + 7 + 2 + 2 + 6 + 4 + 1 + 0 = 89

3º - Divisão e resultado:

89 | 10

9 8 ===========> 10 - 9 = 1 (DAC)

Portanto a impressão do campo Nosso Número no BOLETO deve ser "198/98712345- 1 "

(24) LITERAL DE MOEDA (ANEXO A)

Literal da moeda a ser impressa no boleto identificando a espécie da moeda. Se o valor vier expresso em

Reais, a informação será ignorada e será impresso R$ no boleto.

(25) AGÊNCIA COBRADORA / LOCAL DE PAGAMENTO (ANEXO A)

O campo “agência cobradora” deve ser preenchido com brancos. O Banco Itaú definirá o código desta

agência mediante o CEP do pagador.

Na área do boleto reservada para indicar o local de pagamento, especificar:

```
 Local de pagamento 1:
ATE O VCTO, PAGUE PREFERENCIALMENTE NO ITAU
```

```
 Local de pagamento 2:
APOS O VENCIMENTO, PAGUE SOMENTE NO ITAU
```

(26) INSTRUÇÕES (ANEXO A)

Área do boleto reservada para instruções, formada por nove linhas de 69 caracteres. Essa área será de

livre utilização pela Empresa, que informará o conteúdo de cada linha a ser impressa através dos registros

com códigos de layout "2 e 3".

Caso não haja nenhuma instrução, não são necessários os registros com códigos de layout "2 e 3".

Caso existam até cinco linhas de instruções, não é necessário o registro com código de layout "3".

Por se tratar de Cobrança Sem Registro, as instruções indicadas neste registro devem obedecer aos

padrões a seguir:

```
 "BANCO AUTORIZADO A RECEBER ATÉ DD/MM/AAAA."
 "APÓS DD/MM/AAAA, COBRAR MULTA DE R$ (VALOR)."
 "APÓS DD/MM/AAAA, COBRAR R$ (VALOR) POR DE DIA DE ATRASO."
```

 "ATÉ DD/MM/AAAA, CONCEDER DESCONTO DE R$ (VALOR)."

(27) INSTRUÇÃO/ALEGAÇÃO CANCELADA

Deve ser preenchido na remessa somente quando utilizados, na posição 109-110, os códigos de ocorrência

35 – Cancelamento de Instrução e 38 – Beneficiário não concorda com alegação do pagador. Para os

demais códigos de ocorrência este campo deverá ser preenchido com zeros.

Obs.: No arquivo retorno será informado o mesmo código da instrução cancelada, e para o cancelamento

de alegação de pagador não há retorno da informação.

(28) CÓDIGO DE LIQUIDAÇÃO

Indica o canal utilizado pelo pagador para pagamento do boleto e, para clientes que possuem o crédito das

liquidações separado em função do recurso utilizado no pagamento, indica se o crédito do valor correspondente

estará “disponível” ou “a compensar” na data do lançamento em conta corrente.

```
CÓD DESCRIÇÃO RECURSO
```

```
AA CAIXA ELETRÔNICO BANCO ITAÚ DISPONÍVEL
```

```
AC PAGAMENTO EM CARTÓRIO AUTOMATIZADO A COMPENSAR
```

```
AO ACERTO ONLINE DISPONÍVEL
```

```
BC BANCOS CORRESPONDENTES DISPONÍVEL
```

```
BF ITAÚ BANKFONE DISPONÍVEL
```

```
BL ITAÚ BANKLINE DISPONÍVEL
```

```
B0 OUTROS BANCOS – RECEBIMENTO OFF-LINE A COMPENSAR
```

```
B1 OUTROS BANCOS – PELO CÓDIGO DE BARRAS A COMPENSAR
```

```
B2 OUTROS BANCOS – PELA LINHA DIGITÁVEL A COMPENSAR
```

```
B3 OUTROS BANCOS – PELO AUTO ATENDIMENTO A COMPENSAR
```

```
B4 OUTROS BANCOS – RECEBIMENTO EM CASA LOTÉRICA A COMPENSAR
```

```
B5 OUTROS BANCOS – CORRESPONDENTE A COMPENSAR
```

```
B6 OUTROS BANCOS – TELEFONE A COMPENSAR
```

```
B7 OUTROS BANCOS – ARQUIVO ELETRÔNICO (Pagamento Efetuado por meio de troca de arquivos) A COMPENSAR
```

```
CC AGÊNCIA ITAÚ – COM CHEQUE DE OUTRO BANCO ou (CHEQUE ITAÚ)* A COMPENSAR
```

```
CI CORRESPONDENTE ITAÚ DISPONÍVEL
```

```
CK SISPAG – SISTEMA DE CONTAS A PAGAR ITAÚ DISPONÍVEL
```

```
CP AGÊNCIA ITAÚ – POR DÉBITO EM CONTA CORRENTE, CHEQUE ITAÚ* OU DINHEIRO DISPONÍVEL
```

```
DG AGÊNCIA ITAÚ – CAPTURADO EM OFF-LINE DISPONÍVEL
```

```
LC PAGAMENTO EM CARTÓRIO DE PROTESTO COM CHEQUE A COMPENSAR
```

```
EA TERMINAL DE CAIXA DISPONÍVEL
```

```
Q0 AGENDAMENTO – PAGAMENTO AGENDADO VIA BANKLINE OU OUTRO CANAL ELETRÔNICO E LIQUIDADO NA
DATA INDICADA
```

```
DISPONÍVEL
```

```
RA DIGITAÇÃO – REALIMENTAÇÃO AUTOMÁTICA DISPONÍVEL
```

```
ST PAGAMENTO VIA SELTEC** DISPONÍVEL
```

```
* Se utiliza BLOQUEIO DE CHEQUE o retorno de CHEQUE ITAÚ será devolvido como CC.
** Sistema Eletrônico de Liquidação de Títulos em Cartório
```

(30) SACADOR/AVALISTA

Existindo a figura do Sacador/Avalista, é imprescindível informar corretamente todos os dados a ele

relacionados, conforme lei federal 12.039, que exige os dados completos para facilitar o contato entre

pagador e o emissor e, caso venha a ser solicitado o protesto da dívida, é facultado aos Cartórios de

Protestos de Títulos exigirem tais dados com exatidão.

```
CÓD DE INSCRIÇÃO NÚMERO DE INSCRIÇÃO OBSERVAÇÃO
```

```
00 PREENCHER COM ZEROS NÃO HÁ SACADOR/AVALISTA.
```

```
01 NÚMERO DO CPF INFORMAR O CPF DO SACADOR/AVALISTA.
```

```
02 NÚMERO DO CNPJ INFORMAR O CNPJ DO SACADOR/AVALISTA.
```

Obs.: Verificar o preenchimento do registro detalhe 02 nas posições 002-003 o preenchimento

correspondente ao tipo de inscrição do Sacador Avalista.

(31) DATA DE EMISSÃO (DDMMAA)

A data informada neste campo deve ser a mesma data de emissão do título de crédito (Duplicata de

Serviço / Duplicata Mercantil / Nota Fiscal, etc), que deu origem a esta Cobrança. Existindo divergência,

na existência de protesto, a documentação poderá não ser aceita pelo Cartório.

(32) TIPO DE VALOR

ARQUIVO REMESSA:

O campo Tipo de Valor (posição 394 do registro Tipo 4) define se o rateio de crédito deve ser feito por

percentual (%) ou em valor (R$):

```
CONTEÚDO DESCRIÇÃO
```

```
1 RATEIO DE CRÉDITO POR PERCENTUAL (%) – VALOR NOMINAL DO TÍTULO (*)
```

```
2 RATEIO DE CRÉDITO EM VALOR (R$) – VALOR NOMINAL DO TÍTULO (*)
```

```
3 RATEIO DE CRÉDITO POR PERCENTUAL (%) – VALOR LÍQUIDO RECEBIDO (**)
```

```
4 RATEIO DE CRÉDITO EM VALOR (R$) – VALOR LÍQUIDO RECEBIDO, RATEADO PROPORCIONALMENTE AOS
VALORES DE RATEIO INFORMADOS NA REMESSA (**)
```

(*) Para os Tipos de Valor “1” e “2”, o rateio é feito sobre o valor nominal do título e eventuais diferenças de

pagamentos a maior (juros) ou a menor (desconto) são contabilizadas na conta de crédito do beneficiário.

(**) Para os Tipos de Valor “3” e “4”, o rateio é feito sobre o valor liquido recebido em pagamento. O valor

líquido recebido corresponde ao: Valor Nominal – Desconto + Juros.

Portanto, os campos VALOR de cada conta de crédito devem obedecer aos seguintes formatos:

- Rateio por PERCENTUAL: formato “9(10)V9(3)”;
- Rateio em VALOR: formato “9(11)V9(2)”.

ARQUIVO RETORNO:

Nas confirmações das entradas, os campos VALOR são informados com o mesmo formato (percentual

ou valor) definido no arquivo remessa;

Na ocorrência de liquidação, os campos VALOR apresentam o valor efetivamente creditado na conta de

crédito.

(33) AGÊNCIA CONTA DO CHEQUE

Este campo será preenchido da seguinte forma: AAAA00CCCCCD

Onde:

AAAA - Número da agência de débito do cheque;

00 - Dois zeros;

CCCCC - Número da conta de débito do cheque;

D - Dac da agência/conta de débito do cheque.

(34) BOLETO DDA

Este serviço requer cadastramento prévio junto ao Banco. Para as ocorrência de confirmação de entrada

(código de ocorrência “02”, nas posições 109 e 110 do registro de transação) o arquivo retorno de

Cobrança passará a apresentar neste campo a indicação de Boleto DDA, conforme segue:

```
CÓDIGO DESCRIÇÃO
```

```
0 NÃO É BOLETO DDA (PAGADOR NÃO ADERIU AO DDA ATÉ O MOMENTO)
```

```
1 BOLETO DDA (PAGADOR ADERIU AO DDA EM AO MENOS UM BANCO DE RELACIONAMENTO)
```

(35) CÓDIGO FLASH **–** Específico para Cobrança Mensagem.

O código do flash será fornecido pelo Banco.

(36) DESTINO BOLETO **–** Específico para Cobrança Mensagem.

```
Este campo permite identificar quando o título deve ser impresso e encaminhado para agência
beneficiária providenciar a entrega ao cliente beneficiário. Para que isto ocorra, todos os registros Tipo
7 de um determinado título devem possuir o conteúdo “1” na posição 394.
```

```
Caso este campo apresente conteúdo diferente de “1” em qualquer registro Tipo 7, o boleto será
impresso e encaminhado pelo meio habitual (via Correio).
```

(3 7 ) TAMANHO DO CAMPO.

Este campo permite incluir até 128 colunas, porém a limitação do campo é de acordo com o modelo

escolhido. Os modelos estão disponíveis no item 09 - Anexo C.

MODELO

FRENTE VERSO

LINHAS COLUNAS LINHAS COLUNAS

01 52 LINHAS 99 POSIÇÕES - -

02 * 49 LINHAS 99 POSIÇÕES - -

03 48 LINHAS 99 POSIÇÕES 20 LINHAS 140 POSIÇÕES

04 57 LINHAS 128 POSIÇÕES 25 LINHAS 140 POSIÇÕES

05 48 LINHAS 99 POSIÇÕES 25 LINHAS 140 POSIÇÕES

06 - - - -

NÃO MENSAGEM - - - -

PERSONALIZADO** 52 LINHAS 128 POSIÇÕES 25 LINHAS 140 POSIÇÕES

- Neste caso o modelo padrão não tem espaço para mensagem variável no verso, porém a empresa

poderá solicitar a disponibilização de até 25 linhas com 140 colunas para mensagem variável.

** Personalizado (modelo próprio) a quantidade de linhas deverá ser observada de acordo com o modelo

desenvolvido para a empresa.

(38) - MULTA

O código da Multa irá determinar como o sistema irá atribuir o valor da multa.

```
CÓDIGO DESCRIÇÃO
```

```
0 NÃO REGISTRA A MULTA
```

```
1 VALOR EM REAIS FIXO
```

```
2 VALOR EM PERCENTUAL COM DUAS CASAS DECIMAIS CONFORME ESTRUTURA DO CAMPO
```

- Qualquer informação enviada diferente das opções informadas no domínio acima, o cliente receberá

erro de registro inválido no tipo 1.

- Caso seja informado o domínio '0', o cliente não irá enviar a multa, mas poderá utilizar alguma outra

função que esteja disponível para o registro tipo 2 no futuro.

DATA DA MULTA

Data da Multa, data que passa incidir a cobrança da Multa.

Campo deve ser formatado como DDMMAAAA.

A data informada deve ser Maior ou igual a data de vencimento do título.

MULTA

O Campo Valor / Percentual define se a multa será informada em Valor nominal ou percentual *

O campo valor deve obedecer ao seguinte formato:

- Percentual: Formato “9(11)V9(2)”
- Valor: Formato “9(11)V9(2)

•* O percentual será aplicado sobre o Valor Nominal do título

- Não poderá ser enviado valor da multa igual ou maior que o valor do próprio título , considerado o valor

Nominal registrado

- Não poderá ser enviado percentual da multa igual ou maior que 100%
- Caso o cliente comande uma instrução de Alteração do valor nominal do título, se houver registro /

instrução de Multa o sistema irá:

- Recalcular o valor da multa se no registro o cliente informou % de Multa
- Manter o valor da Multa se no registro o cliente informou a Multa em Valor

### 5. Condições Personalizadas

Para garantir um nível de operação mais personificado, considerando-se particularidades de cada

cliente, várias características dos arquivos podem ser cadastradas de acordo com suas necessidades.

Essas características são denominadas Indicadores. O cadastramento dos indicadores é feito pelo Itaú

conforme solicitado pelo cliente.

A seguir, relacionamos os indicadores mais utilizados. Aqueles marcados com (*) são o valor default (assumidos

pelo Banco) caso não haja nenhum cadastramento.

04.2 - HEADER/TRAILER

(*) 0 - Por Arquivo

1 - Por Conta

12.5 - CONCESSÃO DE ABATIMENTO

```
Indica se, na concessão de abatimento, o cliente deseja que seja alterado o valor do título ou apenas seja
emitido um aviso ao pagador.
0 - Altera valor
```

(*) 1 - Emite aviso

13.3 - BANCOS CORRESPONDENTES

Indica se o cliente aceita ou não, bancos correspondentes como depositário dos títulos.

(*) 0 - Aceita para Escritural, Sem Registro e Direta.

1 - Não aceita para Escritural e aceita para Sem Registro e Direta

3 - Não aceita para nenhuma modalidade

4 - Aceita para Escritural e não aceita para Sem Registro e Direta

16.6 - MOEDA VARIÁVEL

Indica se o cliente deseja enviar quantidade de moeda no campo valor do título

(*) 0 - Não envia

2 - Envia

19.0 - DESCONTO NO ARQUIVO REMESSA

```
Indica se o cliente envia mais de um desconto no arquivo (o 2º e 3º desconto enviado no campo
"Sacador/Avalista").
(*) 0 - Somente um desconto
```

1 - Mais de um desconto

22.4 - RELATÓRIO DO MOVIMENTO

(*) 0 - Não tem

1 - Tem

23.2 - INFORMAÇÃO DA LIQUIDAÇÃO NO ARQUIVO RETORNO

Indica em que momento a liquidação é informada na fita retorno.

(*) 0 - No crédito (2154)

1 - No processamento (dia seguinte ao pagamento - B4EP)

2 - Informa duas vezes, no crédito e no processamento. A identificação se dá pela posição 107 do registro

de transação do Arquivo Retorno, que contém os seguintes códigos:

I - Informativo (Processamento)

C - Contábil (No crédito)

25.7 - TIPOS DE REGISTROS NA FITA RETORNO

(*) 0 - Todos os registros

1 - Só os registros de liquidações

2 - Todos os registros; exceto as confirmações de entrada.

36.4 - SEPARAÇÃO DE DESCONTO E ABATIMENTO

Indica se na liquidação do título o valor do desconto deverá ser separado do valor do abatimento.

(*) 0 - Não separa

1 - Separa Descontos/Abatimento

2 - Separa Juros/Correção Monetária

3 - Separa Desconto/Abatimento e Juros/Correção Monetária

37.2 - RETORNO DE INSTRUÇÕES/OCORRÊNCIAS

Indica se o cliente deseja receber confirmação das instruções comandadas para os seus títulos.

0 - Não retorna

1 - Retorna só instrução do beneficiário

2 - Retorna só ocorrências do pagador

(*) 3 - Retorna instruções do beneficiário e ocorrências do pagador

38.0 - RETORNO DE REGISTROS REJEITADOS

Indica se o cliente deseja receber os registros recusados pelo sistema de cobrança do Banco.

0 - Não retorna

1 - Retorna somente as rejeições de entrada

(*) 2 - Retorna todas as rejeições

40.6 - DATA DE CRÉDITO

Indica se o cliente deseja receber a data do crédito.

0 - Data do crédito no registro Header

1 - Data do crédito no registro de Transação

(*) 2 - Data do crédito no registro Header e Transação

3 - Não recebe informação da Data do Crédito

41.4 - BOLETO ELETRÔNICO DDA

Indica se o cliente deseja receber a informação de Boleto DDA.

(*) 0 - Não retorna

1 - Retorna

42.2 - ALEGAÇÃO DOPAGADOR - BOLETO ELETRÔNICO DDA

Indica se o cliente deseja receber a informação de alegação do pagador de Boletos DDA.

(*) 0 - Não retorna

1 - Retorna

47.1 - RETORNO DE TARIFAS

0 - Não retorna

(*) 1 _–_ Retorna

### 6. Testes e Operações

```
Para se assegurar o perfeito funcionamento do sistema, devem ser transmitidos ao banco, arquivos de teste
com dados simulados nas cobranças que possuam Arquivos Remessa, formatados conforme layout descrito
neste manual e contendo no máximo 30 registros.
```

Com base nesse arquivo, o Itaú providenciará um Arquivo Retorno contendo a confirmação e /ou rejeição das

entradas para que o cliente teste o seu sistema e no caso da cobrança com emissão do BOLETO de cobrança

pelo Banco Itaú, estes serão impressos e encaminhados a agência do cliente limitados a 30 Boletos por agência

/ conta.

Consideram-se concluída a fase de teste após terem sido esclarecidas todas as dúvidas e irregularidades,

cabendo ao cliente a decisão de passar para a fase de produção.

É possível fazer teste mesmo estando em produção.

Validador de Layout de Arquivos

O Validador de Arquivos de layout possibilita a você agilizar os processos de validação de layout de cobrança

no momento que sua empresa envia o arquivo, por meio do Itaú Empresas na Internet.

Ao enviar o arquivo, você conseguirá visualizar imediatamente o relatório de erros de estrutura no layout,

antecipando sua correção antes da validação em ambiente de Teste.

Principais Benefícios:

 Agilidade no envio de arquivos de cobrança;

 Redução de tempo e custo de desenvolvimento de seus sistemas;

 Conveniência, com a disponibilização do relatório de erros de forma on-line;

 Disponibilidade, sem limites de utilização.

Mais uma inovação a serviço da conveniência, que o Itaú oferece a sua empresa.

Acesse agora o menu Transmissão de Arquivo > Validação > Layout de Arquivo.

Visualização de boletos Cobrança Mensagem

Após a definição do modelo de boleto que a empresa irá trabalhar e o inicio dos testes de arquivo, estará

disponível no Itaú Empresas na Internet a visualização dos boletos em ambiente de teste.

Após 1 hora do processamento do arquivo (ver tabela de horários no envio do arquivo) será possível

visualizar os boletos de teste através do Itaú Empresas na Internet pela seguinte rota:

Menu: Transmissão de Arquivos > Transmissão (ambiente de teste) > Recepcionar.

### 7. Anexo A

#### Cobrança sem Registro-Emissão Integral

As carteiras de cobrança sem registro cuja impressão integral seja de responsabilidade do banco

(identificadas na nota 5 **com a observação “B”) devem seguir layout abaixo.**

#### 7.1 – Explicações gerais sobre o arquivo

Cada arquivo é composto dos seguintes registros:

```
 Um registro Header de Arquivo;
 Quatro Registros de Detalhe, sendo três destes opcionais;
 Um registro Trailer de Arquivo.
```

Para cada boleto a ser emitido deve existir um registro com código de layout = 1 e outro com código = 2 onde

constarão as instruções de recebimento. O registro com código de layout=3 é opcional, devendo ser utilizado

quando o beneficiário desejar enviar mais do que cinco instruções de recebimento e / ou mensagens ao pagador.

O registro com código de layout=4 é opcional, devendo ser utilizado quando o título possuir a figura de um

sacador avalista.

Representado graficamente, o arquivo é composto da seguinte maneira:

Arquivo

Registro Header do Arquivo => { Reg. = 0 }

=> { Reg. = 6 / layout = 1 obrigatório}

| Registro de Detalhe => { Reg. = 6 / layout = 2 opcional }

=> { Reg. = 6 / layout = 3 opcional }

=> { Reg. = 6 / layout = 4 opcional }

Registro Trailer do Arquivo => { Reg. = 9 }

#### 7.2 – Layout do Arquivo

```
ARQUIVO REMESSA REGISTRO HEADER DE ARQUIVO TAMANHO DO REGISTRO = 400 BYTES
```

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

```
TIPO DE REGISTRO IDENTIFICAÇÃO DO REGISTRO HEADER 001 001 9(01) 0
```

```
OPERAÇÃO TIPO DE OPERAÇÃO - REMESSA 002 002 9(01) 1
```

```
LITERAL DE REMESSA IDENTIFICAÇÃO POR EXTENSO DO MOVIMENTO 003 009 X(07) REMESSA
```

```
CÓDIGO DO SERVIÇO IDENTIFICAÇÃO DO TIPO DE SERVIÇO 010 011 9(02) 01
```

```
LITERAL DE SERVIÇO IDENTIFICAÇÃO POR EXTENSO DO TIPO DE SERVIÇO 012 026 X(15) COBRANCA
```

```
AGÊNCIA AGÊNCIA MANTENEDORA DA CONTA 027 030 9(04)
```

```
ZEROS COMPLEMENTO DE REGISTRO 031 032 9(02) “00”
```

```
CONTA NÚMERO DA CONTA CORRENTE DA EMPRESA 033 037 9(05)
```

DAC (^) DÍGITO DE AUTO CONFERÊNCIA AG/CONTA EMPRESA 038 038 9(01)
BRANCOS COMPLEMENTO DO REGISTRO 039 046 X(08)
NOME DA EMPRESA NOME POR EXTENSO DA "EMPRESA MÃE" 047 076 X(30)
CÓDIGO DO BANCO Nº DO BANCO NA CÂMARA DE COMPENSAÇÃO 077 079 9(03) 341
NOME DO BANCO NOME POR EXTENSO DO BANCO COBRADOR 080 094 X(15) BANCO ITAU SA
DATA DE GERAÇÃO DATA DE GERAÇÃO DO ARQUIVO 095 100 9(06) DDMMAA
BRANCOS COMPLEMENTO DO REGISTRO 101 394 X(294)
NÚMERO SEQÜENCIAL NÚMERO SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400 9(06) 000001
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA

```
ARQUIVO REMESSA REGISTRO EMISSÃO DE BOLETO TAMANHO DO REGISTRO = 400 BYTES
```

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

```
TIPO DE REGISTRO IDENTIFICAÇÃO DO REGISTRO TRANSAÇÃO 001 001 9(01) 6
```

```
CÓDIGO DE LAYOUT IDENTIFICAÇÃO DO LAYOUT PARA O REGISTRO 002 002 9(01) 1
```

```
AGÊNCIA AGÊNCIA MANTENEDORA DA CONTA 003 006 9(04)
```

```
ZEROS COMPLEMENTO DE REGISTRO 007 008 9(02) “00”
```

```
CONTA NÚMERO DA CONTA CORRENTE DA EMPRESA 009 013 9(05)
```

```
DAC DÍGITO DE AUTO CONFERÊNCIA AG/CONTA EMPRESA 014 014 9(01)
```

```
Nº DA CARTEIRA Nº DA CARTEIRA NO BANCO 015 017 9(03)
```

```
NOSSO NÚMERO IDENTIFICAÇÃO DO TÍTULO NO BANCO 018 025 9(08)
```

```
DAC DAC DO NOSSO NÚMERO 026 026 9(01) NOTA 23
```

```
CÓDIGO DA MOEDA INDICA SE O VALOR DO TÍTULO ESTÁ SENDO INFORMADO EM REAL
OU EM MOEDA VARIÁVEL
```

```
027 027 9(01) 0 = R$
1 = VARIÁVEL
```

```
LITERAL DE MOEDA IDENTIF. DA MOEDA A SER IMPRESSA NO BOLETO (PARA MOEDA
VARIÁVEL)
```

```
028 031 X(04) NOTA 24
```

```
VALOR DO TÍTULO VALOR DO TÍTULO 032 044 9(11)V9(2) (*)
```

```
SEU NÚMERO NÚMERO DO DOCUMENTO NA EMPRESA 045 054 X(10) NOTA 18
```

```
VENCIMENTO DATA DE VENCIMENTO DO TÍTULO 055 060 9(06) DDMMAA
```

```
ESPÉCIE ESPÉCIE DO TÍTULO 061 062 X(02) NOTA 10
```

```
ACEITE IDENTIFICAÇÃO DE TÍTULO ACEITO OU NÃO ACEITO 063 063 X(01)
```

```
A=SIM
N=NÃO
```

```
DATA DE EMISSÃO DATA DE EMISSÃO DO TÍTULO 064 069 9(06) DDMMAA
```

CÓD. DE INSCRIÇÃO IDENTIFICAÇÃO DO TIPO DE INSCRIÇÃO DO PAGADOR 070 071 9(02) (^) 01=CPF 02=CNPJ
Nº DE INSCRIÇÃO NÚMERO DE INSCRIÇÃO DO PAGADOR 072 086 9(15) CPF OU CNPJ
NOME NOME DO PAGADOR 087 116 X(30)
BRANCOS COMPLEMENTO DO REGISTRO 117 125 X(09)
LOGRADOURO RUA, NÚMERO E COMPLEMENTO DO PAGADOR 126 165 X(40)
BAIRRO BAIRRO DO PAGADOR 166 177 X(12)
CEP CÓDIGO DE ENDEREÇAMENTO POSTAL DO PAGADOR 178 185 9(08)
CIDADE CIDADE DO PAGADOR 186 200 X(15)
ESTADO ESTADO (UF - UNIDADE DA FEDERAÇÃO) DO PAGADOR 201 202 X(02)
SACADOR/AVALISTA NOME DO SACADOR/AVALISTA 203 232 X(30)
BRANCOS COMPLEMENTO DE REGISTRO 233 236 X(04)
LOCAL DE PGTO 1 LOCAL PARA PAGAMENTO DO TÍTULO - LINHA 1 237 291 X(55) NOTA 25
LOCAL DE PGTO 2 LOCAL PARA PAGAMENTO DO TÍTULO - LINHA 2 292 346 X(55) NOTA 25
CÓD. DE INSCRIÇÃO. IDENTIF. TIPO DE INSCRIÇÃO DO SACADOR/AVALISTA 347 348 9(02) 01=CPF 02=CNPJ
Nº DE INSCRIÇÃO NÚMERO DE INSCRIÇÃO DO SACADOR/AVALISTA 349 363 9(15)
BRANCOS COMPLEMENTO DO REGISTRO 364 394 X(31)
NÚM. SEQÜENCIAL NÚMERO SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400 9(06)
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA
(*) Para títulos em moeda variável o valor deverá ser informado na picture 9(08)V9(05).

```
ARQUIVO REMESSA REGISTRO EMISSÃO DE BOLETO TAMANHO DO REGISTRO = 400 BYTES
```

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

```
TIPO DO REGISTRO IDENTIFICAÇÃO DO REGISTRO 001 001 9(01) 6
```

```
CÓDIGO DO LAYOUT IDENTIFICAÇÃO DO LAYOUT PARA O REGISTRO 002 002 9(01) 2
```

LINHA 1 (^) CONTEÚDO DA 1ª LINHA DE IMPRESSÃO DA ÁREA "INSTRUÇÕES”
DO BOLETO
003 071 X(69) NOTA 26
LINHA 2 (^) CONTEÚDO DA 2ª LINHA DE IMPRESSÃO DA ÁREA "INSTRUÇÕES"
DO BOLETO
072 140 X(69) NOTA 26
LINHA 3 (^) CONTEÚDO DA 3ª LINHA DE IMPRESSÃO DA ÁREA "INSTRUÇÕES"
DO BOLETO
141 209 X(69) NOTA 26
LINHA 4 (^) CONTEÚDO DA 4ª LINHA DE IMPRESSÃO DA ÁREA "INSTRUÇÕES"
DO BOLETO
210 278 X(69) NOTA 26
LINHA 5 (^) CONTEÚDO DA 5ª LINHA DE IMPRESSÃO DA ÁREA "INSTRUÇÕES"
DO BOLETO
279 347 X(69) NOTA 26
BRANCOS COMPLEMENTO DO REGISTRO 348 394 X(47)
NÚMERO SEQÜENCIAL NÚMERO SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400 9(06)
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA
ARQUIVO REMESSA REGISTRO EMISSÃO DE BOLETO TAMANHO DO REGISTRO = 400 BYTES
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
TIPO DO REGISTRO IDENTIFICAÇÃO DO REGISTRO 001 001 9(01) 6
CÓDIGO DO LAYOUT IDENTIFICAÇÃO DO LAYOUT PARA O REGISTRO 002 002 9(01) 3
LINHA 6 CONTEÚDO DA 6ª LINHA DE IMPRESSÃO DA ÁREA "INSTRUÇÕES"
DO BOLETO
003 071 X(69) NOTA 26
LINHA 7 CONTEÚDO DA 7ª LINHA DE IMPRESSÃO DA ÁREA "INSTRUÇÕES"
DO BOLETO
072 140 X(69) NOTA 26
LINHA 8 CONTEÚDO DA 8ª LINHA DE IMPRESSÃO DA ÁREA "INSTRUÇÕES"
DO BOLETO
141 209 X(69) NOTA 26
LINHA 9 CONTEÚDO DA 9ª LINHA DE IMPRESSÃO DA ÁREA "INSTRUÇÕES"
DO BOLETO
210 278 X(69) NOTA 26
BRANCOS COMPLEMENTO DO REGISTRO 279 394 X(116)
NÚMERO SEQÜENCIAL NÚMERO SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400 9(06)
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA
ARQUIVO REMESSA REGISTRO EMISSÃO DE BOLETO TAMANHO DO REGISTRO = 400 BYTES
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
TIPO DO REGISTRO IDENTIFICAÇÃO DO REGISTRO 001 001 9(01) 6
CÓDIGO DO LAYOUT IDENTIFICAÇÃO DO LAYOUT PARA O REGISTRO 002 002 9(01) 4
CÓDIGO DE INSCRIÇÃO IDENTIFICAÇÃO DO TIPO DE INSCRIÇÃO DO SACADO/AVALISTA 003 004 9(002) 01 – CPF
02 - CNPJ

###### NÚMERO DE INSCRIÇÃO NÚMERO DE INSCRIÇÃO DO SACADOR / AVALISTA 005 018 9(014)

```
LOGRADOURO RUA, NÚMERO E COMPLEMENTO DO SACADOR / AVALISTA 019 058 X(040)
```

```
BAIRRO BAIRRO DO SACADOR/AVALISTA 059 070 X(012)
```

###### CEP CÓDIGO DE ENDEREÇAMENTO POSTAL DO SA CADOR/AVALISTA 071 078 9(008)

```
CIDADE CIDADE DO SACADOR/AVALISTA 079 093 X(015)
```

```
ESTADO ESTADO (UF-UNIDADE DA FEDERAÇÃO) DO SACADOR/AVALISTA 094 095 X(002)
```

```
BRANCOS COMPLEMENTAÇÃO DO REGISTRO 096 394 X(299)
```

```
NÚMERO SEQÜENCIAL NÚMERO SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400 9(006)
```

```
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA
```

```
ARQUIVO REMESSA REGISTRO TRAILER DE ARQUIVO TAMANHO DO REGISTRO = 400 BYTES
```

```
NOME DO CAMPO SIGNIFICADO POSIÇÃO PICTURE CONTEÚDO
```

TIPO DE REGISTRO IDENTIFICAÇÃO DO REGISTRO TRAILER 001 001 9(01) 9

BRANCOS COMPLEMENTO DO REGISTRO 002 394 X(393)

NÚMERO SEQÜENCIAL (^) NÚMERO SEQÜENCIAL DO REGISTRO NO ARQUIVO 395 400 9(06)
X = ALFANUMÉRICO 9 = NUMÉRICO V = VÍRGULA DECIMAL ASSUMIDA

### 9. Anexo C

A Cobrança Mensagem destina-se às empresas que necessitam enviar informações específicas do seu ramo

de atividade aos pagadores.

Este manual esclarece tecnicamente o Intercâmbio Eletrônico de Arquivos de cobrança e estabelece as

condições básicas para sua utilização.

#### 9. 1 – Modelos de cobrança mensagem

#### 9. 1 .1 – Modelos de boleto

#### 9. 1 .1.1 – Modelo 1 – Frente (Modelo livre)

#### 9. 1 .1.2 - Modelo 1 – Frente com grade para desenvolvimento

#### (Modelo livre)

Os dados do recibo do pagador deverão ser informados no arquivo (registro tipo 7).

#### 9. 1 .1.3 - Modelo 1 – Verso (Modelo livre)

#### 9. 1 .2.1 - Modelo 2 – Frente (Modelo com recibo do pagador)

#### 9. 1 .2.2 - Modelo 2 - Frente com grade para desenvolvimento

#### (Modelo com recibo do pagador)

Os dados do recibo do pagador deverão ser informados no arquivo (registro tipo 7).

#### 9. 1 .2.3 - Modelo 2 – Verso (Modelo com recibo do pagador)

#### 9. 1 .3.1 - Modelo 3 (Modelo consórcio)

#### 9. 1 .3.2 - Modelo 3 - Frente com grade para desenvolvimento

#### (Modelo consórcio)

Os dados do recibo do pagador deverão ser informados no arquivo (registro tipo 7).

#### 9. 1 .3.3 - Modelo 3 – Verso (Modelo consórcio)

#### 9. 1 .3.4 - Modelo 3 – Verso com grade para desenvolvimento

#### (Modelo consórcio)

#### 9. 1 .4.1 - Modelo 4 (Modelo condomínio)

#### 9. 1 .4.2 - Modelo 4 - Frente com grade para desenvolvimento

#### (Modelo condomínio)

Os dados do recibo do pagador deverão ser informados no arquivo (registro tipo 7).

#### 9. 1 .4.3 - Modelo 4 - Verso com grade para desenvolvimento

#### (Modelo condomínio)

#### 9. 1 .5.1 - Modelo 5 (Modelo com recibo do pagador e

#### contorno mensagem livre)

#### 9. 1 .5.2 - Modelo 5 - Frente com grade para desenvolvimento

#### (Modelo com recibo do pagador e contorno mensagem

#### livre)

Os dados do recibo do pagador deverão ser informados no arquivo (registro tipo 7).

#### 9. 1 .5.3 - Modelo 5 - Verso com grade para desenvolvimento

#### (Modelo com recibo do pagador e contorno mensagem

#### livre)

#### 9. 1 .6.1- Modelo 6 (Modelo propaganda com imagem)

Importante: Neste modelo, o Recibo do Pagador será preenchido automaticamente pelo banco.

#### 9. 1 .6.2 - Modelo 6 – Verso (Modelo propaganda com

#### imagem)
