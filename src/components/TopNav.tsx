import React from 'react';
import { Sun, Moon, Sparkles, FileText, Settings, Play } from 'lucide-react';

interface TopNavProps {
  activeTab: 'schedule' | 'checklist' | 'timer' | 'roadmap';
  setActiveTab: (tab: 'schedule' | 'checklist' | 'timer' | 'roadmap') => void;
  isDark: boolean;
  toggleDark: () => void;
  onOpenCustomizer: () => void;
  onOpenMarkdown: () => void;
  onOpenCoach: () => void;
  timerActive: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleDark,
  onOpenCustomizer,
  onOpenMarkdown,
  onOpenCoach,
  timerActive,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark in display face */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold text-base shadow-xs">
                  F
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  FocusForge
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4 clean single-line nav tabs with subtle hover underlines */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer rounded-md ${
                activeTab === 'schedule'
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              Schedule Table
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer rounded-md ${
                activeTab === 'checklist'
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              Daily Checklist
            </button>

            <button
              onClick={() => setActiveTab('timer')}
              className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer rounded-md flex items-center gap-1.5 ${
                activeTab === 'timer'
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>Focus Timer</span>
              {timerActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Timer Running" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer rounded-md ${
                activeTab === 'roadmap'
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              60-Day Roadmap
            </button>
          </nav>

          {/* Zone 3: 1 primary action button + utility controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenMarkdown}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
              title="View or copy Markdown schedule"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Markdown</span>
            </button>

            <button
              onClick={onOpenCustomizer}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Customize schedule & time splits"
              aria-label="Customize Schedule"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={toggleDark}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenCoach}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Coach & Mentor</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
