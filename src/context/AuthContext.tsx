import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabase, getEdgeFunctionUrl } from '@/lib/config';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  adminLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ADMIN_KEY = 'arb_tech_admin';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
    });

    try {
      const admin = sessionStorage.getItem(ADMIN_KEY);
      if (admin === 'true') setIsAdmin(true);
    } catch {
      // ignore
    }

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const supabase = getSupabase();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  const adminLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
    setAdminLoading(true);
    try {
      const response = await fetch(getEdgeFunctionUrl('admin-auth'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      if (data.success) {
        setIsAdmin(true);
        try {
          sessionStorage.setItem(ADMIN_KEY, 'true');
        } catch {
          // ignore
        }
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setAdminLoading(false);
    }
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(ADMIN_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, loading, adminLoading, signInWithGoogle, signOut, adminLogin, adminLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
