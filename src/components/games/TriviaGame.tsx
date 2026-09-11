import { useState, useMemo } from 'react';
import { Check, X, RotateCcw, Trophy, Brain, Timer } from 'lucide-react';

interface Question {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

const QUESTIONS: Question[] = [
  {
    q: 'What AI model powers ARB TECH\'s Sovereign AIOS Architecture?',
    options: ['GPT-4', 'Gemma 4', 'LLaMA 3', 'Claude 3'],
    answer: 1,
    explain: 'The Sovereign AIOS is built on Gemma 4 with a Python backend.',
  },
  {
    q: 'Which language is primarily used for AI/ML at ARB TECH?',
    options: ['JavaScript', 'Rust', 'Python', 'Go'],
    answer: 2,
    explain: 'Python is the backbone of the AIOS architecture.',
  },
  {
    q: 'What does ARB Sender Utility focus on?',
    options: ['Gaming', 'Security & API Integrations', 'Video Editing', 'Data Mining'],
    answer: 1,
    explain: 'ARB Sender is a security-focused messaging utility with API integrations.',
  },
  {
    q: 'What UI style does the Chatme Portal use?',
    options: ['Neumorphism', 'Glassmorphism', 'Skeuomorphism', 'Flat Design'],
    answer: 1,
    explain: 'Chatme Portal features a glassmorphism UI with real-time communication.',
  },
  {
    q: 'What is the primary backend for Chatme Portal?',
    options: ['Django', 'Flask', 'Node.js', 'Ruby on Rails'],
    answer: 2,
    explain: 'Chatme Portal runs on Node.js with WebSocket communication.',
  },
  {
    q: 'Who is the Co-Founder of ARB TECH?',
    options: ['John Doe', 'Syeda Arooba Fatima', 'Jane Smith', 'Alex Chen'],
    answer: 1,
    explain: 'Syeda Arooba Fatima is the Co-Founder and Lead Digital Infrastructure Architect.',
  },
  {
    q: 'What does Groq specialize in?',
    options: ['AI inference acceleration', 'Cloud storage', 'Database management', 'Web hosting'],
    answer: 0,
    explain: 'Groq builds high-speed AI inference chips for fast model execution.',
  },
  {
    q: 'Which model does AROOBA AI use?',
    options: ['openai/gpt-oss-120b', 'gpt-4', 'bloom', 'falcon-40b'],
    answer: 0,
    explain: 'AROOBA AI runs on Groq\'s gpt-oss-120b model for fast responses.',
  },
  {
    q: 'What is Supabase primarily used as?',
    options: ['A CSS framework', 'An open-source Firebase alternative', 'A game engine', 'A video editor'],
    answer: 1,
    explain: 'Supabase is an open-source backend providing auth, database, and storage.',
  },
  {
    q: 'What is the default theme color of this site?',
    options: ['Neon Purple', 'Teal', 'Electric Pink', 'Gold'],
    answer: 1,
    explain: 'The default accent is teal (#00d4aa), customizable from Settings.',
  },
];

export default function TriviaGame() {
  const shuffled = useMemo(() => [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 8), []);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = shuffled[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === question.answer) {
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (current + 1 >= shuffled.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
  };

  if (finished) {
    const maxScore = shuffled.length * 10;
    const pct = Math.round((score / maxScore) * 100);
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid var(--border-active)' }}>
          <Trophy className="w-10 h-10 accent-text" />
        </div>
        <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-2">Quiz Complete</h3>
        <p className="text-lg text-[var(--text-primary)] mb-1">
          Score: <span className="accent-text font-bold">{score}</span> / {maxScore}
        </p>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{pct}% correct</p>
        <button onClick={restart} className="btn-primary inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 accent-text" />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Question {current + 1} / {shuffled.length}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {streak > 1 && (
            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--primary-color)' }}>
              <Timer className="w-3 h-3" /> {streak}x streak
            </span>
          )}
          <span className="text-sm font-medium accent-text">{score} pts</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: 'var(--bg-panel)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${((current + 1) / shuffled.length) * 100}%`, background: 'var(--primary-color)' }}
        />
      </div>

      {/* Question */}
      <h3 className="text-base font-medium text-[var(--text-primary)] mb-5 leading-relaxed">{question.q}</h3>

      {/* Options */}
      <div className="space-y-2.5 mb-5">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === question.answer;
          let style: React.CSSProperties = {
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
          };

          if (showResult) {
            if (isCorrect) {
              style = { background: 'rgba(0,212,170,0.08)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' };
            } else if (isSelected) {
              style = { background: 'rgba(255,0,0,0.05)', border: '1px solid rgba(255,0,0,0.2)', color: '#f87171' };
            } else {
              style = { background: 'var(--bg-panel)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', opacity: 0.5 };
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
              className="w-full text-left p-3.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between"
              style={style}
            >
              <span>{opt}</span>
              {showResult && isCorrect && <Check className="w-4 h-4" />}
              {showResult && isSelected && !isCorrect && <X className="w-4 h-4" />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className="p-3.5 rounded-lg mb-5 fade-in" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <span className="accent-text font-medium">Explanation: </span>{question.explain}
          </p>
        </div>
      )}

      {showResult && (
        <button onClick={next} className="btn-primary flex items-center gap-2 mx-auto">
          {current + 1 >= shuffled.length ? 'See Results' : 'Next Question'}
        </button>
      )}
    </div>
  );
}
