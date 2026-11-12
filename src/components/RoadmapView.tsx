import React from 'react';
import { ROADMAP_PHASES } from '../utils/defaultData';
import { CheckCircle2, Calendar, Target, Flag, ArrowRight } from 'lucide-react';

interface RoadmapViewProps {
  currentDay: number;
  targetDays: number;
  onSelectDay: (day: number) => void;
  goal: string;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  currentDay,
  targetDays,
  onSelectDay,
  goal,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>60-Day Technical Internship Trajectory</span>
              <span aria-hidden="true">·</span>
              <span>Day {currentDay} of {targetDays} Active</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              The 4-Phase Deliberate Practice Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Every day builds compound technical equity. From Day 1 syntax drills to Day 60 portfolio deployment and mock technical interviews.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">Current Progress</div>
              <div className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                {Math.round((currentDay / targetDays) * 100)}%
              </div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center font-mono font-bold text-sm text-slate-900 dark:text-white">
              D{currentDay}
            </div>
          </div>
        </div>

        {/* Quick Day Navigator Strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Jump to Day in Journey:
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {Array.from({ length: 60 }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                onClick={() => onSelectDay(d)}
                className={`min-w-8 h-8 px-2 rounded-md font-mono text-xs tabular-nums transition-colors cursor-pointer flex items-center justify-center ${
                  d === currentDay
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white font-bold shadow-xs'
                    : d < currentDay
                    ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    : 'border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Phases Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ROADMAP_PHASES.map((phase) => {
          const isCurrentPhase =
            (phase.phase === 1 && currentDay <= 15) ||
            (phase.phase === 2 && currentDay > 15 && currentDay <= 30) ||
            (phase.phase === 3 && currentDay > 30 && currentDay <= 45) ||
            (phase.phase === 4 && currentDay > 45);

          return (
            <div
              key={phase.phase}
              className={`bg-white dark:bg-slate-900 border rounded-xl p-6 space-y-4 shadow-xs transition-all ${
                isCurrentPhase
                  ? 'border-slate-900 dark:border-emerald-500/80 ring-1 ring-slate-900/10 dark:ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 opacity-90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isCurrentPhase
                        ? 'bg-slate-900 text-white dark:bg-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    0{phase.phase}
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {phase.daysRange}
                  </span>
                </div>
                {isCurrentPhase && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Active Phase
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {phase.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {phase.focus}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Target Tangible Deliverables
                </div>
                <div className="space-y-1.5">
                  {phase.keyOutcomes.map((outcome, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
