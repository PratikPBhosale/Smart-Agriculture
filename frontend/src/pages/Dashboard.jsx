import React, { useEffect, useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, AlertTriangle, Leaf, Clock, CheckCircle2 } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

const PRIORITY_STYLE_BASE = {
  high:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  low:    { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
};

const PHASE_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'
];

function PriorityBadge({ priority }) {
  const { t } = useLang();
  const s = PRIORITY_STYLE_BASE[priority?.toLowerCase()] || PRIORITY_STYLE_BASE.medium;
  const label = t(priority?.toLowerCase() || 'medium');
  return (
    <span style={{
      background: s.bg, color: s.color,
      border: `1px solid ${s.color}40`,
      borderRadius: '20px', padding: '2px 10px',
      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em'
    }}>
      {label}
    </span>
  );
}

function DayCard({ dayData }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const p = PRIORITY_STYLE_BASE[dayData.priority?.toLowerCase()] || PRIORITY_STYLE_BASE.medium;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid rgba(255,255,255,0.08)`,
      borderLeft: `3px solid ${p.color}`,
      borderRadius: '10px',
      marginBottom: '10px',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Header row */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Day circle */}
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: p.bg, border: `2px solid ${p.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: p.color }}>
              D{dayData.day}
            </span>
          </div>
          {/* First task preview */}
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>
              {dayData.tasks[0]}
            </span>
            {dayData.tasks.length > 1 && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '6px' }}>
                +{dayData.tasks.length - 1} {t('more')}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <PriorityBadge priority={dayData.priority} />
          {open ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </div>
      </div>

      {/* Expanded content */}
      {open && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ paddingTop: '12px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {t('tasksFor')} {dayData.day}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {dayData.tasks.map((task, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                  padding: '6px 0', borderBottom: i < dayData.tasks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                }}>
                  <CheckCircle2 size={15} color={p.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem' }}>{task}</span>
                </li>
              ))}
            </ul>
            {dayData.notes && (
              <div style={{
                marginTop: '10px', padding: '8px 12px',
                background: 'rgba(255,255,255,0.04)', borderRadius: '8px',
                display: 'flex', gap: '8px', alignItems: 'flex-start'
              }}>
                <AlertTriangle size={14} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: '#f59e0b' }}>{dayData.notes}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseSection({ phase, phaseData, colorIdx }) {
  const [collapsed, setCollapsed] = useState(false);
  const color = PHASE_COLORS[colorIdx % PHASE_COLORS.length];
  const days = phaseData.days || [];

  return (
    <div style={{
      marginBottom: '2rem',
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid rgba(255,255,255,0.07)`,
      borderRadius: '14px',
      overflow: 'hidden',
    }}>
      {/* Phase header */}
      <div
        onClick={() => setCollapsed(c => !c)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', cursor: 'pointer',
          background: `linear-gradient(90deg, ${color}18, transparent)`,
          borderBottom: collapsed ? 'none' : `1px solid rgba(255,255,255,0.07)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: color, boxShadow: `0 0 8px ${color}`
          }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color }}>{phase}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {phaseData.week_range} &nbsp;·&nbsp; {days.length} activity days
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: `${color}20`, color, border: `1px solid ${color}40`,
            borderRadius: '20px', padding: '3px 12px', fontSize: '0.78rem', fontWeight: 700
          }}>
            Day {days[0]?.day} – Day {days[days.length - 1]?.day}
          </span>
          {collapsed
            ? <ChevronDown size={18} color="var(--text-muted)" />
            : <ChevronUp size={18} color="var(--text-muted)" />}
        </div>
      </div>

      {/* Days list */}
      {!collapsed && (
        <div style={{ padding: '16px 20px' }}>
          {days.map((dayData, i) => (
            <DayCard key={i} dayData={dayData} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { t } = useLang();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try localStorage first (freshly generated plan)
    const stored = localStorage.getItem('farmingPlan');
    if (stored) {
      try {
        setPlan(JSON.parse(stored));
        setLoading(false);
        return;
      } catch (_) {}
    }
    // Fallback: fetch tasks from DB and show basic view
    fetch('http://localhost:8000/tasks')
      .then(res => res.json())
      .then(tasks => {
        if (tasks.length > 0) {
          // Reconstruct a minimal plan from DB tasks
          const phaseMap = {};
          tasks.forEach(t => {
            if (!phaseMap[t.phase]) phaseMap[t.phase] = { phase: t.phase, week_range: '', days: [] };
            phaseMap[t.phase].days.push({
              day: t.day_offset,
              tasks: t.task_name.split(' | '),
              notes: '',
              priority: t.priority
            });
          });
          setPlan({ crop: 'Your Crop', total_days: null, phases: Object.values(phaseMap), alerts: [] });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" style={{ margin: '100px auto' }} />;

  if (!plan || !plan.phases || plan.phases.length === 0) {
    return (
      <div className="grid">
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
          <Calendar size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h2>{t('noPlan')}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{t('noPlanDesc')}</p>
        </div>
      </div>
    );
  }

  const totalTasks = plan.phases.reduce((sum, p) => sum + (p.days?.length || 0), 0);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>

      {/* Header card */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Leaf size={26} color="#fff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{plan.crop} {t('farmingPlan')}</h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {t('dayByDay')}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {plan.total_days && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>{plan.total_days}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('totalDays')}</div>
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)' }}>{plan.phases.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('phases')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>{totalTasks}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('activityDays')}</div>
            </div>
          </div>
        </div>

        {/* Progress bar across phases */}
        {plan.total_days && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', height: '8px', borderRadius: '999px', overflow: 'hidden', gap: '2px' }}>
              {plan.phases.map((ph, i) => {
                const days = ph.days || [];
                const span = days.length > 0
                  ? (days[days.length - 1].day - days[0].day + 1)
                  : 1;
                const pct = (span / plan.total_days) * 100;
                return (
                  <div key={i} style={{
                    flex: `0 0 ${pct}%`,
                    background: PHASE_COLORS[i % PHASE_COLORS.length],
                    borderRadius: '999px',
                    minWidth: '4px'
                  }} title={ph.phase} />
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '8px', flexWrap: 'wrap' }}>
              {plan.phases.map((ph, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PHASE_COLORS[i % PHASE_COLORS.length], display: 'inline-block' }} />
                  {ph.phase}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alerts */}
      {plan.alerts && plan.alerts.length > 0 && (
        <div className="glass-panel" style={{ marginBottom: '2rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <span style={{ fontWeight: 700, color: '#f59e0b' }}>{t('importantAlerts')}</span>
          </div>
          {plan.alerts.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', padding: '6px 0', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ color: '#f59e0b', flexShrink: 0 }}>•</span>
              <span style={{ fontSize: '0.88rem' }}>{a}</span>
            </div>
          ))}
        </div>
      )}

      {/* Phase sections */}
      {plan.phases.map((phaseData, i) => (
        <PhaseSection
          key={i}
          phase={phaseData.phase}
          phaseData={phaseData}
          colorIdx={i}
        />
      ))}

    </div>
  );
}
