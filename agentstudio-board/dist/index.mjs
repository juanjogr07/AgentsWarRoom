// src/components/StateGuards.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var SHIMMER_DELAYS = ["delay-0", "delay-75", "delay-150", "delay-300"];
var SHIMMER_WIDTHS = ["w-full", "w-5/6", "w-full", "w-4/5"];
function EmptyState({ message }) {
  return /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-dashed border-gray-700 bg-gray-950 p-8 font-mono flex items-center justify-center ring-1 ring-white/5", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600", children: message }) });
}
function LoadingState({ rows = 3 }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono space-y-3 ring-1 ring-white/5", children: [
    /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-800 rounded animate-pulse w-1/3 delay-0" }),
    Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ jsx(
      "div",
      {
        className: `h-8 bg-gray-800 rounded animate-pulse ${SHIMMER_DELAYS[i % SHIMMER_DELAYS.length]} ${SHIMMER_WIDTHS[i % SHIMMER_WIDTHS.length]}`
      },
      i
    ))
  ] });
}

// src/utils.ts
function elapsed(iso) {
  if (!iso) return "unknown";
  const ts = new Date(iso).getTime();
  if (isNaN(ts)) return "unknown";
  const secs = Math.max(0, Math.floor((Date.now() - ts) / 1e3));
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  const h = Math.floor(secs / 3600);
  const m = Math.floor(secs % 3600 / 60);
  return m > 0 ? `${h}h ${m}m ago` : `${h}h ago`;
}

// src/components/IncidentDashboard.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var severityColors = {
  P1: { bg: "bg-red-950", border: "border-red-500", text: "text-red-400", badge: "bg-red-500 text-white" },
  P2: { bg: "bg-yellow-950", border: "border-yellow-500", text: "text-yellow-400", badge: "bg-yellow-500 text-black" },
  P3: { bg: "bg-blue-950", border: "border-blue-500", text: "text-blue-400", badge: "bg-blue-500 text-white" }
};
var statusBadge = {
  investigating: "bg-red-800 text-red-200",
  identified: "bg-yellow-800 text-yellow-200",
  resolved: "bg-green-800 text-green-200"
};
function timeLabel(incident) {
  if (incident.status === "resolved" && incident.resolvedAt)
    return `resolved ${elapsed(incident.resolvedAt)}`;
  return elapsed(incident.startedAt);
}
function IncidentDashboard({ data, onAction, className }) {
  const incident = data;
  if (!(incident == null ? void 0 : incident.id) || !(incident == null ? void 0 : incident.title)) return /* @__PURE__ */ jsx2(EmptyState, { message: "No incident data" });
  const colors = severityColors[incident.severity] ?? severityColors.P3;
  const isResolved = incident.status === "resolved";
  return /* @__PURE__ */ jsxs2("div", { className: `rounded-lg border ${colors.border} ${isResolved ? "bg-gray-950 opacity-75" : colors.bg} p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ""}`, children: [
    /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-3 mb-4 flex-wrap", children: [
      /* @__PURE__ */ jsx2("span", { className: `px-2 py-0.5 rounded text-xs font-bold ${colors.badge}`, children: incident.severity }),
      incident.status && /* @__PURE__ */ jsx2("span", { className: `px-2 py-0.5 rounded text-xs font-medium ${statusBadge[incident.status] ?? "bg-gray-800 text-gray-400"}`, children: incident.status }),
      /* @__PURE__ */ jsx2("span", { className: `text-sm font-semibold ${colors.text} flex-1 min-w-0 truncate`, children: incident.title }),
      /* @__PURE__ */ jsx2("span", { className: "text-xs text-gray-500 shrink-0", children: timeLabel(incident) })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx2("p", { className: "text-xs text-gray-500 mb-1", children: "Affected services" }),
      /* @__PURE__ */ jsx2("div", { className: "flex flex-wrap gap-2", children: (incident.affectedServices ?? []).map((s) => /* @__PURE__ */ jsx2("span", { className: "px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300", children: s }, s)) })
    ] }),
    incident.timeline && incident.timeline.length > 0 && /* @__PURE__ */ jsxs2("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx2("p", { className: "text-xs text-gray-500 mb-2", children: "Timeline" }),
      /* @__PURE__ */ jsx2("div", { className: "space-y-1.5 border-l border-gray-800 pl-3", children: incident.timeline.map((e, i) => /* @__PURE__ */ jsxs2("div", { className: "flex gap-3 text-xs relative", children: [
        /* @__PURE__ */ jsx2("div", { className: "w-1.5 h-1.5 rounded-full bg-gray-700 absolute -left-[1.05rem] top-1" }),
        /* @__PURE__ */ jsx2("span", { className: "text-gray-600 shrink-0", children: new Date(e.at).toLocaleTimeString() }),
        /* @__PURE__ */ jsx2("span", { className: "text-gray-300 break-words min-w-0", children: e.event })
      ] }, i)) })
    ] }),
    !isResolved && /* @__PURE__ */ jsxs2("div", { className: "flex gap-2 mt-4 pt-3 border-t border-gray-800", children: [
      /* @__PURE__ */ jsx2(
        "button",
        {
          onClick: () => onAction({ type: "rollback", label: "Rollback", payload: { incidentId: incident.id }, requiresConfirmation: true }),
          className: "px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-xs font-medium transition-colors",
          children: "\u21A9 Rollback"
        }
      ),
      /* @__PURE__ */ jsx2(
        "button",
        {
          onClick: () => onAction({ type: "escalate", label: "Escalate", payload: { incidentId: incident.id }, requiresConfirmation: true }),
          className: "px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 rounded text-xs font-medium transition-colors",
          children: "\u26A1 Escalate"
        }
      ),
      /* @__PURE__ */ jsx2(
        "button",
        {
          onClick: () => onAction({ type: "resolve_incident", label: "Resolve", payload: { incidentId: incident.id }, requiresConfirmation: true }),
          className: "px-3 py-1.5 bg-green-800 hover:bg-green-700 rounded text-xs font-medium transition-colors ml-auto",
          children: "\u2713 Resolve"
        }
      )
    ] }),
    isResolved && /* @__PURE__ */ jsx2("div", { className: "mt-4 pt-3 border-t border-gray-800", children: /* @__PURE__ */ jsx2("span", { className: "text-xs text-green-500", children: "\u2713 Incident resolved" }) })
  ] });
}

// src/components/ServiceHealth.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var statusConfig = {
  down: { dot: "bg-red-400", text: "text-red-400", border: "border-red-900", order: 0 },
  degraded: { dot: "bg-yellow-400", text: "text-yellow-400", border: "border-yellow-900", order: 1 },
  healthy: { dot: "bg-green-400", text: "text-green-400", border: "border-green-900", order: 2 }
};
function UnhealthyBadge({ services }) {
  const down = services.filter((s) => s.status === "down").length;
  const degraded = services.filter((s) => s.status === "degraded").length;
  if (down === 0 && degraded === 0) return null;
  return /* @__PURE__ */ jsxs3("span", { className: "text-xs font-semibold", children: [
    down > 0 && /* @__PURE__ */ jsxs3("span", { className: "text-red-400", children: [
      down,
      " down"
    ] }),
    down > 0 && degraded > 0 && /* @__PURE__ */ jsx3("span", { className: "text-gray-600", children: " \xB7 " }),
    degraded > 0 && /* @__PURE__ */ jsxs3("span", { className: "text-yellow-400", children: [
      degraded,
      " degraded"
    ] })
  ] });
}
function ServiceHealth({ data, onAction, className }) {
  const { services } = data;
  if (!services) return /* @__PURE__ */ jsx3(LoadingState, { rows: 4 });
  if (services.length === 0) return /* @__PURE__ */ jsx3(EmptyState, { message: "No services to display" });
  const sorted = [...services].sort((a, b) => {
    var _a, _b;
    return (((_a = statusConfig[a.status]) == null ? void 0 : _a.order) ?? 3) - (((_b = statusConfig[b.status]) == null ? void 0 : _b.order) ?? 3);
  });
  return /* @__PURE__ */ jsxs3("div", { className: `rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ""}`, children: [
    /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsx3("h3", { className: "text-sm font-semibold text-gray-300 shrink-0", children: "Service Health" }),
        /* @__PURE__ */ jsx3(UnhealthyBadge, { services: sorted })
      ] }),
      /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: () => onAction({
            type: "escalate",
            label: "Page On-Call",
            payload: { source: "service_health", unhealthyServices: sorted.filter((s) => s.status !== "healthy").map((s) => s.name) },
            requiresConfirmation: true
          }),
          className: "px-3 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-xs font-medium transition-colors shrink-0 ml-3",
          children: "\u26A1 Page On-Call"
        }
      )
    ] }),
    /* @__PURE__ */ jsx3("div", { className: "space-y-2", children: sorted.map((s) => {
      const cfg = statusConfig[s.status] ?? statusConfig.healthy;
      return /* @__PURE__ */ jsxs3("div", { className: `flex items-center gap-2 rounded px-3 py-2 border ${cfg.border} bg-gray-900`, children: [
        /* @__PURE__ */ jsx3("div", { className: `w-2 h-2 rounded-full ${cfg.dot} shrink-0` }),
        /* @__PURE__ */ jsx3("span", { className: "text-xs text-gray-300 w-28 shrink-0 truncate", children: s.name }),
        /* @__PURE__ */ jsx3("span", { className: `text-xs ${cfg.text} w-14 shrink-0`, children: s.status }),
        /* @__PURE__ */ jsxs3("span", { className: "text-xs text-gray-500 w-24 shrink-0", children: [
          "p99:",
          s.latencyP99,
          "ms"
        ] }),
        /* @__PURE__ */ jsxs3("span", { className: `text-xs w-16 text-right shrink-0 ${s.errorRate > 1 ? "text-red-400" : "text-gray-600"}`, children: [
          s.errorRate,
          "%"
        ] }),
        /* @__PURE__ */ jsxs3("span", { className: "text-xs text-gray-700 w-14 text-right shrink-0", children: [
          s.rps,
          "rps"
        ] }),
        s.uptimePct != null && /* @__PURE__ */ jsxs3("span", { className: `text-xs w-14 text-right shrink-0 ${s.uptimePct < 99 ? "text-yellow-500" : "text-gray-700"}`, children: [
          s.uptimePct,
          "%up"
        ] }),
        s.status !== "healthy" && /* @__PURE__ */ jsx3(
          "button",
          {
            onClick: () => onAction({ type: "investigate_service", label: `Investigate ${s.name}`, payload: { service: s.name, status: s.status, latencyP99: s.latencyP99, errorRate: s.errorRate } }),
            className: "px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors shrink-0 ml-auto",
            children: "Investigate"
          }
        )
      ] }, s.name);
    }) })
  ] });
}

// src/components/SprintBoard.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var taskConfig = {
  in_flight: { label: "In Flight", text: "text-blue-400", bg: "bg-blue-950", border: "border-blue-900" },
  blocked: { label: "Blocked", text: "text-red-400", bg: "bg-red-950", border: "border-red-900" },
  done: { label: "Done", text: "text-green-400", bg: "bg-green-950", border: "border-green-900" }
};
function DaysLabel({ days }) {
  if (days <= 0) return /* @__PURE__ */ jsx4("span", { className: "text-xs text-red-400 font-semibold", children: "OVERDUE" });
  if (days === 1) return /* @__PURE__ */ jsx4("span", { className: "text-xs text-yellow-400", children: "1d left" });
  return /* @__PURE__ */ jsxs4("span", { className: "text-xs text-gray-500", children: [
    days,
    "d left"
  ] });
}
function SprintBoard({ data, onAction, className }) {
  const { sprintName, daysRemaining, tasks } = data;
  if (!tasks) return /* @__PURE__ */ jsx4(LoadingState, { rows: 3 });
  if (tasks.length === 0) return /* @__PURE__ */ jsx4(EmptyState, { message: "No tasks in sprint" });
  const blocked = tasks.filter((t) => t.status === "blocked").length;
  const done = tasks.filter((t) => t.status === "done").length;
  return /* @__PURE__ */ jsxs4("div", { className: `rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ""}`, children: [
    /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx4("h3", { className: "text-sm font-semibold text-gray-300 truncate", children: sprintName }),
      /* @__PURE__ */ jsxs4("div", { className: "flex gap-4 text-xs shrink-0 ml-3", children: [
        blocked > 0 && /* @__PURE__ */ jsxs4("span", { className: "text-red-400", children: [
          blocked,
          " blocked"
        ] }),
        done > 0 && /* @__PURE__ */ jsxs4("span", { className: "text-green-400", children: [
          done,
          " done"
        ] }),
        /* @__PURE__ */ jsx4(DaysLabel, { days: daysRemaining })
      ] })
    ] }),
    /* @__PURE__ */ jsx4("div", { className: "space-y-2", children: tasks.map((t) => {
      const cfg = taskConfig[t.status] ?? taskConfig.in_flight;
      return /* @__PURE__ */ jsxs4("div", { className: `rounded border ${cfg.border} ${cfg.bg} px-3 py-2`, children: [
        /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsx4("span", { className: "text-xs text-gray-600 shrink-0", children: t.id }),
          /* @__PURE__ */ jsx4("span", { className: "text-xs text-gray-200 flex-1 truncate", children: t.title }),
          /* @__PURE__ */ jsx4("span", { className: `text-xs ${cfg.text} shrink-0`, children: cfg.label }),
          /* @__PURE__ */ jsx4("span", { className: "text-xs text-gray-600 shrink-0", children: t.assignee }),
          t.status === "blocked" && /* @__PURE__ */ jsx4(
            "button",
            {
              onClick: () => onAction({ type: "unblock_task", label: `Unblock ${t.id}`, payload: { taskId: t.id, blocker: t.blocker } }),
              className: "px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors shrink-0",
              children: "Unblock"
            }
          )
        ] }),
        t.blocker && /* @__PURE__ */ jsxs4("p", { className: "text-xs text-red-300 mt-1 ml-8 line-clamp-2", children: [
          "\u26A1 ",
          t.blocker
        ] })
      ] }, t.id);
    }) })
  ] });
}

// src/components/MetricsChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function MetricsChart({ data, onAction, className }) {
  const { metric, unit, data: points, threshold } = data;
  if (!points || points.length === 0) return /* @__PURE__ */ jsx5(EmptyState, { message: "No metric data" });
  const max = Math.max(...points.map((p) => p.value));
  const hasSpike = threshold != null && max > threshold;
  return /* @__PURE__ */ jsxs5("div", { className: `rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ""}`, children: [
    /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx5("h3", { className: "text-sm font-semibold text-gray-300", children: metric }),
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-3 text-xs", children: [
        /* @__PURE__ */ jsxs5("span", { className: "text-gray-600", children: [
          "unit: ",
          unit
        ] }),
        hasSpike && /* @__PURE__ */ jsx5("span", { className: "text-red-400", children: "\u26A0 threshold exceeded" })
      ] })
    ] }),
    /* @__PURE__ */ jsx5(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxs5(LineChart, { data: points, children: [
      /* @__PURE__ */ jsx5(XAxis, { dataKey: "t", tick: { fontSize: 9, fill: "#6b7280" }, interval: 4 }),
      /* @__PURE__ */ jsx5(YAxis, { tick: { fontSize: 9, fill: "#6b7280" }, width: 36 }),
      /* @__PURE__ */ jsx5(
        Tooltip,
        {
          contentStyle: { background: "#111827", border: "1px solid #374151", fontSize: 11, borderRadius: 6, color: "#d1d5db" },
          labelStyle: { color: "#9ca3af", marginBottom: 2 },
          cursor: { stroke: "#374151", strokeWidth: 1 },
          formatter: (v) => [`${v}${unit}`, metric]
        }
      ),
      threshold != null && /* @__PURE__ */ jsx5(ReferenceLine, { y: threshold, stroke: "#f59e0b", strokeDasharray: "3 3", strokeOpacity: 0.7 }),
      /* @__PURE__ */ jsx5(
        Line,
        {
          type: "monotone",
          dataKey: "value",
          stroke: hasSpike ? "#ef4444" : "#3b82f6",
          strokeWidth: 2,
          dot: false,
          activeDot: { r: 4, strokeWidth: 0 },
          isAnimationActive: false
        }
      )
    ] }) }),
    hasSpike && /* @__PURE__ */ jsx5("div", { className: "mt-3", children: /* @__PURE__ */ jsx5(
      "button",
      {
        onClick: () => onAction({ type: "create_incident", label: "Create Incident", payload: { metric, value: max, threshold }, requiresConfirmation: true }),
        className: "px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-xs font-medium transition-colors",
        children: "+ Create Incident"
      }
    ) })
  ] });
}

// src/components/DeployHistory.tsx
import { useState } from "react";
import { Fragment, jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var statusConfig2 = {
  success: { dot: "bg-green-400", text: "text-green-400" },
  rolled_back: { dot: "bg-red-400", text: "text-red-400" },
  in_progress: { dot: "bg-yellow-400", text: "text-yellow-400" }
};
function DeployHistory({ data, onAction, className }) {
  const { service, deploys } = data;
  const [pendingRollback, setPendingRollback] = useState(null);
  if (!deploys) return /* @__PURE__ */ jsx6(LoadingState, { rows: 3 });
  if (deploys.length === 0) return /* @__PURE__ */ jsx6(EmptyState, { message: `No deploys found for ${service ?? "service"}` });
  function confirmRollback(deploy) {
    onAction({
      type: "rollback",
      label: `Rollback to ${deploy.version}`,
      payload: { deployId: deploy.id, service: deploy.service, version: deploy.version },
      requiresConfirmation: false
    });
    setPendingRollback(null);
  }
  return /* @__PURE__ */ jsxs6("div", { className: `rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ""}`, children: [
    /* @__PURE__ */ jsxs6("h3", { className: "text-sm font-semibold text-gray-300 mb-4", children: [
      "Deploy History \u2014 ",
      service
    ] }),
    pendingRollback && /* @__PURE__ */ jsxs6("div", { className: "mb-4 rounded border border-red-700 bg-red-950 px-4 py-3", children: [
      /* @__PURE__ */ jsx6("p", { className: "text-xs text-red-300 font-semibold mb-1", children: "\u26A0 Confirm rollback" }),
      /* @__PURE__ */ jsxs6("p", { className: "text-xs text-red-400 mb-3", children: [
        "Roll back ",
        /* @__PURE__ */ jsx6("span", { className: "font-bold", children: service }),
        " from current to",
        " ",
        /* @__PURE__ */ jsx6("span", { className: "font-bold", children: pendingRollback.version }),
        "? Running deploy will be stopped."
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx6(
          "button",
          {
            onClick: () => confirmRollback(pendingRollback),
            className: "px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-xs font-medium transition-colors",
            children: "\u21A9 Confirm Rollback"
          }
        ),
        /* @__PURE__ */ jsx6(
          "button",
          {
            onClick: () => setPendingRollback(null),
            className: "px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors",
            children: "Cancel"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx6("div", { className: "space-y-2", children: deploys.map((d, i) => {
      const cfg = statusConfig2[d.status] ?? statusConfig2.success;
      const isPending = (pendingRollback == null ? void 0 : pendingRollback.id) === d.id;
      return /* @__PURE__ */ jsxs6(
        "div",
        {
          className: `flex items-center gap-3 rounded px-3 py-2 border bg-gray-900 flex-wrap transition-colors ${isPending ? "border-red-700 bg-red-950" : "border-gray-800"}`,
          children: [
            /* @__PURE__ */ jsx6("div", { className: `w-2 h-2 rounded-full ${cfg.dot} shrink-0` }),
            /* @__PURE__ */ jsx6("span", { className: "text-xs font-semibold text-gray-200 w-14 shrink-0", children: d.version }),
            i === 0 && /* @__PURE__ */ jsx6("span", { className: "px-1.5 py-0.5 bg-blue-900 border border-blue-700 rounded text-xs text-blue-300 shrink-0", children: "LATEST" }),
            /* @__PURE__ */ jsx6("span", { className: `text-xs ${cfg.text} w-20 shrink-0`, children: d.status }),
            /* @__PURE__ */ jsx6("span", { className: "text-xs text-gray-500", children: elapsed(d.deployedAt) }),
            /* @__PURE__ */ jsx6("span", { className: "text-xs text-gray-600", children: d.deployedBy }),
            d.commitSha && /* @__PURE__ */ jsx6("span", { className: "text-xs text-gray-700 bg-gray-800 px-1.5 rounded", children: d.commitSha }),
            d.changeCount != null && /* @__PURE__ */ jsxs6("span", { className: "text-xs text-gray-700", children: [
              d.changeCount,
              " commits"
            ] }),
            /* @__PURE__ */ jsx6("div", { className: "ml-auto", children: /* @__PURE__ */ jsx6(
              "button",
              {
                onClick: () => setPendingRollback(isPending ? null : d),
                className: `px-2 py-0.5 border rounded text-xs transition-colors whitespace-nowrap ${isPending ? "bg-gray-700 border-gray-600 text-gray-400" : "bg-red-900 hover:bg-red-800 border-red-700 text-red-300"}`,
                children: isPending ? "Cancel" : /* @__PURE__ */ jsxs6(Fragment, { children: [
                  "\u21A9 Rollback to ",
                  d.version
                ] })
              }
            ) })
          ]
        },
        d.id
      );
    }) })
  ] });
}

// src/components/AlertFeed.tsx
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
var severityConfig = {
  critical: { dot: "bg-red-400", text: "text-red-400", border: "border-red-900", bg: "bg-red-950" },
  warning: { dot: "bg-yellow-400", text: "text-yellow-400", border: "border-yellow-900", bg: "bg-yellow-950" },
  info: { dot: "bg-blue-400", text: "text-blue-400", border: "border-blue-900", bg: "bg-blue-950" }
};
function AlertFeed({ data, onAction, className }) {
  const { alerts, title } = data;
  if (!alerts) return /* @__PURE__ */ jsx7(LoadingState, { rows: 4 });
  if (alerts.length === 0) return /* @__PURE__ */ jsx7(EmptyState, { message: "No alerts" });
  const active = alerts.filter((a) => !a.resolved);
  const resolved = alerts.filter((a) => a.resolved);
  const activeServices = Array.from(new Set(active.map((a) => a.service)));
  return /* @__PURE__ */ jsxs7("div", { className: `rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ""}`, children: [
    /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx7("h3", { className: "text-sm font-semibold text-gray-300", children: title ?? "Alert Feed" }),
      /* @__PURE__ */ jsxs7("div", { className: "flex gap-3 text-xs", children: [
        active.length > 0 && /* @__PURE__ */ jsxs7("span", { className: "text-red-400 font-semibold", children: [
          active.length,
          " firing"
        ] }),
        resolved.length > 0 && /* @__PURE__ */ jsxs7("span", { className: "text-gray-600", children: [
          resolved.length,
          " resolved"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx7("div", { className: "space-y-2", children: alerts.map((a) => {
      const cfg = severityConfig[a.severity] ?? severityConfig.info;
      const isActiveCritical = !a.resolved && a.severity === "critical";
      return /* @__PURE__ */ jsxs7(
        "div",
        {
          className: `flex items-start gap-3 rounded px-3 py-2 border ${a.resolved ? "border-gray-800 bg-gray-900 opacity-50" : `${cfg.border} ${cfg.bg}`}`,
          children: [
            /* @__PURE__ */ jsx7("div", { className: `w-2 h-2 rounded-full ${cfg.dot} shrink-0 mt-1 ${isActiveCritical ? "animate-pulse" : ""}` }),
            /* @__PURE__ */ jsxs7("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsx7("span", { className: `text-xs font-bold ${cfg.text}`, children: a.severity.toUpperCase() }),
                /* @__PURE__ */ jsx7("span", { className: "text-xs text-gray-400 bg-gray-800 px-1.5 rounded", children: a.service }),
                a.resolved && /* @__PURE__ */ jsx7("span", { className: "text-xs text-green-700 bg-gray-800 px-1.5 rounded", children: "\u2713 resolved" })
              ] }),
              /* @__PURE__ */ jsx7("p", { className: "text-xs text-gray-300 mt-0.5 break-words", children: a.message })
            ] }),
            /* @__PURE__ */ jsx7("span", { className: "text-xs text-gray-600 shrink-0 mt-0.5", children: elapsed(a.firedAt) })
          ]
        },
        a.id
      );
    }) }),
    active.length > 0 && /* @__PURE__ */ jsxs7("div", { className: "mt-4 pt-3 border-t border-gray-800 flex gap-2", children: [
      /* @__PURE__ */ jsx7(
        "button",
        {
          onClick: () => onAction({
            type: "create_incident",
            label: "Open Incident",
            payload: { alertIds: active.map((a) => a.id), services: activeServices },
            requiresConfirmation: true
          }),
          className: "px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-xs font-medium transition-colors",
          children: "+ Open Incident"
        }
      ),
      /* @__PURE__ */ jsx7(
        "button",
        {
          onClick: () => onAction({
            type: "escalate",
            label: "Page On-Call",
            payload: { alertCount: active.length, services: activeServices },
            requiresConfirmation: true
          }),
          className: "px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 rounded text-xs font-medium transition-colors",
          children: "\u26A1 Page On-Call"
        }
      )
    ] })
  ] });
}

// src/components/OnCallStatus.tsx
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
function formatUntil(iso) {
  return new Date(iso).toLocaleString(void 0, { weekday: "short", hour: "2-digit", minute: "2-digit" });
}
function PersonRow({
  person,
  tier,
  onPage
}) {
  const tierColor = tier === "Primary" ? "bg-green-900 text-green-300 border-green-700" : "bg-gray-800 text-gray-400 border-gray-700";
  const dotColor = tier === "Primary" ? "bg-green-400" : "bg-gray-500";
  return /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-3 rounded px-3 py-2.5 border border-gray-800 bg-gray-900", children: [
    /* @__PURE__ */ jsx8("div", { className: `w-2 h-2 rounded-full ${dotColor} shrink-0` }),
    /* @__PURE__ */ jsxs8("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsx8("span", { className: "text-xs font-semibold text-gray-200", children: person.name }),
        /* @__PURE__ */ jsx8("span", { className: "text-xs text-gray-500", children: person.handle }),
        /* @__PURE__ */ jsx8("span", { className: `text-xs px-1.5 py-0.5 rounded border ${tierColor}`, children: tier })
      ] }),
      /* @__PURE__ */ jsxs8("p", { className: "text-xs text-gray-600 mt-0.5", children: [
        person.schedule,
        " \xB7 until ",
        formatUntil(person.until)
      ] }),
      person.phone && /* @__PURE__ */ jsx8("p", { className: "text-xs text-gray-700 mt-0.5", children: person.phone })
    ] }),
    /* @__PURE__ */ jsx8(
      "button",
      {
        onClick: onPage,
        className: "px-2 py-1 bg-orange-900 hover:bg-orange-800 border border-orange-700 rounded text-xs text-orange-300 transition-colors shrink-0",
        children: "\u{1F4DE} Page"
      }
    )
  ] });
}
function OnCallStatus({ data, onAction, className }) {
  const { team, primary, secondary, escalationPolicy } = data;
  if (!primary) return /* @__PURE__ */ jsx8(EmptyState, { message: "No on-call data" });
  return /* @__PURE__ */ jsxs8("div", { className: `rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ""}`, children: [
    /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxs8("h3", { className: "text-sm font-semibold text-gray-300", children: [
        "On-Call \u2014 ",
        team ?? "Unknown Team"
      ] }),
      escalationPolicy && /* @__PURE__ */ jsx8("span", { className: "text-xs text-gray-500", children: escalationPolicy })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx8(
        PersonRow,
        {
          person: primary,
          tier: "Primary",
          onPage: () => onAction({
            type: "page_oncall",
            label: `Page ${primary.name}`,
            payload: { handle: primary.handle, tier: "primary", team },
            requiresConfirmation: true
          })
        }
      ),
      secondary && /* @__PURE__ */ jsx8(
        PersonRow,
        {
          person: secondary,
          tier: "Secondary",
          onPage: () => onAction({
            type: "page_oncall",
            label: `Page ${secondary.name}`,
            payload: { handle: secondary.handle, tier: "secondary", team },
            requiresConfirmation: true
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsx8(
      "button",
      {
        onClick: () => onAction({
          type: "escalate",
          label: "Escalate to On-Call",
          payload: { team, primaryHandle: primary.handle },
          requiresConfirmation: true
        }),
        className: "mt-4 w-full px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 rounded text-xs font-medium transition-colors",
        children: "\u26A1 Escalate to On-Call"
      }
    )
  ] });
}

// src/index.ts
var boardComponents = [
  {
    name: "IncidentDashboard",
    description: "Shows active incident: severity (P1/P2/P3), status (investigating/identified/resolved), elapsed time, affected services, and event timeline. Trigger words: incidente, alerta, falla, degradado. Pair with ServiceHealth and DeployHistory. Has Rollback, Escalate, and Resolve action buttons.",
    component: IncidentDashboard,
    category: "board",
    requiredData: ["id", "title", "severity", "startedAt", "affectedServices"]
  },
  {
    name: "ServiceHealth",
    description: "Real-time health grid for all services: latency p99 (ms), error rate (%), requests/sec, uptime %, and status (healthy/degraded/down). Degraded services sort to top. Use when user asks about system health or performance. Each degraded service has an Investigate button. Header has Page On-Call button.",
    component: ServiceHealth,
    category: "board",
    requiredData: ["services"]
  },
  {
    name: "SprintBoard",
    description: "Sprint task board: in-flight, blocked (with blockers), done, days remaining. Use when user asks about sprint status, blocked work, or team capacity \u2014 trigger words: sprint, blocked, bloqueado. Each blocked task has an Unblock button.",
    component: SprintBoard,
    category: "board",
    requiredData: ["sprintName", "tasks", "daysRemaining"]
  },
  {
    name: "MetricsChart",
    description: "Time-series line chart for a single engineering metric (latency ms, error rate %, RPS, memory MB) with optional threshold line. Use when user wants to see a trend, spike, or degradation over time. Shows Create Incident button when threshold exceeded.",
    component: MetricsChart,
    category: "board",
    requiredData: ["metric", "data", "unit"]
  },
  {
    name: "DeployHistory",
    description: "Recent deployment history for a service: version, deploy time, deployer, commit SHA, change count, and outcome (success/in_progress/rolled_back). Use when user asks what changed before an incident, wants to rollback, or asks about recent deploys \u2014 trigger words: deploy, deploy\xF3, rollback, qu\xE9 cambi\xF3. Each deploy row has an inline-confirmed Rollback button.",
    component: DeployHistory,
    category: "board",
    requiredData: ["service", "deploys"]
  },
  {
    name: "AlertFeed",
    description: "Real-time alert feed: shows firing and resolved alerts with severity (critical/warning/info), service name, message, and elapsed time. Use when user asks about active alerts, what is firing right now, or to see all ongoing issues \u2014 trigger words: alertas, qu\xE9 est\xE1 fallando, qu\xE9 est\xE1 disparado. Has Open Incident and Page On-Call action buttons when alerts are firing.",
    component: AlertFeed,
    category: "board",
    requiredData: ["alerts"]
  },
  {
    name: "OnCallStatus",
    description: "Shows who is currently on call: primary and secondary contact, schedule, shift end time, and phone. Use when user asks who is on call, needs to page someone, or before escalating an incident \u2014 trigger words: qui\xE9n est\xE1 de guardia, on-call, escalar, pagear. Has individual Page buttons and an Escalate button.",
    component: OnCallStatus,
    category: "board",
    requiredData: ["team", "primary"]
  }
];
export {
  EmptyState,
  LoadingState,
  boardComponents
};
