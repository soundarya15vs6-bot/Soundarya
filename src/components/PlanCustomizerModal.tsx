import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, RefreshCw, Sliders, Check } from 'lucide-react';
import { SubjectConfig } from '../types';

interface PlanCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: string;
  currentDailyHours: number;
  currentSubjects: SubjectConfig[];
  onApplyPlan: (goal: string, dailyHours: number, subjects: SubjectConfig[], aiGenerate: boolean) => Promise<void>;
  isGenerating: boolean;
}

export const PlanCustomizerModal: React.FC<PlanCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  currentDailyHours,
  currentSubjects,
  onApplyPlan,
  isGenerating,
}) => {
  const [goal, setGoal] = useState(currentGoal);
  const [hours, setHours] = useState(currentDailyHours);
  const [subjects, setSubjects] = useState<SubjectConfig[]>(currentSubjects);

  if (!isOpen) return null;

  const totalAllocatedMinutes = subjects.reduce((sum, s) => sum + s.durationMinutes, 0);
  const targetTotalMinutes = hours * 60;
  const minuteDelta = targetTotalMinutes - totalAllocatedMinutes;

  const handleUpdateSubject = (id: string, field: 'name' | 'durationMinutes', value: any) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: field === 'durationMinutes' ? Number(value) : value } : s))
    );
  };

  const handleAddSubject = () => {
    const newSubject: SubjectConfig = {
      id: `subj-${Date.now()}`,
      name: 'New Focus Subject',
      durationMinutes: 30,
      color: 'slate',
      category: 'core',
    };
    setSubjects([...subjects, newSubject]);
  };

  const handleRemoveSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleApplyPreset = (presetGoal: string, presetHours: number, presetSubjects: any[]) => {
    setGoal(presetGoal);
    setHours(presetHours);
    setSubjects(
      presetSubjects.map((s, idx) => ({
        id: `subj-${idx + 1}`,
        name: s.name,
        durationMinutes: s.durationMinutes,
        color: 'slate',
        category: 'core',
      }))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Customize Goals & Time Splits
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calibrate daily hours, subject breakdown, and AI schedule generation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            aria-label="Close customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset('Land a Python internship in 60 days', 4, [
                    { name: 'Python Theory & Mini-Projects', durationMinutes: 120 },
                    { name: 'Git & GitHub', durationMinutes: 60 },
                    { name: 'HackerRank Practice', durationMinutes: 30 },
                    { name: 'Trading Study', durationMinutes: 30 },
                  ])
                }
                className="p-2.5 text-left text-xs border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <div className="font-semibold text-slate-900 dark:text-white">Python Internship</div>
                <div className="text-[11px] text-slate-500">4 Hours · User Default</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset('Full-Stack Web Developer in 60 days', 4, [
                    { name: 'React & Frontend Architecture', durationMinutes: 90 },
                    { name: 'Node.js & Express REST APIs', durationMinutes: 90 },
                    { name: 'Git & CI/CD Pipelines', durationMinutes: 30 },
                    { name: 'LeetCode Algorithms Drill', durationMinutes: 30 },
                  ])
                }
                className="p-2.5 text-left text-xs border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <div className="font-semibold text-slate-900 dark:text-white">Full-Stack Web Dev</div>
                <div className="text-[11px] text-slate-500">4 Hours · React/Node</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset('Data Science & Quantitative Analysis', 4, [
                    { name: 'Pandas & NumPy Data Wrangling', durationMinutes: 120 },
                    { name: 'SQL Query Drills & Schema Design', durationMinutes: 60 },
                    { name: 'Kaggle EDA & Visualization', durationMinutes: 30 },
                    { name: 'Statistics & Probability Review', durationMinutes: 30 },
                  ])
                }
                className="p-2.5 text-left text-xs border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <div className="font-semibold text-slate-900 dark:text-white">Data & Quant</div>
                <div className="text-[11px] text-slate-500">4 Hours · Pandas/SQL</div>
              </button>
            </div>
          </div>

          {/* Goal Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Primary Goal & Vision
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Land a Python internship in 60 days"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
            />
          </div>

          {/* Daily Hours Slider / Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Total Daily Time Available
              </label>
              <span className="text-xs font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                {hours} Hours ({targetTotalMinutes} Minutes)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full cursor-pointer accent-slate-900 dark:accent-emerald-500"
            />
          </div>

          {/* Subjects & Time Split List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subjects & Duration Split
              </label>
              <div className="text-xs font-mono tabular-nums">
                Allocated: <strong className="text-slate-900 dark:text-white">{totalAllocatedMinutes}m</strong> / {targetTotalMinutes}m
                {minuteDelta !== 0 && (
                  <span className={`ml-1.5 ${minuteDelta > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                    ({minuteDelta > 0 ? `+${minuteDelta}m remaining` : `${minuteDelta}m over`})
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {subjects.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <span className="text-xs font-mono text-slate-400 w-5 text-center">{idx + 1}</span>
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) => handleUpdateSubject(s.id, 'name', e.target.value)}
                    placeholder="Subject Name"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="5"
                      max="360"
                      step="5"
                      value={s.durationMinutes}
                      onChange={(e) => handleUpdateSubject(s.id, 'durationMinutes', e.target.value)}
                      className="w-16 px-2 py-1.5 text-xs font-mono tabular-nums text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                    />
                    <span className="text-xs font-mono text-slate-500">mins</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(s.id)}
                    disabled={subjects.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                    aria-label="Remove subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSubject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-dashed border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            AI Mentor will synthesize concrete beginner-friendly tasks for this setup.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onApplyPlan(goal, hours, subjects, false)}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Update Structure
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => onApplyPlan(goal, hours, subjects, true)}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing AI Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate AI Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
