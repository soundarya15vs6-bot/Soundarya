import React, { useState, useEffect } from 'react';
import { DailyPlan, TimeBlock, ChecklistTask, SubjectConfig } from './types';
import { INITIAL_DAILY_PLAN, DEFAULT_SUBJECTS, generateMarkdownSchedule } from './utils/defaultData';
import { TopNav } from './components/TopNav';
import { ScheduleTable } from './components/ScheduleTable';
import { GroupedChecklist } from './components/GroupedChecklist';
import { FocusTimer } from './components/FocusTimer';
import { RoadmapView } from './components/RoadmapView';
import { MarkdownModal } from './components/MarkdownModal';
import { CoachPanel } from './components/CoachPanel';
import { PlanCustomizerModal } from './components/PlanCustomizerModal';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('focusforge_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('focusforge_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('focusforge_theme', 'light');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'schedule' | 'checklist' | 'timer' | 'roadmap'>('schedule');

  // Plan state
  const [plan, setPlan] = useState<DailyPlan>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('focusforge_daily_plan');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_DAILY_PLAN;
  });

  // Current subjects configuration
  const [subjects, setSubjects] = useState<SubjectConfig[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('focusforge_subjects');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_SUBJECTS;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('focusforge_daily_plan', JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('focusforge_subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Modal states
  const [isMarkdownOpen, setIsMarkdownOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Active block for timer
  const [activeTimerBlock, setActiveTimerBlock] = useState<TimeBlock | null>(null);
  const [completedMinutesToday, setCompletedMinutesToday] = useState<number>(0);

  // Handle task toggling
  const handleToggleTask = (groupIdx: number, taskIdx: number) => {
    setPlan((prev) => {
      const newGroups = prev.checklistGroups.map((group, gI) => {
        if (gI !== groupIdx) return group;
        return {
          ...group,
          tasks: group.tasks.map((task, tI) => {
            if (tI !== taskIdx) return task;
            return { ...task, completed: !task.completed };
          }),
        };
      });

      const updatedMarkdown = generateMarkdownSchedule({
        goal: prev.goal,
        totalDailyHours: prev.totalDailyHours,
        dayNumber: prev.dayNumber,
        targetDays: prev.targetDays,
        timeBlocks: prev.timeBlocks,
        checklistGroups: newGroups,
      });

      return {
        ...prev,
        checklistGroups: newGroups,
        markdownSchedule: updatedMarkdown,
      };
    });
  };

  // Handle adding custom task
  const handleAddTask = (groupIdx: number, newTask: ChecklistTask) => {
    setPlan((prev) => {
      const newGroups = prev.checklistGroups.map((group, gI) => {
        if (gI !== groupIdx) return group;
        return {
          ...group,
          tasks: [...group.tasks, newTask],
        };
      });

      const updatedMarkdown = generateMarkdownSchedule({
        goal: prev.goal,
        totalDailyHours: prev.totalDailyHours,
        dayNumber: prev.dayNumber,
        targetDays: prev.targetDays,
        timeBlocks: prev.timeBlocks,
        checklistGroups: newGroups,
      });

      return {
        ...prev,
        checklistGroups: newGroups,
        markdownSchedule: updatedMarkdown,
      };
    });
  };

  // Handle starting a timer from a schedule block
  const handleStartBlockTimer = (block: TimeBlock) => {
    setActiveTimerBlock(block);
    setActiveTab('timer');
  };

  // Handle completed focus session
  const handleSessionComplete = (durationMinutes: number) => {
    setCompletedMinutesToday((prev) => prev + durationMinutes);
  };

  // Handle day switch in roadmap
  const handleSelectDay = (day: number) => {
    setPlan((prev) => ({
      ...prev,
      dayNumber: day,
      markdownSchedule: generateMarkdownSchedule({
        goal: prev.goal,
        totalDailyHours: prev.totalDailyHours,
        dayNumber: day,
        targetDays: prev.targetDays,
        timeBlocks: prev.timeBlocks,
        checklistGroups: prev.checklistGroups,
      }),
    }));
  };

  // Handle applying customized plan (manual or AI-generated)
  const handleApplyPlan = async (
    newGoal: string,
    newHours: number,
    newSubjects: SubjectConfig[],
    aiGenerate: boolean
  ) => {
    setSubjects(newSubjects);

    if (aiGenerate) {
      setIsGeneratingPlan(true);
      try {
        const response = await fetch('/api/coach/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goal: newGoal,
            totalDailyHours: newHours,
            subjects: newSubjects.map((s) => ({
              name: s.name,
              durationMinutes: s.durationMinutes,
            })),
            dayNumber: plan.dayNumber,
            targetDays: plan.targetDays,
          }),
        });

        const result = await response.json();
        if (result.success && result.data) {
          const { mentorNote, milestoneSummary, timeBlocks, checklistGroups, markdownSchedule } =
            result.data;

          // Ensure tasks have completed = false
          const sanitizedGroups = (checklistGroups || []).map((g: any) => ({
            ...g,
            tasks: (g.tasks || []).map((t: any) => ({
              ...t,
              completed: false,
            })),
          }));

          setPlan({
            goal: newGoal,
            totalDailyHours: newHours,
            dayNumber: plan.dayNumber,
            targetDays: plan.targetDays,
            mentorNote: mentorNote || plan.mentorNote,
            milestoneSummary: milestoneSummary || plan.milestoneSummary,
            timeBlocks: timeBlocks || plan.timeBlocks,
            checklistGroups: sanitizedGroups,
            markdownSchedule: markdownSchedule || '',
          });

          setIsCustomizerOpen(false);
          setActiveTab('schedule');
        } else {
          throw new Error(result.error || 'Failed to generate plan');
        }
      } catch (err: any) {
        alert(`AI Generation Notice: ${err.message}. Applying manual schedule template.`);
        applyManualPlan(newGoal, newHours, newSubjects);
      } finally {
        setIsGeneratingPlan(false);
      }
    } else {
      applyManualPlan(newGoal, newHours, newSubjects);
    }
  };

  const applyManualPlan = (newGoal: string, newHours: number, newSubjects: SubjectConfig[]) => {
    // Generate basic chronological time blocks
    let currentHour = 9;
    let currentMin = 0;

    const newBlocks: TimeBlock[] = newSubjects.map((subj, idx) => {
      const startH = String(currentHour).padStart(2, '0');
      const startM = String(currentMin).padStart(2, '0');

      currentMin += subj.durationMinutes;
      while (currentMin >= 60) {
        currentHour += 1;
        currentMin -= 60;
      }

      const endH = String(currentHour).padStart(2, '0');
      const endM = String(currentMin).padStart(2, '0');

      // Add 10m break
      currentMin += 10;
      if (currentMin >= 60) {
        currentHour += 1;
        currentMin -= 60;
      }

      return {
        id: `tb-gen-${idx}`,
        startTime: `${startH}:${startM} - ${endH}:${endM}`,
        subject: subj.name,
        durationMinutes: subj.durationMinutes,
        focusArea: `${subj.name} Core Deep Work`,
        specificDailyGoal: `Execute concrete practice drills and code implementation for ${subj.name}`,
        recommendedBreak: '10 min break & hydration',
      };
    });

    const newGroups = newSubjects.map((subj) => ({
      subject: `${subj.name} (${subj.durationMinutes} Mins)`,
      durationMinutes: subj.durationMinutes,
      tasks: [
        {
          id: `task-${subj.id}-1`,
          title: `${subj.name} Foundation Drills`,
          actionDetail: `Complete targeted exercises and verify syntax line-by-line.`,
          estimatedMins: Math.round(subj.durationMinutes * 0.4),
          beginnerTip: `Start by reading documentation or examples before writing tests.`,
          verificationCriteria: `Runs cleanly with zero console syntax errors.`,
          completed: false,
        },
        {
          id: `task-${subj.id}-2`,
          title: `${subj.name} Hands-On Implementation`,
          actionDetail: `Write practical code or exercises and commit progress.`,
          estimatedMins: Math.round(subj.durationMinutes * 0.6),
          beginnerTip: `Commit your working changes with clear messages.`,
          verificationCriteria: `All test cases or validation scripts pass.`,
          completed: false,
        },
      ],
    }));

    const newMarkdown = generateMarkdownSchedule({
      goal: newGoal,
      totalDailyHours: newHours,
      dayNumber: plan.dayNumber,
      targetDays: plan.targetDays,
      timeBlocks: newBlocks,
      checklistGroups: newGroups,
    });

    setPlan((prev) => ({
      ...prev,
      goal: newGoal,
      totalDailyHours: newHours,
      timeBlocks: newBlocks,
      checklistGroups: newGroups,
      markdownSchedule: newMarkdown,
    }));

    setIsCustomizerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Contract Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDark={toggleDark}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenMarkdown={() => setIsMarkdownOpen(true)}
        onOpenCoach={() => setIsCoachOpen(true)}
        timerActive={activeTab === 'timer'}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'schedule' && (
          <ScheduleTable
            timeBlocks={plan.timeBlocks}
            goal={plan.goal}
            totalDailyHours={plan.totalDailyHours}
            dayNumber={plan.dayNumber}
            targetDays={plan.targetDays}
            mentorNote={plan.mentorNote}
            milestoneSummary={plan.milestoneSummary}
            onStartBlockTimer={handleStartBlockTimer}
            onGoToChecklist={() => setActiveTab('checklist')}
            onOpenCoach={() => setIsCoachOpen(true)}
          />
        )}

        {activeTab === 'checklist' && (
          <GroupedChecklist
            groups={plan.checklistGroups}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onOpenCoach={() => setIsCoachOpen(true)}
          />
        )}

        {activeTab === 'timer' && (
          <FocusTimer
            timeBlocks={plan.timeBlocks}
            activeBlock={activeTimerBlock}
            onClearActiveBlock={() => setActiveTimerBlock(null)}
            onSessionComplete={handleSessionComplete}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            currentDay={plan.dayNumber}
            targetDays={plan.targetDays}
            onSelectDay={handleSelectDay}
            goal={plan.goal}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <strong className="text-slate-700 dark:text-slate-300 font-semibold">FocusForge</strong> · Built for disciplined engineers and daily progress
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMarkdownOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Export Markdown
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Configure Schedule
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsCoachOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-emerald-600 dark:text-emerald-400 font-medium"
            >
              Consult AI Coach
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <MarkdownModal
        isOpen={isMarkdownOpen}
        onClose={() => setIsMarkdownOpen(false)}
        markdownContent={plan.markdownSchedule}
        dayNumber={plan.dayNumber}
      />

      <CoachPanel
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        goal={plan.goal}
        checklistGroups={plan.checklistGroups}
        dayNumber={plan.dayNumber}
      />

      <PlanCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentGoal={plan.goal}
        currentDailyHours={plan.totalDailyHours}
        currentSubjects={subjects}
        onApplyPlan={handleApplyPlan}
        isGenerating={isGeneratingPlan}
      />
    </div>
  );
}
