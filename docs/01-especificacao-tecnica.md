# Portaria - Sistema de Credenciamento para Eventos

**Nome do projeto:** Portaria  
**Domínio:** portaria.events (registrado em 26/12/2025)  
**Email:** contato@portaria.events  
**Data de início:** 26 de dezembro de 2025  
**Contexto:** Migração e modernização de sistema legado de credenciamento para eventos médios  

**Status atual:**
- ✅ Nome validado no INPI (classes 41 e 42 - livres)
- ✅ Domínio registrado: portaria.events
- ✅ Email profissional configurado: contato@portaria.events
- ✅ Infraestrutura protegida (2FA, WHOIS privacy, auto-renew)
- 🔄 Aguardando sistema legado completo do cliente
- 🔄 Finalizando aprendizado técnico (cofrinho-API)

---

## 1. CONTEXTO E MOTIVAÇÃO

### Origem do projeto
- Pai do Ygor tinha empresa de eventos nos anos 2000/2010
- Sócio contratou programador para criar sistema de credenciamento desktop
- Sistema funcionava parcialmente, mas tinha limitações críticas

### Problemas do sistema legado
- ❌ **Sem controle de presença/check-in** - não registrava quem compareceu
- ❌ **Sem gestão por salas** - não controlava distribuição de participantes
- ❌ **Sem relatórios analíticos** - impossível medir inscritos vs presentes
- ❌ **Desktop-only** - aplicação Windows, sem acesso web/mobile
- ❌ **Bancos locais desconectados** - arquivos .mdb por máquina, sem sincronização
- ❌ **UX datada e lenta** - interface Windows Forms genérica

### Objetivo do novo sistema
Criar solução **web moderna** para eventos médios que resolva:
1. Gestão completa de eventos e inscrições
2. **Check-in em tempo real** com controle de presença
3. Atribuição de participantes a salas/trilhas
4. Impressão de credenciais (digital primeiro, hardware depois)
5. Relatórios e analytics de participação

---

## 2. ANÁLISE DO SISTEMA LEGADO

### ⚠️ IMPORTANTE: Sistema analisado é preliminar

**FREQMDB (analisado) ≠ Sistema de Credenciamento (a receber)**

O programa FREQMDB explorado inicialmente era apenas um **módulo auxiliar limitado** para controle de frequência por sala, não o sistema completo de credenciamento. 

**Funcionalidades do FREQMDB (módulo auxiliar):**
- Controle básico de presença em cursos/eventos
- Atribuição simples de participantes por código de evento
- Interface Windows Forms extremamente limitada
- Banco de dados Microsoft Access (.mdb)

**Sistema de Credenciamento real (ainda a receber do pai):**
- Supostamente **mais complexo e completo** que o FREQMDB
- Funcionalidades de impressão de credenciais
- Gestão mais robusta de eventos
- Detalhes técnicos ainda desconhecidos

### Tecnologia identificada (FREQMDB - referência parcial)
- **Linguagem:** Provavelmente C#/.NET (Windows Forms)
- **Banco de dados:** Microsoft Access (.mdb)
- **Arquitetura:** Desktop standalone com bancos locais

### Estrutura de arquivos do FREQMDB (apenas para referência)
```
FREQMDB/
├── Frequencia.exe (19/07/2017)
├── SERVIDOR.mdb (4.54 MB)
├── PORTASALA.mdb
├── PORTASALA-ALE-PC.mdb
├── PORTASALA-DESKTOP-MLHBTJQ.mdb
└── PORTASALA-PP01-PC.mdb
```

**Observação:** Este sistema auxiliar tinha múltiplos arquivos `.mdb` por máquina, sugerindo arquitetura problemática sem sincronização central.

### Funcionalidades observadas no FREQMDB (limitadas)

**Tela de Frequência:**
- Dropdown para selecionar evento/curso por código (ex: "MOD09 - Módulo Harmonização")
- Campo CPF para busca
- Lista de participantes inscritos
- Contador de inscritos (ex: "18" participantes)
- Botões: Atualizar, Alterar, Limpar, Fechar
- Coluna adicional (provavelmente dias de presença)

**Modelo de dados inferido (parcial, apenas do FREQMDB):**
```
CURSOS/EVENTOS
├─ Código (ex: MOD09)
├─ Nome (ex: Módulo Harmonização)
└─ [outros campos]

PARTICIPANTES
├─ Nome completo
├─ CPF
└─ [dados pessoais]

INSCRICOES (relação muitos-para-muitos)
├─ ID_Curso
├─ ID_Participante
└─ [Status, Data]

FREQUENCIA (funcionalidade limitada)
├─ ID_Inscricao
├─ Data/Dia
└─ Presente (campo existe mas controle insuficiente)
```

### Problemas identificados no FREQMDB
- Interface extremamente simplória
- Modal de confirmação para cada alteração (lento)
- "Atualizando Dados. Aguarde..." sugere queries lentas
- Sem busca em tempo real
- Sem dashboard visual
- Sem acesso simultâneo de múltiplos usuários
- **Nota:** Estes problemas são do módulo auxiliar; o sistema principal pode ter outros desafios

### 🔄 Próxima etapa: Análise do sistema real de credenciamento
Quando o pai do Ygor enviar o **sistema de credenciamento completo**, será necessário:
1. Explorar todas as funcionalidades
2. Mapear modelo de dados real
3. Identificar fluxos de trabalho completos
4. Documentar layouts de credenciais
5. Entender integrações com hardware (impressoras)
6. Analisar relatórios gerados

Esta análise complementar será crucial para refinar as especificações do novo sistema.

---

## 3. ESPECIFICAÇÃO DO NOVO SISTEMA

### 3.1 Visão geral
Sistema **web responsivo** para gestão completa de eventos corporativos e educacionais de médio porte (50-500 participantes).

### 3.2 Público-alvo
- **Cliente final:** Empresas que organizam eventos (treinamentos, congressos, workshops)
- **Usuários primários:** Organizadores de eventos
- **Usuários secundários:** Equipe de recepção/check-in

### 3.3 Funcionalidades core (MVP)

#### Módulo 1: Gestão de Eventos
- Criar/editar/excluir eventos
- Campos do evento:
  - Nome
  - Código/identificador único
  - Data(s) de realização
  - Local
  - Descrição
  - Logo/identidade visual (opcional)
- Criar salas/trilhas dentro do evento
- Definir capacidade por sala (opcional)

#### Módulo 2: Inscrições
- **Formulário público de inscrição** (link compartilhável)
- Campos customizáveis:
  - Nome completo (obrigatório)
  - Email (obrigatório)
  - CPF (opcional)
  - Empresa/Instituição
  - Cargo/Função
  - Telefone
  - Campos customizados por evento
- Participante escolhe sala/trilha de interesse ao se inscrever
- **Confirmação automática por email** com:
  - Dados da inscrição
  - QR Code único para check-in
  - Informações do evento
- Dashboard de inscrições para organizador:
  - Lista de todos os inscritos
  - Filtros por sala, status, data
  - Busca por nome/email/CPF
  - Edição manual de inscrições

#### Módulo 3: Credenciamento (DIFERENCIAL)
**Dashboard de check-in (interface para recepção):**
- Busca rápida por:
  - Nome
  - Email
  - CPF
  - Escaneamento de QR Code
- Card do participante com:
  - Foto (se fornecida)
  - Nome completo
  - Empresa/Cargo
  - Sala atribuída
  - Status: 🔴 Inscrito / 🟢 Presente / ⚫ Ausente
- **Botão "Marcar Presença":**
  - Registra timestamp do check-in
  - Muda status visual
  - Habilita impressão de credencial
- **Impressão de credencial** (após check-in confirmado):
  - Geração de PDF com layout customizável
  - Campos: Nome, Empresa, Cargo, Sala, QR Code
  - Opção de impressão direta ou download
- **Visualização em tempo real:**
  - Contador: X de Y presentes (%)
  - Gráfico de chegada ao longo do tempo
  - Lista de ausentes

#### Módulo 4: Relatórios e Analytics
**Relatórios disponíveis:**
- **Geral:**
  - Total de inscritos vs presentes
  - Taxa de comparecimento (%)
  - Horário de pico de chegadas
- **Por sala/trilha:**
  - Inscritos vs presentes em cada sala
  - Ocupação real vs capacidade
- **Individual:**
  - Lista de presentes (para certificados)
  - Lista de ausentes (para follow-up)
- **Timeline:**
  - Gráfico de horário de chegada dos participantes
  - Distribuição temporal

**Exportações:**
- CSV/Excel (dados brutos)
- PDF (relatório formatado)
- Integração futura: envio automático de certificados

### 3.4 Funcionalidades futuras (pós-MVP)
- Impressão térmica/PVC direto do navegador (WebUSB)
- Totens de auto-atendimento
- Múltiplos organizadores com permissões granulares
- Integrações (Mailchimp, CRM, gateways de pagamento)
- White-label/branding avançado
- App mobile nativo para check-in
- Reconhecimento facial para check-in automático
- Analytics preditivos (estimativa de comparecimento)

---

## 4. ARQUITETURA TÉCNICA

### 4.1 Stack recomendada

**🎯 Stack escolhida baseada em aprendizados do projeto `cofrinho-API`:**

**Backend:**
- **Runtime:** Node.js v24
- **Framework:** Express.js
- **Query Builder:** Knex (migrations, multi-DB support)
- **Autenticação:** JWT (jsonwebtoken) + bcryptjs
- **Segurança:** helmet, cors
- **Email:** Nodemailer ou SendGrid
- **Validação:** Joi ou Zod (a adicionar)
- **Ambiente:** dotenv

**Banco de dados:**
- **Principal:** PostgreSQL 17
- **Cache:** Redis (opcional, para sessões em tempo real)
- **Estrutura:** Multi-tenant (organization_id como filtro universal)

**Frontend:**
- **Framework:** React.js
- **UI Library:** Tailwind CSS + Shadcn/UI
- **Estado:** Zustand ou Context API
- **Geração de PDF:** jsPDF ou react-pdf
- **QR Code:** qrcode.js

**Hospedagem:**
- **Backend + DB:** Railway, Render ou Fly.io (~$20-50/mês inicial)
- **Frontend:** Vercel ou Netlify (grátis para começar)
- **Email:** SendGrid free tier (100 emails/dia)
- **Storage (logos/fotos):** AWS S3 ou Cloudinary

**Arquitetura:**
```
src/
├── config/        # Database e app configuration
├── middlewares/   # Auth, error handling, validation
├── migrations/    # Knex database schema versions
├── routes/        # HTTP endpoint handlers
├── seeds/         # Test data (opcional)
└── services/      # Business logic (validation, queries)
```

**Pattern:** Routes handle HTTP, Services handle logic. Routes call services, never query DB directly.

### 4.2 Modelo de dados (PostgreSQL + Knex)

**Convenções (baseadas no `cofrinho-API`):**
- Colunas em snake_case (user_id, created_at)
- Timestamps automáticos (created_at, updated_at) via Knex
- UUIDs como primary keys para segurança
- Foreign keys com CASCADE DELETE
- Índices em colunas de busca frequente

```javascript
// Migration: organizations
exports.up = (knex) => {
  return knex.schema.createTable('organizations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.string('slug', 100).unique().notNullable();
    table.text('logo_url');
    table.timestamps(true, true); // created_at, updated_at
  });
};

// Migration: users (organizadores)
exports.up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable(); // bcryptjs 10 rounds
    table.string('name', 255).notNullable();
    table.string('role', 50).defaultTo('organizer'); // admin, organizer, receptionist
    table.timestamps(true, true);
    
    table.index('organization_id');
    table.index('email');
  });
};

// Migration: events
exports.up = (knex) => {
  return knex.schema.createTable('events', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.string('code', 50).unique().notNullable(); // ex: MOD09
    table.string('name', 255).notNullable();
    table.text('description');
    table.date('start_date').notNullable();
    table.date('end_date');
    table.string('location', 255);
    table.text('logo_url');
    table.uuid('created_by').references('id').inTable('users');
    table.timestamps(true, true);
    
    table.index('organization_id');
    table.index('code');
    table.index('start_date');
  });
};

// Migration: rooms (salas/trilhas)
exports.up = (knex) => {
  return knex.schema.createTable('rooms', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE');
    table.string('name', 255).notNullable(); // ex: "Sala A", "Trilha Marketing"
    table.integer('capacity');
    table.text('description');
    table.timestamps(true, true);
    
    table.index('event_id');
  });
};

// Migration: participants
exports.up = (knex) => {
  return knex.schema.createTable('participants', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE');
    table.uuid('room_id').references('id').inTable('rooms').onDelete('SET NULL');
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('cpf', 14);
    table.string('company', 255);
    table.string('job_title', 255);
    table.string('phone', 20);
    table.string('qr_code', 255).unique().notNullable(); // hash único para check-in
    table.enu('status', ['registered', 'checked_in', 'absent']).defaultTo('registered');
    table.timestamp('checked_in_at');
    table.jsonb('custom_fields'); // campos customizados por evento
    table.timestamps(true, true);
    
    table.unique(['event_id', 'email']); // um participante por email por evento
    table.index('event_id');
    table.index('qr_code');
    table.index('status');
    table.index('email');
  });
};

// Migration: check_ins (histórico de check-ins)
exports.up = (knex) => {
  return knex.schema.createTable('check_ins', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('participant_id').references('id').inTable('participants').onDelete('CASCADE');
    table.uuid('checked_in_by').references('id').inTable('users'); // quem fez o check-in
    table.timestamp('timestamp').defaultTo(knex.fn.now());
    table.string('method', 50); // 'qr_code', 'manual', 'search'
    
    table.index('participant_id');
    table.index('timestamp');
  });
};
```

**Padrão de validação de ownership (igual ao cofrinho-API):**

```javascript
// services/participants.js - padrão aprendido em cofrinho-API
const findByEventAndOwnership = async (eventId, participantId, organizationId) => {
  // 1. Buscar participante
  const participant = await knex('participants')
    .where({ id: participantId, event_id: eventId })
    .first();
  
  if (!participant) {
    throw new Error('Participante não encontrado');
  }
  
  // 2. Verificar se o evento pertence à organização do usuário
  const event = await knex('events')
    .where({ id: eventId, organization_id: organizationId })
    .first();
  
  if (!event) {
    throw new Error('Participante não encontrado'); // mensagem vaga (segurança)
  }
  
  return participant;
};

// Ordem de validação (industry standard do cofrinho-API):
// 1. Validar campos (rápido, sem DB)
// 2. Verificar ownership (query ao DB)
```

### 4.3 Arquitetura de Services e Routes (padrão cofrinho-API)

**Separação clara de responsabilidades:**

```
Routes (HTTP layer)          Services (Business logic)
├─ Recebem requisições      ├─ Validam dados
├─ Extraem params/body      ├─ Interagem com DB (Knex)
├─ Chamam services          ├─ Aplicam regras de negócio
└─ Retornam respostas       └─ Lançam erros descritivos
```

**Exemplo: Check-in de participante**

```javascript
// services/participants.js
module.exports = (app) => {
  const { knex } = app.config.database;

  const checkIn = async (eventId, participantId, userId) => {
    // 1. Validar campos (cheap)
    if (!eventId || !participantId) {
      throw new Error('Event ID e Participant ID são obrigatórios');
    }

    // 2. Buscar participante
    const participant = await knex('participants')
      .where({ id: participantId, event_id: eventId })
      .first();

    if (!participant) {
      throw new Error('Participante não encontrado');
    }

    // 3. Verificar ownership (evento pertence à org do usuário)
    const user = await knex('users').where({ id: userId }).first();
    const event = await knex('events')
      .where({ id: eventId, organization_id: user.organization_id })
      .first();

    if (!event) {
      throw new Error('Participante não encontrado'); // vago por segurança
    }

    // 4. Verificar se já fez check-in
    if (participant.status === 'checked_in') {
      throw new Error('Participante já fez check-in');
    }

    // 5. Atualizar status
    const [updated] = await knex('participants')
      .where({ id: participantId })
      .update({
        status: 'checked_in',
        checked_in_at: knex.fn.now(),
        updated_at: knex.fn.now()
      })
      .returning('*');

    // 6. Registrar histórico
    await knex('check_ins').insert({
      participant_id: participantId,
      checked_in_by: userId,
      timestamp: knex.fn.now(),
      method: 'manual'
    });

    return updated;
  };

  return { checkIn };
};
```

```javascript
// routes/participants.js
module.exports = (app) => {
  const checkIn = async (req, res, next) => {
    try {
      const { eventId, id } = req.params;
      const userId = req.user.id; // do auth middleware

      const participant = await app.services.participants.checkIn(eventId, id, userId);

      res.status(200).json(participant);
    } catch (err) {
      next(err); // error middleware trata
    }
  };

  return { checkIn };
};
```

**Middleware de autenticação (reutilizado do cofrinho-API):**

```javascript
// middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, organization_id }
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
```

**Registro de rotas no app.js:**

```javascript
// app.js
const express = require('express');
const app = express();

// Config
app.config = { database: require('./config/database') };

// Middlewares globais
app.use(express.json());
app.use(require('helmet')());
app.use(require('cors')());

// Services (factory pattern)
app.services = {
  users: require('./services/users')(app),
  events: require('./services/events')(app),
  participants: require('./services/participants')(app),
  // ...
};

// Routes
const authMiddleware = require('./middlewares/auth'); // plain pattern

app.use('/auth', require('./routes/auth')(app)); // sem auth
app.use('/events', authMiddleware, require('./routes/events')(app)); // com auth
app.use('/participants', authMiddleware, require('./routes/participants')(app));

// Error handling middleware (último)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
```

### 4.4 Práticas de segurança (aplicadas do cofrinho-API)

**1. Secrets em variáveis de ambiente:**
```bash
# .env (gitignored)
NODE_ENV=development
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=credenciamento
DB_USER=postgres
DB_PASSWORD=your_password

# .env.example (commitado)
NODE_ENV=development
PORT=3000
JWT_SECRET=change_this_in_production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=credenciamento
DB_USER=postgres
DB_PASSWORD=change_this
```

**2. Hashing de senhas (bcryptjs, 10 rounds):**
```javascript
// services/auth.js
const bcrypt = require('bcryptjs');

const signup = async (name, email, password) => {
  const hash = await bcrypt.hash(password, 10);
  
  const [user] = await knex('users')
    .insert({ name, email, password_hash: hash })
    .returning(['id', 'name', 'email']); // NUNCA retornar password_hash
  
  return user;
};
```

**3. JWT com expiração:**
```javascript
// services/auth.js
const jwt = require('jsonwebtoken');

const signin = async (email, password) => {
  const user = await knex('users').where({ email }).first();
  
  if (!user) {
    throw new Error('Email ou senha inválidos'); // mensagem vaga
  }
  
  const isValid = await bcrypt.compare(password, user.password_hash);
  
  if (!isValid) {
    throw new Error('Email ou senha inválidos'); // mesma mensagem
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email, organization_id: user.organization_id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return { token };
};
```

**4. Filtro universal por organization_id:**
```javascript
// SEMPRE filtrar por organization_id para multi-tenancy
const listEvents = async (userId) => {
  const user = await knex('users').where({ id: userId }).first();
  
  return knex('events')
    .where({ organization_id: user.organization_id }) // CRÍTICO
    .select('*');
};
```

**5. Mensagens de erro vagas para enumeração:**
```javascript
// ❌ MAU: revela se email existe
if (!user) throw new Error('Email não encontrado');
if (!isValid) throw new Error('Senha incorreta');

// ✅ BOM: mesma mensagem para ambos
throw new Error('Email ou senha inválidos');
```

**6. Validação de ownership em recursos aninhados:**
```javascript
// User → Event → Participant (hierarquia)
const deleteParticipant = async (eventId, participantId, userId) => {
  const user = await knex('users').where({ id: userId }).first();
  
  // 1. Verificar se evento pertence à organização
  const event = await knex('events')
    .where({ id: eventId, organization_id: user.organization_id })
    .first();
  
  if (!event) {
    throw new Error('Participante não encontrado'); // vago
  }
  
  // 2. Deletar participante (já sabemos que o evento é válido)
  const deleted = await knex('participants')
    .where({ id: participantId, event_id: eventId })
    .del();
  
  if (!deleted) {
    throw new Error('Participante não encontrado');
  }
  
  return true;
};
```

### 4.5 Fluxo de dados completo

```
1. ANTES DO EVENTO
   Organizador → Cria evento → Define salas → Gera link de inscrição
   ↓
   Participante → Acessa formulário → Preenche dados → Escolhe sala
   ↓
   Sistema → Gera QR Code único → Envia email confirmação
   ↓
   Organizador → Visualiza dashboard de inscrições

2. NO DIA DO EVENTO
   Recepcionista → Abre dashboard de check-in
   ↓
   Participante chega → Diz nome OU mostra QR Code
   ↓
   Recepcionista → Busca → Confirma identidade → Clica "Marcar Presença"
   ↓
   Sistema → Registra timestamp → Muda status → Habilita impressão
   ↓
   Sistema → Gera PDF da credencial → Imprime
   ↓
   Participante → Recebe credencial → Vai para sala

3. PÓS-EVENTO
   Organizador → Acessa relatórios
   ↓
   Sistema → Gera analytics (inscritos vs presentes, por sala, timeline)
   ↓
   Organizador → Exporta dados → Envia para sistema de certificados
```

---

## 5. WIREFRAMES DAS TELAS PRINCIPAIS

### 5.1 Dashboard de eventos (Organizador)
```
┌─────────────────────────────────────────────────────────┐
│ 🎯 EventCred                    Olá, João  [Sair]       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 Meus Eventos                  [+ Criar novo evento] │
│                                                          │
│  ┌──────────────────────────────────────────────┐      │
│  │ 📅 Módulo Harmonização (MOD09)               │      │
│  │    19 de julho de 2025 • São Paulo           │      │
│  │                                               │      │
│  │    📊 18 inscritos • 🟢 5 presentes          │      │
│  │    🚪 3 salas configuradas                   │      │
│  │                                               │      │
│  │    [Ver detalhes]  [Check-in]  [Relatórios] │      │
│  └──────────────────────────────────────────────┘      │
│                                                          │
│  ┌──────────────────────────────────────────────┐      │
│  │ 📅 Workshop Marketing Digital                 │      │
│  │    02 de agosto de 2025 • Rio de Janeiro     │      │
│  │                                               │      │
│  │    📊 32 inscritos • ⏺ Ainda não iniciado    │      │
│  │    🚪 2 salas configuradas                   │      │
│  │                                               │      │
│  │    [Ver detalhes]  [Check-in]  [Relatórios] │      │
│  └──────────────────────────────────────────────┘      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Check-in em tempo real (Recepção)
```
┌─────────────────────────────────────────────────────────┐
│ 🎯 Check-in: Módulo Harmonização                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🔍 Buscar participante:                                │
│  [________________] [Buscar] ou [📷 Escanear QR Code]  │
│                                                          │
│  📊 Presença: 5 de 18 (28%)  ████░░░░░░░░░░░░░░        │
│                                                          │
│  Filtrar: [Todos ▼] [Sala A ▼]  Ordenar: [Nome ▼]     │
│                                                          │
│  ┌──────────────────────────────────────────────┐      │
│  │ ✅ Adriana Costa David                       │      │
│  │    Empresa XYZ • Sala A                      │      │
│  │    🟢 Presente às 08:45                      │      │
│  │    [Ver detalhes] [Reimprimir credencial]    │      │
│  └──────────────────────────────────────────────┘      │
│                                                          │
│  ┌──────────────────────────────────────────────┐      │
│  │ ⏺ Alessandra Fernandes Cavalcante            │      │
│  │    Empresa ABC • Sala B                      │      │
│  │    🔴 Aguardando check-in                    │      │
│  │    [✓ Marcar Presença] [Imprimir Credencial] │      │
│  └──────────────────────────────────────────────┘      │
│                                                          │
│  ┌──────────────────────────────────────────────┐      │
│  │ ✅ Alessandra Goncalves de Oliveira          │      │
│  │    Freelancer • Sala A                       │      │
│  │    🟢 Presente às 08:52                      │      │
│  │    [Ver detalhes] [Reimprimir credencial]    │      │
│  └──────────────────────────────────────────────┘      │
│                                                          │
│  [Carregar mais...]                                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Relatório do evento
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Relatório: Módulo Harmonização                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📅 Período: 19 de julho de 2025                        │
│                                                          │
│  ┌─────────────────────────────────────────────┐       │
│  │ RESUMO GERAL                                 │       │
│  │                                              │       │
│  │  👥 Total de inscritos:  18                 │       │
│  │  ✅ Total de presentes:  15 (83%)           │       │
│  │  ❌ Ausentes:            3 (17%)            │       │
│  │                                              │       │
│  │  ⏰ Horário de pico: 08:45 - 09:15          │       │
│  └─────────────────────────────────────────────┘       │
│                                                          │
│  ┌─────────────────────────────────────────────┐       │
│  │ POR SALA/TRILHA                              │       │
│  │                                              │       │
│  │  🚪 Sala A                                   │       │
│  │     Inscritos: 8 • Presentes: 7 (88%)       │       │
│  │     ████████░                                │       │
│  │                                              │       │
│  │  🚪 Sala B                                   │       │
│  │     Inscritos: 6 • Presentes: 5 (83%)       │       │
│  │     ████████░░                               │       │
│  │                                              │       │
│  │  🚪 Sala C                                   │       │
│  │     Inscritos: 4 • Presentes: 3 (75%)       │       │
│  │     ███████░░░                               │       │
│  └─────────────────────────────────────────────┘       │
│                                                          │
│  📈 [Gráfico de chegadas ao longo do tempo]            │
│                                                          │
│  [📥 Exportar Excel] [📄 Exportar PDF]                 │
│  [📧 Enviar certificados para presentes]               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 6. MODELO DE NEGÓCIO

### 6.1 Precificação SaaS

- Até 5 eventos/ano
- 200 participantes por evento
- 2 usuários organizadores
- Relatórios básicos
- Suporte por email

- Até 12 eventos/ano
- 500 participantes por evento
- 5 usuários organizadores
- Relatórios avançados + analytics
- Suporte prioritário
- Logo customizável

- Eventos ilimitados
- Participantes ilimitados
- Usuários ilimitados
- White-label completo
- Integrações via API
- Suporte dedicado

**Modelo alternativo:** Pay-per-event
- Escalável para clientes ocasionais

### 6.2 Projeção financeira (conservadora)

**Ano 1:**

**Ano 2:**

**Ano 3:**

### 6.3 Vantagens competitivas

1. **Foco em eventos médios** - nicho negligenciado por grandes players
2. **UX brasileira** - fluxos adaptados à realidade local
3. **Preço acessível** - 50-70% mais barato que enterprise solutions
4. **Suporte próximo** - empresas médias valorizam atendimento humanizado
5. **Validação prévia** - cliente real desde o dia zero

---

## 7. ROADMAP DE DESENVOLVIMENTO

### Fase 1: MVP Funcional (2-3 meses)

**Sprint 1-2 (Semanas 1-4):**
- Setup inicial (repo, banco, deploy)
- Autenticação e cadastro de usuários
- CRUD de eventos
- CRUD de salas

**Sprint 3-4 (Semanas 5-8):**
- Formulário público de inscrições
- Sistema de emails (confirmação)
- Dashboard de inscrições para organizador
- Geração de QR Codes

**Sprint 5-6 (Semanas 9-12):**
- Interface de check-in
- Busca e filtros
- Marcação de presença
- Geração de credencial em PDF
- Relatórios básicos

**Sprint 7 (Semana 13):**
- Testes com cliente real
- Correções de bugs
- Ajustes de UX

### Fase 2: Validação de Mercado (6-12 meses)
- Onboarding de 5-10 clientes pagantes
- Iteração baseada em feedback
- Melhorias de performance
- Adição de features secundárias:
  - Campos customizados mais robustos
  - Templates de email customizáveis
  - Mais opções de relatórios
  - Branding por evento

### Fase 3: Escala e Sofisticação (12+ meses)
- Impressão térmica via WebUSB
- App mobile para check-in
- Integrações (CRM, pagamento, certificados)
- White-label para revendedores
- API pública para parceiros
- Analytics preditivos

---

## 8. RISCOS E MITIGAÇÕES

### Riscos técnicos
| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Complexidade subestimada | Alta | Alto | Começar com MVP mínimo, iterar |
| Problemas de performance com muitos check-ins simultâneos | Média | Médio | Usar Redis para cache, otimizar queries |
| Impressão de credenciais não funciona em todos os navegadores | Média | Baixo | Começar com PDF, hardware depois |
| Bug crítico durante evento ao vivo | Baixa | Altíssimo | Testes extensivos, modo offline, suporte 24/7 |

### Riscos de negócio
| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Mercado saturado, difícil adquirir clientes | Média | Alto | Foco em nicho específico, parcerias |
| Churn alto (clientes cancelam) | Média | Médio | Excelência em suporte, contrato anual |
| Concorrência de grandes players | Baixa | Médio | Diferenciação por preço e UX brasileira |

### Riscos pessoais (Ygor)
| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Perder motivação no meio do projeto | Média | Alto | Trabalhar com cliente real, validações rápidas |
| Conhecimento técnico insuficiente | Alta | Médio | Usar Claude Code, aprender fazendo, documentação |
| Tentar fazer tudo sozinho e não escalar | Alta | Médio | Aceitar limitações, contratar/parceria quando necessário |

---

## 9. PRÓXIMOS PASSOS IMEDIATOS

### ⚠️ BLOQUEADOR: Aguardando sistema de credenciamento real
Antes de começar o desenvolvimento, é **essencial** receber e analisar o sistema completo de credenciamento (não o FREQMDB). Isso evitará retrabalho e garantirá que todas as funcionalidades importantes sejam mapeadas.

### Esta semana (Semana 1) - REVISADO
- [ ] **PRIORIDADE:** Receber sistema de credenciamento completo do pai
- [ ] Explorar o sistema real em detalhes (todas as telas e funcionalidades)
- [ ] Tentar extrair/abrir banco de dados do sistema real
- [ ] Conversa estruturada com pai sobre funcionalidades completas
- [ ] Conversa com cliente potencial (empresa que comprou o sistema)
- [ ] Documentar diferenças entre FREQMDB e sistema real

### Após receber sistema real (Semana 2)
- [ ] Análise técnica completa do sistema
- [ ] Atualizar documento de especificação com descobertas
- [ ] Decisão final de stack técnica (Node vs Python)
- [ ] Definir escopo exato do MVP
- [ ] Setup inicial do repositório no GitHub

### Semana 3
- [ ] Configuração do ambiente de desenvolvimento
- [ ] Setup do banco PostgreSQL (local + produção)
- [ ] Primeira tela: login/cadastro
- [ ] Deploy inicial no Railway/Render

### Semana 4-5
- [ ] CRUD de eventos
- [ ] CRUD de salas
- [ ] Dashboard básico

---

## 10. PERGUNTAS PENDENTES

### ⚠️ PRIORIDADE MÁXIMA: Receber sistema real de credenciamento
**Aguardando o pai enviar o sistema completo de credenciamento** (não o FREQMDB). Quando recebido:
- Explorar todas as funcionalidades
- Documentar fluxos completos
- Mapear modelo de dados real
- Analisar layouts de credenciais
- Entender integração com impressoras
- Exportar e estudar estrutura do banco de dados

### Para o pai:
1. Fluxo completo atual: da inscrição até a impressão - como funciona hoje?
2. Tem backup dos dados em `.mdb`? Podemos extrair a estrutura?
3. Que impressoras eram usadas? Modelos específicos?
4. Formato da credencial: tamanho padrão? Campos obrigatórios?
5. Gestão por sala: o que exatamente isso significa? Múltiplas trilhas simultâneas?
6. Que relatórios eram necessários e não existiam?
7. O que era mais confuso ou lento de usar no sistema antigo?
8. Casos extremos: o sistema travava? Perdia dados? Quando?

1. Perfil dos eventos: quantos participantes típicos? Quantas salas?
2. Frequência: quantos eventos por ano?
3. Além do básico, que features seriam "uau" para vocês?
4. Infraestrutura: vocês têm impressoras? Internet estável? Equipe técnica?
5. Orçamento real: quanto pagariam por uma solução completa e moderna?
6. Prazos: quando seria o próximo evento que poderiam testar o sistema?

---

## 11. RECURSOS E REFERÊNCIAS

### Concorrentes para análise
- Sympla (Brasil) - eventos pagos, foco em ticketing
- Even3 (Brasil) - eventos acadêmicos
- Eventbrite (Global) - events de todos os tipos
- Cvent (Enterprise) - solução corporativa robusta

### Tecnologias a estudar
- **Backend:** Node.js + Express, Prisma ORM, JWT
- **Frontend:** React + Tailwind + Shadcn/UI
- **PDF:** jsPDF ou react-pdf
- **Email:** Nodemailer + templates
- **QR Code:** qrcode.js
- **Deploy:** Railway, Docker

### Documentação útil
- Multi-tenancy patterns: https://docs.microsoft.com/en-us/azure/architecture/patterns/multi-tenancy
- PostgreSQL best practices: https://wiki.postgresql.org/wiki/Don't_Do_This
- JWT authentication: https://jwt.io/introduction
- PDF generation: https://pspdfkit.com/blog/2019/generate-pdf-nodejs/

---

## 12. NOTAS FINAIS

Este projeto tem potencial real de se tornar um negócio sustentável porque:

1. ✅ **Problema validado** - sistema legado prova que há demanda
3. ✅ **Acesso ao mercado** - pai tem network na área de eventos
4. ✅ **Nicho específico** - eventos médios são negligenciados
5. ✅ **Conhecimento do domínio** - pai viveu os problemas na prática

**Maior desafio:** Execução técnica. Ygor tem forte capacidade de aprendizado e direção criativa ("vibe coding"), mas este projeto exige:
- Conhecimento full-stack web
- Arquitetura de sistemas
- Deploy e DevOps
- Manutenção e suporte

**Recomendação:** Usar Claude Code como parceiro técnico inicial, mas considerar seriamente contratar desenvolvedor sênior ou buscar co-founder técnico se o projeto ganhar tração nos primeiros 6 meses.

## 12. DECISÕES FINAIS DE BRANDING E INFRAESTRUTURA

### Nome escolhido: PORTARIA ✅

**Data da decisão:** 26 de dezembro de 2025

**Validações realizadas:**
- ✅ INPI Brasil - Busca inicial (básica): "PORTARIA" livre nas classes 41 e 42
- ⚠️ INPI Brasil - Busca radical (detalhada): Detectados conflitos com marcas existentes
  - "PORTARIA DIGITAL" (múltiplas, classe 42)
  - "PORTARIA INTELIGENTE" (classe 42)
  - "PORTARIA ONLINE" (classe 42)
  - "PORTARIA 4.0" (classe 41)
- ✅ Solução: "PORTARIA EVENTS" livre em ambas as classes (verificado 26/12/2025)
- ✅ Domínio portaria.events: DISPONÍVEL (registrado)
- ✅ Email contato@portaria.events: CONFIGURADO

**Estratégia de naming:**
- **Nome comercial:** Portaria (uso diário, marketing, conversas)
- **Marca registrável:** PORTARIA EVENTS (proteção legal no INPI)
- **Domínio:** portaria.events (reforça a marca)
- **Justificativa:** "PORTARIA EVENTS" é distintivo, único, e enfatiza o nicho

**Domínios registrados:**
- **Principal:** portaria.events (Cloudflare, renovação: 26/12/2026)
- **Status:** Ativo, protegido (2FA, WHOIS privacy, auto-renew)

**Domínios ocupados (não disponíveis):**
- portaria.io - Ocupado
- portaria.com - Ocupado  
- portaria.com.br - Ocupado

**Estratégia de domínio:**
- portaria.events como domínio principal
- Extensão .events reforça o nicho (eventos)
- SEO beneficiado pela extensão semântica
- Único no mercado (ninguém mais terá portaria.events)

**Email profissional:**
- contato@portaria.events (Cloudflare Email Routing)
- Gratuito, ilimitado, encaminhado para email pessoal
- Assinatura profissional configurada

**Marca registrada:**
- Status INPI: "PORTARIA EVENTS" LIVRE (verificado 26/12/2025)
- Classes: 41 (organização de eventos) + 42 (software/TI)
- Próximo passo: Protocolar registro em janeiro 2026
- Prazo de concessão: 12-24 meses
- Observação: Usar logo com "PORTARIA EVENTS" ou simplesmente "Portaria" (marca protege ambos)

**Investimento total em branding até agora:**

**Identidade visual:**
- Status: Pendente
- Timing: Após receber sistema legado (janeiro 2026)
- Sugestão de logo: "PORTARIA" em destaque, "events" menor ou como subtítulo

**Branding guidelines preliminares:**
- **Nome completo:** Portaria Events (marca registrada)
- **Nome comercial:** Portaria (uso diário)
- **Tagline sugerida:** "Credenciamento inteligente para eventos"
- **Tom de voz:** Profissional, acessível, brasileiro
- **Cores sugeridas:** Azul escuro (confiança) + Verde (confirmação/check)
- **Tipografia:** Sans-serif moderna (Inter, Poppins, Montserrat)

**Uso legal vs comercial:**
```
Uso diário/marketing:     "Portaria"
Marca registrada:         "PORTARIA EVENTS"
Contratos:                "PORTARIA EVENTS, marca registrada no INPI..."
Rodapé do site:           "© 2025 Portaria Events. Todos os direitos reservados."
```

---

## 13. APRENDIZADOS TRANSFERÍVEIS DO COFRINHO-API

Este projeto será construído com os mesmos padrões e práticas aprendidos durante o desenvolvimento do `cofrinho-API`, um projeto de API REST de finanças pessoais que Ygor está construindo atualmente.

### Conceitos já dominados (via cofrinho-API)

| Conceito | Aplicação no credenciamento |
|----------|----------------------------|
| **Hierarquia de recursos** | User → Account → Transaction = Organization → Event → Room → Participant |
| **JWT auth + middleware** | Sistema de login para organizadores |
| **Ownership verification** | Filtro por organization_id (multi-tenancy) |
| **Knex migrations** | Schema de eventos/inscrições |
| **Service/Route separation** | Mesma arquitetura clean |
| **Factory vs Plain patterns** | Services (factory), Middlewares (plain) |
| **Ordem de validação** | Campos primeiro (cheap), ownership depois (DB call) |
| **Mensagens de erro vagas** | Prevenir enumeração de recursos |
| **bcryptjs hashing** | Senhas com 10 rounds |
| **Environment variables** | Secrets nunca hardcoded |

### Estrutura de projeto reutilizável

O `cofrinho-API` serve como **boilerplate** para este projeto:

```
credenciamento-api/
├── src/
│   ├── config/
│   │   └── database.js          # Conexão Knex (igual)
│   ├── middlewares/
│   │   ├── auth.js              # JWT verification (reutilizar)
│   │   └── errorHandler.js      # Error handling (adicionar)
│   ├── services/
│   │   ├── organizations.js     # = users.js do cofrinho
│   │   ├── events.js            # = accounts.js do cofrinho
│   │   ├── rooms.js             # novo
│   │   └── participants.js      # = transactions.js do cofrinho
│   ├── routes/
│   │   ├── auth.js              # signin/signup (reutilizar)
│   │   ├── events.js            # CRUD de eventos
│   │   ├── rooms.js             # CRUD de salas
│   │   └── participants.js      # inscrições + check-in
│   ├── migrations/              # Knex migrations
│   ├── app.js                   # Express setup (reutilizar)
│   └── server.js                # Server startup (reutilizar)
├── .env                         # Secrets (gitignored)
├── .env.example                 # Template
├── .gitignore                   # Node patterns
└── knexfile.js                  # Knex config
```

### Padrões de código internalizados

**1. Service layer (factory pattern):**
```javascript
// services/events.js
module.exports = (app) => {
  const { knex } = app.config.database;

  const create = async (data, userId) => {
    // Validação + lógica de negócio
  };

  const findAll = async (userId) => {
    // Query com filtro de ownership
  };

  return { create, findAll, /* ... */ };
};
```

**2. Route layer (factory pattern):**
```javascript
// routes/events.js
module.exports = (app) => {
  const create = async (req, res, next) => {
    try {
      const result = await app.services.events.create(req.body, req.user.id);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  return { create, /* ... */ };
};
```

**3. Auth middleware (plain pattern):**
```javascript
// middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

### Funcionalidades extras a adicionar

Comparado ao `cofrinho-API`, o sistema de credenciamento precisa de:

| Feature | Complexidade | Estratégia |
|---------|--------------|------------|
| **Geração de QR Code** | Baixa | Biblioteca `qrcode` |
| **Envio de emails** | Média | Nodemailer + templates |
| **Geração de PDF** | Média | jsPDF ou PDFKit |
| **Check-in em tempo real** | Média | WebSocket (opcional MVP) ou polling |
| **Formulário público** | Baixa | Rota não-autenticada |
| **Relatórios complexos** | Média | Queries Knex + agregações |

### Vantagens da abordagem incremental

**Por terminar cofrinho-API primeiro:**
1. ✅ Confiança em padrões de arquitetura
2. ✅ Boilerplate testado e funcional para reutilizar
3. ✅ Conhecimento de debugging e troubleshooting
4. ✅ Familiaridade com Knex, JWT, bcrypt
5. ✅ Entendimento de multi-tenancy via filtros

**Ao começar credenciamento-API:**
1. Copiar estrutura base do cofrinho-API
2. Adaptar migrations para novo domínio
3. Focar nas features específicas (QR, PDF, emails)
4. Reutilizar 60-70% do código de auth/middleware/config

### Cronograma sugerido (ATUALIZADO - 26/12/2025)

**✅ Fase 0: Naming e Infraestrutura (CONCLUÍDA)**
- [x] Pesquisa e brainstorming de nomes
- [x] Verificação INPI (classes 41 e 42)
- [x] Registro de domínio portaria.events
- [x] Configuração de email contato@portaria.events
- [x] Ativação de proteções (2FA, WHOIS privacy, auto-renew)
- **Status:** COMPLETO ✅ (26/12/2025)

**Fase 1: Completar cofrinho-API (1-2 semanas - Dez/Jan 2026)**
- [ ] Error handling middleware
- [ ] Proteger users route com auth
- [ ] Refinar validações
- [ ] Documentar aprendizados

**Fase 2: Analisar sistema legado (1 semana - Jan 2026)**
- [ ] Receber sistema real do pai
- [ ] Mapear funcionalidades completas
- [ ] Atualizar especificação
- [ ] Definir escopo exato do MVP

**Fase 2.5: Branding básico (Jan 2026)**
- [ ] Paleta de cores e tipografia

**Fase 3: Setup portaria-api (1 semana - Jan 2026)**
- [ ] Copiar boilerplate do cofrinho-API
- [ ] Criar migrations de events/rooms/participants
- [ ] Setup auth e middleware
- [ ] Deploy inicial

**Fase 4: Features core (4-6 semanas - Fev/Mar 2026)**
- [ ] CRUD de events/rooms
- [ ] Sistema de inscrições
- [ ] Check-in com QR Code
- [ ] Geração de credencial PDF
- [ ] Relatórios básicos

**Fase 5: Validação com cliente (2 semanas - Mar 2026)**
- [ ] Testes com cliente real
- [ ] Ajustes de UX
- [ ] Correções de bugs

---

**Documento gerado em:** 26 de dezembro de 2025  
**Última atualização:** 26 de dezembro de 2025 (23:59)

**Marcos atingidos:**
- ✅ Nome definido e validado: Portaria
- ✅ Domínio registrado: portaria.events
- ✅ Email configurado: contato@portaria.events
- ✅ Infraestrutura protegida (2FA, WHOIS privacy)
- ✅ INPI verificado: marca livre nas classes 41 e 42
- ✅ Especificação técnica completa

**Equity:** 100% (solo founder)  
**Próximo milestone:** Receber sistema legado + finalizar cofrinho-API
