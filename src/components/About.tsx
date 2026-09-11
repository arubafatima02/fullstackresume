import { Cpu, Shield, Zap, Code, ArrowUpRight } from 'lucide-react';

export default function About() {
  const skills = [
    { name: 'AI Architecture', level: 95 },
    { name: 'Python / ML', level: 90 },
    { name: 'JavaScript / Node.js', level: 92 },
    { name: 'Security & API Integration', level: 88 },
    { name: 'UI/UX Design', level: 85 },
    { name: 'Cloud Infrastructure', level: 87 },
  ];

  const features = [
    { icon: Cpu, title: 'AI-First Architecture', desc: 'Building intelligent systems with Gemma 4 and next-gen AI workflows.' },
    { icon: Shield, title: 'Security Focused', desc: 'Every project engineered with security-first principles and encrypted data flows.' },
    { icon: Zap, title: 'Real-Time Systems', desc: 'WebSocket-powered real-time communication and seamless user experiences.' },
    { icon: Code, title: 'Clean Engineering', desc: 'Production-grade codebases with scalable, maintainable architecture.' },
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-16">
        <div className="section-label mb-3">01 — Profile</div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)]">
          About <span className="accent-text">Me</span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Bio — wider */}
        <div className="lg:col-span-3 elevated-card p-8 slide-up">
          <div className="space-y-5 text-[var(--text-secondary)] leading-relaxed text-[0.95rem]">
            <p className="text-lg text-[var(--text-primary)] font-medium">
              I build the infrastructure that powers intelligent systems.
            </p>
            <p>
              I'm <span className="accent-text">Syeda Arooba Fatima</span>, Co-Founder of{' '}
              <span className="accent-text">ARB TECH</span> and Lead Digital Infrastructure Architect.
              My work spans AI operating systems, security-focused messaging utilities, and real-time
              communication platforms.
            </p>
            <p>
              From the <span className="text-[var(--text-primary)]">Sovereign AIOS Architecture</span> built
              on Gemma 4, to secure API integrations in ARB Sender, and the glassmorphism Chatme Portal —
              every project is engineered to be architecturally elegant, not just functional.
            </p>
            <p>
              Currently leading ARB TECH's mission to deliver cutting-edge digital infrastructure
              with an AI-first approach.
            </p>
            <a
              href="https://aroob.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium accent-text hover:gap-2.5 transition-all"
            >
              Visit aroob.netlify.app
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Skills — narrower */}
        <div className="lg:col-span-2 elevated-card p-8 slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
            // Skill Matrix
          </h3>
          <div className="space-y-5">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[var(--text-secondary)] font-medium">{skill.name}</span>
                  <span className="accent-text font-mono">{skill.level}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-panel)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%`, background: 'var(--primary-color)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
        {features.map((feat, i) => (
          <div
            key={feat.title}
            className="elevated-card p-6 slide-up"
            style={{ animationDelay: `${0.15 + i * 0.08}s` }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(0,212,170,0.08)' }}>
              <feat.icon className="w-5 h-5 accent-text" />
            </div>
            <h4 className="font-display font-semibold text-base text-[var(--text-primary)] mb-2">{feat.title}</h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
