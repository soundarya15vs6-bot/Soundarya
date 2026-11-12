import React, { useState } from 'react';
import { ChecklistGroup, ChecklistTask } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Check,
  Plus,
  HelpCircle,
  Code2,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface GroupedChecklistProps {
  groups: ChecklistGroup[];
  onToggleTask: (groupIdx: number, taskIdx: number) => void;
  onAddTask: (groupIdx: number, task: ChecklistTask) => void;
  onOpenCoach: () => void;
}

export const GroupedChecklist: React.FC<GroupedChecklistProps> = ({
  groups,
  onToggleTask,
  onAddTask,
  onOpenCoach,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [expandedTips, setExpandedTips] = useState<Record<string, boolean>>({});
  const [addingToGroup, setAddingToGroup] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDetail, setNewTaskDetail] = useState('');
  const [newTaskMins, setNewTaskMins] = useState(15);

  // Calculate statistics
  let totalTasks = 0;
  let completedTasks = 0;
  let totalMinutes = 0;
  let completedMinutes = 0;

  groups.forEach((group) => {
    group.tasks.forEach((task) => {
      totalTasks += 1;
      totalMinutes += task.estimatedMins;
      if (task.completed) {
        completedTasks += 1;
        completedMinutes += task.estimatedMins;
      }
    });
  });

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggle = (groupIdx: number, taskIdx: number, task: ChecklistTask) => {
    onToggleTask(groupIdx, taskIdx);
    if (!task.completed) {
      sound.playChime('task');
      // If this completion finishes the entire day, fire celebratory confetti
      if (completedTasks + 1 === totalTasks && totalTasks > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const toggleTip = (taskId: string) => {
    setExpandedTips((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const submitNewTask = (groupIdx: number) => {
    if (!newTaskTitle.trim()) return;
    const task: ChecklistTask = {
      id: `custom-${Date.now()}`,
      title: newTaskTitle.trim(),
      actionDetail: newTaskDetail.trim() || 'Execute deliberately according to plan.',
      estimatedMins: Number(newTaskMins) || 15,
      completed: false,
    };
    onAddTask(groupIdx, task);
    setNewTaskTitle('');
    setNewTaskDetail('');
    setAddingToGroup(null);
  };

  return (
    <div className="space-y-6">
      {/* Progress & Stats Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Grouped Daily Checklist</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                {completedTasks} of {totalTasks} Tasks Done
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                {completedMinutes} of {totalMinutes}m Completed
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {percentage === 100
                ? 'All Daily Tasks Completed! Outstanding Job'
                : 'Actionable Execution Checklist'}
            </h2>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({totalTasks})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'pending'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pending ({totalTasks - completedTasks})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'completed'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Done ({completedTasks})
            </button>
          </div>
        </div>

        {/* Progress line */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono mb-1.5">
            <span>Daily Completion Pace</span>
            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{percentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 dark:bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Groups */}
      <div className="space-y-6">
        {groups.map((group, groupIdx) => {
          const groupTasks = group.tasks.filter((t) => {
            if (filter === 'pending') return !t.completed;
            if (filter === 'completed') return t.completed;
            return true;
          });

          const groupCompleted = group.tasks.filter((t) => t.completed).length;

          return (
            <div
              key={groupIdx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs"
            >
              {/* Group Header */}
              <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {group.subject}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    · {group.durationMinutes} mins allocated
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {groupCompleted}/{group.tasks.length} done
                  </span>
                  <button
                    onClick={() => setAddingToGroup(addingToGroup === groupIdx ? null : groupIdx)}
                    className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md transition-colors cursor-pointer"
                    title="Add custom task to this group"
                    aria-label="Add task"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add Task Inline Form */}
              {addingToGroup === groupIdx && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Add Concrete Task to {group.subject}
                    </span>
                    <button
                      onClick={() => setAddingToGroup(null)}
                      className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Task Title (e.g. Solve HackerRank Python If-Else)"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Action Detail (e.g. Run tests on local terminal)"
                      value={newTaskDetail}
                      onChange={(e) => setNewTaskDetail(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
                    />
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="5"
                        max="180"
                        value={newTaskMins}
                        onChange={(e) => setNewTaskMins(Number(e.target.value))}
                        className="w-16 px-2 py-1.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-center focus:outline-none"
                      />
                      <span className="text-xs text-slate-500 font-mono">min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => submitNewTask(groupIdx)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-md transition-colors cursor-pointer"
                  >
                    Save Task
                  </button>
                </div>
              )}

              {/* Task List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {groupTasks.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                    No tasks match the active filter.
                  </div>
                ) : (
                  groupTasks.map((task) => {
                    const originalTaskIdx = group.tasks.findIndex((t) => t.id === task.id);
                    const isTipOpen = !!expandedTips[task.id];

                    return (
                      <div
                        key={task.id}
                        className={`p-4 sm:px-6 transition-colors ${
                          task.completed
                            ? 'bg-slate-50/40 dark:bg-slate-900/30'
                            : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Checkbox */}
                          <button
                            onClick={() => handleToggle(groupIdx, originalTaskIdx, task)}
                            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                              task.completed
                                ? 'bg-slate-900 dark:bg-emerald-500 border-slate-900 dark:border-emerald-500 text-white'
                                : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-400 bg-white dark:bg-slate-800'
                            }`}
                            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          {/* Task Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                              <h3
                                className={`text-sm font-semibold transition-colors ${
                                  task.completed
                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                    : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {task.title}
                              </h3>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="flex items-center gap-1 text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                                  <Clock className="w-3 h-3" />
                                  {task.estimatedMins}m
                                </span>
                              </div>
                            </div>

                            <p
                              className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                                task.completed
                                  ? 'text-slate-400 dark:text-slate-500'
                                  : 'text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {task.actionDetail}
                            </p>

                            {/* Verification Criteria */}
                            {task.verificationCriteria && (
                              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span>
                                  <strong className="text-slate-700 dark:text-slate-300 font-medium">
                                    Done when:
                                  </strong>{' '}
                                  {task.verificationCriteria}
                                </span>
                              </div>
                            )}

                            {/* Beginner Tip / Code Snippet Toggle */}
                            {(task.beginnerTip || task.codeSnippet) && (
                              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                                <button
                                  onClick={() => toggleTip(task.id)}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                >
                                  <HelpCircle className="w-3 h-3 text-amber-500" />
                                  <span>{isTipOpen ? 'Hide Beginner Coach Guidance' : 'View Beginner Coach Guidance & Code'}</span>
                                  {isTipOpen ? (
                                    <ChevronUp className="w-3 h-3" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3" />
                                  )}
                                </button>

                                {isTipOpen && (
                                  <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-2 border border-slate-200/70 dark:border-slate-700/60">
                                    {task.beginnerTip && (
                                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                        <strong className="text-slate-900 dark:text-white font-medium">
                                          Mentor Insight:
                                        </strong>{' '}
                                        {task.beginnerTip}
                                      </p>
                                    )}

                                    {task.codeSnippet && (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                          <Code2 className="w-3 h-3" />
                                          <span>Reference Pattern:</span>
                                        </div>
                                        <pre className="p-2.5 bg-slate-900 text-slate-100 rounded-md text-xs font-mono overflow-x-auto leading-relaxed">
                                          <code>{task.codeSnippet}</code>
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
