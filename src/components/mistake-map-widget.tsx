"use client";

import { useEffect, useState } from "react";
import { Calculator, Lightbulb, Clock, AlertCircle, Brain } from "lucide-react";

interface WeaknessData {
  summary: {
    calculation: number;
    concept: number;
    time: number;
    careless: number;
    total: number;
  };
  breakdown: {
    calculation: number;
    concept: number;
    time: number;
    careless: number;
  };
  total: number;
}

export function MistakeMapWidget() {
  const [data, setData] = useState<WeaknessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/weakness');
        if (res.ok) {
          const weaknessData = await res.json();
          setData(weaknessData);
        }
      } catch (err) {
        console.error('Failed to load weakness data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          Your Mistake Pattern
        </h3>
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!data || data.total === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          Your Mistake Pattern
        </h3>
        <div className="text-center py-8">
          <div className="flex justify-center mb-3">
            <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-600 text-sm">
            Answer some questions wrong to see your mistake pattern!
          </p>
          <p className="text-slate-500 text-xs mt-2">
            We'll track whether your errors are from calculation, concepts, time, or carelessness
          </p>
        </div>
      </div>
    );
  }

  const weaknessTypes = [
    {
      id: 'calculation',
      IconComponent: Calculator,
      label: 'Calculation',
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
      percentage: data.breakdown.calculation,
      count: data.summary.calculation
    },
    {
      id: 'concept',
      IconComponent: Lightbulb,
      label: 'Concept',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      iconColor: 'text-cyan-600',
      percentage: data.breakdown.concept,
      count: data.summary.concept
    },
    {
      id: 'time',
      IconComponent: Clock,
      label: 'Time',
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
      percentage: data.breakdown.time,
      count: data.summary.time
    },
    {
      id: 'careless',
      IconComponent: AlertCircle,
      label: 'Careless',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      percentage: data.breakdown.careless,
      count: data.summary.careless
    }
  ];

  // Find the primary weakness
  const sortedWeaknesses = [...weaknessTypes].sort((a, b) => b.percentage - a.percentage);
  const primaryWeakness = sortedWeaknesses[0];

  const recommendations: Record<string, string> = {
    calculation: "Practice more numerical problems and double-check your calculations",
    concept: "Review fundamental concepts and watch explanatory videos",
    time: "Practice with timers and work on speed optimization techniques",
    careless: "Read questions carefully and review answers before submitting"
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          Your Mistake Pattern
        </h3>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {data.total} tracked errors
        </span>
      </div>

      {/* Simple Bar Chart */}
      <div className="space-y-3 mb-6">
        {weaknessTypes.map((type) => (
          <div key={type.id}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <type.IconComponent className={`w-5 h-5 ${type.iconColor}`} />
                <span className="text-sm font-medium text-slate-700">{type.label}</span>
              </div>
              <span className={`text-sm font-semibold ${type.textColor}`}>
                {type.percentage}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${type.color} transition-all duration-500`}
                style={{ width: `${type.percentage}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {type.count} {type.count === 1 ? 'error' : 'errors'}
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className={`${primaryWeakness.lightColor} rounded-lg p-3 border ${primaryWeakness.color.replace('bg-', 'border-')}`}>
        <div className="flex items-start gap-2">
          <primaryWeakness.IconComponent className={`w-5 h-5 shrink-0 ${primaryWeakness.iconColor}`} />
          <div>
            <div className={`text-xs font-semibold ${primaryWeakness.textColor} mb-1`}>
              Focus Area: {primaryWeakness.label} Errors
            </div>
            <div className="text-xs text-slate-600">
              {recommendations[primaryWeakness.id]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
