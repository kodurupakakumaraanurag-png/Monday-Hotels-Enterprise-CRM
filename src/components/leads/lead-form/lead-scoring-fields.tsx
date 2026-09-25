"use client";

import React from "react";
import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { LeadFormData, computeTotalLeadScore } from "@/lib/validations/lead-schema";
import { Sparkles, Award, ShieldCheck } from "lucide-react";

interface Props {
  register: UseFormRegister<LeadFormData>;
  watch: UseFormWatch<LeadFormData>;
  errors: FieldErrors<LeadFormData>;
}

export function LeadScoringFields({ register, watch, errors }: Props) {
  const watchScores = watch([
    "digitalPresenceScore",
    "hiringActivityScore",
    "techStackFitScore",
    "fundingRevenueScore",
    "projectUrgencyScore",
    "budgetClarityScore",
    "importedSourceScore",
  ]);

  const currentValues: Partial<LeadFormData> = {
    digitalPresenceScore: Number(watchScores[0] || 0),
    hiringActivityScore: Number(watchScores[1] || 0),
    techStackFitScore: Number(watchScores[2] || 0),
    fundingRevenueScore: Number(watchScores[3] || 0),
    projectUrgencyScore: Number(watchScores[4] || 0),
    budgetClarityScore: Number(watchScores[5] || 0),
    importedSourceScore: watchScores[6] !== undefined ? Number(watchScores[6]) : undefined,
  };

  const calculatedTotal = computeTotalLeadScore(currentValues);

  return (
    <div className="space-y-3.5 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span>4. Lead Scoring Engine (6 Components • Scale 0 to 5)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Score:</span>
          <span className="text-sm font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
            {calculatedTotal} / 30
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {/* 19. Digital Presence Score */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Digital Presence (0-5)
          </label>
          <input
            type="number"
            min={0}
            max={5}
            {...register("digitalPresenceScore", { valueAsNumber: true })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 20. Hiring Activity Score */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Hiring Activity (0-5)
          </label>
          <input
            type="number"
            min={0}
            max={5}
            {...register("hiringActivityScore", { valueAsNumber: true })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 21. Tech Stack Fit Score */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Tech Stack Fit (0-5)
          </label>
          <input
            type="number"
            min={0}
            max={5}
            {...register("techStackFitScore", { valueAsNumber: true })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 22. Funding / Revenue Score */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Funding / Revenue (0-5)
          </label>
          <input
            type="number"
            min={0}
            max={5}
            {...register("fundingRevenueScore", { valueAsNumber: true })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 23. Project Urgency Score */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Project Urgency (0-5)
          </label>
          <input
            type="number"
            min={0}
            max={5}
            {...register("projectUrgencyScore", { valueAsNumber: true })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 24. Budget Clarity Score */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Budget Clarity (0-5)
          </label>
          <input
            type="number"
            min={0}
            max={5}
            {...register("budgetClarityScore", { valueAsNumber: true })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>
    </div>
  );
}
