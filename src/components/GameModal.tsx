import { X } from 'lucide-react';
import type { GameType } from '@/lib/types';
import SnakeGame from './games/SnakeGame';
import TriviaGame from './games/TriviaGame';
import TerminalGame from './games/TerminalGame';

interface GameModalProps {
  game: GameType;
  onClose: () => void;
}

const TITLES: Record<string, string> = {
  snake: 'Cyber Snake',
  trivia: 'Tech Trivia',
  terminal: 'Code Breaker',
};

export default function GameModal({ game, onClose }: GameModalProps) {
  if (!game) return null;

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 fade-in" onClick={onClose}>
      <div
        className="max-w-3xl w-full max-h-[90vh] overflow-y-auto no-scrollbar"
        style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">{TITLES[game]}</h2>
          <button onClick={onClose} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {game === 'snake' && <SnakeGame />}
          {game === 'trivia' && <TriviaGame />}
          {game === 'terminal' && <TerminalGame />}
        </div>
      </div>
    </div>
  );
}
