import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

// Common type if lib/theme is not present, otherwise keep original
type Theme = 'dark' | 'light';

interface AudioPlayerProps {
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  theme?: Theme;
}

// Direct external CDN audio URL
const AUDIO_URL = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3";

export default function AudioPlayer({ theme = 'dark' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isDark = theme === 'dark';

  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = false;
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.log("Autoplay waiting for user click:", err);
        setIsPlaying(false);
      });
  };

  useEffect(() => {
    playAudio();

    const handleUserInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        playAudio();
      }
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  const handleToggle = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playAudio();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 group">
      <audio ref={audioRef} src={AUDIO_URL} loop preload="auto" />

      <div 
        onClick={handleToggle}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md border shadow-xl transition-all cursor-pointer hover:scale-105 ${
          isDark ? 'bg-emerald-950/90 border-emerald-500/20 shadow-emerald-500/10 hover:border-emerald-500/40'
                 : 'bg-white/95 border-emerald-500/20 shadow-emerald-500/10 hover:border-emerald-500/40'
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 flex items-center justify-center hover:scale-110 transition-transform shrink-0 shadow-md"
          aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-700" />}
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <Music className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="hidden sm:block min-w-0">
            <p className={`text-xs font-medium truncate max-w-[140px] ${isDark ? 'text-emerald-100' : 'text-slate-800'}`}>
              Background Track
            </p>
          </div>

          {/* Equalizer animation with Green Theme */}
          <div className="flex items-end gap-0.5 h-6 w-10">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all ${
                  isPlaying
                    ? 'bg-gradient-to-t from-emerald-400 to-teal-300 eq-bar'
                    : isDark ? 'bg-emerald-800/50' : 'bg-slate-300'
                }`}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  height: isPlaying ? undefined : '30%'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
