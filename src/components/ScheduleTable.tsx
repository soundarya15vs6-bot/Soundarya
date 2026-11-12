import React from 'react';
import { TimeBlock } from '../types';
import { Play, Clock, Sparkles, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react';

interface ScheduleTableProps {
  timeBlocks: TimeBlock[];
  goal: string;
  totalDailyHours: number;
  dayNumber: number;
  targetDays: number;
  mentorNote: string;
  milestoneSummary: string;
  onStartBlockTimer: (block: TimeBlock) => void;
  onGoToChecklist: () => void;
  onOpenCoach: () => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  timeBlocks,
  goal,
  totalDailyHours,
  dayNumber,
  targetDays,
  mentorNote,
  milestoneSummary,
  onStartBlockTimer,
  onGoToChecklist,
  onOpenCoach,
}) => {
  const [copied, setCopied] = React.useState(false);

  const totalMinutes = timeBlocks.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const copyQuickSummary = () => {
    const text = `Goal: ${goal} (Day ${dayNumber}/${targetDays})\n` +
      timeBlocks.map(b => `${b.startTime} | ${b.subject}: ${b.specificDailyGoal}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Day {dayNumber} of {targetDays}</span>
              <span aria-hidden="true">·</span>
              <span>Daily Target: {totalDailyHours} Hours ({totalMinutes} Mins)</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Plan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
              {goal}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {milestoneSummary}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={copyQuickSummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Summary Copied' : 'Copy Day Brief'}</span>
            </button>
            <button
              onClick={onGoToChecklist}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Go to Daily Checklist</span>
            </button>
          </div>
        </div>

        {/* Coach's Mindset Callout */}
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white font-semibold">Coach's Directive: </strong>
              {mentorNote}
            </div>
          </div>
        </div>
      </div>

      {/* Structured Schedule Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Daily Schedule & Time Blocks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Structured chronological sequence calibrated for peak cognitive endurance
            </p>
          </div>
          <div className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
            Total: {totalMinutes}m scheduled
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold text-xs border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-3.5 whitespace-nowrap">Time Block</th>
                <th scope="col" className="px-6 py-3.5 whitespace-nowrap">Subject & Duration</th>
                <th scope="col" className="px-6 py-3.5">Focus Area</th>
                <th scope="col" className="px-6 py-3.5">Specific Daily Goal</th>
                <th scope="col" className="px-6 py-3.5 hidden md:table-cell">Suggested Break</th>
                <th scope="col" className="px-6 py-3.5 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {timeBlocks.map((block, idx) => (
                <tr
                  key={block.id || idx}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white tabular-nums">
                        {block.startTime}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {block.subject}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                      {block.durationMinutes} minutes
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {block.focusArea}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600 dark:text-slate-400 max-w-md text-xs sm:text-sm leading-relaxed">
                      {block.specificDailyGoal}
                    </p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {block.recommendedBreak || '5-10 min break'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onStartBlockTimer(block)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 bg-slate-100 dark:bg-slate-800 rounded-md transition-colors cursor-pointer"
                      title={`Start ${block.durationMinutes}m focus timer for ${block.subject}`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start Timer</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rules & Productivity Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Rule 01
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Concrete & Actionable Tasks
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Never sit down to "learn Python". Sit down to write a script with while-loops, bounds checking, and graceful ValueError handling.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Rule 02
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Proof of Work Over Theory
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every day ends with an atomic Git commit pushed to GitHub. When recruiters review your profile, they examine commit consistency and commit message hygiene.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Rule 03
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Deliberate Practice Loop
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            HackerRank builds syntax reflex; mini-projects build architectural thinking; trading study provides real domain data to analyze with future Pandas code.
          </p>
        </div>
      </div>
    </div>
  );
};
