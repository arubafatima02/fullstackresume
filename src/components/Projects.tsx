import { useEffect, useState } from 'react';
import { ExternalLink, FolderGit2, Video, FileText, Loader2, Trash2 } from 'lucide-react';
import { getSupabase } from '@/lib/config';
import { useAuth } from '@/context/AuthContext';
import type { Project } from '@/lib/types';

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All', icon: FolderGit2 },
  { key: 'project', label: 'Projects', icon: FolderGit2 },
  { key: 'video', label: 'Videos', icon: Video },
  { key: 'post', label: 'Posts', icon: FileText },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase is not configured');
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry? This cannot be undone.')) return;
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase is not configured');
      const { error: err } = await supabase.from('projects').delete().eq('id', id);
      if (err) throw err;
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="section-label mb-3">02 — Work</div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)]">
          Featured <span className="accent-text">Projects</span>
        </h2>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              filter === cat.key
                ? 'btn-primary'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            style={filter === cat.key ? {} : { background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <cat.icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin accent-text" />
        </div>
      )}

      {error && !loading && (
        <div className="elevated-card p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={loadProjects} className="btn-ghost mt-4">Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className="elevated-card p-6 group flex flex-col slide-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,212,170,0.08)', color: 'var(--primary-color)' }}>
                  {project.category}
                </span>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {project.image_url && (
                <div className="mb-4 overflow-hidden rounded-lg">
                  <img src={project.image_url} alt={project.title} className="w-full h-36 object-cover" />
                </div>
              )}

              <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-2 group-hover:accent-text transition-colors">
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--text-muted)' }}>
                {project.description}
              </p>

              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs px-2 py-1 rounded"
                      style={{ background: 'var(--bg-panel)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {isAdmin && (
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-xs flex items-center gap-1.5 text-red-400/70 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete entry
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No entries found in this category.</p>
        </div>
      )}
    </section>
  );
}
