export default function Footer() {
  const links = [
    { icon: 'fa-brands fa-github', url: 'https://github.com/itsarooba5', label: 'GitHub' },
    { icon: 'fa-brands fa-linkedin', url: 'https://www.linkedin.com/in/syeda-arooba-fatima', label: 'LinkedIn' },
    { icon: 'fa-solid fa-envelope', url: 'mailto:syedaaroobafatima7@gmail.com', label: 'Email' },
    { icon: 'fa-solid fa-globe', url: 'https://aroob.netlify.app', label: 'Website' },
  ];

  return (
    <footer className="relative border-t mt-20" style={{ borderColor: 'var(--border-color)' }}>
      <div className="subtle-grid absolute inset-0 opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="font-display font-bold text-lg text-[var(--text-primary)] mb-1">
              ARB<span style={{ color: 'var(--primary-color)' }}>_</span>TECH
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Syeda Arooba Fatima — Co-Founder
            </div>
            <div className="text-xs mt-2 max-w-xs" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
              Architecting the future, one line at a time.
            </div>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={link.label}
                className="w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <i className={link.icon + ' text-base'}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-2" style={{ borderColor: 'var(--border-color)' }}>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} ARB TECH. All rights reserved.
          </div>
          <div className="text-xs flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--primary-color)' }}></span>
            System Status: Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
