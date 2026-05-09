// Demo data for all M2 components — the hackathon demo runs fully offline

export const mockIncident = {
  id: 'INC-2026-047',
  title: 'auth-service: latency spike (+400ms)',
  severity: 'P1' as const,
  status: 'investigating' as const,
  startedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  affectedServices: ['auth-service', 'api-gateway', 'user-sessions'],
  timeline: [
    { at: new Date(Date.now() - 8 * 60 * 1000).toISOString(), event: 'Alert triggered: p99 > 500ms' },
    { at: new Date(Date.now() - 6 * 60 * 1000).toISOString(), event: 'On-call paged: @juan' },
    { at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), event: 'Root cause identified: DB connection pool exhausted' },
  ],
}

export const mockIncidentP2 = {
  id: 'INC-2026-046',
  title: 'billing-service: payment processing slow',
  severity: 'P2' as const,
  status: 'identified' as const,
  startedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  affectedServices: ['billing-service', 'payments-api'],
  timeline: [
    { at: new Date(Date.now() - 35 * 60 * 1000).toISOString(), event: 'Alert triggered: payment latency > 2s' },
    { at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), event: 'On-call paged: @carlos' },
    { at: new Date(Date.now() - 20 * 60 * 1000).toISOString(), event: 'Root cause: upstream payment provider throttling' },
    { at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), event: 'Mitigation: switched to fallback provider' },
  ],
}

export const mockIncidentResolved = {
  id: 'INC-2026-045',
  title: 'api-gateway: elevated 5xx errors',
  severity: 'P2' as const,
  status: 'resolved' as const,
  startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  resolvedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  affectedServices: ['api-gateway'],
  timeline: [
    { at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), event: 'Alert triggered: 5xx rate > 2%' },
    { at: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(), event: 'Rollback deployed: v1.8.2 → v1.8.1' },
    { at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), event: 'Error rate normalized — incident closed' },
  ],
}

export const mockServices = {
  services: [
    { name: 'prod-api',       status: 'healthy',  latencyP99: 210, errorRate: 0.1, rps: 1240, uptimePct: 99.9 },
    { name: 'auth-service',   status: 'degraded', latencyP99: 610, errorRate: 2.1, rps: 340,  uptimePct: 97.2 },
    { name: 'api-gateway',    status: 'healthy',  latencyP99: 45,  errorRate: 0.3, rps: 3100, uptimePct: 99.9 },
    { name: 'user-sessions',  status: 'degraded', latencyP99: 890, errorRate: 1.8, rps: 120,  uptimePct: 96.8 },
    { name: 'billing-service',status: 'healthy',  latencyP99: 150, errorRate: 0.0, rps: 89,   uptimePct: 100  },
  ],
}

export const mockServicesAllHealthy = {
  services: [
    { name: 'prod-api',       status: 'healthy', latencyP99: 180, errorRate: 0.0, rps: 1340, uptimePct: 99.9 },
    { name: 'auth-service',   status: 'healthy', latencyP99: 95,  errorRate: 0.1, rps: 420,  uptimePct: 99.8 },
    { name: 'api-gateway',    status: 'healthy', latencyP99: 38,  errorRate: 0.2, rps: 3200, uptimePct: 99.9 },
    { name: 'user-sessions',  status: 'healthy', latencyP99: 210, errorRate: 0.1, rps: 180,  uptimePct: 99.7 },
    { name: 'billing-service',status: 'healthy', latencyP99: 130, errorRate: 0.0, rps: 95,   uptimePct: 100  },
  ],
}

export const mockSprint = {
  sprintName: 'Sprint 14',
  daysRemaining: 2,
  tasks: [
    { id: 'T-101', title: 'Auth token refresh flow',   status: 'in_flight' as const, assignee: '@maria' },
    { id: 'T-102', title: 'Rate limiting middleware',  status: 'blocked' as const,   assignee: '@carlos', blocker: 'Waiting for infra quota approval' },
    { id: 'T-103', title: 'Session cleanup cron',      status: 'done' as const,      assignee: '@juan' },
    { id: 'T-104', title: 'DB connection pool config', status: 'blocked' as const,   assignee: '@juan',   blocker: 'Related to current incident INC-2026-047' },
    { id: 'T-105', title: 'API docs update',           status: 'in_flight' as const, assignee: '@maria' },
    { id: 'T-106', title: 'Migrate to new auth SDK',   status: 'done' as const,      assignee: '@carlos' },
  ],
}

export const mockDeployHistory = {
  service: 'auth-service',
  deploys: [
    {
      id: 'deploy-2026-193',
      service: 'auth-service',
      version: 'v2.5.0',
      deployedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      deployedBy: '@carlos',
      status: 'in_progress' as const,
      commitSha: 'a3f9c12',
      changeCount: 8,
    },
    {
      id: 'deploy-2026-192',
      service: 'auth-service',
      version: 'v2.4.1',
      deployedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      deployedBy: '@juan',
      status: 'success' as const,
      commitSha: 'b7e2a41',
      changeCount: 3,
    },
    {
      id: 'deploy-2026-191',
      service: 'auth-service',
      version: 'v2.4.0',
      deployedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      deployedBy: '@maria',
      status: 'success' as const,
      commitSha: 'c1d5f93',
      changeCount: 12,
    },
  ],
}

export const mockLatencyMetric = {
  metric: 'auth-service p99 latency',
  unit: 'ms',
  threshold: 300,
  data: Array.from({ length: 30 }, (_, i) => ({
    t: new Date(Date.now() - (30 - i) * 60 * 1000).toLocaleTimeString(),
    value: i < 22
      ? Math.round(150 + Math.random() * 50)
      : Math.round(400 + Math.random() * 200 + (i - 22) * 40),
  })),
}

export const mockErrorRateMetric = {
  metric: 'auth-service error rate',
  unit: '%',
  threshold: 1,
  data: Array.from({ length: 30 }, (_, i) => ({
    t: new Date(Date.now() - (30 - i) * 60 * 1000).toLocaleTimeString(),
    value: i < 20
      ? Math.round((0.1 + Math.random() * 0.3) * 10) / 10
      : Math.round((1.5 + Math.random() * 1 + (i - 20) * 0.15) * 10) / 10,
  })),
}

export const mockAlerts = {
  alerts: [
    {
      id: 'ALT-001',
      service: 'auth-service',
      message: 'p99 latency > 500ms for 5 consecutive minutes',
      severity: 'critical' as const,
      firedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      resolved: false,
    },
    {
      id: 'ALT-002',
      service: 'user-sessions',
      message: 'Error rate exceeded 1.5% threshold',
      severity: 'warning' as const,
      firedAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
      resolved: false,
    },
    {
      id: 'ALT-003',
      service: 'api-gateway',
      message: 'Request queue depth > 1000 for 2 minutes',
      severity: 'warning' as const,
      firedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      resolved: false,
    },
    {
      id: 'ALT-004',
      service: 'prod-api',
      message: 'CPU utilization > 80%',
      severity: 'info' as const,
      firedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      resolved: true,
    },
    {
      id: 'ALT-005',
      service: 'billing-service',
      message: 'DB connection pool near limit (85%)',
      severity: 'info' as const,
      firedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      resolved: true,
    },
  ],
}

export const mockOnCall = {
  team: 'Platform Engineering',
  escalationPolicy: 'PagerDuty · 5min escalation',
  primary: {
    name: 'Juan García',
    handle: '@juan',
    phone: '+52 55 1234 5678',
    schedule: 'Weekday Rotation',
    since: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    until: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
  },
  secondary: {
    name: 'María López',
    handle: '@maria',
    schedule: 'Backup Rotation',
    since: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    until: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
  },
}
