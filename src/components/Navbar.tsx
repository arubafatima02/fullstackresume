import { useState, useEffect } from 'react';
import { Settings, Terminal, Menu, X, Shield } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import type { Page } from '@/lib/types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { setSettingsOpen } = useTheme();
  const { isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLink = (label: string, page: Page) => (
    <button
      onClick={() => { onNavigate(page); setMobileOpen(false); }}
      className={`text-sm font-medium tracking-wide transition-all duration-300 px-3 py-1.5 rounded-md ${
        currentPage === page
          ? 'text-[var(--primary-color)] bg-[rgba(0,212,170,0.05)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${
        scrolled ? 'bg-[var(--bg-dark)]/90 backdrop-blur-xl border-b' : 'bg-transparent'
      }`}
      style={scrolled ? { borderBottomColor: 'var(--border-color)' } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0, 212, 170, 0.1)', border: '1px solid var(--border-active)' }}>
              <Terminal className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
            </div>
            <span className="font-display font-bold text-base text-[var(--text-primary)]">
              ARB<span style={{ color: 'var(--primary-color)' }}>_</span>TECH
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLink('Home', 'home')}
            {navLink('Ask AROOBA AI', 'ask-ai')}
            {navLink('Admin', 'admin')}
            <button
              onClick={() => setSettingsOpen(true)}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 px-3 py-1.5 rounded-md flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Admin badge */}
          {isAdmin && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid var(--border-active)' }}>
              <Shield className="w-3 h-3" style={{ color: 'var(--primary-color)' }} />
              <span className="font-mono text-xs" style={{ color: 'var(--primary-color)' }}>ADMIN</span>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--bg-dark)]/95 backdrop-blur-xl border-b fade-in" style={{ borderBottomColor: 'var(--border-color)' }}>
          <div className="px-4 py-4 flex flex-col gap-2">
            {navLink('Home', 'home')}
            {navLink('Ask AROOBA AI', 'ask-ai')}
            {navLink('Admin', 'admin')}
            <button
              onClick={() => { setSettingsOpen(true); setMobileOpen(false); }}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-2 py-1.5 px-3 rounded-md"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
