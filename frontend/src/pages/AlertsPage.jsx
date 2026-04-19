import React, { useEffect, useState } from 'react';
import { AlertTriangle, CloudRain, Info, Thermometer, Wind, Droplets, RefreshCw, MessageSquare } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

const SEVERITY_STYLE = {
  High:   { bg: 'rgba(239,68,68,0.1)',   border: 'var(--danger)',   icon: <AlertTriangle size={20} color="#ef4444" /> },
  Medium: { bg: 'rgba(245,158,11,0.1)',  border: '#f59e0b',         icon: <CloudRain size={20} color="#f59e0b" /> },
  Normal: { bg: 'rgba(255,255,255,0.05)', border: 'var(--primary)', icon: <Info size={20} color="var(--primary)" /> },
  Low:    { bg: 'rgba(255,255,255,0.05)', border: 'var(--primary)', icon: <Info size={20} color="var(--primary)" /> },
};

export default function AlertsPage() {
  const { t } = useLang();
  const [alerts, setAlerts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneMsg, setPhoneMsg] = useState('');
  const [cityInput, setCityInput] = useState('Pune');

  const fetchAlerts = () => {
    fetch('http://localhost:8000/alerts')
      .then(res => res.json())
      .then(data => { setAlerts(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const fetchWeather = (loc) => {
    if (!loc || !loc.trim()) return;
    setWeatherLoading(true);
    fetch(`http://localhost:8000/weather?location=${encodeURIComponent(loc.trim())}`)
      .then(res => res.json())
      .then(data => { setWeather({ ...data, location: loc.trim() }); setWeatherLoading(false); })
      .catch(() => setWeatherLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
    fetchWeather('Pune');
  }, []);

  const handleRegisterPhone = async () => {
    if (!phone) return;
    try {
      const res = await fetch(`http://localhost:8000/register-phone?phone=${encodeURIComponent(phone)}`, { method: 'POST' });
      const data = await res.json();
      setPhoneMsg(data.message);
    } catch {
      setPhoneMsg('Failed to register. Ensure backend is running.');
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '100px auto' }} />;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>

      {/* Live Weather Card */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CloudRain size={24} color="var(--secondary)" /> {t('liveWeather')}
          </h2>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <input
              placeholder="Enter city..."
              value={cityInput}
              onChange={e => setCityInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchWeather(cityInput)}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 12px', color: '#fff', fontSize: '0.9rem', minWidth: '160px' }}
              list="mh-cities"
              placeholder={t('enterCity')}
            />
            <datalist id="mh-cities">
              {['Pune','Nashik','Nagpur','Ratnagiri','Kolhapur','Satara','Solapur','Ahmednagar','Jalgaon','Amravati','Latur','Nanded','Beed','Palghar','Mumbai','Sindhudurg','Sangli','Wardha','Yavatmal','Akola','Dhule'].map(c => <option key={c} value={c} />)}
            </datalist>
            <button onClick={() => fetchWeather(cityInput)} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              {t('searchCity')}
            </button>
            <button onClick={() => fetchWeather(cityInput)} className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '0.85rem' }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {weatherLoading ? (
          <div className="spinner" style={{ margin: '20px auto' }} />
        ) : weather ? (
          <div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              📍 {weather.location} &nbsp;·&nbsp; {weather.condition}
              {weather.is_severe && (
                <span style={{ marginLeft: '10px', background: 'rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '12px', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 700 }}>
                  ⚠️ {weather.severity} Alert
                </span>
              )}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <WeatherStat icon={<Thermometer size={20} color="#ef4444" />} label={t('temperature')} value={`${weather.temperature}°C`} />
              <WeatherStat icon={<CloudRain size={20} color="#6366f1" />} label={t('rainfall')} value={`${weather.rainfall}mm/hr`} />
              <WeatherStat icon={<Droplets size={20} color="#06b6d4" />} label={t('humidity')} value={`${weather.humidity}%`} />
              <WeatherStat icon={<Wind size={20} color="#10b981" />} label={t('windSpeed')} value={`${weather.wind_speed}km/h`} />
            </div>
            {weather.is_severe && weather.anomaly !== 'None' && (
              <div style={{ marginTop: '1rem', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.88rem' }}>
                ⚠️ {weather.anomaly} — SMS alert will be sent to registered numbers.
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Enter a city above to check weather.</p>
        )}
      </div>

      {/* SMS Registration */}
      <div className="glass-panel" style={{ marginBottom: '2rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
          <MessageSquare size={18} color="#6366f1" /> {t('smsTitle')}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
          {t('smsDesc')}
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <input
            type="tel"
            placeholder={t('phonePlaceholder')}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px 14px', color: '#fff', fontSize: '0.9rem' }}
          />
          <button onClick={handleRegisterPhone} className="btn btn-primary" style={{ padding: '8px 20px' }}>
            {t('btnRegister')}
          </button>
        </div>
        {phoneMsg && <p style={{ marginTop: '0.6rem', color: '#10b981', fontSize: '0.85rem' }}>✅ {phoneMsg}</p>}
        <p style={{ marginTop: '0.8rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          {t('smsNote')}
        </p>
      </div>

      {/* Alerts List */}
      <div className="glass-panel">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <AlertTriangle size={22} color="var(--warning)" /> {t('alertsTitle')}
        </h2>

        {alerts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>{t('noAlerts')}</p>
        ) : (
          alerts.map((a, idx) => {
            const style = SEVERITY_STYLE[a.severity] || SEVERITY_STYLE.Normal;
            return (
              <div key={idx} style={{
                padding: '1.2rem',
                background: style.bg,
                borderLeft: `4px solid ${style.border}`,
                borderRadius: '0 8px 8px 0',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}>
                {style.icon}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0 }}>{a.alert_type} Alert</h4>
                    <span style={{
                      background: a.severity === 'High' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                      color: a.severity === 'High' ? '#ef4444' : '#f59e0b',
                      borderRadius: '12px', padding: '1px 8px', fontSize: '0.72rem', fontWeight: 700
                    }}>{a.severity}</span>
                  </div>
                  <p style={{ color: 'var(--text-main)', margin: '0 0 4px' }}>{a.message}</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(a.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function WeatherStat({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 16px', minWidth: '130px' }}>
      {icon}
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  );
}
