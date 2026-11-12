import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, CheckCircle2, AlertCircle, RefreshCw, X, MessageSquare, BookOpen } from 'lucide-react';
import { ChecklistGroup } from '../types';

interface CoachPanelProps {
  isOpen: boolean;
  onClose: () => void;
  goal: string;
  checklistGroups: ChecklistGroup[];
  dayNumber: number;
}

interface Message {
  role: 'user' | 'coach';
  content: string;
  timestamp: string;
}

export const CoachPanel: React.FC<CoachPanelProps> = ({
  isOpen,
  onClose,
  goal,
  checklistGroups,
  dayNumber,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'coach',
      content: `Hello! I am your Technical Mentor & Productivity Coach for your journey: **${goal}**. 

I am here to guide your 4-hour study sessions, unblock technical concepts, review your code design, or adjust your habits. What would you like to work on right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'debrief'>('chat');
  const [debriefContent, setDebriefContent] = useState<string | null>(null);
  const [isDebriefLoading, setIsDebriefLoading] = useState(false);

  if (!isOpen) return null;

  // Calculate task statistics
  let total = 0;
  let completed = 0;
  const completedTitles: string[] = [];
  const incompleteTitles: string[] = [];

  checklistGroups.forEach((g) => {
    g.tasks.forEach((t) => {
      total++;
      if (t.completed) {
        completed++;
        completedTitles.push(`[${g.subject}] ${t.title}`);
      } else {
        incompleteTitles.push(`[${g.subject}] ${t.title}`);
      }
    });
  });

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/coach/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          goal,
          completedCount: completed,
          totalCount: total,
          activeSubject: 'Python Internship Study',
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'coach',
            content: data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || 'No response from mentor');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'coach',
          content: `Coach alert: ${err.message || 'Unable to connect to coach at this moment. Take a 5-minute break and retry.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunDebrief = async () => {
    setIsDebriefLoading(true);
    try {
      const res = await fetch('/api/coach/debrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          completedTasks: completedTitles,
          incompleteTasks: incompleteTitles,
          reflections: `Completed ${completed} of ${total} tasks for Day ${dayNumber}.`,
        }),
      });

      const data = await res.json();
      if (data.success && data.debrief) {
        setDebriefContent(data.debrief);
      } else {
        throw new Error(data.error || 'Failed to generate debrief');
      }
    } catch (err: any) {
      setDebriefContent(`Error: ${err.message}`);
    } finally {
      setIsDebriefLoading(false);
    }
  };

  const quickPrompts = [
    'How do I stay laser-focused for 4 hours without mental burnout?',
    'Explain the Number Guessing Game loop architecture in Python',
    'What common git mistakes do beginners make and how to avoid them?',
    'How does learning candlestick basics connect to Python programming?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-xl h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Technical Mentor & Coach
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Direct Guidance</span>
                <span aria-hidden="true">·</span>
                <span>Day {dayNumber} Milestone</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-2.5 py-1 font-medium rounded-md cursor-pointer transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Mentor Chat
              </button>
              <button
                onClick={() => setActiveTab('debrief')}
                className={`px-2.5 py-1 font-medium rounded-md cursor-pointer transition-colors ${
                  activeTab === 'debrief'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Daily Debrief
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              aria-label="Close mentor panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'coach' && (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white dark:bg-slate-800'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div
                      className={`text-[10px] mt-2 font-mono ${
                        msg.role === 'user' ? 'text-slate-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 items-center text-xs text-slate-500 dark:text-slate-400">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <span>Mentor is formulating technical guidance...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-6 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="text-[11px] font-medium text-slate-500 mb-1.5">Quick questions:</div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-2.5 py-1 text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
              <input
                type="text"
                placeholder="Ask your mentor about code, Git, logic, or focus habits..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask</span>
              </button>
            </div>
          </div>
        ) : (
          /* Daily Debrief Tab */
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Today's Execution Snapshot
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-400">
                  {completed} / {total} Tasks Completed
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Run an end-of-day debrief. Your mentor will analyze your completed work, extract high-yield lessons, and calibrate tomorrow's 4-hour schedule.
              </p>
              <button
                onClick={handleRunDebrief}
                disabled={isDebriefLoading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
              >
                {isDebriefLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Today's Progress...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate End-of-Day Debrief</span>
                  </>
                )}
              </button>
            </div>

            {debriefContent && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mentor Debrief Report</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {debriefContent}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
