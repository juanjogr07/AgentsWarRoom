import { ComponentType } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

interface AgentComponentProps {
    data: Record<string, unknown>;
    onAction: (action: AgentAction) => void;
    className?: string;
}
interface AgentComponent {
    name: string;
    description: string;
    component: ComponentType<AgentComponentProps>;
    category: 'board' | 'action' | 'compose';
    requiredData?: string[];
}
interface AgentAction {
    type: string;
    label: string;
    payload: Record<string, unknown>;
    requiresConfirmation?: boolean;
}
interface AgentDecision {
    components: Array<{
        name: string;
        data: Record<string, unknown>;
    }>;
    mode: 'board' | 'copilot' | 'compose';
}

declare function EmptyState({ message }: {
    message: string;
}): react_jsx_runtime.JSX.Element;
declare function LoadingState({ rows }: {
    rows?: number;
}): react_jsx_runtime.JSX.Element;

declare const boardComponents: AgentComponent[];

export { type AgentAction, type AgentComponent, type AgentComponentProps, type AgentDecision, EmptyState, LoadingState, boardComponents };
