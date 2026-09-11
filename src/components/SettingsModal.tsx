import { useState } from 'react';
import { X, Palette, Gamepad2, RotateCcw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { resolveColor, PRESET_COLORS } from '@/lib/colors';
import type { GameType } from '@/lib/types';

interface SettingsModalProps {
  onClose: () => void;
  onLaunchGame: (game: GameType) => void;
}

type Tab = 'theme' | 'games';

export default function SettingsModal({ onClose, onLaunchGame }: SettingsModalProps) {
  const { themeColor, setThemeColor } = useTheme();
  const [tab, setTab] = useState<Tab>('theme');
  const [colorInput, setColorInput] = useState(themeColor);
  const [colorError, setColorError] = useState<string | null>(null);

  const handleColorChange = (value: string) => {
    setColorInput(value);
    const resolved = resolveColor(value);
    if (resolved) {
      setThemeColor(resolved);
      setColorError(null);
    } else {
      setColorError('Invalid color. Try: red, blue, #ff4757, cyan...');
    }
  };

  const handlePreset = (color: string) => {
    setColorInput(color);
    setThemeColor(color);
    setColorError(null);
  };

  const handleReset = () => {
    setThemeColor('#00d4aa');
    setColorInput('#00d4aa');
    setColorError(null);
  };

  const games = [
    { type: 'snake' as GameType, title: 'Cyber Snake', desc: 'Classic snake with a modern twist', icon: 'fa-solid fa-gamepad' },
    { type: 'trivia' as GameType, title: 'Tech Trivia', desc: 'Test your AI & tech knowledge', icon: 'fa-solid fa-brain' },
    { type: 'terminal' as GameType, title: 'Code Breaker', desc: 'Crack the secret access code', icon: 'fa-solid fa-terminal' },
  ];

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 fade-in" onClick={onClose}>
      <div
        className="elevated-card max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar"
        style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">Settings</h2>
          <button onClick={onClose} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--border-color)' }}>
          {[
            { key: 'theme' as Tab, label: 'Theme', icon: Palette },
            { key: 'games' as Tab, label: 'Games', icon: Gamepad2 },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${
                tab === t.key
                  ? 'border-b-2'
                  : ''
              }`}
              style={tab === t.key
                ? { color: 'var(--primary-color)', borderBottomColor: 'var(--primary-color)' }
                : { color: 'var(--text-muted)' }
              }
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === 'theme' && (
            <div className="space-y-6 fade-in">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider block mb-3" style={{ color: 'var(--text-muted)' }}>
                  Custom Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="Type: red, blue, #ff4757, cyan..."
                    className="cyber-input flex-1 min-w-[200px]"
                  />
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="cyber-input cursor-pointer w-16 h-10 p-1"
                  />
                </div>
                {colorError && <p className="text-xs text-red-400 mt-2">{colorError}</p>}
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  Current: <span className="accent-text font-mono">{themeColor}</span>
                </p>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wider block mb-3" style={{ color: 'var(--text-muted)' }}>
                  Presets
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {PRESET_COLORS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handlePreset(preset.value)}
                      className="group flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-all"
                      style={{
                        border: `1px solid ${themeColor === preset.value ? preset.value : 'var(--border-color)'}`,
                        background: themeColor === preset.value ? `${preset.value}10` : 'transparent',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full transition-transform group-hover:scale-110"
                        style={{ background: preset.value, boxShadow: `0 0 8px ${preset.value}40` }}
                      />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleReset} className="btn-ghost flex items-center gap-2 text-sm">
                <RotateCcw className="w-4 h-4" />
                Reset to Default
              </button>
            </div>
          )}

          {tab === 'games' && (
            <div className="space-y-3 fade-in">
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Select a game to play</p>
              {games.map((game) => (
                <button
                  key={game.type}
                  onClick={() => onLaunchGame(game.type)}
                  className="elevated-card p-4 w-full flex items-center gap-4 text-left group"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid var(--border-color)' }}>
                    <i className={game.icon} style={{ color: 'var(--primary-color)' }}></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-sm text-[var(--text-primary)] group-hover:accent-text transition-colors">{game.title}</h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{game.desc}</p>
                  </div>
                  <span className="text-xs font-medium accent-text">Play →</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
