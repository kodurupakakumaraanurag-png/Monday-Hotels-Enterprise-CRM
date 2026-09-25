"use client";

import React from "react";

interface BarChartItem {
  label: string;
  value: number;
  formattedValue?: string;
  color?: string;
}

export function SimpleBarChart({
  data,
  title,
  subtitle,
}: {
  data: BarChartItem[];
  title?: string;
  subtitle?: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4 shadow-xl">
      {(title || subtitle) && (
        <div>
          {title && <h3 className="text-sm font-bold text-stone-100">{title}</h3>}
          {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="space-y-3 pt-2">
        {data.map((item, i) => {
          const pct = Math.round((item.value / maxValue) * 100);
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-300">{item.label}</span>
                <span className="font-bold text-amber-300">
                  {item.formattedValue || item.value.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-stone-950 h-3 rounded-full overflow-hidden border border-stone-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.color || "bg-gradient-to-r from-amber-600 to-amber-400"
                  }`}
                  style={{ width: `${Math.max(4, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FunnelVisualizationChart({
  steps,
  title,
}: {
  steps: { stage: string; count: number; value: number }[];
  title?: string;
}) {
  const maxCount = Math.max(...steps.map((s) => s.count), 1);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4 shadow-xl">
      {title && <h3 className="text-sm font-bold text-stone-100">{title}</h3>}
      <div className="space-y-2 pt-2">
        {steps.map((step, idx) => {
          const widthPct = Math.max(15, Math.round((step.count / maxCount) * 100));
          return (
            <div key={step.stage} className="flex items-center space-x-3 text-xs">
              <span className="w-28 shrink-0 font-semibold text-stone-400 text-right truncate">
                {step.stage}
              </span>
              <div className="flex-1 bg-stone-950/60 p-1.5 rounded-lg border border-stone-800">
                <div
                  className="bg-gradient-to-r from-amber-500/80 to-amber-300 text-stone-950 font-bold px-3 py-1.5 rounded flex justify-between items-center transition-all duration-500"
                  style={{ width: `${widthPct}%` }}
                >
                  <span>{step.count} Deals</span>
                  {step.value > 0 && <span>${step.value.toLocaleString()}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SimpleLineAreaChart({
  title,
  points,
  yUnit = "$",
}: {
  title: string;
  points: { label: string; val: number }[];
  yUnit?: string;
}) {
  const max = Math.max(...points.map((p) => p.val), 1);
  const min = Math.min(...points.map((p) => p.val), 0);
  const range = max - min || 1;

  const svgHeight = 120;
  const svgWidth = 400;

  const coords = points.map((pt, idx) => {
    const x = (idx / (points.length - 1 || 1)) * (svgWidth - 40) + 20;
    const y = svgHeight - 20 - ((pt.val - min) / range) * (svgHeight - 40);
    return { x, y, pt };
  });

  const pathD = coords.reduce(
    (acc, curr, i) => (i === 0 ? `M ${curr.x},${curr.y}` : `${acc} L ${curr.x},${curr.y}`),
    ""
  );

  const areaD = `${pathD} L ${coords[coords.length - 1]?.x || svgWidth},${svgHeight - 10} L ${
    coords[0]?.x || 0
  },${svgHeight - 10} Z`;

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-stone-100">{title}</h3>
        <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
          Historical Trend
        </span>
      </div>

      <div className="pt-2">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-36 overflow-visible">
          <defs>
            <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="10" y1="20" x2={svgWidth - 10} y2="20" stroke="#27272a" strokeDasharray="3 3" />
          <line x1="10" y1="60" x2={svgWidth - 10} y2="60" stroke="#27272a" strokeDasharray="3 3" />
          <line x1="10" y1="100" x2={svgWidth - 10} y2="100" stroke="#27272a" strokeDasharray="3 3" />

          {/* Area fill */}
          <path d={areaD} fill="url(#areaGlow)" />

          {/* Line path */}
          <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />

          {/* Data Points */}
          {coords.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r="4" fill="#fbbf24" stroke="#18181b" strokeWidth="2" />
              <text
                x={c.x}
                y={svgHeight}
                textAnchor="middle"
                fill="#a1a1aa"
                fontSize="9"
                fontWeight="bold"
              >
                {c.pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
