import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SettingsModal from '@/components/SettingsModal';
import GameModal from '@/components/GameModal';
import AskAroobaAI from '@/components/AskAroobaAI';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';
import type { Page, GameType } from '@/lib/types';

function AppContent() {
  const { settingsOpen, setSettingsOpen } = useTheme();
  const { isAdmin } = useAuth();
  const [page, setPage] = useState<Page>('home');
  const [game, setGame] = useState<GameType>(null);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleNavigate = (newPage: Page) => {
    setPage(newPage);
  };

  const handleLaunchGame = (g: GameType) => {
    setGame(g);
    setSettingsOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)]">
      <Navbar currentPage={page} onNavigate={handleNavigate} />

      {page === 'home' && (
        <main>
          <Hero onAskAI={() => handleNavigate('ask-ai')} />
          <About />
          <Projects />
          <Contact />
        </main>
      )}

      {page === 'ask-ai' && <AskAroobaAI onBack={() => handleNavigate('home')} />}

      {page === 'admin' && (
        <>
          {!isAdmin ? (
            <AdminLogin onBack={() => handleNavigate('home')} onSuccess={() => {}} />
          ) : (
            <AdminPanel onBack={() => handleNavigate('home')} />
          )}
        </>
      )}

      <Footer />

      {/* Modals */}
      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} onLaunchGame={handleLaunchGame} />
      )}

      {game && <GameModal game={game} onClose={() => setGame(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
