# Portaria - MVP Roadmap

**Status:** READY FOR DEVELOPMENT - Questionnaire analyzed, MVP scope defined
**Criado em:** 26 de dezembro de 2025
**Última revisão:** 31 de dezembro de 2025

---

## Fase 0: Preparação (Dezembro 2025 - Janeiro 2026)

**Objetivo:** Finalizar aprendizado técnico e coletar requisitos

### Semana 1-2 (27 Dez - 10 Jan)
- [x] ~~Finalizar cofrinho-API~~ **CORE DONE**
  - [x] ~~Error handling middleware~~
  - [x] ~~Proteger users route com auth~~
  - [ ] Finalizar testes automatizados (opcional, em progresso)
  - [x] ~~Documentar aprendizados~~
- [x] ~~Aguardar resposta do questionário (pai)~~ **DONE** (30/12/2025)

### Semana 3-4 (11 Jan - 24 Jan)
- [x] ~~Receber sistema legado~~ **DONE** - Received VISITMAIL
- [x] Análise do sistema legado **DONE** (28/12/2025)
  - [x] Screenshot de todas as telas
  - [x] Documentar workflows completos
  - [x] ~~Extrair schema do banco (.DB Paradox)~~ **DONE** (28/12/2025)
  - [x] Listar funcionalidades existentes
  - [x] Identificar gaps vs especificação
  - [x] Identificar bugs críticos (5 found)
- [x] Revisar este roadmap com base nas descobertas **DONE**
- [ ] Logo básico (Canva ou designer)

**Entregável:** ~~Documento de análise do legado~~ **DONE:** `docs/research/legacy-system/analise-sistema-legado-visitmail.md`

### Descobertas da Análise do Legado

**Sistema:** VISITMAIL (2005, Delphi + Paradox)
- Owner: Olho Nú (pai's company)
- Developer: Single unnamed contractor
- 5 bugs críticos (crashes, plain text passwords)
- Funcional mas obsoleto e instável
- Substituição completa justificada

**Arquitetura legado:**
- Multi-file database (1 set of 3 tables per event)
- Tables: `{EVENT}`, `{EVENT}_etiqueta`, `{EVENT}_presenca`
- Global tables: `Eventos`, `Usuario`, `Tipo_participante`, `Atividade_participante`, `uf`

**Features a manter no novo:**
- Login multi-evento
- Cadastro de participantes (simplificar campos)
- Check-in com feedback visual (melhorar)
- Impressão de credencial (melhorar layout)
- Relatórios filtráveis
- Import/Export Excel (tornar robusto)

**Features a NÃO migrar:**
- Campo FAX (obsoleto)
- Endereço completo (desnecessário)
- Código de barras (usar QR Code)

### Descobertas do Questionário (30/12/2025)

**Respondente:** o respondente (pai) - 20 anos de experiência com o sistema
**Análise completa:** `docs/planning/analise-questionario-sistema-legado.md`

**Insight principal:** O problema NÃO é falta de funcionalidades - é **estabilidade e confiabilidade**.

**Única feature CRÍTICA:** Confirmação automática por email

**Requisitos confirmados:**
- Excel import é MUST-HAVE (workflow depende disso)
- Salas/trilhas é feature NOVA (legado não tinha)
- Eventos de 50-5000 participantes, 2-3 dias duração
- 3-10 operadores simultâneos
- Internet às vezes instável (MVP aceita dependência, offline fase 2)

**Decisões Occam's Razor (31/12/2025):**
- PDF primeiro, impressão térmica fase 2
- Certificados fase 2
- Pricing a discutir após MVP funcional

**Mercado validado:** 3-4 empresas interessadas conhecidas

---

## Fase 1: Setup e Fundação (Janeiro - Fevereiro 2026)

**Objetivo:** Infraestrutura técnica pronta

### Semana 5-6 (25 Jan - 7 Fev)
- [ ] Criar repositório portaria-api
- [ ] Copiar boilerplate do cofrinho-API
  - [ ] Config, middlewares, estrutura de pastas
  - [ ] Auth middleware (reutilizar)
  - [ ] Error handling middleware
- [ ] Setup PostgreSQL local
- [ ] Criar migrations iniciais
  - [ ] organizations
  - [ ] users
  - [ ] events
  - [ ] rooms
  - [ ] participants
  - [ ] check_ins
- [ ] Deploy inicial (Railway ou Render)
- [ ] Configurar .env e variáveis de ambiente

**Entregável:** API rodando em produção com auth funcionando

---

## Fase 2: Core Backend (Fevereiro 2026)

**Objetivo:** CRUD completo de eventos e participantes

### Semana 7-8 (8 Fev - 21 Fev)
- [ ] Service + Route: Organizations
  - [ ] CRUD básico
  - [ ] Multi-tenancy setup
- [ ] Service + Route: Events
  - [ ] Create, Read, Update, Delete
  - [ ] Filtro por organization_id
  - [ ] Validações (datas, campos obrigatórios)
  - [ ] Event code generation (like legacy: PORT25, TECH2004)
- [ ] Service + Route: Rooms
  - [ ] CRUD vinculado a eventos
  - [ ] Capacidade opcional

### Semana 9-10 (22 Fev - 7 Mar)
- [ ] Service + Route: Participants
  - [ ] Inscrição (create)
  - [ ] Listagem com filtros (by name, company, status)
  - [ ] Edição e exclusão
  - [ ] Geração de QR Code único
  - [ ] Validação de email único por evento
- [ ] Service + Route: Participant Types (like legacy Tipo_participante)
  - [ ] CRUD simples (code + description)
- [ ] Testar todos os endpoints via PowerShell
- [ ] Documentar API (endpoints, params, responses)

**Entregável:** API completa para gestão de eventos e inscrições

---

## Fase 3: Check-in e Credenciamento (Março 2026)

**Objetivo:** Fluxo core de credenciamento funcionando

### Semana 11-12 (8 Mar - 21 Mar)
- [ ] Service: Check-in
  - [ ] Marcar presença por ID
  - [ ] Marcar presença por QR Code
  - [ ] Registrar timestamp e método
  - [ ] Impedir check-in duplicado
  - [ ] **Visual feedback** (learn from legacy bug: no confirmation)
- [ ] Service: Credencial
  - [ ] Gerar PDF com dados do participante
  - [ ] Layout melhorado vs legado (nome, empresa, tipo, sala, QR)
  - [ ] Include event logo (legacy had this)
  - [ ] Endpoint para download
- [ ] Testar fluxo completo via API

### Semana 13-14 (22 Mar - 4 Abr)
- [ ] Service: Relatórios básicos
  - [ ] Inscritos vs presentes (totais)
  - [ ] Presentes por sala
  - [ ] Lista de ausentes
  - [ ] Exportação CSV/Excel
- [ ] Envio de email de confirmação (Nodemailer)
  - [ ] Template básico
  - [ ] Incluir QR Code no email

**Entregável:** Backend do MVP completo e testado

---

## Fase 4: Frontend MVP (Abril 2026)

**Objetivo:** Interface mínima usável

### Abordagem: Decidir antes de começar
- [ ] Decisão: React próprio vs Freelancer vs Low-code
- [ ] Se low-code: configurar Retool/Appsmith
- [ ] Se freelancer: contratar e briefar
- [ ] Se React: setup inicial + aprendizado

### Semana 15-18 (5 Abr - 2 Mai)
- [ ] Tela: Login/Cadastro (fix legacy bugs: no premature validation)
- [ ] Tela: Dashboard de eventos (legacy had empty screen after login)
- [ ] Tela: Criar/editar evento
- [ ] Tela: Lista de participantes (with filters like legacy)
- [ ] Tela: Check-in (busca + marcar presença + **confirmation feedback**)
- [ ] Tela: Relatório básico

**Entregável:** Interface funcional conectada à API

---

## Fase 5: Validação (Maio 2026)

**Objetivo:** Testar com usuário real

### Semana 19-20 (3 Mai - 16 Mai)
- [ ] Demo interno (pai)
- [ ] Coletar feedback
- [ ] Lista de bugs e ajustes
- [ ] Priorizar correções

### Semana 21-22 (17 Mai - 30 Mai)
- [ ] Corrigir bugs críticos
- [ ] Ajustes de UX baseados em feedback
- [ ] Preparar demo para cliente

### Semana 23-24 (31 Mai - 13 Jun)
- [ ] Negociar primeiro contrato

**Entregável:** Cliente pagante ou feedback estruturado para pivotar

---

## Milestones Resumidos

| Data | Milestone | Status |
|------|-----------|--------|
| 28 Dez 2025 | Análise do legado completa | **DONE** |
| 28 Dez 2025 | cofrinho-API core complete | **DONE** |
| 30 Dez 2025 | Questionário respondido e analisado | **DONE** |
| 31 Dez 2025 | MVP scope definido (Occam's Razor) | **DONE** |
| 24 Jan 2026 | INPI protocolado + logo | |
| 7 Fev 2026 | portaria-api rodando em produção | |
| 7 Mar 2026 | CRUD completo (eventos, salas, participantes) | |
| 4 Abr 2026 | Backend MVP pronto (check-in, PDF, relatórios, email) | |
| 2 Mai 2026 | Frontend MVP funcional | |
| 13 Jun 2026 | Primeira venda ou decisão de pivotar | |

---

## Riscos por Fase

| Fase | Risco Principal | Mitigação |
|------|-----------------|-----------|
| 0 | ~~Pai demora para enviar sistema~~ | **RESOLVED** |
| 1 | Setup mais complexo que esperado | Reutilizar máximo do cofrinho-API |
| 2 | Escopo creep nos endpoints | Aderir ao MVP, nada de "nice to have" |
| 3 | PDF/email mais difícil que esperado | Começar simples, iterar |
| 4 | Frontend demora muito | Considerar low-code ou freelancer |
| 5 | Cliente não gosta do produto | Coletar feedback cedo, ajustar |

---

## Definição de "Pronto" (MVP)

O MVP está pronto quando:
- [ ] Organizador consegue criar evento com salas
- [ ] Organizador consegue importar participantes via Excel/CSV
- [ ] Participante consegue se inscrever (API ou form básico)
- [ ] Recepcionista consegue fazer check-in por busca
- [ ] Sistema gera PDF de credencial para download
- [ ] Organizador consegue ver relatório de presença (inscritos vs presentes)
- [ ] Sistema envia email de confirmação de inscrição (CRÍTICO)

**Não inclui no MVP (Fase 2+):**
- Check-in por QR Code scanner (busca por nome é suficiente)
- Impressão térmica direta (PDF primeiro)
- Certificados de participação
- Múltiplos usuários por organização
- White-label/branding avançado
- App mobile
- Integrações com terceiros
- Modo offline

---

## Notas

1. **Fase 0 complete.** Legacy analysis + questionnaire done. Ready to code.
2. **cofrinho-API core done.** Boilerplate ready to copy.
3. **Datas são tentativas.** Ajustar baseado em velocidade real.
4. **Backend first.** Frontend só começa após backend MVP completo.
5. **Learn from legacy bugs.** Especially: validation timing, visual feedback.
6. **Excel import is MUST-HAVE.** Workflow depends on it - não é opcional.
7. **Email confirmation is CRITICAL.** Única feature marcada como crítica no questionário.
8. **Stability > Features.** O problema do legado era instabilidade, não falta de features.

---

**Próxima revisão:** Após setup do portaria-api (Fevereiro 2026)
