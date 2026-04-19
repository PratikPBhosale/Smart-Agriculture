import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Leaf, Sprout, LayoutDashboard, Bell, Microscope } from 'lucide-react';
import InputPage from './pages/InputPage';
import RecommendationPage from './pages/RecommendationPage';
import Dashboard from './pages/Dashboard';
import AlertsPage from './pages/AlertsPage';
import DiseaseDetection from './pages/DiseaseDetection';
import ChatBot from './components/ChatBot';
import { useLang } from './i18n/LanguageContext';
import { LANGUAGES } from './i18n/translations';
import './index.css';

function Navbar() {
  const { t, lang, changeLang } = useLang();

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand">
        <Leaf size={28} color="var(--primary)" />
        {t('appName')}
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Sprout size={18} style={{marginRight: '6px', verticalAlign: 'middle'}}/> {t('navInput')}
        </NavLink>
        <NavLink to="/recommendation" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} style={{marginRight: '6px', verticalAlign: 'middle'}}/> {t('navPlan')}
        </NavLink>
        <NavLink to="/disease" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Microscope size={18} style={{marginRight: '6px', verticalAlign: 'middle'}}/> {t('navDisease')}
        </NavLink>
        <NavLink to="/alerts" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Bell size={18} style={{marginRight: '6px', verticalAlign: 'middle'}}/> {t('navAlerts')}
        </NavLink>

        {/* Language Switcher */}
        <div style={{ display: 'flex', gap: '4px', marginLeft: '8px', alignItems: 'center' }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              title={l.label}
              style={{
                background: lang === l.code
                  ? 'rgba(16,185,129,0.2)'
                  : 'rgba(255,255,255,0.05)',
                border: lang === l.code
                  ? '1px solid rgba(16,185,129,0.5)'
                  : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '4px 10px',
                cursor: 'pointer',
                color: lang === l.code ? '#10b981' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: lang === l.code ? 700 : 400,
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container page-transition">
        <Routes>
          <Route path="/" element={<InputPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
      </main>
      <ChatBot />
    </Router>
  );
}

export default App;
