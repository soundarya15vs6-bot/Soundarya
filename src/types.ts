export interface SubjectConfig {
  id: string;
  name: string;
  durationMinutes: number;
  color: string;
  category: 'core' | 'tooling' | 'practice' | 'domain';
}

export interface TimeBlock {
  id: string;
  startTime: string;
  subject: string;
  durationMinutes: number;
  focusArea: string;
  specificDailyGoal: string;
  recommendedBreak?: string;
}

export interface ChecklistTask {
  id: string;
  title: string;
  actionDetail: string;
  estimatedMins: number;
  beginnerTip?: string;
  verificationCriteria?: string;
  completed: boolean;
  codeSnippet?: string;
}

export interface ChecklistGroup {
  subject: string;
  durationMinutes: number;
  tasks: ChecklistTask[];
}

export interface DailyPlan {
  goal: string;
  totalDailyHours: number;
  dayNumber: number;
  targetDays: number;
  mentorNote: string;
  milestoneSummary: string;
  timeBlocks: TimeBlock[];
  checklistGroups: ChecklistGroup[];
  markdownSchedule: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  daysRange: string;
  focus: string;
  keyOutcomes: string[];
}
