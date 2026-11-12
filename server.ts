import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Generate structured study & work plan
app.post('/api/coach/generate-plan', async (req, res) => {
  try {
    const {
      goal = 'Land a Python internship in 60 days',
      totalDailyHours = 4,
      subjects = [
        { name: 'Python Theory & Mini-Projects', durationMinutes: 120 },
        { name: 'Git & GitHub', durationMinutes: 60 },
        { name: 'HackerRank Practice', durationMinutes: 30 },
        { name: 'Trading Study', durationMinutes: 30 },
      ],
      dayNumber = 1,
      targetDays = 60,
    } = req.body;

    const subjectDescriptions = subjects
      .map((s: { name: string; durationMinutes: number }) => `- ${s.name} (${s.durationMinutes} minutes)`)
      .join('\n');

    const prompt = `You are an elite productivity coach and senior technical mentor.
A student needs a high-yield, structured daily study and work plan.

STUDENT PROFILE:
- Goal: ${goal}
- Day: Day ${dayNumber} of ${targetDays}
- Total Daily Time: ${totalDailyHours} hours (${totalDailyHours * 60} minutes)
- Subjects & Time Allocation:
${subjectDescriptions}

RULES & CONSTRAINTS:
1. Every task must be concrete, actionable, and beginner-friendly (no vague tasks like "learn python").
2. Time blocks must logically sequence with optimal energy management (heavy coding first, hands-on practice, technical drills, lighter research).
3. Include specific goals and beginner tips for each task.
4. Generate both structured JSON data and a beautiful Markdown schedule string.
The Markdown string MUST contain:
- A structured schedule table with columns: Time Block, Subject, Focus Area, Specific Daily Goal.
- A grouped daily checklist in markdown checkbox format (- [ ] Task description) with brief actionable instruction.
- A Coach's Tip section.

Return valid JSON adhering to the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mentorNote: {
              type: Type.STRING,
              description: 'Expert coach guidance note explaining strategy for today',
            },
            milestoneSummary: {
              type: Type.STRING,
              description: 'Summary of what will be achieved today towards the primary goal',
            },
            timeBlocks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  startTime: { type: Type.STRING, description: 'e.g. 09:00 - 10:15' },
                  subject: { type: Type.STRING },
                  durationMinutes: { type: Type.INTEGER },
                  focusArea: { type: Type.STRING },
                  specificDailyGoal: { type: Type.STRING },
                  recommendedBreak: { type: Type.STRING },
                },
                required: ['id', 'startTime', 'subject', 'durationMinutes', 'focusArea', 'specificDailyGoal'],
              },
            },
            checklistGroups: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subject: { type: Type.STRING },
                  durationMinutes: { type: Type.INTEGER },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        actionDetail: { type: Type.STRING },
                        estimatedMins: { type: Type.INTEGER },
                        beginnerTip: { type: Type.STRING },
                        verificationCriteria: { type: Type.STRING },
                      },
                      required: ['id', 'title', 'actionDetail', 'estimatedMins'],
                    },
                  },
                },
                required: ['subject', 'durationMinutes', 'tasks'],
              },
            },
            markdownSchedule: {
              type: Type.STRING,
              description: 'Clean formatted markdown text containing the schedule table and grouped checklist',
            },
          },
          required: ['mentorNote', 'milestoneSummary', 'timeBlocks', 'checklistGroups', 'markdownSchedule'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating plan:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate plan from Gemini',
    });
  }
});

// Endpoint: Ask Productivity Coach / Technical Mentor
app.post('/api/coach/ask', async (req, res) => {
  try {
    const { question, goal, completedCount, totalCount, activeSubject } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const systemInstruction = `You are an expert productivity coach and seasoned software engineering mentor.
You communicate with clarity, empathy, and high-impact technical precision.
Never give vague platitudes. Provide concrete code examples, mental models, or practical habit adjustments.
Current student goal: ${goal || 'Land a Python internship in 60 days'}.
Tasks completed today: ${completedCount ?? 0} of ${totalCount ?? 0}.
Current active subject context: ${activeSubject || 'General study'}.
Keep answers focused, structured with bullet points or numbered steps where helpful, and under 250 words unless writing code.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: question,
      config: {
        systemInstruction,
      },
    });

    res.json({
      success: true,
      answer: response.text || 'Unable to generate coach response.',
    });
  } catch (error: any) {
    console.error('Error asking coach:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to communicate with coach',
    });
  }
});

// Endpoint: Daily Debrief
app.post('/api/coach/debrief', async (req, res) => {
  try {
    const { completedTasks, incompleteTasks, reflections, goal } = req.body;

    const prompt = `Review the student's study day and provide an encouraging, actionable debrief.
Goal: ${goal}
Completed tasks (${completedTasks?.length || 0}):
${(completedTasks || []).map((t: string) => `- ${t}`).join('\n')}

Incomplete tasks (${incompleteTasks?.length || 0}):
${(incompleteTasks || []).map((t: string) => `- ${t}`).join('\n')}

Student reflection / thoughts: ${reflections || 'None provided'}

Provide:
1. High-impact praise for completed technical milestones.
2. Constructive diagnostic on any leftover tasks without guilt.
3. 3 specific tactical priorities for tomorrow to maintain momentum.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite mentor who builds confident engineers through deliberate practice.',
      },
    });

    res.json({
      success: true,
      debrief: response.text || 'Great work today!',
    });
  } catch (error: any) {
    console.error('Error generating debrief:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate debrief',
    });
  }
});

// Vite middleware in dev or static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
