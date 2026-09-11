import { useEffect, useState } from 'react';
import { ArrowDown, Terminal, Github, Linkedin, Sparkles } from 'lucide-react';
import ParticleNetwork from './ParticleNetwork';

interface HeroProps {
  onAskAI: () => void;
}

export default function Hero({ onAskAI }: HeroProps) {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Lead Digital Infrastructure Architect';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated particle background */}
      <div className="absolute inset-0 z-0">
        <ParticleNetwork />
      </div>

      {/* Aurora glow blobs */}
      <div
        className="aurora-blob w-[500px] h-[500px] top-[10%] left-[5%]"
        style={{ background: 'var(--primary-color)' }}
      />
      <div
        className="aurora-blob w-[400px] h-[400px] bottom-[10%] right-[10%]"
        style={{ background: 'var(--primary-color)', animationDelay: '5s' }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[var(--bg-dark)]/50 via-transparent to-[var(--bg-dark)]" />
      <div className="absolute inset-0 z-10 subtle-grid" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        {/* Status badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card font-mono text-xs">
          <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--primary-color)' }}></span>
          <span style={{ color: 'var(--text-secondary)' }}>Available for collaboration</span>
        </div>

        {/* Name */}
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 leading-tight">
          <span className="block text-[var(--text-primary)]">Syeda Arooba</span>
          <span className="block accent-glow">Fatima</span>
        </h1>

        {/* Animated subtitle */}
        <div className="font-mono text-sm sm:text-base md:text-lg mb-3 min-h-[1.5em]" style={{ color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--primary-color)' }}>$</span> {typedText}
          <span className="type-cursor"></span>
        </div>

        <p className="font-body text-sm sm:text-base mb-10 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Co-Founder of <span style={{ color: 'var(--text-secondary)' }}>ARB TECH</span> — building AI-powered systems,
          security utilities, and real-time communication platforms.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={onAskAI} className="btn-primary flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Ask AROOBA AI
          </button>
          <a href="https://github.com/itsarooba5" target="_blank" rel="noopener noreferrer" className="btn-ghost flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/syeda-arooba-fatima" target="_blank" rel="noopener noreferrer" className="btn-ghost flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        </div>

        {/* Tech badges */}
        <div className="mt-14 flex flex-wrap justify-center gap-6 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 accent-text" />
            <span>AI Architecture</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 accent-text" />
            <span>Security Utilities</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 accent-text" />
            <span>Real-Time Systems</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-50 hover:opacity-100 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
}
