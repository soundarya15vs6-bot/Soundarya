import { DailyPlan, RoadmapPhase, SubjectConfig, TimeBlock, ChecklistGroup } from '../types';

export const DEFAULT_SUBJECTS: SubjectConfig[] = [
  {
    id: 'subj-1',
    name: 'Python Theory & Mini-Projects',
    durationMinutes: 120,
    color: 'emerald',
    category: 'core',
  },
  {
    id: 'subj-2',
    name: 'Git & GitHub',
    durationMinutes: 60,
    color: 'sky',
    category: 'tooling',
  },
  {
    id: 'subj-3',
    name: 'HackerRank Practice',
    durationMinutes: 30,
    color: 'amber',
    category: 'practice',
  },
  {
    id: 'subj-4',
    name: 'Trading Study',
    durationMinutes: 30,
    color: 'purple',
    category: 'domain',
  },
];

export const DEFAULT_TIME_BLOCKS: TimeBlock[] = [
  {
    id: 'tb-1',
    startTime: '09:00 - 10:15',
    subject: 'Python Theory & Practice',
    durationMinutes: 75,
    focusArea: 'Variables, Type-Casting & Control Flow',
    specificDailyGoal: 'Master conditional logic and while-loops with resilient user input handling',
    recommendedBreak: '10 min water & posture stretch',
  },
  {
    id: 'tb-2',
    startTime: '10:25 - 11:10',
    subject: 'Python Mini-Projects',
    durationMinutes: 45,
    focusArea: 'CLI Number Guessing Game',
    specificDailyGoal: 'Build, debug, and document number_guesser.py with replay counter and bounds checking',
    recommendedBreak: '15 min walk away from screen',
  },
  {
    id: 'tb-3',
    startTime: '11:25 - 12:25',
    subject: 'Git & GitHub',
    durationMinutes: 60,
    focusArea: 'Local Repository & GitHub Remote Sync',
    specificDailyGoal: 'Initialize repo, construct clean .gitignore, practice conventional commits, and push to origin main',
    recommendedBreak: '10 min eye rest',
  },
  {
    id: 'tb-4',
    startTime: '12:35 - 13:05',
    subject: 'HackerRank Practice',
    durationMinutes: 30,
    focusArea: 'Python Warmup & Conditional Logic',
    specificDailyGoal: 'Solve 2 beginner problems (If-Else & Division) with 100% test case coverage',
    recommendedBreak: '5 min hydration',
  },
  {
    id: 'tb-5',
    startTime: '13:10 - 13:40',
    subject: 'Trading Study',
    durationMinutes: 30,
    focusArea: 'Candlestick Anatomy & Algorithmic Indicators',
    specificDailyGoal: 'Diagram OHLC prices, understand wick rejection, and study RSI momentum overbought/oversold limits',
    recommendedBreak: 'Session Complete — Log Daily Debrief',
  },
];

export const DEFAULT_CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    subject: 'Python Theory & Mini-Projects (120 Mins)',
    durationMinutes: 120,
    tasks: [
      {
        id: 'task-py-1',
        title: 'Input Validation & Data Types Drill',
        actionDetail: 'Write an interactive script prompting user age and budget, wrapping input in try/except ValueError blocks.',
        estimatedMins: 30,
        beginnerTip: 'Remember: input() in Python always returns a string. Always cast explicitly with int() or float() inside a try block.',
        verificationCriteria: 'Run the script and deliberately type letters like "abc" to verify it catches the error gracefully instead of crashing.',
        codeSnippet: 'try:\n    user_val = int(input("Enter number: "))\nexcept ValueError:\n    print("Please enter a valid integer!")',
        completed: false,
      },
      {
        id: 'task-py-2',
        title: 'Control Flow & Bounded While-Loops',
        actionDetail: 'Construct a while-loop with an explicit exit sentinel and maximum 5-attempt counter.',
        estimatedMins: 30,
        beginnerTip: 'Always increment your counter variable (e.g. attempts += 1) inside the loop, or your program will freeze in an infinite loop.',
        verificationCriteria: 'Loop terminates either when the user inputs "quit" or when attempts reaches 5.',
        codeSnippet: 'attempts = 0\nmax_attempts = 5\nwhile attempts < max_attempts:\n    # logic\n    attempts += 1',
        completed: false,
      },
      {
        id: 'task-py-3',
        title: 'Mini-Project: CLI Number Guessing Game',
        actionDetail: 'Create number_guesser.py. Use random.randint(1, 100), give "Too high" / "Too low" feedback, and display total guesses taken.',
        estimatedMins: 45,
        beginnerTip: 'Start simple: first make it guess 1 number, then add the attempts counter, then add the play-again loop.',
        verificationCriteria: 'Play the game from the terminal 3 times in a row without syntax or runtime exceptions.',
        codeSnippet: 'import random\nsecret = random.randint(1, 100)\n# prompt user & compare',
        completed: false,
      },
      {
        id: 'task-py-4',
        title: 'PEP 8 Code Cleanup & Docstrings',
        actionDetail: 'Add descriptive docstrings to functions, use snake_case for variables, and check 79-character line limits.',
        estimatedMins: 15,
        beginnerTip: 'Clean code is what separates internship candidates from hobbyists during code reviews.',
        verificationCriteria: 'Run python -m py_compile number_guesser.py to verify clean compilation.',
        completed: false,
      },
    ],
  },
  {
    subject: 'Git & GitHub (60 Mins)',
    durationMinutes: 60,
    tasks: [
      {
        id: 'task-git-1',
        title: 'Local Git Setup & Proper .gitignore',
        actionDetail: 'Run git init in your project directory. Create a .gitignore file ignoring __pycache__/, .venv/, and *.pyc.',
        estimatedMins: 20,
        beginnerTip: 'Never commit virtual environments or bytecode caches. A clean .gitignore is the first thing engineers check.',
        verificationCriteria: 'Run git status and confirm __pycache__ never shows up as an untracked file.',
        codeSnippet: '__pycache__/\n*.pyc\n.venv/\n.env',
        completed: false,
      },
      {
        id: 'task-git-2',
        title: 'Atomic Staging & Conventional Commits',
        actionDetail: 'Stage number_guesser.py and commit with message "feat: add CLI number guessing game with bounds checking".',
        estimatedMins: 20,
        beginnerTip: 'Use present-tense imperative verbs: "feat: add ...", "fix: resolve ...", "docs: update ...".',
        verificationCriteria: 'Run git log --oneline and verify your commit message is formatted cleanly.',
        codeSnippet: 'git add number_guesser.py .gitignore\ngit commit -m "feat: add CLI number guessing game with bounds checking"',
        completed: false,
      },
      {
        id: 'task-git-3',
        title: 'Remote Repository & GitHub First Push',
        actionDetail: 'Create repository 60-days-python-journey on GitHub, link remote origin, and execute git push -u origin main.',
        estimatedMins: 20,
        beginnerTip: 'If your local branch is named "master", run git branch -M main before pushing.',
        verificationCriteria: 'Refresh your GitHub profile and see your repository and first green commit block active.',
        codeSnippet: 'git remote add origin https://github.com/<your-username>/60-days-python-journey.git\ngit branch -M main\ngit push -u origin main',
        completed: false,
      },
    ],
  },
  {
    subject: 'HackerRank Practice (30 Mins)',
    durationMinutes: 30,
    tasks: [
      {
        id: 'task-hr-1',
        title: 'Challenge: Python If-Else',
        actionDetail: 'Solve the conditional branching problem: handle odd numbers, even numbers 2-5, 6-20, and >20.',
        estimatedMins: 15,
        beginnerTip: 'Check edge cases: specifically n = 2, n = 5, n = 20, and large numbers like n = 100.',
        verificationCriteria: 'All 8 hidden test cases pass on HackerRank with a green checkmark.',
        completed: false,
      },
      {
        id: 'task-hr-2',
        title: 'Challenge: Arithmetic Operators & Division',
        actionDetail: 'Read two integers a and b. Print integer division (a // b) and float division (a / b).',
        estimatedMins: 15,
        beginnerTip: 'In Python 3, // is floor division and / always returns a floating-point number.',
        verificationCriteria: 'Code passes sample tests and final submission without division-by-zero warnings.',
        completed: false,
      },
    ],
  },
  {
    subject: 'Trading Study (30 Mins)',
    durationMinutes: 30,
    tasks: [
      {
        id: 'task-tr-1',
        title: 'OHLC Candlestick Anatomy Breakdown',
        actionDetail: 'Study and sketch the 4 core price markers: Open, High, Low, Close. Identify upper/lower wicks and real body.',
        estimatedMins: 15,
        beginnerTip: 'Long lower wicks represent buyers stepping in to reject lower prices; long upper wicks signal selling pressure.',
        verificationCriteria: 'Explain aloud what a green vs red candlestick means in terms of Open vs Close price.',
        completed: false,
      },
      {
        id: 'task-tr-2',
        title: 'RSI Momentum & Algorithmic Context',
        actionDetail: 'Understand the Relative Strength Index formula basics: overbought (>70) and oversold (<30), and how Python pandas calculates rolling averages.',
        estimatedMins: 15,
        beginnerTip: 'In algorithmic trading, RSI is calculated on rolling 14-period price changes. Later we will code this in Python!',
        verificationCriteria: 'Write a 3-bullet note summarizing how traders use RSI for mean-reversion strategies.',
        completed: false,
      },
    ],
  },
];

export function generateMarkdownSchedule(params: {
  goal: string;
  totalDailyHours: number;
  dayNumber: number;
  targetDays: number;
  timeBlocks: TimeBlock[];
  checklistGroups?: ChecklistGroup[];
}): string {
  const blocks = params.timeBlocks && params.timeBlocks.length > 0 ? params.timeBlocks : DEFAULT_TIME_BLOCKS;
  const groups = params.checklistGroups && params.checklistGroups.length > 0 ? params.checklistGroups : DEFAULT_CHECKLIST_GROUPS;

  let md = `# 🎯 Daily Study & Work Schedule: Day ${params.dayNumber} of ${params.targetDays}\n\n`;
  md += `**Goal:** ${params.goal}  \n`;
  md += `**Total Daily Time:** ${params.totalDailyHours} Hours (${params.totalDailyHours * 60} Minutes)  \n`;
  md += `**Date/Session:** Day ${params.dayNumber} | Focus Mode Active  \n\n`;

  md += `## 🕒 Daily Schedule & Time Blocks\n\n`;
  md += `| Time Block | Subject | Focus Area | Specific Daily Goal | Suggested Break |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;

  blocks.forEach((b) => {
    md += `| **${b.startTime}** | ${b.subject} (${b.durationMinutes}m) | ${b.focusArea} | ${b.specificDailyGoal} | ${b.recommendedBreak || '10 min rest'} |\n`;
  });

  md += `\n---\n\n## ✅ Grouped Daily Checklist\n\n`;

  groups.forEach((g) => {
    md += `### 📌 ${g.subject}\n`;
    g.tasks.forEach((t) => {
      const check = t.completed ? '[x]' : '[ ]';
      md += `- ${check} **${t.title} (${t.estimatedMins}m)**: ${t.actionDetail}\n`;
      if (t.beginnerTip) {
        md += `  > *Beginner Tip:* ${t.beginnerTip}\n`;
      }
      if (t.verificationCriteria) {
        md += `  > *Verification:* ${t.verificationCriteria}\n`;
      }
    });
    md += `\n`;
  });

  md += `---\n\n### 💡 Coach's Rule & Mindset\n`;
  md += `> *"Keep tasks concrete, actionable, and beginner-friendly. Push every working script to GitHub, solve problems line by line, and remember that consistent small blocks build an unstoppable engineering career."*\n`;

  return md;
}

export const INITIAL_DAILY_PLAN: DailyPlan = {
  goal: 'Land a Python internship in 60 days',
  totalDailyHours: 4,
  dayNumber: 1,
  targetDays: 60,
  mentorNote:
    'Start with deliberate focus. Four continuous, disciplined hours with your phone out of reach builds more real engineering capability than 8 unfocused hours. Commit to daily atomic GitHub pushes to build a rock-solid proof of work for hiring managers.',
  milestoneSummary:
    'Day 1 sets the bedrock: Python syntax & error handling, a working CLI Number Guessing Game, version control with clean commit messages on GitHub, 2 warm-up HackerRank algorithms, and core financial candlestick anatomy.',
  timeBlocks: DEFAULT_TIME_BLOCKS,
  checklistGroups: DEFAULT_CHECKLIST_GROUPS,
  markdownSchedule: generateMarkdownSchedule({
    goal: 'Land a Python internship in 60 days',
    totalDailyHours: 4,
    dayNumber: 1,
    targetDays: 60,
    timeBlocks: DEFAULT_TIME_BLOCKS,
    checklistGroups: DEFAULT_CHECKLIST_GROUPS,
  }),
};

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: 1,
    title: 'Core Foundations & Tooling',
    daysRange: 'Days 1 – 15',
    focus: 'Python syntax, data types, loops, functions, git atomic workflows, HackerRank Easy challenges, and market data structure basics.',
    keyOutcomes: [
      '5 CLI Mini-Projects pushed to GitHub',
      'Solid command line & Git branching mastery',
      '15+ HackerRank Easy badges completed',
      'Understanding of financial candles and CSV time series',
    ],
  },
  {
    phase: 2,
    title: 'Data Structures & OOP',
    daysRange: 'Days 16 – 30',
    focus: 'Lists, dicts, sets, classes, inheritance, modular architecture, unit testing with pytest, and technical interview algorithms.',
    keyOutcomes: [
      'Object-Oriented Bank / Trading Account simulator',
      'Clean modular Python packages with virtualenvs',
      'HackerRank 3-star Python rating',
      'Algorithmic indicator calculations using math functions',
    ],
  },
  {
    phase: 3,
    title: 'Real-World Libraries & APIs',
    daysRange: 'Days 31 – 45',
    focus: 'NumPy, Pandas, requests / REST APIs, data cleaning, automated data pipelines, and intermediate algorithm challenges.',
    keyOutcomes: [
      'Automated Stock/Crypto Price Alert CLI & API scraper',
      'Pandas data analysis with interactive plots',
      'Clean README.md portfolios with live demonstration GIFs',
      'Technical problem-solving in under 25 minutes',
    ],
  },
  {
    phase: 4,
    title: 'Internship Capstone & Interview Readiness',
    daysRange: 'Days 46 – 60',
    focus: 'Full capstone project, system design fundamentals, resume technical bullet points, mock interview questions, and job applications.',
    keyOutcomes: [
      'Flagship Portfolio Project with live GitHub repository',
      'ATS-optimized Python Developer Resume',
      'Fluency in live coding problem explanation',
      '15+ tailored internship applications submitted',
    ],
  },
];
