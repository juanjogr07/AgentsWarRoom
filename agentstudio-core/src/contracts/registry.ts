import { AgentComponent } from './types'

export class ComponentRegistry {
  private static instance: ComponentRegistry
  private components = new Map<string, AgentComponent>()

  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry()
    }
    return ComponentRegistry.instance
  }

  register(component: AgentComponent): void {
    this.components.set(component.name, component)
  }

  registerAll(components: AgentComponent[]): void {
    components.forEach(c => this.register(c))
  }

  get(name: string): AgentComponent | undefined {
    return this.components.get(name)
  }

  list(): AgentComponent[] {
    return Array.from(this.components.values())
  }

  /** Injected into the CopilotKit system prompt so the agent knows what it can render */
  getDescriptions(): string {
    return this.list()
      .map(c => {
        const fields = c.requiredData?.length
          ? ` | required data fields: ${c.requiredData.join(', ')}`
          : ''
        return `- ${c.name} [${c.category}]: ${c.description}${fields}`
      })
      .join('\n')
  }
}
