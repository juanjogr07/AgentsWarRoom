// Demo data for all M3 components — the hackathon demo runs fully offline

export const mockRollback = {
  service: 'auth-service',
  currentVersion: 'v2.5.0',
  targetVersion: 'v2.4.1',
  deployedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  changes: [
    'feat: new JWT validation logic',
    'perf: connection pool size increased to 50',
    'fix: session timeout edge case',
  ],
  estimatedTime: '2-3 minutes',
  affectedUsers: 1240,
}

export const mockEscalate = {
  incidentId: 'INC-2024-047',
  severity: 'P1',
  oncallEngineer: { name: 'Juan Gomez', handle: '@juan', pagerdutyId: 'PD-JG01' },
  slackChannel: '#incidents-p1',
  affectedUsers: 1240,
  businessImpact: 'Login failures for ~1.2k active users. Auth API success rate: 97.9%',
}

export const mockMCPComposer = {
  availableTools: [
    { name: 'slack', description: 'Post messages to Slack channels', actions: ['post_message'] },
    { name: 'pagerduty', description: 'Manage PagerDuty incidents', actions: ['create_incident', 'acknowledge'] },
    { name: 'github', description: 'GitHub repository operations', actions: ['create_pr', 'revert'] },
  ],
  suggestedWorkflow: [
    { tool: 'pagerduty', action: 'create_incident', params: { title: 'auth-service P1', severity: 'P1' } },
    { tool: 'slack', action: 'post_message', params: { channel: '#incidents-p1', message: 'P1 incident: auth-service degraded — war room started' } },
    { tool: 'github', action: 'create_pr', params: { title: 'revert: auth-service v2.5.0 → v2.4.1' } },
  ],
}

export const mockWorkflow = {
  title: 'P1 Incident Response — auth-service',
  steps: [
    { id: 1, title: 'Acknowledge incident in PagerDuty', tool: 'pagerduty', status: 'pending' as const },
    { id: 2, title: 'Post war room message to #incidents-p1', tool: 'slack', status: 'pending' as const },
    { id: 3, title: 'Initiate rollback: auth-service v2.5.0 → v2.4.1', tool: 'github', status: 'pending' as const },
    { id: 4, title: 'Verify service health post-rollback', tool: 'monitor', status: 'pending' as const },
    { id: 5, title: 'Create postmortem ticket', tool: 'jira', status: 'pending' as const },
  ],
}
