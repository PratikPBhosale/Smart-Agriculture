import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader, Minimize2 } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

const SUGGESTED_QUESTIONS = [
  "Which crop is best for black soil in Nashik?",
  "How to treat tomato late blight?",
  "Best fertilizer for sugarcane in Kolhapur?",
  "When to irrigate wheat crop?",
  "How to identify Alphonso mango disease?",
];

export default function ChatBot() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🌾 Namaste! I am KrishiBot, your AI Farming Assistant.\n\nI can help you with crop selection, disease treatment, fertilizers, irrigation, and Maharashtra-specific farming advice.\n\nAsk me anything!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Get context from localStorage
  const getContext = () => {
    try {
      const inputId = localStorage.getItem('inputId');
      return inputId ? { inputId } : null;
    } catch { return null; }
  };

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setInput('');
    const userMsg = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: newMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          context: getContext()
        })
      });
      const data = await res.json();
      const botMsg = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, botMsg]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Connection error. Please ensure the backend is running.'
      }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setOpen(o => !o); setMinimized(false); }}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '58px', height: '58px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: 'none', cursor: 'pointer', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(16,185,129,0.5)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Chat with KrishiBot"
      >
        {open ? <X size={24} color="#fff" /> : <MessageCircle size={24} color="#fff" />}
        {!open && unread > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#ef4444', color: '#fff', borderRadius: '50%',
            width: '20px', height: '20px', fontSize: '0.7rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700
          }}>{unread}</span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '96px', right: '24px',
          width: '380px',
          height: minimized ? '56px' : '520px',
          background: 'rgba(11,15,25,0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '20px',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          zIndex: 999,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))',
            borderBottom: minimized ? 'none' : '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t('chatTitle')}</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  {t('chatSubtitle')}
                </div>
              </div>
            </div>
            <button
              onClick={() => setMinimized(m => !m)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
            >
              <Minimize2 size={16} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '12px 14px',
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end', gap: '8px',
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {msg.role === 'user'
                        ? <User size={14} color="#fff" />
                        : <Bot size={14} color="#fff" />}
                    </div>
                    {/* Bubble */}
                    <div style={{
                      maxWidth: '78%',
                      padding: '10px 13px',
                      borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : 'rgba(255,255,255,0.07)',
                      border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      fontSize: '0.85rem',
                      lineHeight: '1.5',
                      color: '#f8fafc',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Bot size={14} color="#fff" />
                    </div>
                    <div style={{
                      padding: '10px 14px', borderRadius: '4px 16px 16px 16px',
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', gap: '4px', alignItems: 'center',
                    }}>
                      {[0,1,2].map(i => (
                        <span key={i} style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: '#10b981',
                          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggested questions (only when 1 message) */}
              {messages.length === 1 && (
                <div style={{ padding: '0 14px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button key={i} onClick={() => sendMessage(q)} style={{
                      background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.25)',
                      color: '#10b981', borderRadius: '12px',
                      padding: '4px 10px', fontSize: '0.75rem',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{
                padding: '10px 12px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', gap: '8px', alignItems: 'flex-end',
                flexShrink: 0,
              }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('chatPlaceholder')}
                  rows={1}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px', padding: '9px 12px',
                    color: '#f8fafc', fontSize: '0.85rem',
                    fontFamily: 'inherit', resize: 'none',
                    outline: 'none', lineHeight: '1.4',
                    maxHeight: '80px', overflowY: 'auto',
                  }}
                  onFocus={e => e.target.style.borderColor = '#10b981'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: input.trim() && !loading
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'rgba(255,255,255,0.08)',
                    border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.2s',
                  }}
                >
                  {loading
                    ? <Loader size={16} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
                    : <Send size={16} color={input.trim() ? '#fff' : '#94a3b8'} />}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
