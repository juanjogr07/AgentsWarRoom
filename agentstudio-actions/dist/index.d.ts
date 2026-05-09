import { ComponentType } from 'react';

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

declare const mockRollback: {
    service: string;
    currentVersion: string;
    targetVersion: string;
    deployedAt: string;
    changes: string[];
    estimatedTime: string;
    affectedUsers: number;
};
declare const mockEscalate: {
    incidentId: string;
    severity: string;
    oncallEngineer: {
        name: string;
        handle: string;
        pagerdutyId: string;
    };
    slackChannel: string;
    affectedUsers: number;
    businessImpact: string;
};
declare const mockMCPComposer: {
    availableTools: {
        name: string;
        description: string;
        actions: string[];
    }[];
    suggestedWorkflow: ({
        tool: string;
        action: string;
        params: {
            title: string;
            severity: string;
            channel?: undefined;
            message?: undefined;
        };
    } | {
        tool: string;
        action: string;
        params: {
            channel: string;
            message: string;
            title?: undefined;
            severity?: undefined;
        };
    } | {
        tool: string;
        action: string;
        params: {
            title: string;
            severity?: undefined;
            channel?: undefined;
            message?: undefined;
        };
    })[];
};
declare const mockWorkflow: {
    title: string;
    steps: {
        id: number;
        title: string;
        tool: string;
        status: "pending";
    }[];
};

declare const actionComponents: AgentComponent[];

export { type AgentComponent, type AgentComponentProps, actionComponents, mockEscalate, mockMCPComposer, mockRollback, mockWorkflow };
