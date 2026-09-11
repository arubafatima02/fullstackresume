import { useState, useEffect, useRef } from 'react';
import { Terminal, RotateCcw, Check, X, KeyRound } from 'lucide-react';

const CODE_LENGTH = 5;
const MAX_ATTEMPTS = 10;
const DIGITS = '0123456789ABCDEF';

function generateCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += DIGITS[Math.floor(Math.random() * DIGITS.length)];
  }
  return code;
}

interface GuessResult {
  guess: string;
  exact: number;
  partial: number;
}

export default function TerminalGame() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<GuessResult[]>([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const start = () => {
    setCode(generateCode());
    setInput('');
    setHistory([]);
    setWon(false);
    setLost(false);
    setError(null);
  };

  useEffect(() => { start(); }, []);

  useEffect(() => {
    if (!won && !lost) inputRef.current?.focus();
  }, [won, lost, history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const guess = input.toUpperCase().trim();

    if (guess.length !== CODE_LENGTH) {
      setError(`Code must be ${CODE_LENGTH} hex characters (0-9, A-F)`);
      return;
    }
    if (!/^[0-9A-F]+$/.test(guess)) {
      setError('Only hex characters allowed: 0-9, A-F');
      return;
    }

    setError(null);

    let exact = 0;
    let partial = 0;
    const codeArr = code.split('');
    const guessArr = guess.split('');
    const used = new Array(CODE_LENGTH).fill(false);

    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessArr[i] === codeArr[i]) { exact++; used[i] = true; }
    }
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessArr[i] !== codeArr[i]) {
        for (let j = 0; j < CODE_LENGTH; j++) {
          if (!used[j] && guessArr[i] === codeArr[j]) { partial++; used[j] = true; break; }
        }
      }
    }

    const result: GuessResult = { guess, exact, partial };
    const newHistory = [...history, result];
    setHistory(newHistory);
    setInput('');

    if (exact === CODE_LENGTH) setWon(true);
    else if (newHistory.length >= MAX_ATTEMPTS) setLost(true);
  };

  const remaining = MAX_ATTEMPTS - history.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <KeyRound className="w-5 h-5 accent-text" />
        <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">Crack the Access Code</h3>
      </div>

      {/* Info panel */}
      <div className="p-4 rounded-lg" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          A {CODE_LENGTH}-character hex code (0-9, A-F) has been generated. You have {MAX_ATTEMPTS} attempts.
          <br /><span className="accent-text">Exact</span> = right digit, right position. <span style={{ color: '#facc15' }}>Partial</span> = right digit, wrong position.
        </p>
      </div>

      {/* Attempts remaining */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Attempts remaining: <span className="accent-text">{remaining}</span> / {MAX_ATTEMPTS}
        </span>
        {remaining <= 3 && remaining > 0 && (
          <span className="text-xs text-amber-400 font-medium">Low attempts!</span>
        )}
      </div>

      {/* History */}
      <div className="rounded-lg max-h-56 overflow-y-auto no-scrollbar p-4" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
        {history.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No attempts yet. Enter your first guess below.</p>
        ) : (
          <div className="space-y-2.5">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="text-xs w-6" style={{ color: 'var(--text-muted)' }}>#{i + 1}</span>
                  <span className="font-mono tracking-wider text-[var(--text-primary)]">{h.guess}</span>
                </span>
                <span className="flex gap-3 text-xs font-medium">
                  <span className="accent-text">{h.exact} exact</span>
                  <span style={{ color: '#facc15' }}>{h.partial} partial</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      {!won && !lost && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={CODE_LENGTH}
            className="cyber-input flex-1 text-center uppercase text-lg tracking-widest"
            placeholder={`${'-'.repeat(CODE_LENGTH)}`}
          />
          <button type="submit" className="btn-primary">Submit</button>
        </form>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Win */}
      {won && (
        <div className="p-6 text-center rounded-xl fade-in" style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid var(--primary-color)' }}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3" style={{ background: 'rgba(0,212,170,0.08)' }}>
            <Check className="w-7 h-7 accent-text" />
          </div>
          <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-1">Access Granted</h3>
          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            Code: <span className="accent-text font-bold font-mono">{code}</span>
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Cracked in {history.length} attempts</p>
          <button onClick={start} className="btn-primary inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> New Code
          </button>
        </div>
      )}

      {/* Lose */}
      {lost && (
        <div className="p-6 text-center rounded-xl fade-in" style={{ background: 'rgba(255,0,0,0.03)', border: '1px solid rgba(255,0,0,0.15)' }}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3" style={{ background: 'rgba(255,0,0,0.05)' }}>
            <X className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="font-display font-bold text-xl text-red-400 mb-1">Access Denied</h3>
          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            The code was: <span className="font-bold font-mono text-[var(--text-primary)]">{code}</span>
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Maximum attempts reached</p>
          <button onClick={start} className="btn-primary inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}
