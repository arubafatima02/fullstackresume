import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Terminal, ArrowLeft, AlertCircle } from 'lucide-react';
import { getEdgeFunctionUrl } from '@/lib/config';
import type { ChatMessage } from '@/lib/types';

interface AskAroobaAIProps {
  onBack: () => void;
}

export default function AskAroobaAI({ onBack }: AskAroobaAIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'AROOBA AI is online. I represent ARB TECH and Co-Founder Syeda Arooba Fatima. Ask me about AIOS, ARB Sender, Chatme, or our mission.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getEdgeFunctionUrl('groq-chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiContent = data.content;
      if (!aiContent) {
        throw new Error('No response from AI');
      }

      setMessages([...newMessages, { role: 'assistant', content: aiContent }]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to connect to AI';
      setError(errMsg);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Connection to AROOBA AI failed. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Header */}
      <div className="border-b px-4 sm:px-6 lg:px-8 py-4" style={{ borderColor: 'var(--border-color)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid var(--border-active)' }}>
              <Terminal className="w-5 h-5 accent-text" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-[var(--text-primary)]">AROOBA AI</h1>
              <div className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--primary-color)' }}></span>
                Online — gpt-oss-120b
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 text-sm leading-relaxed ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                {msg.role === 'assistant' && (
                  <div className="text-xs font-medium uppercase mb-1.5 accent-text">AROOBA AI</div>
                )}
                <p className="text-[var(--text-primary)] whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="chat-bubble-ai p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin accent-text" />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Processing...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="elevated-card p-3 flex items-center gap-2 max-w-md" style={{ borderRadius: '8px' }}>
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400">{error}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t px-4 sm:px-6 lg:px-8 py-4" style={{ borderColor: 'var(--border-color)' }}>
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Ask about AIOS, ARB Sender, Chatme..."
            className="cyber-input flex-1"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
        <p className="text-xs mt-2 text-center max-w-4xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          AROOBA AI represents ARB TECH. Visit aroob.netlify.app for more.
        </p>
      </div>
    </div>
  );
}
