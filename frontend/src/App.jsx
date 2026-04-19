import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Leaf, Sprout, LayoutDashboard, Bell, Microscope } from 'lucide-react';
import InputPage from './pages/InputPage';
import RecommendationPage from './pages/RecommendationPage';
import Dashboard from './pages/Dashboard';
import AlertsPage from './pages/AlertsPage';
import DiseaseDetection from './pages/DiseaseDetection';
import './index.css';

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand">
        <Leaf size={28} color="var(--primary)" />
        AI Farming Assistant
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Sprout size={18} style={{marginRight: '6px', verticalAlign: 'middle'}}/> Input
        </NavLink>
        <NavLink to="/recommendation" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} style={{marginRight: '6px', verticalAlign: 'middle'}}/> Plan
        </NavLink>
        <NavLink to="/disease" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Microscope size={18} style={{marginRight: '6px', verticalAlign: 'middle'}}/> Disease Detect
        </NavLink>
        <NavLink to="/alerts" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Bell size={18} style={{marginRight: '6px', verticalAlign: 'middle'}}/> Alerts
        </NavLink>
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
    </Router>
  );
}

export default App;
