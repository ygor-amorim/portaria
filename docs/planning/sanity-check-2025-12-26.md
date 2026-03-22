# Sanity Check - 26 de Dezembro de 2025

**Contexto:** Revisão de viabilidade do projeto com Claude Code após finalizar sessão do cofrinho-API.

---

## Veredicto: VIÁVEL

O projeto está bem dimensionado para um desenvolvedor solo aprendendo. Não está mordendo mais do que consegue mastigar.

---

## Avaliação de Viabilidade

| Fator | Veredicto | Justificativa |
|-------|-----------|---------------|
| Complexidade técnica | Gerenciável | 80% é CRUD + auth (aprendendo no cofrinho-API). 20% são libs documentadas (PDF, QR, email). |
| Escopo para solo dev | Apropriado | MVP enxuto: eventos, participantes, check-in, relatórios básicos. |
| Curva de aprendizado | Íngreme mas linear | Cada passo constrói sobre o anterior. Sem saltos no escuro. |

---

## Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Perda de motivação | Média | Alto | Milestones internos + demos para cliente |
| Frontend demora mais que esperado | Alta | Médio | Contratar ajuda ou usar low-code para MVP |
| Scope creep | Média | Alto | Aderir ao MVP ferozmente - nada de "nice to have" até primeira venda |

---

## Análise de Cenários

**Pior caso:**
- 6 meses de trabalho, projeto morre
- Ganho: Portfolio completo, experiência real com Node/Express/PostgreSQL

**Melhor caso:**

**Caso esperado:**
- Algo no meio. Aprendizado significativo, 1-2 clientes pagantes, opcionalidade.

---

## Decisões Estratégicas Confirmadas

### 1. Backend First
Dada baixa experiência com frontend (apenas HTML/CSS básico), construir API completa primeiro. Testar com PowerShell/Postman. Frontend depois.

### 2. Opções de Frontend para MVP
1. **Aprender React** - mais lento, controle total
3. **Low-code (Retool/Appsmith)** - conecta direto na API, prototipagem rápida

Opção 3 interessante para MVP: API real + frontend low-code. Rebuild em React depois se validar.

### 3. Reverse Engineering do .exe
Sem código fonte disponível - apenas .exe. Estratégia:
- Rodar o .exe, screenshot de cada tela
- Documentar workflows (criar evento → adicionar participante → check-in → imprimir)
- Abrir arquivos .mdb com MDB Viewer para extrair schema do banco
- Foco em funcionalidade, não em código legado

Não tentar copiar código. Reimaginar do zero com patterns modernos.

### 4. Milestones Internos
Sem pressão externa do cliente (não sabe que estamos construindo). Criar accountability própria:

| Prazo | Milestone |
|-------|-----------|
| Fim de Janeiro | cofrinho-API completo, questionário do pai analisado |
| Fim de Fevereiro | portaria-api core (auth + events + participants) |
| Fim de Março | Fluxo de check-in funcionando (mesmo que feio) |
| Abril | Primeira demo para cliente insider |

---

## Conclusão

O projeto é desafiador o suficiente para crescer, mas restrito o suficiente para terminar. A mentalidade está correta: "se não der certo, pelo menos aprendi."

Próximo passo: Finalizar cofrinho-API, depois começar portaria-api.

---

**Documento gerado em:** 26 de dezembro de 2025
**Fonte:** Conversa com Claude Code após sessão de desenvolvimento do cofrinho-API
