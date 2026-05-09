'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  CopilotKit,
  useCopilotReadable,
  useCopilotAction,
  useCopilotChat,
  useCopilotAdditionalInstructions,
} from '@copilotkit/react-core'
import { TextMessage, Role } from '@copilotkit/runtime-client-gql'
import { ComponentRegistry } from '@/contracts/registry'
import type { AgentDecision, AgentAction } from '@/contracts/types'

/* ── Icons ──────────────────────────────────────────────────── */
const BoltIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>
  </svg>
)
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
  </svg>
)
const GridIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
)
const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
)
const WorkflowIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/>
    <path d="M9 6h7a3 3 0 0 1 3 3v6"/>
  </svg>
)
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const QuantumIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="2.2" fill="currentColor"/>
    <ellipse cx="12" cy="12" rx="9" ry="3.5"/>
    <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)"/>
    <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)"/>
  </svg>
)
const SendIcon = () => (
  <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7Z"/>
  </svg>
)
const PlusIcon = ({ size = 12 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
)

/* ── Module loader ──────────────────────────────────────────── */
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

/* ── Topbar ─────────────────────────────────────────────────── */
function Topbar() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo">
          <QuantumIcon size={16} />
        </div>
        <div className="name">Agents<span>WarRoom</span></div>
      </div>

      <div className="crumbs">
        <span className="pill">Generative UI · v0.4</span>
        <span style={{ color: 'var(--ink-5)' }}>/</span>
        <span>Engineering Command Center</span>
      </div>

      <div className="spacer" />

      <div className="ops" style={{ marginRight: 14 }}>
        <span className="live-dot" />
        <span style={{ color: 'var(--ink-2)' }}>OPERATIONS · LIVE</span>
        <span style={{ color: 'var(--ink-5)', margin: '0 4px' }}>·</span>
        <span style={{ color: 'var(--violet-200)' }}>
          {time.toLocaleTimeString([], { hour12: false })}
        </span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 10px', borderRadius: 8,
        border: '1px solid var(--line)',
        background: 'rgba(167,139,250,0.04)',
        color: 'var(--ink-3)', fontSize: 11.5,
        cursor: 'pointer',
      }}>
        <SearchIcon />
        <span>Ask the agent…</span>
        <span className="mono" style={{
          marginLeft: 8, fontSize: 10, padding: '2px 6px',
          borderRadius: 4, background: 'rgba(167,139,250,0.10)',
          border: '1px solid var(--line-2)', color: 'var(--violet-200)',
        }}>⌘K</span>
      </div>
    </header>
  )
}

/* ── Rail ───────────────────────────────────────────────────── */
const RAIL_ITEMS = [
  { id: 'incident', Icon: AlertIcon,    label: 'Incidents' },
  { id: 'metrics',  Icon: ActivityIcon, label: 'Metrics' },
  { id: 'sprint',   Icon: GridIcon,     label: 'Sprint' },
  { id: 'workflow', Icon: WorkflowIcon, label: 'Workflows' },
  { id: 'escalate', Icon: ShieldIcon,   label: 'On-call' },
]

function Rail({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <nav className="railnav">
      {RAIL_ITEMS.map(it => (
        <button
          key={it.id}
          className={`rail-btn${active === it.id ? ' active' : ''}`}
          onClick={() => onChange(it.id)}
          title={it.label}
        >
          <it.Icon />
        </button>
      ))}
      <div className="rail-divider" />
      <button className="rail-btn" title="Settings"><SettingsIcon /></button>
    </nav>
  )
}

/* ── Status bar ─────────────────────────────────────────────── */
function StatusBar({ componentCount }: { componentCount: number }) {
  return (
    <div className="statusbar">
      <span style={{ color: 'var(--violet-200)' }}>● connected</span>
      <span className="sep">|</span>
      <span>claude-sonnet-4-6</span>
      <span className="sep">|</span>
      <span>registry: 11 components</span>
      <span className="sep">|</span>
      <span>rendered: {componentCount}</span>
      <span style={{ marginLeft: 'auto', color: 'var(--ink-4)' }}>
        ai tinkerers · generative ui hackathon · 2026-05-09
      </span>
    </div>
  )
}

/* ── Canvas ─────────────────────────────────────────────────── */
type ComponentItem = AgentDecision['components'][number]

function Canvas({
  components,
  registry,
  onAction,
}: {
  components: ComponentItem[]
  registry: ComponentRegistry
  onAction: (a: AgentAction) => void
}) {
  if (components.length === 0) {
    return (
      <div className="empty">
        <div>
          <div className="glyph">
            <span style={{ color: 'var(--violet-300)' }}><QuantumIcon size={36} /></span>
          </div>
          <h2>The agent is standing by</h2>
          <p>
            Ask anything about the system. The agent will compose the exact panels you need —
            incidents, metrics, deploys, workflows — and render them live.
          </p>
          <div className="suggestions">
            {[
              'hay un incidente en auth-service, muéstrame qué está pasando',
              'muéstrame métricas de latencia y error rate',
              'haz rollback del deploy actual',
              'arma un workflow para responder al P1',
            ].map((prompt, i) => (
              <button
                key={i}
                className="suggest-pill"
                onClick={() => {
                  const el = document.getElementById('agent-input')
                  if (el) {
                    ;(el as HTMLTextAreaElement).value = prompt
                    el.dispatchEvent(new Event('input', { bubbles: true }))
                    el.focus()
                  }
                }}
              >
                <span className="arrow">→</span>{prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="canvas-grid">
      {components.map((item, i) => {
        const registered = registry.get(item.name)
        if (!registered) {
          return (
            <div key={i} className="q-card enter">
              <div className="body" style={{ color: 'var(--critical)', fontSize: 13 }}>
                Unknown component: {item.name}
              </div>
            </div>
          )
        }
        const Component = registered.component
        return (
          <div key={i} style={{ animationDelay: `${i * 90}ms` }}>
            <div className="q-card enter">
              <Component data={item.data} onAction={onAction} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Agent Sidebar ──────────────────────────────────────────── */
interface ChatMsg {
  role: 'user' | 'agent'
  text: string
  rendered?: string[]
}

function AgentSidebar({
  messages,
  onSend,
  isLoading,
}: {
  messages: ChatMsg[]
  onSend: (text: string) => void
  isLoading: boolean
}) {
  const [draft, setDraft] = useState('')
  const scrollerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
    }
  }, [messages.length, isLoading])

  const submit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    if (!draft.trim()) return
    onSend(draft)
    setDraft('')
  }, [draft, onSend])

  const quick = [
    { label: 'incident in auth-service', prompt: 'hay un incidente en auth-service, muéstrame qué está pasando' },
    { label: 'rollback latest deploy',   prompt: 'haz rollback del deploy actual' },
    { label: 'escalate to on-call',      prompt: 'escala el incidente al equipo de guardia' },
    { label: 'compose response workflow', prompt: 'arma un workflow para responder al P1' },
  ]

  return (
    <aside className="agent">
      {/* Header */}
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'radial-gradient(circle at 30% 30%, var(--magenta), var(--violet-500))',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 0 18px -4px var(--violet-400)',
        }}>
          <QuantumIcon size={14} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-1)' }}>WarRoom Agent</div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--violet-200)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            claude-sonnet-4-6 · ready
          </div>
        </div>
        <button className="btn subtle icon-only tiny" title="New session">
          <PlusIcon size={12} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollerRef}
        className="thin-scroll"
        style={{
          flex: 1, overflowY: 'auto', padding: '18px 16px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}
      >
        {messages.length === 0 && (
          <div style={{ marginTop: 'auto' }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--ink-3)', margin: '0 0 10px' }}>
              Try asking
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quick.map((q, i) => (
                <button
                  key={i}
                  className="suggest-pill"
                  onClick={() => onSend(q.prompt)}
                >
                  <span className="arrow">→</span>{q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === 'user' ? 'user-msg' : 'agent-msg'}`}>
            <div className="msg-avatar">
              {m.role === 'user'
                ? <span style={{ fontSize: 10, fontWeight: 600 }}>JG</span>
                : <QuantumIcon size={11} />
              }
            </div>
            <div className="msg-body">
              {m.text}
              {m.rendered && m.rendered.length > 0 && (
                <div style={{
                  marginTop: 10, padding: '8px 10px', borderRadius: 8,
                  background: 'rgba(167,139,250,0.06)',
                  border: '1px solid var(--line)',
                }}>
                  <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--violet-200)', marginBottom: 4 }}>
                    Rendered to canvas
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {m.rendered.map((n, j) => (
                      <span key={j} className="badge outline-violet" style={{ fontSize: 10 }}>{n}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="msg agent-msg">
            <div className="msg-avatar"><QuantumIcon size={11} /></div>
            <div className="msg-body">
              <span className="dots"><i /><i /><i /></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={submit}
        style={{
          borderTop: '1px solid var(--line)', padding: 14,
          background: 'rgba(7,5,14,0.5)',
        }}
      >
        <div
          className="input-shell"
          style={{
            position: 'relative',
            borderRadius: 12,
            background: 'rgba(167,139,250,0.05)',
            border: '1px solid var(--line-2)',
            transition: 'all 220ms var(--ease-out-quint)',
          }}
        >
          <textarea
            id="agent-input"
            ref={textareaRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
            placeholder="Pregunta sobre el estado del sistema…"
            rows={2}
            style={{
              width: '100%', resize: 'none',
              background: 'transparent', border: 'none', outline: 'none',
              padding: '12px 14px 36px',
              color: 'var(--ink-1)',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              lineHeight: 1.5,
            }}
          />
          <div style={{
            position: 'absolute', left: 10, right: 10, bottom: 8,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{
              fontSize: 10, padding: '3px 6px', borderRadius: 4,
              border: '1px solid var(--line-2)', color: 'var(--ink-3)',
              background: 'rgba(167,139,250,0.04)',
            }} className="mono">@context</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>auth-service</span>
            <button
              type="submit"
              className="btn primary tiny"
              style={{ marginLeft: 'auto', padding: '4px 10px' }}
              disabled={!draft.trim() || isLoading}
            >
              <SendIcon /> Send
            </button>
          </div>
        </div>
        <p className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', margin: '8px 4px 0' }}>
          Cmd+K to focus · Shift+Enter for newline
        </p>
      </form>
    </aside>
  )
}

/* ── Inner app (uses CopilotKit hooks) ──────────────────────── */
function AgentWarRoom() {
  const registry = ComponentRegistry.getInstance()
  const [activeComponents, setActiveComponents] = useState<ComponentItem[]>([])
  const [modulesLoaded, setModulesLoaded] = useState(false)
  const [activeRail, setActiveRail] = useState('incident')
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([])

  const { appendMessage, isLoading } = useCopilotChat()

  const handleAction = useCallback(async (action: AgentAction) => {
    if (action.requiresConfirmation) {
      const ok = window.confirm(`Confirmar: ${action.label}?`)
      if (!ok) return
    }
    await appendMessage(new TextMessage({ content: actionToPrompt(action), role: Role.User }))
  }, [appendMessage])

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
      const built = components as ComponentItem[]
      setActiveComponents(built)
      const names = built.map(c => c.name)
      setChatMessages(prev => [...prev, {
        role: 'agent',
        text: `Rendered ${names.length} component${names.length !== 1 ? 's' : ''} to canvas.`,
        rendered: names,
      }])
      return `Rendered: ${names.join(', ')}`
    },
  })

  const handleSend = useCallback(async (text: string) => {
    setChatMessages(prev => [...prev, { role: 'user', text }])
    const lower = text.toLowerCase()
    if (/(metric|latenc|error rate|spike|p99)/.test(lower)) setActiveRail('metrics')
    else if (/(rollback|revert|deploy)/.test(lower)) setActiveRail('incident')
    else if (/(escalat|on.?call|page)/.test(lower)) setActiveRail('escalate')
    else if (/(sprint|task|backlog)/.test(lower)) setActiveRail('sprint')
    else if (/(workflow|compose|mcp|automat)/.test(lower)) setActiveRail('workflow')
    else setActiveRail('incident')

    await appendMessage(new TextMessage({ content: text, role: Role.User }))
  }, [appendMessage])

  return (
    <div className="stage">
      <div className="grid-floor" />
      <div className="shell">
        <Topbar />
        <Rail active={activeRail} onChange={setActiveRail} />
        <main className="canvas">
          <Canvas
            components={activeComponents}
            registry={registry}
            onAction={handleAction}
          />
        </main>
        <AgentSidebar
          messages={chatMessages}
          onSend={handleSend}
          isLoading={isLoading}
        />
        <StatusBar componentCount={activeComponents.length} />
      </div>
    </div>
  )
}

/* ── Root ───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <AgentWarRoom />
    </CopilotKit>
  )
}
