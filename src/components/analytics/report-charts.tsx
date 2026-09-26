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
    <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 space-y-4 shadow-sm">
      {(title || subtitle) && (
        <div>
          {title && <h3 className="text-sm font-bold text-[#18332B]">{title}</h3>}
          {subtitle && <p className="text-xs text-[#6B766F] mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="space-y-3 pt-2">
        {data.map((item, i) => {
          const pct = Math.round((item.value / maxValue) * 100);
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#18332B]">{item.label}</span>
                <span className="font-bold text-[#285943]">
                  {item.formattedValue || item.value.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-[#F7F4EC] h-3 rounded-full overflow-hidden border border-[#E5E2D9]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.color || "bg-[#285943]"
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
    <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 space-y-4 shadow-sm">
      {title && <h3 className="text-sm font-bold text-[#18332B]">{title}</h3>}
      <div className="space-y-2 pt-2">
        {steps.map((step) => {
          const widthPct = Math.max(15, Math.round((step.count / maxCount) * 100));
          return (
            <div key={step.stage} className="flex items-center space-x-3 text-xs">
              <span className="w-28 shrink-0 font-semibold text-[#6B766F] text-right truncate">
                {step.stage}
              </span>
              <div className="flex-1 bg-[#F7F4EC] p-1.5 rounded-lg border border-[#E5E2D9]">
                <div
                  className="bg-[#285943] text-white font-bold px-3 py-1.5 rounded flex justify-between items-center transition-all duration-500 shadow-sm"
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
    <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#18332B]">{title}</h3>
        <span className="text-[10px] bg-[#DDE9E1] text-[#173F32] px-2 py-0.5 rounded border border-[#A8C3B2] font-semibold">
          Historical Trend
        </span>
      </div>

      <div className="pt-2">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-36 overflow-visible">
          <defs>
            <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#285943" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#285943" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="10" y1="20" x2={svgWidth - 10} y2="20" stroke="#E5E2D9" strokeDasharray="3 3" />
          <line x1="10" y1="60" x2={svgWidth - 10} y2="60" stroke="#E5E2D9" strokeDasharray="3 3" />
          <line x1="10" y1="100" x2={svgWidth - 10} y2="100" stroke="#E5E2D9" strokeDasharray="3 3" />

          {/* Area fill */}
          <path d={areaD} fill="url(#areaGlow)" />

          {/* Line path */}
          <path d={pathD} fill="none" stroke="#285943" strokeWidth="3" strokeLinecap="round" />

          {/* Data Points */}
          {coords.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r="4" fill="#C9A15B" stroke="#18332B" strokeWidth="2" />
              <text
                x={c.x}
                y={svgHeight}
                textAnchor="middle"
                fill="#6B766F"
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
