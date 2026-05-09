import { CopilotRuntime, GoogleGenerativeAIAdapter, copilotRuntimeNextJSAppRouterEndpoint } from '@copilotkit/runtime'

export const { handleRequest: POST } = copilotRuntimeNextJSAppRouterEndpoint({
  runtime: new CopilotRuntime(),
  serviceAdapter: new GoogleGenerativeAIAdapter({ model: 'gemini-2.0-flash' }),
  endpoint: '/api/copilotkit',
})
