import { useState } from 'react';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminLoginProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AdminLogin({ onBack, onSuccess }: AdminLoginProps) {
  const { adminLogin, adminLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = await adminLogin(email, password);
    if (success) {
      onSuccess();
    } else {
      setError('Access denied. Invalid admin credentials.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 subtle-grid">
      <div className="elevated-card max-w-md w-full p-8 fade-in" style={{ borderRadius: '16px' }}>
        <button onClick={onBack} className="text-sm flex items-center gap-2 mb-6 transition-colors" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid var(--border-active)' }}>
            <Shield className="w-8 h-8 accent-text" />
          </div>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Admin Access</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Restricted area — authorized personnel only</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg flex items-center gap-2" style={{ background: 'rgba(255,0,0,0.05)', border: '1px solid rgba(255,0,0,0.2)' }}>
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cyber-input w-full pl-10"
                placeholder="admin@email.com"
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cyber-input w-full pl-10"
                placeholder="Enter password..."
              />
            </div>
          </div>
          <button type="submit" disabled={adminLoading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {adminLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
