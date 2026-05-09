'use client'

import { useState, useEffect } from 'react'
import {
  CopilotKit,
  useCopilotReadable,
  useCopilotAction,
  useCopilotChat,
  useCopilotAdditionalInstructions,
} from '@copilotkit/react-core'
import { CopilotSidebar } from '@copilotkit/react-ui'
import { TextMessage, Role } from '@copilotkit/runtime-client-gql'
import { ComponentRegistry } from '@/contracts/registry'
import type { AgentDecision, AgentAction } from '@/contracts/types'

async function loadModules() {
  const registry = ComponentRegistry.getInstance()
  const [board, actions] = await Promise.all([
    import('@agentstudio/board'),
    import('@agentstudio/actions'),
  ])
  registry.registerAll(board.boardComponents)
  registry.registerAll(actions.actionComponents)
}

function actionToPrompt(action: AgentAction): string {
  const p = action.payload ?? {}
  const id = (p.incidentId ?? p.id ?? '') as string
  switch (action.type) {
    case 'rollback':
      return `[ACCIÓN CONFIRMADA] El usuario aprobó un rollback${id ? ` del incidente ${id}` : ''}. Muestra RollbackCard con los datos del deploy de auth-service (currentVersion v2.5.0 → targetVersion v2.4.1).`
    case 'rollback_confirmed':
      return `[ROLLBACK EJECUTADO] El rollback fue confirmado. Muestra WorkflowBuilder con los pasos del proceso de rollback en curso.`
    case 'escalate':
    case 'page_oncall':
      return `[ACCIÓN CONFIRMADA] El usuario aprobó escalar${id ? ` el incidente ${id}` : ''}. Muestra EscalateCard con el ingeniero de guardia y canal de Slack.`
    case 'escalate_confirmed':
      return `[ESCALACIÓN EJECUTADA] Se notificó al equipo. Muestra WorkflowBuilder con los próximos pasos de respuesta al incidente.`
    case 'resolve_incident':
      return `[INCIDENTE RESUELTO] El usuario marcó el incidente${id ? ` ${id}` : ''} como resuelto. Muestra IncidentDashboard con status "resolved" y el tiempo de resolución.`
    case 'create_incident':
      return `[NUEVO INCIDENTE] El usuario abrió un incidente a partir de alertas activas. Muestra IncidentDashboard con el nuevo incidente y ServiceHealth del estado actual.`
    case 'investigate_service':
      return `[INVESTIGACIÓN] El usuario quiere investigar el servicio ${(p.service as string) ?? ''}. Muestra MetricsChart con la latencia p99 y AlertFeed con las alertas activas de ese servicio.`
    case 'post_to_slack':
      return `[SLACK] El usuario posteó al canal ${(p.channel as string) ?? '#incidents'}. Confirma y muestra WorkflowBuilder con los siguientes pasos de respuesta.`
    case 'workflow_complete':
      return `[WORKFLOW COMPLETADO] Todos los pasos finalizaron. Muestra un resumen y el estado actual del sistema.`
    case 'execute_workflow':
      return `[WORKFLOW INICIADO] El usuario ejecutó el workflow MCP. Muestra WorkflowBuilder animado con los pasos ejecutándose.`
    case 'cancel':
      return `[CANCELADO] El usuario canceló la acción. ¿Hay algo más en lo que pueda ayudar con el sistema?`
    default:
      return `[ACCIÓN: ${action.label}] El usuario ejecutó una acción. Payload: ${JSON.stringify(p)}. Responde con los componentes UI más apropiados.`
  }
}

const DEMO_CONTEXT = `
DEMO CONTEXT — use this data when populating components:

Active incident: id="INC-2026-047", title="auth-service: latency spike (+400ms)", severity="P1", status="investigating",
  startedAt=8 minutes ago, affectedServices=["auth-service","api-gateway","user-sessions"],
  timeline=[{at: 8min ago, event: "Alert triggered: p99 > 500ms"}, {at: 6min ago, event: "On-call paged: @juan"}, {at: 3min ago, event: "Root cause identified: DB connection pool exhausted"}]

Services: auth-service (degraded, p99:610ms, error:2.1%), user-sessions (degraded, p99:890ms, error:1.8%), prod-api (healthy), api-gateway (healthy), billing-service (healthy)

Deploy history (auth-service): v2.5.0 (in_progress, 6min ago, @carlos, 8 commits), v2.4.1 (success, 2h ago, @juan), v2.4.0 (success, 24h ago, @maria)

Rollback data: service="auth-service", currentVersion="v2.5.0", targetVersion="v2.4.1", estimatedTime="2-3 minutes", affectedUsers=1240,
  changes=["feat: new JWT validation logic","perf: connection pool size increased to 50","fix: session timeout edge case"]

Escalation: incidentId="INC-2026-047", severity="P1", oncallEngineer={name:"Juan Gomez",handle:"@juan",pagerdutyId:"PD-JG01"},
  slackChannel="#incidents-p1", affectedUsers=1240, businessImpact="Login failures for ~1.2k active users. Auth API success rate: 97.9%"

On-call: team="Platform Engineering", primary={name:"Juan García",handle:"@juan",phone:"+52 55 1234 5678",schedule:"Weekday Rotation",until: 16h from now},
  secondary={name:"María López",handle:"@maria",schedule:"Backup Rotation",until: 16h from now}, escalationPolicy="PagerDuty · 5min escalation"

Workflow (P1 response): title="P1 Incident Response — auth-service",
  steps=[{id:1,title:"Acknowledge in PagerDuty",tool:"pagerduty",status:"pending"},{id:2,title:"Post to #incidents-p1",tool:"slack",status:"pending"},
         {id:3,title:"Rollback auth-service v2.5.0→v2.4.1",tool:"github",status:"pending"},{id:4,title:"Verify health post-rollback",tool:"monitor",status:"pending"},
         {id:5,title:"Create postmortem ticket",tool:"jira",status:"pending"}]

MCP tools: slack, pagerduty, github.

Alerts: [{id:"ALT-001",service:"auth-service",message:"p99 latency > 500ms",severity:"critical",firedAt: 8min ago,resolved:false},
         {id:"ALT-002",service:"user-sessions",message:"Error rate > 1.5%",severity:"warning",firedAt: 7min ago,resolved:false},
         {id:"ALT-003",service:"api-gateway",message:"Queue depth > 1000",severity:"warning",firedAt: 5min ago,resolved:false}]

Sprint: sprintName="Sprint 14", daysRemaining=2,
  tasks=[{id:"T-101",title:"Auth token refresh flow",status:"in_flight",assignee:"@maria"},
         {id:"T-102",title:"Rate limiting middleware",status:"blocked",assignee:"@carlos",blocker:"Waiting for infra quota approval"},
         {id:"T-103",title:"Session cleanup cron",status:"done",assignee:"@juan"},
         {id:"T-104",title:"DB connection pool config",status:"blocked",assignee:"@juan",blocker:"Related to current incident INC-2026-047"}]

Latency chart: metric="auth-service p99 latency", unit="ms", threshold=300 — generate 30 data points: first 22 around 150-200ms, last 8 spiking to 400-800ms.
`

function AgentWarRoom() {
  const registry = ComponentRegistry.getInstance()
  const [activeComponents, setActiveComponents] = useState<AgentDecision['components']>([])
  const [modulesLoaded, setModulesLoaded] = useState(false)
  const { appendMessage } = useCopilotChat()

  useEffect(() => {
    loadModules().then(() => setModulesLoaded(true))
  }, [])

  useCopilotAdditionalInstructions({
    instructions: `You are the AgentWarRoom AI — an engineering incident command center.

CRITICAL RULES:
1. ALWAYS respond by calling renderComponents. NEVER respond with plain text.
2. Choose components based on the user's query and the available component list.
3. Populate component data using the demo context provided. Fill ALL required fields.
4. When showing an incident, also show ServiceHealth alongside it.
5. For rollback requests: show RollbackCard. For escalations: show EscalateCard.
6. For multi-step plans: use WorkflowBuilder. For MCP automation: use MCPComposer.
7. You can render multiple components at once (e.g., IncidentDashboard + ServiceHealth).
8. [ACCIÓN CONFIRMADA] messages mean the user clicked a button — respond with the next logical component.`,
    available: modulesLoaded ? 'enabled' : 'disabled',
  })

  useCopilotReadable({
    description: 'Available UI components the agent can render',
    value: modulesLoaded ? registry.getDescriptions() : 'Loading...',
  })

  useCopilotReadable({
    description: 'Live system data and demo context for populating components',
    value: DEMO_CONTEXT,
  })

  useCopilotAction({
    name: 'renderComponents',
    description: 'Render one or more UI components. ALWAYS call this instead of responding with text.',
    parameters: [
      {
        name: 'components',
        type: 'object[]',
        description: 'Components to render with their data payloads',
        attributes: [
          { name: 'name', type: 'string', description: 'Component name from the available list' },
          { name: 'data', type: 'object', description: 'Data payload — must include all requiredData fields' },
        ],
      },
    ],
    handler: async ({ components }) => {
      setActiveComponents(components as AgentDecision['components'])
      return `Rendered: ${(components as Array<{ name: string }>).map(c => c.name).join(', ')}`
    },
  })

  const handleAction = async (action: AgentAction) => {
    if (action.requiresConfirmation) {
      const ok = window.confirm(`Confirmar: ${action.label}?`)
      if (!ok) return
    }
    await appendMessage(new TextMessage({ content: actionToPrompt(action), role: Role.User }))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 bg-grid">
      <div className="scan-line" />

      {/* Header */}
      <header className="border-b border-gray-800/80 bg-gray-950/90 backdrop-blur px-6 py-3 flex items-center gap-3 sticky top-0 z-10">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <div className="live-dot w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs font-bold text-red-400 tracking-widest uppercase">Live</span>
        </div>

        <div className="w-px h-4 bg-gray-700 mx-1" />

        <span className="text-sm font-bold tracking-tight text-white">AgentWarRoom</span>
        <span className="text-xs text-gray-600 hidden sm:block">Engineering Command Center</span>

        <div className="ml-auto flex items-center gap-4 text-xs font-mono">
          {modulesLoaded && (
            <span className="text-gray-600">
              <span className="text-green-500">{registry.list().length}</span> components
            </span>
          )}
          {activeComponents.length > 0 && (
            <button
              onClick={() => setActiveComponents([])}
              className="px-2 py-1 border border-gray-700 hover:border-gray-500 rounded text-gray-500 hover:text-gray-300 transition-colors"
            >
              ✕ clear
            </button>
          )}
          <span className="text-gray-700">Gemini 2.0</span>
        </div>
      </header>

      <main className="p-6">
        {activeComponents.length === 0 ? (
          <div className="flex items-center justify-center h-[70vh]">
            <div className="text-center space-y-6 max-w-lg">
              {/* Big icon */}
              <div className="text-5xl select-none">&#9888;</div>

              <div>
                <h2 className="text-white font-bold text-lg mb-1">Engineering Command Center</h2>
                <p className="text-gray-600 text-sm">
                  Describe lo que necesitas. El agente genera la UI exacta.
                </p>
              </div>

              {/* Prompt suggestions */}
              <div className="space-y-2 text-left">
                {[
                  'hay un incidente en auth-service, muéstrame qué está pasando',
                  'qué alertas están activas ahora mismo?',
                  'muéstrame el historial de deploys',
                  'quién está de guardia?',
                  'cómo va el sprint 14?',
                ].map((prompt, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-800 hover:border-gray-600 rounded bg-gray-900/50 hover:bg-gray-900 transition-colors cursor-default group"
                  >
                    <span className="text-gray-700 group-hover:text-gray-500 text-xs">›</span>
                    <span className="text-xs font-mono text-gray-500 group-hover:text-gray-300 transition-colors">
                      "{prompt}"
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-gray-800 text-xs font-mono">
                Escribe en el sidebar de la derecha
                <span className="blink ml-1 text-gray-600">█</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 max-w-4xl">
            {activeComponents.map((item, i) => {
              const registered = registry.get(item.name)
              if (!registered) {
                return (
                  <div key={i} className="text-red-500 text-xs font-mono px-3 py-2 border border-red-900 rounded bg-red-950/30">
                    Unknown component: {item.name}
                  </div>
                )
              }
              const Component = registered.component
              return (
                <div key={`${item.name}-${i}`} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <Component
                    data={item.data}
                    onAction={handleAction}
                  />
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        defaultOpen
        labels={{
          title: 'WarRoom Agent',
          placeholder: 'Pregunta sobre el estado del sistema...',
        }}
      >
        <AgentWarRoom />
      </CopilotSidebar>
    </CopilotKit>
  )
}
