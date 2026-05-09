"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  actionComponents: () => actionComponents,
  mockEscalate: () => mockEscalate,
  mockMCPComposer: () => mockMCPComposer,
  mockRollback: () => mockRollback,
  mockWorkflow: () => mockWorkflow
});
module.exports = __toCommonJS(index_exports);

// src/components/RollbackCard.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function RollbackCard({ data, onAction }) {
  var _a, _b;
  const [confirming, setConfirming] = (0, import_react.useState)(false);
  const rollback = data;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rounded-lg border border-orange-800 bg-orange-950/30 p-5 font-mono", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-orange-400 font-bold text-sm", children: "\u21A9 Rollback" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-400 text-xs", children: rollback.service })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-gray-900 rounded p-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mb-1", children: "Current (will revert)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-red-400 text-sm font-bold", children: rollback.currentVersion })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-gray-900 rounded p-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mb-1", children: "Target (stable)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-green-400 text-sm font-bold", children: rollback.targetVersion })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mb-2", children: "Changes being reverted" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "space-y-1", children: (rollback.changes ?? []).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "text-xs text-gray-400 flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "-" }),
        c
      ] }, i)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 text-xs text-gray-500 mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
        "\u23F1 ~",
        rollback.estimatedTime ?? "calculating..."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
        "\u{1F465} ",
        ((_a = rollback.affectedUsers) == null ? void 0 : _a.toLocaleString()) ?? "N/A",
        " users"
      ] })
    ] }),
    !confirming ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          onClick: () => setConfirming(true),
          className: "px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded text-xs font-bold transition-colors",
          children: "Confirm Rollback"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          onClick: () => onAction({ type: "cancel", label: "Cancel", payload: {} }),
          className: "px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs transition-colors",
          children: "Cancel"
        }
      )
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-orange-900/50 border border-orange-700 rounded p-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xs text-orange-300 mb-3", children: [
        "\u26A0 This will rollback ",
        rollback.service,
        " and may briefly affect ",
        ((_b = rollback.affectedUsers) == null ? void 0 : _b.toLocaleString()) ?? "some",
        " users. Confirm?"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => onAction({ type: "rollback_confirmed", label: "Rollback confirmed", payload: { ...rollback }, requiresConfirmation: false }),
            className: "px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-xs font-bold transition-colors",
            children: "Yes, Roll Back Now"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => setConfirming(false),
            className: "px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs transition-colors",
            children: "Go Back"
          }
        )
      ] })
    ] })
  ] });
}

// src/components/EscalateCard.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function EscalateCard({ data, onAction }) {
  var _a, _b, _c;
  const incident = data;
  const isP1 = incident.severity === "P1";
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: `rounded-lg border p-5 font-mono ${isP1 ? "border-red-800 bg-red-950/30" : "border-yellow-800 bg-yellow-950/30"}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `font-bold text-sm ${isP1 ? "text-red-400" : "text-yellow-400"}`, children: "\u26A1 Escalate" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `px-2 py-0.5 rounded text-xs font-bold text-white ${isP1 ? "bg-red-500" : "bg-yellow-600"}`, children: incident.severity }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "text-gray-500 text-xs", children: incident.incidentId })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "mb-4 bg-gray-900 rounded p-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-xs text-gray-500 mb-1", children: "Business impact" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-xs text-gray-300", children: incident.businessImpact })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "bg-gray-900 rounded p-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-xs text-gray-500 mb-1", children: "On-call engineer" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-sm text-blue-400", children: ((_a = incident.oncallEngineer) == null ? void 0 : _a.name) ?? "\u2014" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-xs text-gray-600", children: ((_b = incident.oncallEngineer) == null ? void 0 : _b.handle) ?? "\u2014" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "bg-gray-900 rounded p-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-xs text-gray-500 mb-1", children: "Slack channel" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-sm text-green-400", children: incident.slackChannel })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "button",
        {
          onClick: () => {
            var _a2;
            return onAction({
              type: "escalate_confirmed",
              label: "Incident escalated",
              payload: { incidentId: incident.incidentId, engineer: (_a2 = incident.oncallEngineer) == null ? void 0 : _a2.handle },
              requiresConfirmation: true
            });
          },
          className: `px-4 py-2 rounded text-xs font-bold transition-colors ${isP1 ? "bg-red-600 hover:bg-red-500" : "bg-yellow-700 hover:bg-yellow-600"}`,
          children: [
            "Page ",
            ((_c = incident.oncallEngineer) == null ? void 0 : _c.name) ?? "On-call"
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          onClick: () => onAction({
            type: "post_to_slack",
            label: "Posted to Slack",
            payload: { channel: incident.slackChannel, incidentId: incident.incidentId }
          }),
          className: "px-4 py-2 bg-green-800 hover:bg-green-700 rounded text-xs transition-colors",
          children: "Post to Slack"
        }
      )
    ] })
  ] });
}

// src/components/MCPComposer.tsx
var import_react2 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var toolColors = {
  slack: "text-green-400 border-green-800",
  pagerduty: "text-red-400 border-red-800",
  github: "text-blue-400 border-blue-800",
  jira: "text-indigo-400 border-indigo-800",
  monitor: "text-cyan-400 border-cyan-800"
};
function MCPComposer({ data, onAction }) {
  const { availableTools, suggestedWorkflow } = data;
  const [steps] = (0, import_react2.useState)(suggestedWorkflow ?? []);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "rounded-lg border border-purple-800 bg-purple-950/20 p-5 font-mono", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "text-purple-400 font-bold text-sm", children: "\u26A1 MCP Composer" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "text-xs text-gray-500", children: [
        (availableTools == null ? void 0 : availableTools.length) ?? 0,
        " tools available"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "flex gap-2 flex-wrap mb-4", children: (availableTools ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "span",
      {
        className: `px-2 py-1 bg-gray-900 rounded-full border text-xs ${toolColors[t.name] ?? "text-gray-400 border-gray-700"}`,
        children: t.name
      },
      t.name
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "text-xs text-gray-500 mb-2", children: "Suggested workflow" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "space-y-2", children: steps.map((step, i) => {
        var _a;
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex items-center gap-3 bg-gray-900 rounded px-3 py-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "text-xs text-gray-600 w-4", children: i + 1 }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: `text-xs font-medium w-20 ${((_a = toolColors[step.tool]) == null ? void 0 : _a.split(" ")[0]) ?? "text-gray-400"}`, children: step.tool }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "text-xs text-gray-400", children: step.action })
        ] }, i);
      }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "button",
      {
        onClick: () => onAction({
          type: "execute_workflow",
          label: "Workflow executed",
          payload: { steps },
          requiresConfirmation: true
        }),
        className: "px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded text-xs font-bold transition-colors",
        children: "Execute Workflow"
      }
    )
  ] });
}

// src/components/WorkflowBuilder.tsx
var import_react3 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var statusConfig = {
  pending: { icon: "&#9675;", color: "text-gray-500" },
  running: { icon: "&#9680;", color: "text-blue-400" },
  done: { icon: "&#9679;", color: "text-green-400" },
  error: { icon: "&#10005;", color: "text-red-400" }
};
function WorkflowBuilder({ data, onAction }) {
  const { title, steps: initialSteps } = data;
  const [steps, setSteps] = (0, import_react3.useState)(initialSteps ?? []);
  const [running, setRunning] = (0, import_react3.useState)(false);
  const runWorkflow = async () => {
    setRunning(true);
    for (let i = 0; i < steps.length; i++) {
      setSteps((s) => s.map((step, j) => j === i ? { ...step, status: "running" } : step));
      await new Promise((r) => setTimeout(r, 900));
      setSteps((s) => s.map((step, j) => j === i ? { ...step, status: "done" } : step));
    }
    setRunning(false);
    onAction({ type: "workflow_complete", label: "Workflow complete", payload: { title } });
  };
  const allDone = steps.every((s) => s.status === "done");
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "rounded-lg border border-blue-800 bg-blue-950/20 p-5 font-mono", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { className: "text-sm font-semibold text-blue-300 mb-4", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "space-y-2 mb-4", children: steps.map((step) => {
      const cfg = statusConfig[step.status];
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-3 bg-gray-900 rounded px-3 py-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "span",
          {
            className: `text-sm w-4 ${cfg.color}`,
            dangerouslySetInnerHTML: { __html: cfg.icon }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-xs text-gray-300 flex-1", children: step.title }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-xs text-gray-600", children: step.tool })
      ] }, step.id);
    }) }),
    !allDone ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "button",
      {
        onClick: runWorkflow,
        disabled: running,
        className: "px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 rounded text-xs font-bold transition-colors",
        children: running ? "&#9680; Running..." : "&#9654; Execute All Steps"
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-2 text-green-400 text-sm", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "\u2713" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "All steps complete" })
    ] })
  ] });
}

// src/mock-data.ts
var mockRollback = {
  service: "auth-service",
  currentVersion: "v2.5.0",
  targetVersion: "v2.4.1",
  deployedAt: new Date(Date.now() - 25 * 60 * 1e3).toISOString(),
  changes: [
    "feat: new JWT validation logic",
    "perf: connection pool size increased to 50",
    "fix: session timeout edge case"
  ],
  estimatedTime: "2-3 minutes",
  affectedUsers: 1240
};
var mockEscalate = {
  incidentId: "INC-2024-047",
  severity: "P1",
  oncallEngineer: { name: "Juan Gomez", handle: "@juan", pagerdutyId: "PD-JG01" },
  slackChannel: "#incidents-p1",
  affectedUsers: 1240,
  businessImpact: "Login failures for ~1.2k active users. Auth API success rate: 97.9%"
};
var mockMCPComposer = {
  availableTools: [
    { name: "slack", description: "Post messages to Slack channels", actions: ["post_message"] },
    { name: "pagerduty", description: "Manage PagerDuty incidents", actions: ["create_incident", "acknowledge"] },
    { name: "github", description: "GitHub repository operations", actions: ["create_pr", "revert"] }
  ],
  suggestedWorkflow: [
    { tool: "pagerduty", action: "create_incident", params: { title: "auth-service P1", severity: "P1" } },
    { tool: "slack", action: "post_message", params: { channel: "#incidents-p1", message: "P1 incident: auth-service degraded \u2014 war room started" } },
    { tool: "github", action: "create_pr", params: { title: "revert: auth-service v2.5.0 \u2192 v2.4.1" } }
  ]
};
var mockWorkflow = {
  title: "P1 Incident Response \u2014 auth-service",
  steps: [
    { id: 1, title: "Acknowledge incident in PagerDuty", tool: "pagerduty", status: "pending" },
    { id: 2, title: "Post war room message to #incidents-p1", tool: "slack", status: "pending" },
    { id: 3, title: "Initiate rollback: auth-service v2.5.0 \u2192 v2.4.1", tool: "github", status: "pending" },
    { id: 4, title: "Verify service health post-rollback", tool: "monitor", status: "pending" },
    { id: 5, title: "Create postmortem ticket", tool: "jira", status: "pending" }
  ]
};

// src/index.ts
var actionComponents = [
  {
    name: "RollbackCard",
    description: "Deployment rollback confirmation card \u2014 shows current version, target version, affected services, and confirm/cancel buttons with impact summary. Use when user wants to rollback a deployment or revert a change that caused an incident.",
    component: RollbackCard,
    category: "action",
    requiredData: ["service", "currentVersion", "targetVersion", "deployedAt"]
  },
  {
    name: "EscalateCard",
    description: "Incident escalation card \u2014 shows on-call engineer, PagerDuty link, Slack channel, and escalation button with business impact. Use when user needs to escalate an incident, page someone, or notify the team.",
    component: EscalateCard,
    category: "action",
    requiredData: ["incidentId", "severity", "oncallEngineer"]
  },
  {
    name: "MCPComposer",
    description: "Discovers available MCP tools and lets user compose a multi-step workflow combining multiple tools (Slack, PagerDuty, GitHub, Jira). Use when user wants to automate a multi-service action or build a workflow.",
    component: MCPComposer,
    category: "compose",
    requiredData: ["availableTools", "suggestedWorkflow"]
  },
  {
    name: "WorkflowBuilder",
    description: "Step-by-step automation workflow builder with execution status per step. Use when user wants to see an ordered plan they can execute or confirm, or after a rollback to show next steps.",
    component: WorkflowBuilder,
    category: "compose",
    requiredData: ["title", "steps"]
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  actionComponents,
  mockEscalate,
  mockMCPComposer,
  mockRollback,
  mockWorkflow
});
