import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Loader2, LogOut, FolderGit2, Video, FileText, Settings, KeyRound } from 'lucide-react';
import { getSupabase } from '@/lib/config';
import { useAuth } from '@/context/AuthContext';
import type { Project } from '@/lib/types';

interface AdminPanelProps {
  onBack: () => void;
}

interface FormData {
  title: string;
  description: string;
  tech_stack: string;
  category: string;
  link: string;
  image_url: string;
}

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  tech_stack: '',
  category: 'project',
  link: '',
  image_url: '',
};

type AdminTab = 'content' | 'config';

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { adminLogout, user } = useAuth();
  const [tab, setTab] = useState<AdminTab>('content');
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Config state (admin-only)
  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [configSaved, setConfigSaved] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabase();
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Project) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      tech_stack: item.tech_stack.join(', '),
      category: item.category,
      link: item.link || '',
      image_url: item.image_url || '',
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      description: form.description,
      tech_stack: form.tech_stack.split(',').map((t) => t.trim()).filter(Boolean),
      category: form.category,
      link: form.link || null,
      image_url: form.image_url || null,
    };

    try {
      const supabase = getSupabase();
      if (editingId) {
        const { error: err } = await supabase.from('projects').update(payload).eq('id', editingId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('projects').insert(payload);
        if (err) throw err;
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry permanently?')) return;
    try {
      const supabase = getSupabase();
      const { error: err } = await supabase.from('projects').delete().eq('id', id);
      if (err) throw err;
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleLogout = () => {
    adminLogout();
    onBack();
  };

  const handleConfigSave = () => {
    try {
      localStorage.setItem('arb_supabase_url', supabaseUrl);
      localStorage.setItem('arb_supabase_key', supabaseKey);
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 2000);
    } catch {
      // ignore
    }
  };

  const categoryIcon = (cat: string) => {
    if (cat === 'video') return Video;
    if (cat === 'post') return FileText;
    return FolderGit2;
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Admin Panel</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Full CRUD access to ARB TECH content</p>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {user.email}
              </span>
            )}
            <button onClick={handleLogout} className="btn-ghost flex items-center gap-2 text-xs">
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--bg-panel)' }}>
          <button
            onClick={() => setTab('content')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={tab === 'content' ? { background: 'var(--bg-card)', color: 'var(--primary-color)' } : { color: 'var(--text-muted)' }}
          >
            <FolderGit2 className="w-4 h-4" />
            Content
          </button>
          <button
            onClick={() => setTab('config')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={tab === 'config' ? { background: 'var(--bg-card)', color: 'var(--primary-color)' } : { color: 'var(--text-muted)' }}
          >
            <KeyRound className="w-4 h-4" />
            API Config
          </button>
        </div>

        {error && (
          <div className="elevated-card p-4 mb-6">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Content tab */}
        {tab === 'content' && (
          <>
            <button onClick={handleAdd} className="btn-primary flex items-center gap-2 mb-6">
              <Plus className="w-4 h-4" />
              Add New Entry
            </button>

            {showForm && (
              <div className="elevated-card p-6 mb-6 fade-in" style={{ borderRadius: '12px' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
                    {editingId ? 'Edit Entry' : 'New Entry'}
                  </h3>
                  <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Title</label>
                      <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="cyber-input w-full" placeholder="Project title" />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="cyber-input w-full">
                        <option value="project">Project</option>
                        <option value="video">Video</option>
                        <option value="post">Post</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Description</label>
                    <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="cyber-input w-full resize-none" placeholder="Description" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Tech Stack (comma-separated)</label>
                      <input type="text" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} className="cyber-input w-full" placeholder="Python, JavaScript..." />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Link URL</label>
                      <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="cyber-input w-full" placeholder="https://..." />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Image URL (optional)</label>
                    <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="cyber-input w-full" placeholder="https://..." />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {editingId ? 'Update' : 'Create'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin accent-text" />
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const Icon = categoryIcon(item.category);
                  return (
                    <div key={item.id} className="elevated-card p-4 flex items-center gap-4" style={{ borderRadius: '10px' }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid var(--border-color)' }}>
                        <Icon className="w-4 h-4 accent-text" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">{item.title}</h4>
                          <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,170,0.06)', color: 'var(--primary-color)' }}>{item.category}</span>
                        </div>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => handleEdit(item)} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg transition-colors text-red-400/60 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No entries yet. Click "Add New Entry" to create one.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Config tab — admin only */}
        {tab === 'config' && (
          <div className="elevated-card p-8 space-y-6 fade-in" style={{ borderRadius: '12px' }}>
            <div>
              <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-1">API Configuration</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage backend connections. These settings are only visible to admins.</p>
            </div>

            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Supabase URL</label>
              <input type="text" value={supabaseUrl} onChange={(e) => setSupabaseUrl(e.target.value)} className="cyber-input w-full" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Supabase Anon Key</label>
              <input type="text" value={supabaseKey} onChange={(e) => setSupabaseKey(e.target.value)} className="cyber-input w-full" />
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 accent-text" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Backend Services</span>
              </div>
              <div className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                <div>Admin Auth: <span className="accent-text">Edge Function (secured)</span></div>
                <div>Groq AI: <span className="accent-text">Edge Function proxy (key hidden)</span></div>
                <div>Model: <span className="accent-text">openai/gpt-oss-120b</span></div>
              </div>
            </div>

            <button onClick={handleConfigSave} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              {configSaved ? 'Saved!' : 'Save Config'}
            </button>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Note: Supabase URL/Key changes require a page reload to take effect.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
