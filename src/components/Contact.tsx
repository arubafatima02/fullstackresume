import { useState } from 'react';
import { Mail, Github, Linkedin, Globe, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
    window.location.href = `mailto:syedaaroobafatima7@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const contactLinks = [
    { icon: Mail, label: 'Email', value: 'syedaaroobafatima7@gmail.com', href: 'mailto:syedaaroobafatima7@gmail.com' },
    { icon: Github, label: 'GitHub', value: 'github.com/itsarooba5', href: 'https://github.com/itsarooba5' },
    { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/syeda-arooba-fatima', href: 'https://www.linkedin.com/in/syeda-arooba-fatima' },
    { icon: Globe, label: 'Website', value: 'aroob.netlify.app', href: 'https://aroob.netlify.app' },
  ];

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="section-label mb-3">03 — Connect</div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)]">
          Get In <span className="accent-text">Touch</span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="elevated-card p-8">
          <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-6">Send a Message</h3>
          {sent && (
            <div className="mb-4 p-3 rounded-lg flex items-center gap-2 fade-in" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid var(--border-active)' }}>
              <CheckCircle className="w-5 h-5 accent-text" />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Opening your email client...</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="cyber-input w-full" placeholder="Your name" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="cyber-input w-full" placeholder="your@email.com" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>Message</label>
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="cyber-input w-full resize-none" placeholder="Your message..." />
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2 w-full justify-center">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {contactLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="elevated-card p-5 flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid var(--border-color)' }}>
                <item.icon className="w-5 h-5 accent-text" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                <div className="text-sm text-[var(--text-primary)] group-hover:accent-text transition-colors">{item.value}</div>
              </div>
            </a>
          ))}

          <div className="elevated-card p-5">
            <div className="font-mono text-xs uppercase tracking-wider mb-3 accent-text">// Quick Info</div>
            <div className="text-sm space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
              <div>Co-Founder @ ARB TECH</div>
              <div>Lead Digital Infrastructure Architect</div>
              <div>AI / Security / Real-Time Systems</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
