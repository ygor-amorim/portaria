# Análise Completa do Sistema Legado VISITMAIL

**Data da análise:** 28 de dezembro de 2025  
**Sistema analisado:** VISITMAIL (Olho Nú Design)  
**Versão:** 03/08/2005 (20 anos de idade)  
**Analista:** Ygor Rocha  
**Objetivo:** Documentar sistema legado para construir Portaria (sistema novo)

---

## 📋 SUMÁRIO EXECUTIVO

O VISITMAIL é um sistema desktop de credenciamento para eventos desenvolvido em **Delphi** pela empresa "Olho Nú Design" em 2005. Utiliza banco de dados **Paradox** (Borland Database Engine) e opera exclusivamente em **Windows**. 

**Principais descobertas:**
- ✅ Sistema funcional com features completas
- 🔴 Múltiplos bugs críticos identificados
- 🔴 Tecnologia obsoleta (20 anos)
- 🔴 Segurança inexistente (senhas em texto plano)
- 🔴 Dependência total do Windows
- 🔴 Manutenção impossível (código-fonte perdido)

**Recomendação:** Substituição completa por sistema web moderno (Portaria).

---

## 🗂️ ESTRUTURA DE ARQUIVOS

### Instalação (C:\Program Files\VISITMAIL\)

```
VISITMAIL/
├── Common/                     # Arquivos compartilhados Borland
├── DADOS/                      # Banco de dados (vazio na instalação)
├── System32/                   # DLLs do sistema
├── Temp/                       # Arquivos temporários
└── VISITMAIL/                  # Aplicação principal
    ├── dvdz9                   # Parâmetros (5 KB)
    ├── instmsia                # Instalador MSI (1.745 KB)
    ├── instmsiw                # Instalador MSI (1.848 KB)
    ├── Lista_Presenca.xls      # Exemplo Excel (29 KB)
    ├── polhonueventos.exe      # ⭐ EXECUTÁVEL PRINCIPAL (2.552 KB)
    ├── setup.exe               # Setup (284 KB)
    ├── Setup                   # Config instalação (2 KB)
    └── VISITMAIL               # Pacote instalador (955 KB)
```

### Banco de Dados (C:\VISITMAIL\DADOS\)

```
DADOS/
├── TABELAS GLOBAIS (compartilhadas entre eventos)
│   ├── Atividade_participante      # Categorias de atividade
│   ├── Atividade_participante.PX   # Índice
│   ├── Eventos                     # Lista de eventos
│   ├── Eventos.MB                  # Memo blob (logos - 360 KB)
│   ├── Eventos.PX                  # Índice
│   ├── Tipo_participante           # Tipos de participante
│   ├── Tipo_participante.PX        # Índice
│   ├── uf                          # Estados brasileiros
│   ├── uf.PX                       # Índice
│   ├── Usuario                     # Usuários do sistema
│   ├── Usuario.PX                  # Índice
│   ├── parametros                  # Configurações globais
│   └── erro                        # Log de erros (?)
│
├── EVENTO: PORT25 (primeiro evento encontrado)
│   ├── PORT25                      # Participantes
│   ├── PORT25_etiqueta             # Credenciais impressas
│   └── PORT25_presenca             # Check-ins
│
├── EVENTO: PORTARIA25
│   ├── PORTARIA25
│   ├── PORTARIA25_etiqueta
│   └── PORTARIA25_presenca
│
├── EVENTO: TECH2004
│   ├── TECH2004
│   ├── TECH2004_etiqueta
│   └── TECH2004_presenca
│
├── DBDWORK                         # Workspace Paradox (1 KB)
└── projeto_armador.rav             # Relatório Rave (37 KB)
```

**Total:** 24 arquivos, ~500 KB de dados

---

## 💾 TECNOLOGIA IDENTIFICADA

### Stack Técnico

| Componente | Tecnologia | Observação |
|------------|------------|------------|
| **Linguagem** | Delphi (Object Pascal) | Evidenciado por QuickReport e BDE |
| **Banco de dados** | Paradox (Borland) | Arquivos .DB + .PX + .MB |
| **Relatórios** | QuickReport + Rave Reports | Arquivos .QRP e .rav |
| **Engine** | BDE (Borland Database Engine) | Configurado via BDE Administrator |
| **Instalador** | InstallShield Wizard | Setup padrão anos 2000 |
| **Plataforma** | Windows desktop only | Arquivos .exe nativos |

### Formatos de Arquivo

- **`.DB`** - Data Base (Paradox) - 4 KB cada (vazio)
- **`.PX`** - Primary IndeX (Paradox) - 4 KB cada
- **`.MB`** - Memo Blob (campos binários/texto longo) - 360 KB
- **`.QRP`** - QuickReport template (Delphi)
- **`.rav`** - Rave Reports (Delphi) - 37 KB
- **`.exe`** - Executável Windows - 2.5 MB

---

## 🗄️ MODELO DE DADOS

> **NOTA (28/12/2025):** Schema verificado por extração direta dos arquivos Paradox usando PowerShell.
> Os nomes de campos abaixo são os reais encontrados no banco de dados.

### Arquitetura: Multi-Database

**Conceito:** Cada evento tem seu próprio conjunto de 3 tabelas.

```
Sistema Global:
  └── Tabelas compartilhadas
      ├── Eventos
      ├── Usuarios
      ├── Tipos
      └── Atividades

Por Evento:
  └── {NOME_EVENTO}
      ├── {NOME}_participantes
      ├── {NOME}_etiqueta
      └── {NOME}_presenca
```

**Exemplo real:**
- Evento "PORTARIA" → Banco "PORT25" → 3 tabelas
- Evento "TECH 2004" → Banco "TECH2004" → 3 tabelas

---

### Tabelas Globais

#### Eventos
```sql
Eventos:
  - nome (TEXT) - ex: "PORTARIA"
  - banco_dados (TEXT) - ex: "PORT25"
  - imagem (BLOB) - logo do evento (armazenado em .MB)
  - icone (BLOB) - ícone do evento
  - data_criacao (?)
```

#### Usuario
```sql
Usuario (campos reais extraídos):
  - Username (TEXT) - ex: "FALCAO", "ADMIN"
  - Nomecompleto (TEXT) - ex: "CARLOS ALBERTO FALCÃO"
  - Perfil (TEXT) - ex: "ADMINISTRADOR"
  - Senha (TEXT) - ⚠️ TEXTO PLANO (sem hash!)
  - Usuario (TEXT) - quem criou
  - Atualizacao (DATE) - última atualização
```

**🔴 PROBLEMA CRÍTICO:** Senhas armazenadas sem criptografia!

**Dados reais extraídos do banco (28/12/2025):**
| Username | Nome Completo | Perfil | SENHA (PLAIN TEXT!) |
|----------|--------------|--------|---------------------|
| ADMIN | ADMIN | ADMINISTRADOR | (não visível) |
| FALCÃO | CARLOS ALBERTO FALCÃO | ADMINISTRADOR | **KHM001** |
| PAULO AFONSO | PAULO AFONSO MONTEIRO | ADMINISTRADOR | **PAULO** |
| PAULO MAIA | PAULO MAIA | ADMINISTRADOR | **PAULO** |

#### Tipo_participante
```sql
Tipo_participante (campos reais):
  - Codigo (TEXT, 2 chars)
  - Descricao (TEXT)
  - Usuario (TEXT)
  - Atualizacao (DATE)
```

**Dados reais extraídos:**
| Codigo | Descricao |
|--------|-----------|
| AP | PESSOAL DE APOIO |
| CG | CONGRESSISTA |
| SO | SONORIZACAO |
| SS | AA |

#### Atividade_participante
```sql
Atividade_participante (campos reais):
  - Codigo (TEXT, 2 chars)
  - Descricao (TEXT)
  - Usuario (TEXT)
  - Atualizacao (DATE)
```

**Dados reais extraídos:**
| Codigo | Descricao |
|--------|-----------|
| CO | COMÉRCIO |
| IN | INDUSTRIA |
| OU | OUTROS |

#### uf
```sql
uf (campos reais):
  - Codigo (TEXT, 2 chars)
  - Descricao (TEXT)
  - Usuario (TEXT)
  - Data (DATE)
```

**19 estados brasileiros cadastrados:** AC, AL, BA, CE, ES, GO, MA, MG, MS, MT, PA, PB, PE, PR, RJ, RS, SC, SE, SP

#### parametros
```sql
parametros (campo real):
  - Dataprocessada (DATE) - última data processada
```

---

### Tabelas Por Evento

#### {EVENTO}.DB (Participantes)
```sql
PORTARIA25.DB (campos reais extraídos - 17 CAMPOS!):
  - Nome (TEXT, obrigatório)
  - Empresa (TEXT)
  - Numeroparticipante (INT, auto-increment)
  - Cargo (TEXT)
  - Tipo (TEXT, 2 chars, FK → Tipo_participante)
  - Endereco (TEXT)
  - TipoEndereco (TEXT) - "C" (Comercial) ou "R" (Residencial)
  - Bairro (TEXT)
  - Cidade (TEXT)
  - Uf (TEXT, 2 chars, FK → uf)
  - Cep (TEXT, máscara: #####-###)
  - Ddd (TEXT, 2 chars) - ⚠️ Obsoleto, separado do telefone
  - Telefone (TEXT)
  - Fax (TEXT) - ⚠️ Obsoleto!
  - Email (TEXT)
  - Atividade (TEXT, 2 chars, FK → Atividade_participante)
  - Atualizacao (DATE)
  - Usuario (TEXT) - quem cadastrou
```

**Campos obsoletos a NÃO migrar:** TipoEndereco, Endereco, Bairro, Cidade, Uf, Cep, Ddd, Fax

#### {EVENTO}_etiqueta.DB (Credenciais Impressas)
```sql
PORTARIA25_etiqueta.DB (campos reais extraídos):
  - Numeroparticipante (INT, FK → participante)
  - Data (DATE)
  - Hora (TIME)
  - Usuario (TEXT) - quem imprimiu
```

#### {EVENTO}_presenca.DB (Check-ins)
```sql
PORTARIA25_presenca.DB (campos reais extraídos):
  - Numeroparticipante (INT, FK → participante)
  - Data (DATE)
  - Hora (TIME)
  - Usuario (TEXT) - quem registrou o check-in
```

---

## 🖥️ INTERFACE DO USUÁRIO

### Fluxo de Login

```
┌─────────────────────────────────────┐
│   OLHO NÚ Design    PRINCIPAL      │
│   Versão: 03/08/2005               │
├─────────────────────────────────────┤
│  ┌── Acesso Sistema VISITMAIL ───┐ │
│  │                                │ │
│  │  Evento:   [PORTARIA    ▼]    │ │
│  │  Usuário:  [____________]     │ │
│  │  Senha:    [____________]     │ │
│  │  Data:     28/12/2025         │ │
│  │                                │ │
│  │  [⚡ Conecta]    [🚪 Sair]   │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Campos:**
1. **Evento** (dropdown, obrigatório)
   - Lista todos eventos cadastrados
   - ⚠️ Precisa selecionar ANTES de logar
   
2. **Usuário** (texto livre)
   - Username cadastrado
   
3. **Senha** (password)
   - Texto oculto com bullets
   
4. **Data** (somente leitura)
   - Data atual do sistema

**Problemas identificados:**
- 🔴 Bug #1: Validação prematura no campo usuário
- 🔴 Bug #2: Validação prematura no campo senha
- ⚠️ UX ruim: precisa saber nome do evento antes de logar
- ⚠️ Data não serve pra nada (decorativo)

---

### Menu Principal

```
┌────────────────────────────────────────────┐
│ Menu    Relatórios    Cadastros           │
├────────────────────────────────────────────┤
│ [📋 PORTARIA]  [⚙️ Manutenção]            │
│                                            │
│         (área de trabalho vazia)           │
│                                            │
│ PORTARIA    YGOR AMORIM        28/12/2025 │
└────────────────────────────────────────────┘
```

**Barra de status:**
- Evento atual
- Usuário logado
- Data/hora

**Problema:** Tela vazia após login (sem dashboard, sem estatísticas).

---

### Estrutura de Menus

#### Menu → Menu
```
📋 Menu
├── PORTARIA (nome do evento atual)
├── Manutenção
└── Sair
    └── Confirmação: "Deseja sair do sistema?"
        ├── Sim
        └── Não
```

#### Menu → Relatórios
```
📊 Relatórios
├── Relação de Crachás emitidos
├── Relação de Participantes
├── Etiquetas para Crachás
├── Gráfico - Crachás emitidos
├── Gráfico - Visitação
└── Gráfico - Participante
```

#### Menu → Cadastros
```
📝 Cadastros
├── Atividades
├── Eventos
└── Tipo Participante ⚠️ (BUG CRÍTICO - Crash)
```

---

### Tela: Consulta de Participantes

```
┌────────── CONSULTA ──────────┐
│ Empresa:  [_________▼]       │
│ Situação: [_________▼]       │
│ Nome:     [_______________]  │
│                              │
│ [🔍 Pesquisar] [✏️ Limpar] [❌ Fechar]│
│                              │
│ ┌─ Resultados ─────────────┐│
│ │Nome     │Empresa│Cargo   ││
│ │─────────┼───────┼────────││
│ │OPERADOR│TESTE  │ADMIN   ││
│ └──────────────────────────┘│
└──────────────────────────────┘
```

**Filtros:**
- Empresa (dropdown)
- Situação (dropdown) - provavelmente: inscrito/presente/ausente
- Nome (busca texto)

**Resultado:**
- Grid com 3 colunas
- Clicar na linha abre detalhes

---

### Tela: Cadastro de Participante

```
┌────────── Inclusão ──────────────────┐
│ Nome:     [_________________________]│
│ Empresa:  [______________] [      ▼]│
│ Cargo:    [_________________________]│
│                                      │
│ Endereço: ○ Comercial  ○ Residencial│
│ [____________________________________]│
│                                      │
│ CEP:  [_____-___]  Bairro: [_______]│
│ Cidade: [__________]  UF: [  ▼]     │
│ DDD [__] Telefone: [_______________]│
│ FAX: [____________________________] │
│ E_Mail: [__________________________]│
│                                      │
│ Atividade: [_________________▼]     │
│                                      │
│    [🖨️ Imprimir] [💾 Gravar] [❌ Fechar]│
└──────────────────────────────────────┘
```

**Campos identificados:**
- Nome* (obrigatório)
- Empresa (texto + dropdown de empresas cadastradas)
- Cargo
- Tipo de endereço (radio button)
- Endereço completo (CEP, Bairro, Cidade, UF)
- DDD + Telefone
- **FAX** ⚠️ (obsoleto em 2025!)
- Email
- Atividade (dropdown)

**Problemas:**
- Muitos campos desnecessários para MVP
- FAX é obsoleto
- Sem indicação de campos obrigatórios
- Sem validação visual (email, CEP)

---

### Tela: Check-in

```
┌──── Presença Participante ────┐
│                               │
│  Participante: [_____]        │
│                               │
│                               │
│                               │
│                      [❌ Fechar]│
└───────────────────────────────┘
```

**Funcionamento presumido:**
- Campo para ID ou código de barras
- Scan com leitor ou digitação manual
- Clica Fechar após registrar

**PROBLEMAS GRAVES:**
- 🔴 Sem feedback visual (nome do participante)
- 🔴 Sem confirmação de sucesso
- 🔴 Não mostra hora do check-in
- 🔴 Impossível corrigir erro
- 🔴 Não lista participantes já presentes

---

### Tela: Relatórios

**Exemplo: Relação de Crachás Emitidos**
```
┌─ Relação de Crachás Emitidos ─┐
│ ○ Todas Empresas              │
│ ○ Uma Empresa                 │
│                               │
│ ○ Todos Tipos Participantes   │
│ ○ Um Tipo Participante        │
│                               │
│ Período:                      │
│ [28/12/2025 ▼] [28/12/2025 ▼]│
│                               │
│    [📄 Gerar]     [❌ Fechar] │
└───────────────────────────────┘
```

**Filtros padrão dos relatórios:**
- Por empresa (todas/uma)
- Por tipo de participante (todos/um)
- Por período (data início → fim)
- Adicional (varia por relatório):
  - Com/sem controle presença
  - Gráficos por período

---

### Tela: Cadastro de Usuários

```
┌──── Cadastro de Usuários ────┐
│                              │
│ APELIDO(USERNAME): [YGOR   ] │
│ Nome Completo: [YGOR AMORIM] │
│ Senha:        [••••••••••] │
│ Perfil:       [ADMINISTRADOR▼]│
│                              │
│ [◄] [◄◄] [►] [►►]          │
└──────────────────────────────┘
```

**Usuários encontrados:**
1. FALCAO - Carlos Alberto Falcão (ADMINISTRADOR)
2. YGOR - Ygor Amorim (ADMINISTRADOR)

**PROBLEMAS CRÍTICOS:**
- 🔴 Senha em texto plano no banco
- 🔴 Senha visível com bullets (mas sem confirmação)
- 🔴 Só existe perfil "ADMINISTRADOR" (sem controle de acesso)
- ⚠️ Navegação por setas (UX dos anos 90)

---

### Tela: Importar/Exportar Excel

**Importação:**
```
┌─ Importar informações Participante ─┐
│     (Planilha Excel)                │
│                                     │
│  [📊 Planilha Excel]  [❌ Fechar]  │
└─────────────────────────────────────┘
```

**Exportação:**
```
┌─ Exportação Dados para Excel ──┐
│ Tabela Excel:                   │
│ [___________________]           │
│ [📂 Informar Tabela]           │
│                                 │
│ Tipo Participante:              │
│ [_______________ ▼]            │
│                                 │
│ [✅ Processar] [❌ Fechar]     │
└─────────────────────────────────┘
```

**Problema relatado:**
- ⚠️ Não funciona no PC do Ygor (depende de configuração Windows específica)
- ✅ Funciona no PC do pai (tem Excel instalado?)

---

## 📄 ARQUIVOS DE EXEMPLO ANALISADOS

> **Nota (28/12/2025):** Arquivos em `docs/research/legacy-system/exemplos/`

### Credenciais/Etiquetas (PDFs)

**Arquivos:** `etiqueta.pdf`, `etiqueta3.pdf`, `ETIQ4.pdf`

**Layout:**
```
┌─────────────────────────────────┐
│ NOME DO PARTICIPANTE            │
│ NOME DO EVENTO                  │
│ ▌▌▌▌▌ VISITMAIL 000001 ▌▌▌▌▌   │
│         (espaço vazio)          │
└─────────────────────────────────┘
```

**Problemas:** Não mostra empresa, tipo, logo, sala. Código de barras em vez de QR.

**Formato do ID:** `VISITMAIL XXXXXX` (6 dígitos sequenciais)

### Planilha de Importação (Excel)

**Arquivo:** `parti.xlsx`

**Formato requerido (11 colunas, ordem EXATA):**
```
NOME | EMPRESA | CARGO | ENDEREÇO | BAIRRO | CEP | CIDADE | ESTADO | TELEFONE | FAX | E-MAIL
```

**Problemas:** Inflexível, muitas colunas obsoletas, não detecta colunas automaticamente.

### Relatórios (PDFs)

**Arquivos analisados:**
- `relacao_participantes.pdf`
- `relacao_participantes_com_controle_presenca.pdf`
- `relacao_etiquetas_emitidas.pdf`
- `relpartypepdf.pdf` (Cadastro de Tipos)

#### Relatório: Relação Participantes
```
┌─────────────────────────────────────────────────────────────────────────┐
│ OLHO NÚ           Relação Participantes           Emissão: 28/12/2025  │
│ Evento: PORTARIA                                  Página: 1            │
├─────────────────────────────────────────────────────────────────────────┤
│ Participante    Empresa    Cargo    Tipo         Telefone    Email     │
│─────────────────────────────────────────────────────────────────────────│
│ YGOR            PORTARIA   ADMIN    CONGRESSIST                        │
├─────────────────────────────────────────────────────────────────────────┤
│ TOTAL PARTICIPANTES: 1                                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Relatório: Relação com Controle de Presença
- Mesmo layout + filtro por período
- Mostra apenas quem fez check-in no período
- ⚠️ Bug: Parece contar cada check-in, não participantes únicos (YGOR aparece 2x com 2 check-ins)

#### Relatório: Etiquetas Emitidas
```
Participante | Empresa | Cargo | Tipo | Usuário | Emissão | Hora
YGOR         | PORTARIA| ADMIN | CG   | ADMIN   | 28/12   | 15:01:30
```
- Inclui **auditoria**: quem imprimiu, quando, que hora
- Útil para controle de impressões duplicadas

### Filtros de Relatório (funcionalidades)

| Filtro | Disponível em |
|--------|---------------|
| Por Empresa | Etiquetas, Participantes |
| Por Tipo de Participante | Etiquetas, Participantes |
| Por Período (data) | Etiquetas, Participantes com presença |
| Apenas presentes vs Todos | Participantes |
| Gráficos | ❓ Existem 3 opções mas possivelmente quebradas |

**Gráficos disponíveis (não testados, possivelmente não funcionam):**
- Gráfico - Crachás emitidos
- Gráfico - Visitação
- Gráfico - Participante

---

## 🐛 BUGS CRÍTICOS IDENTIFICADOS

### Bug #1: Validação Prematura - Campo Usuário

**Trigger:** Clicar no campo "Usuário" (antes de digitar)

**Erro exibido:**
```
"Usuário não cadastrado no Sistema"
```

**Causa provável:**
- Validação no evento `onFocus()` em vez de `onBlur()` ou `onSubmit()`
- Código Delphi executa antes do usuário fazer qualquer ação

**Gravidade:** 🟡 MÉDIA (UX ruim, assusta usuário)

**Solução no novo sistema:**
- Validar apenas no `onBlur()` ou `onSubmit()`
- Mensagens de erro inline (não popup)

---

### Bug #2: Validação Prematura - Campo Senha

**Trigger:** Clicar no campo "Senha" (antes de digitar)

**Erro exibido:**
```
"Senha do usuário não confere"
```

**Causa provável:**
- Mesmo problema do Bug #1
- Valida senha vazia contra banco de dados

**Gravidade:** 🟡 MÉDIA (duplica problema do Bug #1)

**Solução no novo sistema:**
- Mesma do Bug #1
- Validação apenas após submissão

---

### Bug #3: Crash ao Abrir "Tipo Participante"

**Trigger:** Menu Cadastros → Tipo Participante

**Erro exibido:**
```
┌────── PORTARIA ──────┐
│  ❌                  │
│ Access violation at  │
│ address 43070000.    │
│ Read of address      │
│ 43070000.           │
│                      │
│       [OK]           │
└──────────────────────┘
```

**Causa:**
- **Access violation** = tentativa de acessar memória inválida
- Address `43070000` = ponteiro nulo ou inválido
- Típico de Delphi/C++: variável não inicializada

**Gravidade:** 🔴 CRÍTICA (funcionalidade completamente quebrada)

**Impacto:**
- Impossível gerenciar tipos de participante
- Precisa editar banco de dados manualmente

---

### Bug #4: Dataset Leak após Bug #3

**Trigger:** Após o Bug #3, tentar qualquer ação

**Erro exibido:**
```
┌────── PORTARIA ──────┐
│  ❌                  │
│ Exception           │
│ EDatabaseError      │
│ in module           │
│ polhonueventos.exe  │
│ at 00094A84.        │
│                      │
│ qrytipo_participante:│
│ Cannot perform this  │
│ operation on an open │
│ dataset.            │
│                      │
│ Runtime error 255   │
│       [OK]           │
└──────────────────────┘
```

**Causa:**
- Query/DataSet `qrytipo_participante` não foi fechado após crash
- Sistema tenta abrir novamente enquanto está aberto
- Gerenciamento de recursos ruim (sem try/finally)

**Gravidade:** 🔴 CRÍTICA (sistema trava completamente)

**Consequência:**
- Precisa fechar e reabrir o programa
- Perda de dados não salvos

**Solução no novo sistema:**
- PostgreSQL com connection pooling automático
- Sem gerenciamento manual de datasets

---

### Bug #5: Crash Genérico

**Observado em:** Diversas telas (não especificadas)

**Erro exibido:**
```
Access violation at address 005D49A 
in module poihonueventos.exe. 
Read of address 00000000.
```

**Análise:**
- `00000000` = ponteiro completamente nulo
- Acesso a objeto não inicializado ou já destruído
- Erro típico de má gestão de memória em Delphi

**Gravidade:** 🔴 CRÍTICA (instabilidade geral)

---

## 🎨 CREDENCIAIS / ETIQUETAS

### Layout Atual

**Formato encontrado (etiqueta.pdf):**
```
OPERADOR TESTE

PORTARIA

[código de barras]
VISITMAIL 000002
```

**Elementos:**
- Nome do participante (fonte grande)
- Nome do evento (fonte média)
- Código de barras
- Identificador: "VISITMAIL ######"

**Problemas de design:**
- ⚠️ Muito espaço em branco desperdiçado
- ⚠️ Sem logo do evento
- ⚠️ Sem empresa do participante
- ⚠️ Sem tipo/categoria
- ⚠️ Layout anos 2000 (sem bordas, sem cores)

---

### Comparação: Legado vs Novo

| Elemento | Legado | Portaria (novo) |
|----------|--------|-----------------|
| **Nome** | ✅ Sim | ✅ Sim (destaque) |
| **Evento** | ✅ Sim | ✅ Sim |
| **Logo** | ❌ Não | ✅ Sim (customizável) |
| **Empresa** | ❌ Não | ✅ Sim |
| **Tipo** | ❌ Não | ✅ Sim (badge colorido) |
| **Código** | ✅ Barcode | ✅ QR Code (moderno) |
| **Layout** | ⚠️ Básico | ✅ Profissional |
| **Espaço usado** | ~30% | ~80% |

---

## 📊 FUNCIONALIDADES COMPLETAS

### Core Features (essenciais)

| Funcionalidade | Legado | Funciona? | Novo sistema |
|----------------|--------|-----------|--------------|
| Login multi-usuário | ✅ | 🟡 Bugs | ✅ Melhorado |
| Cadastro de eventos | ✅ | ✅ | ✅ |
| Cadastro de participantes | ✅ | ✅ | ✅ Simplificado |
| Check-in manual | ✅ | 🟡 Sem feedback | ✅ Com feedback |
| Geração de credencial | ✅ | ✅ | ✅ Layout melhor |
| Busca de participantes | ✅ | ✅ | ✅ |
| Relatórios filtráveis | ✅ | ✅ | ✅ |

### Features Administrativas

| Funcionalidade | Legado | Funciona? | Novo sistema |
|----------------|--------|-----------|--------------|
| Tipos personalizados | ✅ | 🔴 Crash | ✅ |
| Atividades/Categorias | ✅ | ✅ | 🔄 Opcional |
| Gerenciar usuários | ✅ | ✅ | ✅ Com roles |
| Logo customizado | ✅ | ✅ | ✅ |
| Multi-empresa | ✅ | ✅ | ✅ |

### Import/Export

| Funcionalidade | Legado | Funciona? | Novo sistema |
|----------------|--------|-----------|--------------|
| Importar Excel | ⚠️ | 🟡 Inconsistente | ✅ Robusto |
| Exportar Excel | ⚠️ | 🟡 Inconsistente | ✅ + CSV |
| Backup manual | ❌ | ❌ | ✅ Automatizado |

### Relatórios

| Relatório | Legado | Novo sistema |
|-----------|--------|--------------|
| Crachás emitidos | ✅ PDF | ✅ PDF + Excel |
| Lista de participantes | ✅ PDF | ✅ PDF + Excel |
| Presença (com/sem check-in) | ✅ PDF | ✅ PDF + Excel |
| Etiquetas para impressão | ✅ PDF | ✅ PDF |
| Gráfico de crachás | ✅ Estático | ✅ Interativo |
| Gráfico de visitação | ✅ Estático | ✅ Interativo |
| Gráfico por participante | ✅ Estático | ✅ Interativo |

---

## ⚠️ PROBLEMAS CONSOLIDADOS

### Técnicos

| Problema | Gravidade | Impacto | Solução no novo |
|----------|-----------|---------|-----------------|
| Paradox database | 🔴 ALTA | Obsoleto há 20 anos | PostgreSQL |
| BDE dependency | 🔴 ALTA | Instalação complexa | Zero dependency |
| Windows-only | 🔴 ALTA | Cliente preso | Web-based |
| Senha texto plano | 🔴 CRÍTICA | Segurança zero | Bcrypt hash |
| Multi-arquivo DB | 🟡 MÉDIA | Backup complexo | Single database |
| Crashes frequentes | 🔴 CRÍTICA | Instabilidade | Web estável |
| Sem logs | 🟡 MÉDIA | Debug impossível | Logging completo |
| **Sem rede/sync** | 🔴 CRÍTICA | Export manual para cada PC | Real-time via HTTP |

### Arquitetura de Rede (Pain Point Crítico)

> **Descoberta (28/12/2025):** Verificado no BDE Administrator (`C:\Program Files (x86)\Common Files\Borland Shared\BDE\IDAPI32.CFG`)

**Configuração encontrada:**
```
dolhonu alias → C:\visitmail\dados
NET DIR → C:\ (local, não compartilhado)
```

**O problema:**
- O sistema TEM suporte a rede (Paradox pode compartilhar arquivos), MAS:
  - Requer `NET DIR` compartilhado para file locking (PDOXUSRS.NET)
  - Todos os PCs precisam do mesmo caminho de rede
  - File locking sobre rede pode ser instável
  - Depende da infraestrutura de rede do local do evento

**Realidade nos eventos:**
- Locais de eventos frequentemente têm rede instável ou inexistente
- Quando a rede falha, o sistema não funciona em múltiplos PCs
- Fallback: exportar dados manualmente para cada PC

**Workaround quando rede não disponível:**
1. Exportar dados manualmente para cada PC antes do evento
2. FREQMDB rodava standalone nas portas das salas (check-in local)
3. Dados precisavam ser sincronizados manualmente depois
4. Risco de perda de dados ou conflitos no merge

**Impacto operacional:**
- ⏱️ Dependência de infraestrutura de rede do venue
- 🔄 Fallback manual quando rede falha
- ❌ Se um PC isolado falhar, dados locais podem ser perdidos
- 🤯 Merge manual de dados quando rede não disponível

**Como Portaria resolve:**
- ✅ Single PostgreSQL database na nuvem
- ✅ Acesso via HTTP API (qualquer dispositivo com browser)
- ✅ Real-time sync automático
- ✅ Sem instalação local necessária
- ✅ Funciona até no celular do recepcionista
- ✅ Offline-first possível no futuro (PWA com sync)

### UX/UI

| Problema | Gravidade | Impacto | Solução no novo |
|----------|-----------|---------|-----------------|
| Interface anos 2000 | 🟡 MÉDIA | Parece amador | Design moderno |
| Validação prematura | 🟡 MÉDIA | Confunde usuário | Validação apropriada |
| Sem dashboard | 🟡 MÉDIA | Desorientação | Dashboard rico |
| Check-in sem feedback | 🔴 ALTA | Erros invisíveis | Modal confirmação |
| Telas vazias | 🟡 MÉDIA | UX ruim | Progressive disclosure |
| Navegação por setas | 🟡 BAIXA | UX anos 90 | Formulários modernos |

### Funcional

| Problema | Gravidade | Impaco | Solução no novo |
|----------|-----------|---------|-----------------|
| Tipo Participante crash | 🔴 CRÍTICA | Feature quebrada | Funcional |
| Import Excel bugado | 🟡 MÉDIA | Dependência Windows | CSV/XLSX robusto |
| Campos obsoletos (FAX) | 🟢 BAIXA | Poluição visual | Campos modernos |
| Multi-evento complexo | 🟡 MÉDIA | Login confuso | Seleção após login |
| Sem inscrição online | 🔴 ALTA | Tudo manual | Form público |

---

## 🎯 GAPS E OPORTUNIDADES

### Funcionalidades Ausentes (adicionar no novo)

| Feature | Prioridade | Benefício |
|---------|------------|-----------|
| **Inscrição online** | 🔴 ALTA | Elimina cadastro manual |
| **Email automático** | 🔴 ALTA | Confirmação de inscrição |
| **Dashboard analytics** | 🟡 MÉDIA | Visão rápida do evento |
| **Controle de salas** | 🟡 MÉDIA | Capacidade e lotação |
| **Check-in por QR** | 🟡 MÉDIA | Mais rápido que barcode |
| **App mobile** | 🟢 BAIXA | Fase 2 |
| **Multi-idioma** | 🟢 BAIXA | Eventos internacionais |

### Melhorias de UX

| Melhoria | Impacto | Esforço |
|----------|---------|---------|
| Login por email | Alto | Baixo |
| Dashboard pós-login | Alto | Médio |
| Check-in com foto | Médio | Alto |
| Validação inline | Alto | Baixo |
| Credencial customizável | Médio | Médio |
| Notificações real-time | Baixo | Alto |

---

## 🏗️ ARQUITETURA: LEGADO VS NOVO

### Sistema Legado (VISITMAIL)

```
┌─────────────────────────────────┐
│     Windows Desktop App         │
│    (Delphi - polhonueventos)    │
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│  Borland Database Engine (BDE)  │
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│   Paradox Files (.DB + .PX)     │
│  C:\VISITMAIL\DADOS\*.DB        │
│                                 │
│  • Eventos (global)             │
│  • Usuario (global)             │
│  • PORT25 (evento)              │
│  • PORT25_presenca (evento)     │
│  • PORT25_etiqueta (evento)     │
└─────────────────────────────────┘
```

**Problemas:**
- ❌ Instalação local obrigatória
- ❌ Um usuário por vez
- ❌ Backup manual (copiar arquivos)
- ❌ Sem versionamento de schema
- ❌ Manutenção impossível

---

### Sistema Novo (Portaria)

```
┌─────────────────────────────────┐
│      Web Browser (Cliente)      │
│   React + Tailwind CSS          │
└─────────────┬───────────────────┘
              │ HTTPS
              ↓
┌─────────────────────────────────┐
│      Backend API (Node.js)      │
│   Express + Knex + JWT          │
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│    PostgreSQL (Cloud)           │
│                                 │
│  • organizations                │
│  • users (com roles)            │
│  • events                       │
│  • rooms                        │
│  • participants                 │
│  • check_ins                    │
└─────────────────────────────────┘
```

**Vantagens:**
- ✅ Zero instalação (browser)
- ✅ Multi-usuário simultâneo
- ✅ Backup automatizado
- ✅ Migrations versionadas
- ✅ Manutenção via deploy

---

## 📋 MAPEAMENTO DE FEATURES

### MVP (deve ter)

| Feature Legado | Feature Nova | Mudança |
|----------------|--------------|---------|
| Login evento + user | Login email → escolhe evento | Simplificado |
| Criar evento | Criar evento | Mantido |
| Cadastrar participante (15 campos) | Cadastrar (5 campos) | Simplificado |
| Check-in manual | Check-in com feedback | Melhorado |
| Credencial PDF | Credencial PDF + QR | Melhorado |
| Busca por nome/empresa | Busca universal | Melhorado |
| Relatório presença | Relatório + export | Melhorado |

### Fase 2 (nice to have)

| Feature Legado | Feature Nova | Quando |
|----------------|--------------|--------|
| Import Excel (bugado) | Import robusto | Após validação |
| Tipos customizados | Tipos + cores | Após validação |
| Gráficos estáticos | Gráficos interativos | Após validação |
| Logo evento | Logo + branding | Após validação |
| Multi-empresa | Multi-org | Desde início |

### Não migrar (obsoleto)

| Feature Legado | Motivo |
|----------------|--------|
| Campo FAX | Obsoleto (ninguém usa fax em 2025) |
| Endereço completo | Desnecessário para credenciamento |
| Tipo endereço (comercial/residencial) | Irrelevante |
| DDD separado | UX ruim (unificar com telefone) |
| Código de barras | Substituir por QR Code |

---

## 🎓 LIÇÕES APRENDIDAS

### Do Sistema Legado

1. **Multi-arquivo é problemático**
   - Backup complexo
   - Sincronização difícil
   - Risco de corrupção
   - **Solução:** Single database com multi-tenancy

2. **Desktop tem limitações graves**
   - Instalação é barreira de entrada
   - Updates são pesadelo
   - Suporte remoto impossível
   - **Solução:** Web-based SaaS

3. **Segurança não pode ser afterthought**
   - Senhas em texto plano = inaceitável
   - Sem controle de acesso = todos admin
   - **Solução:** Security by design (bcrypt, JWT, roles)

4. **Validação prematura frustra usuários**
   - Mensagens de erro antes de agir
   - **Solução:** Validação no momento certo (onBlur/onSubmit)

5. **Feedback visual é essencial**
   - Check-in sem confirmação = ansiedade
   - **Solução:** Modals, toasts, loading states

6. **Tecnologia obsoleta = risco**
   - 20 anos depois, código é indecifrável
   - Ninguém mais sabe Delphi + Paradox
   - **Solução:** Stack moderna e documentada

---

## 🚀 RECOMENDAÇÕES

### Imediatas

1. **Não tentar consertar o legado**
   - Código-fonte perdido
   - Tecnologia morta
   - Bugs impossíveis de corrigir
   
2. **Construir do zero (greenfield)**
   - Stack moderna (Node.js + PostgreSQL)
   - Arquitetura limpa
   - Testes desde o início

3. **Simplificar o MVP**
   - Menos campos que o legado
   - Foco no essencial
   - Iterar baseado em feedback

### Técnicas

1. **Não replicar arquitetura legado**
   - Multi-arquivo → Single database
   - Desktop → Web
   - Paradox → PostgreSQL

2. **Migração de dados (quando chegar a hora)**
   - Ler arquivos .DB com biblioteca Python/Node
   - Importar para PostgreSQL
   - Script de migração testado

3. **Aprender com os erros**
   - Validação apropriada
   - Feedback visual sempre
   - Logs estruturados
   - Error handling robusto

### Estratégicas

1. **Posicionar como upgrade, não substituição**
   - "Evolução do sistema"
   - "Mesmas funcionalidades, tecnologia moderna"
   - "Acesso de qualquer lugar"

2. **Migração gradual**
   - Cliente pode usar ambos em paralelo
   - Importar dados históricos
   - Training/onboarding

3. **Pricing competitivo**
   - Novo sistema oferece MUITO mais valor
   - Justificar preço igual ou maior

---

## 📊 ESTATÍSTICAS FINAIS

### Sistema Legado

- **Idade:** 20 anos (2005 → 2025)
- **Linguagem:** Delphi (Object Pascal)
- **Banco de dados:** Paradox (Borland)
- **Tamanho:** ~5 MB total
- **Eventos encontrados:** 3 (PORT25, PORTARIA25, TECH2004)
- **Usuários cadastrados:** 2 (FALCAO, YGOR)
- **Bugs críticos:** 4 documentados
- **Funcionalidades:** ~15 features core
- **Plataforma:** Windows desktop only

### Sistema Novo (Portaria)

- **Stack:** Node.js + PostgreSQL + React
- **Arquitetura:** Web-based SaaS
- **MVP previsto:** 8-12 semanas
- **Equity:** 100% (solo founder)

---

## 📝 PRÓXIMOS PASSOS

### Análise (concluído)
- [x] Instalar e rodar sistema legado
- [x] Documentar todas as telas
- [x] Mapear estrutura de arquivos
- [x] Identificar bugs críticos
- [x] Extrair modelo de dados
- [x] Criar documento de análise

### Pendente (com Claude Code)
- [ ] Explorar estrutura completa de pastas
- [ ] Tentar abrir arquivos .DB (viewer Paradox)
- [ ] Extrair schema detalhado
- [ ] Analisar arquivos .rav (relatórios)
- [ ] Documentar queries/relatórios

### Desenvolvimento (janeiro 2026)
- [ ] Finalizar cofrinho-API (aprendizado)
- [ ] Protocolar marca INPI
- [ ] Logo básico
- [ ] Setup portaria-api
- [ ] Primeira migration

---

## 🎯 CONCLUSÃO

O sistema legado VISITMAIL é funcional mas **obsoleto e instável**. A tecnologia tem 20 anos, bugs críticos tornam algumas funcionalidades inutilizáveis, e a arquitetura desktop limita severamente o uso moderno.

**A substituição por Portaria é justificada e necessária.**

O novo sistema não é apenas uma atualização visual - é uma modernização completa que resolve:
- ✅ Instabilidade (crashes frequentes)
- ✅ Segurança (senhas em texto plano)
- ✅ Acessibilidade (web vs desktop)
- ✅ Manutenibilidade (stack moderna)
- ✅ Escalabilidade (cloud vs local)

**Cliente ganha:**
- Sistema mais estável
- Acesso de qualquer lugar
- Atualizações automáticas
- Suporte moderno
- Novas features (inscrição online, emails, etc)

**Ygor ganha:**
- Portfolio real
- Experiência completa (frontend + backend)
- Cliente pagante desde dia 1
- Produto escalável (outros eventos)

**ROI projetado:** 300-500% no primeiro ano com apenas 1 cliente.

**Recomendação final:** SEGUIR EM FRENTE com desenvolvimento do MVP. 🚀

---

**Documento criado em:** 28 de dezembro de 2025  
**Última atualização:** 28 de dezembro de 2025  
**Autor:** Ygor Rocha  
**Versão:** 1.0 - Análise Completa
