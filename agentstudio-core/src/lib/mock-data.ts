// M1 fallback mock data — used for local dev before M2/M3 are available
// Full mock data lives in agentstudio-board and agentstudio-actions

export const demoPrompts = [
  'hay un incidente en auth-service, muéstrame qué está pasando',
  '¿cuál es el estado del sprint 14?',
  'muéstrame la latencia de auth-service en los últimos 30 minutos',
  'necesito hacer rollback de auth-service',
  'arma un workflow para escalar el incidente y notificar al equipo',
]

export const systemContext = {
  teamName: 'Engineering WarRoom',
  incident: {
    id: 'INC-2024-047',
    service: 'auth-service',
    severity: 'P1',
    startedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  sprint: {
    name: 'Sprint 14',
    daysRemaining: 2,
    blockedCount: 2,
  },
}
