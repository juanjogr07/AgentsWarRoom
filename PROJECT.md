# AgentWarRoom
### Engineering Command Center — Generative UI Hackathon

> *"What if your AI didn't answer in text — it rendered the exact dashboard you needed, right now?"*

---

## El Problema

Los ingenieros pierden tiempo crítico durante incidentes buscando dashboards, cruzando datos de servicios con el estado del sprint, y ejecutando acciones en 4 herramientas distintas. Los chatbots no ayudan — te dan texto cuando necesitas acción.

## La Solución

**AgentWarRoom** es un command center de ingeniería donde el agente **genera la UI en tiempo real** según lo que preguntas. No hay páginas pre-construidas. No hay dashboards fijos. El agente decide qué mostrar y lo renderiza instantáneamente.

```
Tú preguntas → el agente elige componentes → la UI aparece → tú actúas
```

---

## ¿Qué puede hacer?

### Modo 1 — Board (Visualización)
El agente renderiza el panel exacto que necesitas para entender el problema:

- **`IncidentDashboard`** — vista completa del incidente: severidad P1/P2/P3, timeline, servicios afectados
- **`ServiceHealth`** — grid en tiempo real de todos los servicios: latencia p99, error rate, RPS
- **`SprintBoard`** — estado del sprint: tareas en vuelo, bloqueadas con su blocker, días restantes
- **`MetricsChart`** — gráfica de cualquier métrica en el tiempo: latencia, error rate, memoria

### Modo 2 — Copilot (Acción)
Cuando necesitas actuar, el agente renderiza tarjetas de confirmación con contexto e impacto:

- **`RollbackCard`** — confirmar rollback con diff de cambios, versión objetivo, tiempo estimado, usuarios afectados
- **`EscalateCard`** — escalar incidente con on-call engineer, canal de Slack, impacto al negocio

### Modo 3 — Compose (Automatización)
Para acciones multi-sistema, el agente descubre herramientas MCP y arma workflows:

- **`MCPComposer`** — combina Slack + PagerDuty + GitHub en un flujo de un click
- **`WorkflowBuilder`** — steps ejecutables con estado en tiempo real (pending → running → done)

---

## Demo en 90 segundos

```
1. "hay un incidente en auth-service, muéstrame qué está pasando"
   → IncidentDashboard (P1, 8 min activo) + ServiceHealth (auth: error rate 2.1%)

2. Click "↩ Rollback"
   → RollbackCard (v2.5.0 → v2.4.1, ~2 min, 1,240 usuarios afectados)

3. Confirmar rollback
   → WorkflowBuilder (5 pasos: acknowledge → notify → rollback → verify → postmortem)

4. "arma un workflow para escalar y notificar al equipo"
   → MCPComposer (PagerDuty + Slack + GitHub compuestos en un solo click)
```

**Imposible como chatbot.** Un chatbot te daría instrucciones de texto. AgentWarRoom te da botones, gráficas y acciones confirmables — generados en el momento.

---

## Estilo Visual

```
Dark engineering aesthetic
├── Background: #030712 (casi negro)
├── Tipografía: monospace (Geist Mono / JetBrains Mono)
├── Colores de estado:
│   ├── P1 / Error → red-500  (#ef4444)
│   ├── Warning    → yellow-500 (#eab308)
│   ├── Healthy    → green-400 (#4ade80)
│   ├── Info       → blue-400  (#60a5fa)
│   └── Compose    → purple-400 (#c084fc)
├── Borders: sutiles, 1px, gris oscuro
└── Cards: bg-gray-950 con border de color según severidad
```

Inspirado en terminales de ingeniería reales: Datadog, PagerDuty, GitHub Actions. No es un dashboard corporativo — es una sala de guerra.

---

## Arquitectura

```
┌─────────────────────────────────────────┐
│           M1 — agentstudio-core          │
│  Next.js 15 + CopilotKit + Gemini Flash  │
│                                          │
│  ComponentRegistry ←── lee descripciones │
│       ↑                    ↓             │
│  M2 + M3              agente decide      │
│  registran sus           qué renderizar  │
│  componentes                             │
└──────────┬──────────────────┬────────────┘
           │                  │
   ┌───────┴──────┐  ┌────────┴──────┐
   │ M2 — board   │  │ M3 — actions  │
   │ Visualización│  │ Confirmaciones│
   │ recharts +   │  │ Workflows +   │
   │ grids        │  │ MCP Composer  │
   └──────────────┘  └───────────────┘
```

El agente nunca importa componentes directamente. Lee las **descripciones** del registro y llama `renderComponents({ name, data })`. Agregar un componente nuevo = exportarlo desde M2 o M3. El agente lo descubre automáticamente.

---

## Tech Stack

| Layer | Tecnología |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| Agent | CopilotKit 1.57 |
| LLM | Google Gemini 2.0 Flash |
| UI | Tailwind CSS + monospace theme |
| Charts | Recharts |
| M2/M3 build | tsup (ESM + CJS + types) |

---

## Tracks del hackathon

- ✅ **Kill the Dashboard** — no hay dashboards pre-construidos. El agente genera el panel exacto.
- ✅ **The Copilot That Ships** — los componentes de acción ejecutan operaciones reales con confirmación.
- ✅ **Agent App Store** — MCPComposer descubre y compone tools de múltiples servicios.

---

## Equipo

| Módulo | Responsable | Repo |
|--------|-------------|------|
| M1 — Core (host app, agent) | Juan | `juanjogr07/agentstudio-core` |
| M2 — Board (visualización) | - | `juanjogr07/agentstudio-board` |
| M3 — Actions (acciones) | - | `juanjogr07/agentstudio-actions` |

---

*Built at AI Tinkerers Generative UI Global Hackathon · May 9, 2026*
