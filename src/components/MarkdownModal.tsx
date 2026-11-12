import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Code2 } from 'lucide-react';

interface MarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdownContent: string;
  dayNumber: number;
}

export const MarkdownModal: React.FC<MarkdownModalProps> = ({
  isOpen,
  onClose,
  markdownContent,
  dayNumber,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'raw' | 'preview'>('raw');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily_study_plan_day_${dayNumber}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Structured Markdown Schedule & Checklist
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Optimized for Obsidian, Notion & GitHub</span>
                <span aria-hidden="true">·</span>
                <span>Day {dayNumber} Plan</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => setViewMode('raw')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  viewMode === 'raw'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Raw Markdown
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Formatted View
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs leading-relaxed bg-slate-50 dark:bg-slate-950/70">
          {viewMode === 'raw' ? (
            <textarea
              readOnly
              value={markdownContent}
              className="w-full h-full min-h-[420px] p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none resize-none selection:bg-emerald-100 dark:selection:bg-emerald-900/40"
            />
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 font-sans text-sm text-slate-800 dark:text-slate-200 space-y-4">
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {markdownContent}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Ready to paste directly into your daily journal or GitHub repository</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
