import React, { useState, useEffect, useRef } from 'react';
import { TimeBlock } from '../types';
import { sound } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface FocusTimerProps {
  timeBlocks: TimeBlock[];
  activeBlock: TimeBlock | null;
  onClearActiveBlock: () => void;
  onSessionComplete: (durationMinutes: number, subject: string) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  timeBlocks,
  activeBlock,
  onClearActiveBlock,
  onSessionComplete,
}) => {
  const defaultMinutes = activeBlock ? activeBlock.durationMinutes : 25;
  const [targetMinutes, setTargetMinutes] = useState<number>(defaultMinutes);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientAudioOn, setAmbientAudioOn] = useState<boolean>(false);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<string>(
    activeBlock ? activeBlock.subject : timeBlocks[0]?.subject || 'Deep Study'
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync when activeBlock changes from outer action
  useEffect(() => {
    if (activeBlock) {
      setSelectedSubject(activeBlock.subject);
      setTargetMinutes(activeBlock.durationMinutes);
      setSecondsRemaining(activeBlock.durationMinutes * 60);
      setIsRunning(false);
    }
  }, [activeBlock]);

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            sound.playChime('timer');
            setSessionCount((c) => c + 1);
            onSessionComplete(targetMinutes, selectedSubject);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, targetMinutes, selectedSubject, onSessionComplete]);

  // Ambient sound handler
  const handleToggleAmbient = () => {
    const next = !ambientAudioOn;
    setAmbientAudioOn(next);
    sound.toggleFocusNoise(next);
  };

  const handleStartPause = () => {
    if (!isRunning && secondsRemaining === 0) {
      setSecondsRemaining(targetMinutes * 60);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(targetMinutes * 60);
  };

  const handleSelectPreset = (mins: number, subjectName?: string) => {
    setIsRunning(false);
    setTargetMinutes(mins);
    setSecondsRemaining(mins * 60);
    if (subjectName) setSelectedSubject(subjectName);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((targetMinutes * 60 - secondsRemaining) / (targetMinutes * 60)) * 100)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Timer Dashboard Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xs text-center">
        {/* Subject Context Header */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          <span>Focus Mode</span>
          <span aria-hidden="true">·</span>
          <span>Target: {selectedSubject}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{sessionCount} Completed Today</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {activeBlock ? activeBlock.focusArea : selectedSubject}
        </h2>

        {/* Big Tabular Clock */}
        <div className="my-8">
          <div className="font-mono tabular-nums text-7xl sm:text-8xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formattedTime}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-2 uppercase tracking-widest">
            {isRunning ? 'Timer Active — Maintain Deep Focus' : 'Ready — Click Play to Begin'}
          </div>
        </div>

        {/* Session Progress Bar */}
        <div className="w-full max-w-md mx-auto h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-slate-900 dark:bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleStartPause}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer shadow-xs ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Session</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset Countdown"
            aria-label="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleAmbient}
            className={`flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              ambientAudioOn
                ? 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title="Synthesize soothing brown noise focus hum"
          >
            {ambientAudioOn ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Ambient Hum {ambientAudioOn ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Quick Subject & Duration Selectors */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Preset Time Blocks from Your Schedule
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {timeBlocks.map((block) => (
            <button
              key={block.id}
              onClick={() => handleSelectPreset(block.durationMinutes, block.subject)}
              className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                selectedSubject === block.subject && targetMinutes === block.durationMinutes
                  ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {block.subject}
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {block.durationMinutes}m
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                {block.focusArea}
              </div>
            </button>
          ))}
        </div>

        {/* Standard intervals */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Standard Pomodoro Intervals:</span>
          <div className="flex items-center gap-1.5">
            {[15, 25, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSelectPreset(mins)}
                className={`px-2.5 py-1 rounded font-mono tabular-nums cursor-pointer transition-colors ${
                  targetMinutes === mins
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
