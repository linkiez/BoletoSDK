## Intercâmbio de Informações entre Empresas

# Layout de Arquivos

# Cobrança Bancária

# Padrão CNAB 400 Posições

## Versão 2

## Julho 2025

```
Atendimento 24 horas, 7 dias por semana
Capital e Regiões Metropolitanas: 3003 6116
Demais Localidades: 0800 660 6116
Acesse pelo Celular no Chat do App
Whatsapp: 11 2831 6088
SAC (24 horas, 7 dias por semana): 0800 660 0060
Ouvidoria (Segunda a Sexta, exceto feriados, das 09 às 18 hrs): 0800 660 6060
```

         - 1. Introdução..............................................................................................
         - 2. Funcionamento ......................................................................................
      - 3. Implantação ...........................................................................................

- 4. Estrutura do Arquivo ................................................................................
  - 5. Arquivo Remessa ....................................................................................
    - 5.1 Registro do Tipo Header do Arquivo de Remessa ....................................
    - 5.2 Registro do Tipo Detalhe Arquivo de Remessa ......................................
    - 1. Arquivo Retorno ....................................................................................
    - 6.1 Registro do Tipo Header do Arquivo de Retorno ....................................
      - 6.2 Registro do Tipo Detalhe do Arquivo de Retorno ...................................
    - 6.3 Registro do Tipo Trailer ........................................................................
      - 7. Caracteres Válidos ...............................................................................
    - 1. Notas ...................................................................................................
    - 1. Código de Barras e Linha Digitável .........................................................
  - 9.1 Formatação do Código de Barras na Ficha de Compensação ................
  - 9.2 Formatação da Linha Digitável na Ficha de Compensação ....................
  - 9.3 Logo C6Bank para inserir no boleto: .....................................................
  - 9.4 Modelo do Boleto ................................................................................
  - 1. Cálculos .............................................................................................
- 10.1 Cálculo do Dígito Verificador do Código de Barras ...............................
- 10.2 Cálculo do Dígito Verificador Linha Digitável .......................................
- 10.3 Cálculo do Fator de Vencimento .........................................................
  - 10.4 Cálculo do Dígito do Nosso Número ...................................................
  - 1. Eventos de Alteração de Outros Dados .................................................

Seja bem-vindo ao C6Empresas!

Estedocumento define olayout no padrãoC 6 BANK para

troca de arquivos de remessa e retorno de títulos de

cobrança entre Beneficiário e Instituição Financeira. Nele,

serãotratadas duasmodalidades decobrança detítulos –

**Cobrança Emissão Banco e Cobrança Emissão**

**Cliente** – cujas particularidades estão oportunamente

citadas.

O processo de Troca de Arquivos consiste no envio do

arquivo de REMESSA para o Banco via Web Banking

contendo os dados do título para registro e/ou

alterações/instruções.

Apósatransmissãodoarquivo, o(s)título(s)aceito(s)pelo

sistema ficam disponíveis para consulta no APP ou no

WebBanking.

Em D+ 1 o sistema do Banco gera o arquivo RETORNO

com o resultado do processamento do Arquivo de

Remessa,acrescidosdasliquidaçõesdodiaanterior.

PassoaPasso

1 - Seugerentedecontafaraocadastrodoseusdadosnaplataforma,paraissoseránecessárioque

vocêtenhaocontatodoseuERPoudesenvolvedorpróprio

2 - VocêreceberáoWelcomeKitcompostode:

- OrientaçõesGerais;
- LayoutC 6 CNAB 400 ;
- PlanilhaauxiliarparaCálculodoNossoNúmero.

3 - SeuERPoudesenvolvedorprópriogeraoarquivoremessaquedeverásertransmitidonoseuWeb

Bankingnaabatrocadearquivos.

Nessaetapacasoexistacríticaestruturalnoarquivoseráapresentadoerroemtela.

4 - Seuarquivoretornoestarádisponíveldentrode 24 hnoseuWebBankingnaabatrocadearquivos.

Casooprocessamentodoarquivoapresenteproblemasnossotimedeespecializadasanalisamdentro

de 48 h,orientandooscamposparacorreção.Realizeascorreçõesegereumnovoarquivo.Processo

somenteseráconcluídocomacompletavalidaçãodoarquivoeinclusãosemerrosapontados.

**Importante:Nossomodelodeimplantaçãoé“TesteemProdução”atravésdetrocadearquivos,ouseja,todos
ostítulosaceitospassamacomporacarteiradeCobrançadaempresa.Casootítulonãosejautilizadopara
nenhumoutroteste,providenciarabaixa.**

**Linha Código do Registro Obrigatório**

```
Registro Tipo Header 0 Sim
```

```
Registro Tipo Detalhe 1 Sim
```

```
Registro Tipo Detalhe Opcional 2 Não
```

```
Registro Tipo Trailer 9 Sim
```

O arquivo possui a seguinte estrutura:

**Estrutura do Arquivo**

**Campo Descrição Campo Início Fim Tam Tipo Conteúdo Observações**

```
1 Tipo de Registro 1 1 1 Num “ 0 ” Campo Fixo
2 Código de Remessa 2 2 1 Num “ 1 ” Campo Fixo
3 Literal Remessa 3 9 7 Ala “ REMESSA ” Campo Fixo
4 Código do Serviço 10 11 2 Num “ 01 ” Campo Fixo
5 Literal do Serviço 12 19 8 Alfa “ COBRANCA ” Campo Fixo
6 Uso do Banco 20 26 7 Alfa “Brancos"
```

```
7 Código do Beneficiário 27 38 12 Num
```

```
Código do
Cedente
```

```
Código informado pelo Banco,
complementarcomzerosaesquerda
8 Uso do Banco 39 46 8 Alfa “Brancos”
9 Nome do Beneficiário 47 76 30 Alfa Razão Social Razão Social do Beneficiário
10 Código do Banco 77 79 3 Num “ 336 ” Campo Fixo
11 Uso do Banco 80 94 15 Alfa “Brancos”
12 Data de Gravação 95 100 6 Num “DDMMAA” Igual ou menor que D
13 Uso do Banco 101 108 8 Alfa “Brancos”
```

```
14 Conta Cobrança 109 120 12 Num Conta
Cobrança
```

```
Código informado pelo Banco,
complementarcomzerosaesquerda
15 Uso do Banco 121 386 266 Alfa “Brancos”
```

```
16 Sequencial da Remessa 387 394 8 Num
```

```
Sequencial do
Arquivo
```

```
17
```

```
Número Sequencial do
Registro
```

```
395 400 6 Num “ 000001 ” Cada linha incrementa 1 número
```

Registro do Tipo Header do Arquivo de Remessa

**Arquivo Remessa**

Registro do Tipo Detalhe Arquivo de Remessa

```
Campo Descrição Campo Início Fim Tam Tipo Conteúdo Observações
18 Tipo de Registro 1 1 1 Num “ 1 ” Campo Fixo
19 Tipo de Inscrição 2 3 2 Num “ 02 ” Campo Fixo
20 Identificação do Beneficiário 4 17 14 Num “00000000000000” CNPJ do Beneficiário
```

```
21 Código do Beneficiário 18 29 12 Num
```

```
“Zeros+Código
doCedente”
```

```
Código informado pelo Banco, complementar com
zerosaesquerda
22 Uso do Banco 30 37 8 Alfa “Brancos”
```

```
23 Uso Exclusivo 38 62 25 Alfa
```

```
Campo de controle da empresa, não há crítica nas
informações. Banco devolve as informações deste
campo no arquivo retorno
```

```
24 Nosso Número do Título 63 73 11 Num
```

```
ParaCarteira 10 deixarocampoemBRANCO;
```

```
Para Carteira 20 preencher com DEZ posições
conforme indicado: 0NNNNNNNNNN
25 Digito do Nosso Número 74 74 1 Num Verificar modelo de cálculo
26 Uso do Banco 75 82 8 Alfa “Brancos”
27 Código do Banco 83 85 3 Num “ 336 ” Campo Fixo
28 Uso do Banco 86 106 21 Alfa “Brancos”
```

```
29 Código da Carteira 107 108 2 Num
```

```
Carteira 10 :CobrançaSimplesEmissãoBanco;
```

```
Carteira 20 :CobrançaSimplesEmissãoCliente;
30 Código de Ocorrência 109 110 2 Num Verificar Nota 1
31 Seu Número do Título 111 120 10 Alfa Emcasodeparcelas indicaronúmerodecontrole
maisaidentificaçãodaparcela.
32 Data de Vencimento 121 126 6 Num “DDMMAA”
```

```
33 Valor do Título 127 139 13 Num
```

```
Preencher no formato 99 v 99 , ou seja, as duas
últimascasassãoconsideradasdecimais;
34 Uso do Banco 140 147 8 Alfa “Brancos”
35 Espécie do Título 148 149 2 Alfa Verificar Nota 2
```

**Arquivo Remessa**

36 Aceite 150 150 1 Alfa

“ **A** ” = Aceite ou
“ **N** ” = Não Aceite
37 Data de Emissão do Título 151 156 6 Num “DDMMAA” Igual ou menor que D
38 Instrução 1 157 158 2 Num Preencher com zeros
39 Instrução 2 159 160 2 Num Preencher com zeros

40 Juros ao Dia 161 173 13 Num

Preencher no formato 99 v 99 , ou seja, as duas
últimascasassãoconsideradasdecimais;
41 Data para Desconto 1 174 179 6 Num “DDMMAA” Verificar Nota 3

42 Valor para Desconto 1 180 192 13 Num

Preencher no formato 99 v 99 , ou seja, as duas
últimascasassãoconsideradasdecimais;
43 Data da Multa 193 198 6 Num “DDMMAA” Verificar Nota 4
44 Uso do Banco 199 205 7 Alfa “Brancos”

45 Valor do Abatimento 206 218 13 Num

```
Preencher no formato 99 v 99 , ou seja, as duas
últimas casas são consideradas decimais;
Observação:Quandodoenviodeduasoumais
instruções de Abatimento, independente de
dataouvalor,osistemairáSOMARosvalores.
```

46 Tipo do Pagador 219 220 02 Num

### “ 01 ” = CPF

### “ 02 ” = CNPJ

47 CPF/CNPJ do Pagador 221 234 14 Num “00000000000000”

Todo o campo deve ser preenchido. Caso o
pagador seja Pessoa Física, completar o campo
comZerosaEsquerda
48 Nome do Pagador 235 274 40 Alfa
49 Endereço do Pagador 275 314 40 Alfa
50 Bairro do Pagador 315 326 12 Alfa
51 CEP do Pagador 327 334 8 Num “00000000” Não informar caractere especial
52 Cidade do Pagador 335 349 15 Alfa
53 UF do Pagador 350 351 2 Alfa Verificar Nota 5
54 Beneficiário Final/Mensagem 352 381 30 Alfa Verificar Nota 6

55 Indicador de Multa 382 382 1 Num

```
“ 0 ” = Sem Multa
“ 2 ” = Percentual
```

56 Percentual de Multa 383 384 2 Num Informar valores inteiros entre 01 e 99
57 Uso do Banco 385 385 1 Alfa “Brancos”
58 Data dos Juros 386 391 6 Num “DDMMAA”
59 Uso do Banco 392 393 2 Alfa “Brancos”
60 Uso do Banco 394 394 1 Alfa “Brancos”
61 Número Sequencial do Registro 395 400 6 Num

Registro do Tipo Detalhe do Arquivo de Remessa –Campos Opcionais

**Campo Descrição Campo Início Fim Tam Tipo Conteúdo Observações**

```
62 Tipo do Beneficiário Final 401 402 2 Num “ 02 ” Campo Fixo
```

```
63 CNPJ do Beneficiário Final 403 416 14 Num “00000000000000”
```

```
Camposreferenteao Beneficiário Final; ao utilizar
este campo todas as posições devem ser
preenchidas( 401 a 521 ). Onãopreenchimentode
umdoscamposacarretaráarecusadoregistrodo
título.
64 Nome do Beneficiário Final 417 456 40 Alfa
65 Endereço do Beneficiário Final 457 496 50 Alfa
66 Cidade do Beneficiário Final 497 511 15 Alfa
67 UF do Beneficiário Final 512 513 2 Alfa
68 CEP do Beneficiário Final 514 521 8 Num
69 E-mail do Beneficiário Final 522 641 120 Alfa
70 Data do Desconto 2 642 647 6 Num “DDMMAA” Verificar Nota 3
71 Valor do Desconto 2 648 660 13 Num
```

```
Preencher no formato 99 v 99 , ou seja, as duas
últimascasassãoconsideradasdecimais;
72 Data do Desconto 3 661 666 6 Num “DDMMAA” VerificarNota 3
73 Valor do Desconto 3 667 679 13 Num
```

```
Preencher no formato 99 v 99 , ou seja, as duas
últimascasassãoconsideradasdecimais;
```

```
74
```

```
Indicativode Tipo de Autorização
para Recebimento de Valor
Divergente
```

```
680 680 1 Alfa Verificar Notas 07 a 11
```

### 75

```
Indicativo de Valor ou Percentual
paraoRangeMínimoeMáximode
AceitaçãodoPagamento
```

```
681 681 1 Alfa Verificar Notas 07 a 11
```

### 76

```
Valor ou Percentual Mínimo para
AceitaçãodoPagamento^68269413 Num Verificar Notas 07 a 11
77 Valor ou Percentual Máximo para
AceitaçãodoPagamento
```

```
695 707 13 Num Verificar Notas 07 a 11
78 Uso do Banco 708 708 1 Alfa “Brancos”
```

```
79
```

```
Quantidade de Pagamentos
ParciaisAceito^7097102 Num Verificar Notas 07 a 11
```

**Arquivo Remessa**

Registro Opcional do Arquivo de Remessa -Detalhe

```
Campo Descrição Campo Início Fim Tam Tipo Conteúdo Observações
80 Tipo de Registro 1 1 1 Num “ 2 ” Campo Fixo
81 Mensagem 1 2 81 80 Alfa Não inserir caracter especial. Vide tabela de caracteres aceitos
82 Mensagem 2 82 161 80 Alfa Não inserir caracter especial. Vide tabela de caracteres aceitos
83 Mensagem 3 162 241 80 Alfa Não inserir caracter especial. Vide tabela de caracteres aceitos
84 Mensagem 4 242 321 80 Alfa Não inserir caracter especial. Vide tabela de caracteres aceitos
85 Uso do Banco 322 365 44 Alfa “Brancos”
86 Seu Número do Título 366 375 10 Alfa Emidentificaçãocaso dedaparcelasparcela.indicar onúmero de controle mais a
87 Data de Vencimento 376 381 6 Num “DDMMAA”
88 Valor do Título 382 394 14 Num Preenchersãoconsideradasnoformatodecimais^99 v;^99 ,ouseja,asduas últimascasas
89 Número Sequencial do Registro 395 400 6 Num
```

Arquivo Remessa Registro do Tipo Trailer

```
Campo Descrição Campo Início Fim Tam Tipo Conteúdo Observações
90 Tipo de Registro 1 1 1 Num “ 9 ” Campo Fixo
91 Uso do Banco 2 394 393 Alfa “Brancos”
92 Número Sequencial do Registro 395 400 6 Num
```

**Arquivo Remessa**

Arquivo Retorno

Registro do Tipo Header do Arquivo de Retorno

```
Campo Descrição Campo Início Fim Tam Tipo Conteúdo Observações
93 Tipo de Registro 1 1 1 Num “ 0 ” Campo Fixo
94 Código de Retorno 2 2 1 Num “ 2 ” Campo Fixo
95 Literal de Retorno 3 9 7 Alfa “ RETORNO ” Campo Fixo
96 Código de Serviço 10 11 2 Num “ 01 ” Campo Fixo
97 Literal de Serviço 12 19 8 A “ COBRANCA ” Campo Fixo
98 Uso do Banco 20 21 2 Alfa
99 Contador do Arquivo 22 26 5 Num Número sequencial do arquivo retorno
100 Conta Cobrança 27 38 12 Num Código informado pelo Banco com zeros a esquerda
101 Código do Cedente 39 50 12 Num Código informado pelo Banco com zeros a esquerda
102 Uso do Banco 51 76 26 Alfa “Brancos”
103 Código do Banco 77 79 3 Num “ 336 ” Campo Fixo
104 Nome do Banco 80 104 25 Alfa “ C6 ” Campo Fixo
105 Uso do Banco 105 108 4 Alfa “Brancos”
```

```
106 Conta de Cobrança Cobrança 109 120 12 Num “000100000002”
```

```
Utilizadoapenasno arquivo retornode entradade
títulos,CampoFixo
107 Uso do Banco 121 124 4 Alfa “Brancos”
108 Data do Movimento 125 130 6 Num “DDMMAA”
109 Uso do Banco 131 394 264 Alfa “Brancos”
110 Número Sequencial do Registro 395 400 6 Num “ 000001 ”
```

Registro do Tipo Detalhe do Arquivo de Retorno

Arquivo Retorno

**Campo Descrição Campo Início Fim Tam Tipo Conteúdo Observações**

```
111 Tipo de Registro 1 1 1 Num “ 1 ” Campo Fixo
112 Tipo de Inscrição Empresa 2 3 2 Num “ 02 ” Campo Fixo
113 CNPJ do Beneficiário 4 17 14 Num “00000000000000”
114 Código da Beneficiário 18 29 12 Num CNPJ do Beneficiário
115 Uso do Banco 30 37 8 Alfa “Brancos”
116 Uso Exclusivo do Beneficiário 38 62 25 Alfa
```

```
117 Nosso Número do Título 63 73 11 Num
```

```
Para Carteira 10 o Banco cria o Nosso Número e
retornaaocliente;ParaCarteira 20 oBancodevolveo
NossoNúmeroinformadonoarquivoderemessa.
118 Dígito do Nosso Número 74 74 1 Num
119 Nosso Número Complementar 75 86 12 Num Nota 25
120 Uso do Banco 87 106 20 Alfa “Brancos”
121 Código da Carteira 107 108 2 Num
122 Código de Ocorrência Retorno 109 110 2 Num Nota 12
123 Data da Ocorrência 111 116 6 Num “DDMMAA”
124 Seu Número Título 117 126 10 Alfa
125 Uso do Banco 127 146 20 Alfa “Brancos”
126 Data de Vencimento 147 152 6 Num “DDMMAA”
```

```
127 Valor do Título 153 165 13 Num
```

```
Formato 99 v 99 , ou seja, asduas últimas casas são
consideradasdecimais;
128 Banco Cobrador 166 168 3 Num “ 336 ”
129 Agência Cobradora 169 173 5 Num
130 Uso do Banco 174 175 2 Alfa “Brancos”
```

131 Valor da Tarifa / Custas
de Cobrança

```
176 188 13 Num Formato^99 v^99 ,ouseja,asduasúltimascasassão
consideradasdecimais;
```

132 Uso do Banco 189 227 39 Num “Brancos”

133 Valor do Abatimento 228 240 13 Num

```
Formato 99 v 99 ,ouseja,asduasúltimascasassão
consideradasdecimais;
```

134 Valor do Desconto 241 253 13 Num

```
Formato 99 v 99 ,ouseja,asduasúltimascasassão
consideradasdecimais;
```

135 Valor Principal 254 266 13 Num Formato^99 v^99 ,ouseja,asduasúltimascasassão
consideradasdecimais;

136 Valor dos Juros 267 279 13 Num

```
Formato 99 v 99 ,ouseja,asduasúltimascasassão
consideradasdecimais;
```

137 Valor de Outros Acréscimos 280 292 13 Num

```
Formato 99 v 99 ,ouseja,asduasúltimascasassão
consideradasdecimais;
```

138 Uso do Banco 293 294 2 Alfa “Brancos”

139 Uso do Banco 295 295 1 Alfa “Brancos”

140 Data do Crédito 296 301 6 Num “DDMMAA”

141 Uso do Banco 302 365 64 Alfa “Brancos”

142 Campos Inválidos 366 377 12 Num

```
Refere-se a posição do arquivo remessa que está
incorreto e/ou inválido (primeira coluna da tabela:
Campo )
```

143 Código da Recusa 378 393 16 Num Nota 13

144 Uso do Banco 394 394 1 Alfa “Brancos”

145 Número Sequencial do Registro 395 400 6 Num

Registro do Tipo Trailer

Arquivo Retorno

```
Campo Descrição Campo Início Fim Tam Tipo Conteúdo Observações
146 Tipo de Registro 1 1 1 N “ 9 ” Campo Fixo
147 Uso do Banco 2 2 1 Alfa “Brancos”
148 Valor Total da Carteira 3 16 14 Num Formatoconsideradas^99 v^99 decimais, ou;seja, as duas últimas casas são
149 Quantidade Total de Títulos na Carteira 17 22 6 Num
150 Valor Total de Liquidações 23 36 14 Num Formatoconsideradas^99 v^99 decimais, ou;seja, as duas últimas casas são
151 QuantidadeTotaldeTítulosLiquidados 37 42 6 Num
152 Uso do Banco 43 394 352 Alfa “Brancos”
153 Número Sequencial do Registro 395 400 6 Num
```

**Caracteres Válidos**

Segue tabela com os caracteres aceitos pelo nosso sistema. Qualquer caractere inserido no arquivo

diferentedosinformadosabaixoiráacarretararejeiçãocorrespondenteaocampoemquefoiutilizado.

```
Caractere Descrição Caractere Descrição Caractere Descrição Caractere Descrição
A A MAIÚSCULO B B MAIÚSCULO C C MAIÚSCULO D D MAIÚSCULO
```

```
E E MAIÚSCULO F F MAIÚSCULO G G MAIÚSCULO H H MAIÚSCULO
I I MAIÚSCULO J J MAIÚSCULO K K MAIÚSCULO L L MAIÚSCULO
M M MAIÚSCULO N N MAIÚSCULO O O MAIÚSCULO P P MAIÚSCULO
```

```
Q Q MAIÚSCULO R R MAIÚSCULO S S MAIÚSCULO T T MAIÚSCULO
```

```
U U MAIÚSCULO V V MAIÚSCULO W W MAIÚSCULO X X MAIÚSCULO
Y Y MAIÚSCULO Z Z MAIÚSCULO a a minúsculo b b minúsculo
c c minúsculo d d minúsculo e e minúsculo f f minúsculo
g g minúsculo h h minúsculo i i minúsculo j j minúsculo
k k minúsculo l l minúsculo m m minúsculo n n minúsculo
o o minúsculo p p minúsculo q q minúsculo r r minúsculo
s s minúsculo t t minúsculo u u minúsculo v v minúsculo
w w minúsculo x x minúsculo y y minúsculo z z minúsculo
0 Zero 1 Um 2 Dois 3 Três
4 Quatro 5 Cinco 6 Seis 7 Sete
8 Oito 9 Nove Espaço! Exclamação
@ Arroba # Numeral $ Dólar % Porcentagem
& “E” Comercial * Asterisco ( Abre Parênteses )
```

```
Fecha
Parênteses
```

- Hífen _ Underline + Sina de Soma = Sinal de Igual
[ Abre Colchete ] Fecha Colchete { Abre Chave } Fecha Chave
, Vírgula. Ponto < Sinal de Menor > Sinal de Maior
; Ponto e Vírgula : Dois Pontos / Barra de Divisão \ Barra Invertida
? Interrogação | Barra Vertical 19

Notas

- Nota 1 :CódigodeOcorrênciaRemessaedeveserpreenchidoconformeindicaçãoabaixo:

```
01 – Remessa
02 – Pedido de Baixa
04 – Concessão de Abatimento
05 – Cancelamento de Abatimento
06 – Alteração de Vencimento
07 – Troca Uso Empresa (Uso do Banco)
31 – Alteração de Outros Dados
90 – Troca de Emitente
```

- Nota 2 :EspéciedoTítuloedeveserpreenchidoconformeindicaçãoabaixo:

```
01 - Duplicata Mercantil (DM)
02 - Duplicata de Serviço (DS)
03 - Nota Promissória
04 - Nota de Seguro
05 - Recibo
06 - Letra de Câmbio
07 - Ficha de Compensação
08 - Carnê
09 - Contrato
10 - Cheque
11 - Cobrança Seriada
12 - Mensalidade Escolar
13 - Nota de Débito
15 - Documento de Dívida
16 - Encargos Condominiais
17 - Conta de Prestação de Serviços
33 - Boleto Aporte
99 – Outros
```

**Espécies que permitem Protesto: 01 (Duplicata Mercantil) e 02 (Duplicata de Serviço), demais não permitem.**^20

- Nota 3 : InformaçãodoDesconto 1 :Regra:SeinformarumaDataparaDescontonaposição 174 a 179 ,obrigatoriamentedeveráinformaroValorde
    Descontonaposição 180 a 192 ;sepreencherumcampoeooutronãoacarretaráarecusadoregistrodotítulo.Oupreencheosdoiscamposcomdados
    válidosecompatíveisoudeixá-loszerado.
- Nota 4 :DataparaCobrançadaMulta:Deveserigualoumaiorqueadatadevencimento,acritériodaempresa.
- Nota 5 :InseriraUFdoEstado,ouocódigocorrespondente,conformetabelaabaixo:

```
Código do Estado Nome do Estado UF do Estado Código do Estado Nome do Estado UF do Estado
11 RONDÔNIA RO 12 ACRE AC
13 AMAZONAS AM 14 RORAIMA RR
15 PARÁ PA 16 AMAPÁ AP
17 TOCANTINS TO 21 MARANHÃO MA
22 PIAUÍ PI 23 CEARÁ CE
24 RIOGRANDEDONORTE RN 25 PARAÍBA PB
26 PERNANMBUCO PE 27 ALAGOAS AL
28 SERGIPE SE 29 BAHIA BA
31 MINASGERAIS MG 32 ESPÍRITOSANTO ES
33 RIODEJANEIRO RJ 35 SÃOPAULO SP
41 PARANÁ PR 42 SANTACATARINA SC
43 RIOGRANDEDOSUL RS 50 MATOGROSSODOSUL MS
51 MATOGROSSO MT 52 GOIÁS GO
53 DISTRITOFEDERAL DF
```

- Nota 6 :Campoquepossuiduasatribuições:

1. Beneficiário Final: PreenchercomonomedoBeneficiárioFinaldotítulo. Indicadoparaempresasqueoperamcomduplicadasnegociadase/ou
    empresasdefactorings.
2. Mensagem:OBeneficiáriopoderáenviarumamensagemvariáveldenomáximo 30 caracteres.EssamensagemseráimpressanoBoleto;

- Nota 07 :IndicativodetipodeAutorizaçãoparaRecebimentodevalordivergente.Seguirtabelaabaixo:

1. Aceita Qualquer Valor;
2. Aceita Qualquer Valor entre o Mínimo e o Máximo;
3. Não Aceita Pagamento com Valor Divergente;
4. Aceita Qualquer valor a partir do Mínimo.

- ATENÇÃO: IndependentedaseleçãorealizadanoCampo IndicativodeTipodeAutorizaçãoparaRecebimentodeValorDivergente,observarasregras
    abaixoparapreenchimentodosdemaiscampos;

### PARA ESPÉCIE DO TÍTULO IGUAL A 31

```
o Nota 08 :Posição 681 a 681 (AtribuiçãodeValorouPercentualparaoValorMínimoeMáximo):EmBranco;
o Nota 09 :Posição 682 a 694 (AtribuiçãodoValorouPercentualMínimo):ValorMínimo=R$ 0 , 01 ;
o Nota 10 :Posição 695 a 707 (AtribuiçãoouPercentualMáximo):ValorMáximo=ValordoTítulo;
o Nota 11 :Posição 709 a 710 (QuantidadedePagamentosParciais):Informardentrodointervalorde 01 a 99 ;
```

### PARA ESPÉCIE DO TÍTULO DIFERENTE DE 31

```
SeoCampoIndicativodeTipodeAutorizaçãodeRecebimentodeValorDivergenteforigual= 1
```

```
o Nota 08 :Posição 681 a 681 (AtribuiçãodeValorouPercentualparaoValorMínimoeMáximo):EmBranco;
o Nota 09 :Posição 682 a 694 (AtribuiçãodoValorouPercentualMínimo):EmBranco;
o Nota 10 :Posição 695 a 707 (AtribuiçãoouPercentualMáximo):EmBranco;
o Nota 11 :Posição 709 a 710 (QuantidadedePagamentosParciais):Informardentrodointervalorde 01 a 99 ;
```

```
SeoCampoIndicativodeTipodeAutorizaçãodeRecebimentodeValorDivergenteforigual= 2
```

o Nota 08 :Posição 681 a 681 (AtribuiçãodeValorouPercentualparaoValorMínimoeMáximo):InformarPercentualouValor;
o Nota 09 :Posição 682 a 694 (AtribuiçãodoValorouPercentualMínimo):ValorMínimo=R$ 0 , 01 ;
o Nota 10 :Posição 695 a 707 (AtribuiçãoouPercentualMáximo):ValorMáximo=ValordoTítulo;
o Nota 11 :Posição 709 a 710 (QuantidadedePagamentosParciais):Informardentrodointervalorde 01 a 99 ;

```
SeoCampoIndicativodeTipodeAutorizaçãodeRecebimentodeValorDivergenteforigual= 3
```

o Nota 08 :Posição 681 a 681 (AtribuiçãodeValorouPercentualparaoValorMínimoeMáximo):EmBranco;
o Nota 09 :Posição 682 a 694 (AtribuiçãodoValorouPercentualMínimo):EmBranco;
o Nota 10 :Posição 695 a 707 (AtribuiçãoouPercentualMáximo):EmBranco;
o Nota 11 :Posição 709 a 710 (QuantidadedePagamentosParciais):EmBranco;

```
SeoCampoIndicativodeTipodeAutorizaçãodeRecebimentodeValorDivergenteforigual= 4
```

o Nota 08 :Posição 681 a 681 (AtribuiçãodeValorouPercentualparaoValorMínimoeMáximo):InformarPercentualouValor;
o Nota 09 :Posição 682 a 694 (AtribuiçãodoValorouPercentualMínimo):ValorMínimo=R$ 0 , 01 ;
o Nota 10 :Posição 695 a 707 (AtribuiçãoouPercentualMáximo):EmBranco;
o Nota 11 :Posição 709 a 710 (QuantidadedePagamentosParciais):EmBranco;

- Nota 12 :Códigodeocorrênciaparainformarostatusdeumtítulo.Segueconformetabelaabaixo:

```
02 – Entrada Confirmada
03 – Entrada Rejeitada
04 – Alteração de Dados (Entrada)
05 – Alteração de Dados (Baixa)
06 – Liquidação do Título
07 – Liquidação do Título Após a Baixa
08 – Título Liquidado em Cartório
09 – Baixa do Título
10 – Baixa Realizada pelo Beneficiário via Arquivo
12 – Abatimento Concedido
13 – Abatimento Cancelado
14 – Vencimento Alterado
15 – Baixa Rejeitada
16 – Instrução Rejeitada
17 – Alterações de Dados Rejeitados
19 – Confirma Instrução de Protesto
20 – Confirma Instrução de Sustação de Protesto
21 – Confirma Instrução de Não Protestar
23 – Protesto Enviado a Cartório
32 – Baixa por ter Sido Protestado
35 – Alegações do Sacado (Marcão-checar códigos de devolução)
69 – Cancelamento de Liquidação por Cheque Devolvido
71 – Título Cancelado pelo Cartório
72 – Baixa Operacional
74 – Cancelamento da Baixa Operacional
75 – Pagamento Parcial
90 – Instrução de Protesto Rejeitada
95 – Troca Uso Empresa
96 – Emissão Extrato Movimentação da Carteira
97 – Tarifa de Sustação de Protesto
98 – Tarifa de Protesto
99 – Custas de Protesto
```

```
Código de Ocorrência Motivo Descrição
03 9000 Data de Vencimento menor que o prazo de aceitação do título
03 9001 Sacado Bloqueado por atraso
03 9002 Registro Opcional Inválido
03 9003 CEP sem praça de cobrança
03 9004 Prazo insuficiente para cobrança do título
03 9005 Campo Numérico inválido
03 9006 Campo Texto inválido
03 9007 Campo Tipo Data inválido
03 9008 Caractere inválido
03 9009 CPF/CNPJ do Pagador e Emitente devem ser diferentes
03 9010 Data de Vencimento menor que a Data de Emissão
03 9011 Data de Emissão maior que a data atual
03 9012 UF do Pagador inválido
03 9013 UF do Emitente inválido
03 9014 Campo Obrigatório não preenchido
03 9015 CPF do Pagador inválido
03 9016 CNPJ do Pagador inválido
03 9017 O Nome do Pagador enviado não confere com o nome do
pagadorcadastradonosistemaparaoCPF/CNPJinformado
03 9018 Tipo do Pagador inválido
03 9021 Dígito do Nosso Número inválido
03 9084
```

```
Seu Número do Registro Opcional diferente da linha do Registro
do Título
03 9085
```

```
DatadeVencimentodoRegistroOpcionaldiferentedalinhado
RegistrodoTítulo
03 9086 Valor do Título do Registro Opcional diferente da linha do
RegistrodoTítulo
03 9090
```

```
Entrada –NossoNúmero já estásendo utilizadopelomesmo
Banco/Conta
03 9091 CEP do Pagador não pertence a UF informada
03 9092 Tipo de Multa inválido
03 9093 Registro Opcional de Emitente Inválido
```

- Nota 13: Para cada Código de Ocorrência listado abaixo, consta Motivo e Descrição

```
03 9097 O Campo Nosso Número não foi informado ou não foi possível identificar o título
03 9098 Encontrado mais de um Título para este Nosso Número
03 9099 Preencha o campo Conta de Cobrança no Cadastro de Carteira por Cedente
03 9103
```

JáexistetítuloemabertocadastradoparaesteBeneficiário/SeuNúmero/Datade
Vencimento/ValoreEmitente
03 9106 Nosso Número não informado
03 9240 Data da Multa menor que Data de Vencimento do Título
03 e 17 9250 Tipo de Autorização para Recebimento de valor divergente inválido
03 e 17 9251 Indicativo tipo de valor ou percentual inválido
03 e 17 9252 Quantidade de Pagamento Parcial inválido
03 e 17 9254 Valor Mínimo não aceito para o título
03 e 17 9255 Valor Máximo não aceito para ao título
03 e 17 9052 Data do Desconto 2 Inválido
03 e 17 9230 Valor do Desconto 2 Inválido
03 e 17 9258 Data do Desconto 3 Inválido
03 e 17 9259 Valor do Desconto 3 Inválido
03 e 17 9260 Mínimo é obrigatório quando informado o tipo valor ou percentual

03 e 17 9261

```
TipodeAutorizaçãodeRecebimentodeValorDivergentenãopermitidoparatipo
detítulo= 31
```

03 e 17 9262

```
ParaEspéciedeTítulodiferentedeFaturadeCartãodeCrédito nãoépossível
informarotipoaceitaqualquervalorcomrangemínimoemáximopreenchido
```

03 e 17 9263 ValorMínimoeValorMáximotemqueserinformadoparaotipodeautorizaçãode
ValorDivergente= 2

03 e 17 9264

```
Valor Mínimo e Valor Máximo não devem ser informados para o tipo de
autorizaçãodeValorDivergente= 3
```

03 e 17 9265

```
ValorMínimodeverserinformadoeValorMáximonãopodeserinformadoparao
tipodeautorizaçãodeValorDivergente= 4
```

03 e 17 9267 Nãoépermitidoterjuros,multa,abatimentoouprotestoparatipodetítulofatura
deCartãodeCrédito
03 9999 CEP do Pagador inválido
06 9210 Liquidação em Cheque
06 e 75 9216 Liquidação no Caixa em Dinheiro
06 e 75 9217 Liquidação em Banco Correspondente

06 e 75 9218 Liquidação por Compensação Eletrônica
06 e 75 9219 Liquidação por Conta
06 e 75 9223 Liquidação por STR
08 9201 Liquidação em Cartório
09 9202 Baixa por Decurso de Prazo (Banco)
09 9237 Baixa por Outros Motivos
17 9113 Não permitido troca de Carteira no evento Alteração de Outros Dados
17 9114 Não permitido troca de Tipo de Título no evento Alteração de Outros Dados
17 9253 QuantidadedePagamentoParcialInválido,somenteépermitidoumvalormaior
ouigualaquantidadedePagamentosjárecebido
32 9203 Baixa de Título Protestado
35 9238 Pagador Rejeita o Boleto
36 9207 Custas de Edital
37 9208 Custas de Sustação de Protesto
90 9108 Título pertence a uma espécie que não pode ser protestada
90 9110 CEP do Pagador não atendido pelos cartórios cadastrados
96 9213 Tarifa de Manutenção de Título Vencido
96 9222 Emissão de Extrato Movimentação da Carteira
97 9204 Tarifa de Sustação de Protesto
98 9205 Tarifa de Protesto
99 9206 Custas de Protesto
Todas 9024 Identificação do Título Inválida
Todas 9025 Ocorrência não permitida pois o título está baixado
Todas 9026 Ocorrência não permitida pois o título está liquidado
Todas 9027 Ocorrência não permitida pois o título está em protesto
Todas 9028 Não é permitida alteração de vencimento para Carteira de Desconto
Todas 9029 Situação do título inválida
Todas 9030 Não foi possível conceder o abatimento
Todas 9031 Não existe abatimento a ser cancelado
Todas 9032 Não foi possível prorrogar a data de vencimento do título
Todas 9033 Evento não permitido para situação do título
Todas 9034 Evento não permitido para cheques

Todas 9035 O código do registro está diferente de 1
Todas 9036 Agência inválida
Todas 9037 Número da Conta Corrente para depósito Inválido

Todas 9038 O CNPJ do cedente no arquivo não confere com o CNPJ do cedente
cadastradoparaoarquivo
Todas 9040 CNPJ do cedente não encontrado no cadastro
Todas 9041 Tipo do emitente inválido
Todas 9042 CNPJ do emitente inválido

Todas 9045

Campo Nosso Número deve ter um valor de, no máximo, 10 dígitos quando a
carteira de cobrança não é direta
Todas 9046 No campo Nosso Número a identificação do título esta inválida
Todas 9047 Banco e conta de cobrança direta não informados
Todas 9049 Campo aceite enviado com valor nulo ou inválido
Todas 9050 Data de emissão inválida
Todas 9051 Data de vencimento inválida
Todas 9053 Espécie de título invalida
Todas 9054 Espécie de título não encontrada
Todas 9055 Valor de título inválido
Todas 9056 Prazo de cartório invalido
Todas 9057 Valor de abatimento inválido
Todas 9058 Valor de desconto inválido
Todas 9059 Código de ocorrência inválida ou inexistente
Todas 9060 Tipo de mora inválido
Todas 9062 Valor de juros ao dia inválido
Todas 9063 A data de juros de mora é anterior à data de vencimento.
Todas 9064 A data de juros de mora inválida
Todas 9065 Número da sequência diferente do esperado
Todas 9066 Número de sequência inválido
Todas 9067 Registro inválido
Todas 9068 CPF do emitente inválido
Todas 9070 Nome do emitente inválido
Todas 9071 Endereço do emitente inválido

Todas 9072 Cidade do emitente inválida
Todas 9073 Cep do emitente inválido
Todas 9074 Este contrato não está cadastrado para o cedente
Todas 9075 Não é permitida a entrada de títulos vencidos
Todas 9078 Não existe Endereço, UF e Cidade para o título
Todas 9079 Nosso Número inválido
Todas 9083 O cedente não pode enviar esse tipo de título com esta carteira
Todas 9224 Carteira do Tipo G não pode inserir títulos.

Código de Barras e Linha Digitável

Formatação do Código de Barras na Ficha de Compensação

```
Campos Obrigatórios (19
posições)
```

```
Tamanho Conteúdo Descrição
```

```
Código do Banco 3 336 Número do C6Bank
Moeda 1 9 – Real ; 0 –Outra Moeda
Dígito Verificador Geral 1 DígitoVerificadordas 43 posições,utilizandooMódulode 11
Fator de Vencimento 4 FatorquedeterminaaDatadeVencimentodoTítulo
Valor do Documento 10 ValordoTítulo,somentenúmeros
Campo Livre (25 posições) Tamanho Conteúdo Descrição
Código do Cedente 12 Código do Cedente
Nosso Número 10 NossoNúmerodoTítulo,semoDígito
Código da Carteira 2 Código da Carteira
Indicador de Layout 1 3 ou 4 3 = Cobrança Registrada Emissão do Boleto Pelo Banco
4 = Cobrança Registrada Emissão do Boleto Pelo Beneficiário
```

Formatação da Linha Digitável na Ficha de Compensação

```
Campo 1 (10 Posições) Tamanho Conteúdo Descrição
```

```
Código do Banco 3 336 Número do C6Bank
Moeda 1 9 – Real ; 0 –Outra Moeda
Código do Cedente 5 As 5 primeirasposiçõesdoCódigodoCedente
Dígito Verificador do Campo 1 1 Utilizar o Módulo de 10
Campo 2 (11 Posições) Tamanho Conteúdo Descrição
```

```
Código do Cedente 7 As 7 últimasposiçõesdoCódigodoCedente
```

```
Nosso Número 3 As 3 primeirasposiçõesdoNossoNúmerodotítulo
Dígito Verificador do Campo 2 1 Utilizar o Módulo de 10
Campo 3 (11 Posições) Tamanho Conteúdo Descrição
```

```
Nosso Número 7 As 7 últimasposiçõesdoNossoNúmerodotítulo
Código da Carteira 2 Código da Carteira
```

```
Indicador de Layout 1 3 ou 4 3 = Cobrança Registrada Emissão do Boleto Pelo Banco
4 = Cobrança Registrada Emissão do Boleto Pelo Beneficiário
Dígito Verificador do Campo 3 1 Utilizar o Módulo de 10
Campo 4 (1 Posição) Tamanho Conteúdo Descrição
```

```
Dígito Verificador Geral 1 Utilizar o Módulo de 11
```

```
Campo 5 (14 Posições) Tamanho Conteúdo Descrição
```

```
Fator de Vencimento 4 FatorquedeterminaaDatadeVencimentodoTítulo
Valor do Documento 10 ValordoTítulo,somentenúmeros
```

Logo C6Bank para inserir no boleto:

Modelo do Boleto

Cálculos

Cálculo do Dígito Verificador do Código

Utilizar Módulo de 11

Cálculo do Dígito Verificador Linha Digitável

Utilizar Módulo de 10

Cálculo do Fator de Vencimento

OFatordeVencimentoéexpressoatravésde 4 dígitoseéutilizadoparaidentificaraDatadeVencimentodoTítulo.

Foiimplantadoem 07 / 10 / 1997 ,comresultado= 1000.

Ocálculoérealizadoatravésdaconta:

FatordeVencimento=DatadeVencimento– 07 / 10 / 1997 (datadereferência),ouseja,éonúmerodediascorridosentreasduasdatas.

Em 22 / 02 / 2025 ,oFatordeVencimentovoltaaser 1000 novamente,epassaaseranovadatadereferência.Apartirdessadataocálculopassaaserfeito:

FatordeVencimento=DatadeVencimento– 22 / 02 / 2025.

Obs.:Estecálculoéválidoaté 13 / 10 / 2049 ,quandooresultadoatinge 9999 .Apartirde 14 / 10 / 2049 ofatorvoltaaser 1000.

**Cálculo do Dígito do Nosso Número**

UtilizarMódulode 11

Eventos de Alteração de Outros Dados

```
Os campos abaixo podem ser alterados na utilização do evento Alteração de Outros Dados (Ocorrência 31).
```

- Endereço do Pagador;
- Complemento do Endereço do Pagador;
- Cidade do Pagador;
- UF do Pagador;
- CEP do Pagador;
- DDD Telefone do Pagador;
- Telefone do Pagador;
- Seu Número do Título;
- Data de Vencimento do Título;
- Valor do Título;
- Prazo de Desconto do Título;
- Valor de Desconto do Título;
- Endereço do Emitente;
- Complemento do Endereço do Emitente;
- Cidade do Emitente;
- UF do Emitente;
- CEP do Emitente;
- DDD Telefone do Emitente;
- Telefone do Emitente;
- Protestar (Sim ou Não);
- Prazo para Protesto;
- Cobrar Juros (Sim ou Não);
- Número de Dias para cobrança de Juros;
- Valor dos Juros;
- Cobrar Multa (Sim ou Não);
- Percentual de Multa;
- Número de Dias para cobrança da Multa;
- Valor da Multa.
