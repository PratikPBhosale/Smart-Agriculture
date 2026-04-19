import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';

export default function InputPage() {
  const { t } = useLang();
  const [formData, setFormData] = useState({ N: '', P: '', K: '', pH: '', location: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          N: parseFloat(formData.N),
          P: parseFloat(formData.P),
          K: parseFloat(formData.K),
          pH: parseFloat(formData.pH),
          location: formData.location
        })
      });
      const data = await response.json();
      localStorage.setItem('inputId', data.id);
      navigate('/recommendation');
    } catch (err) {
      console.error(err);
      alert(t('errorSave'));
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-2">
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '3rem' }}>{t('heroTitle')}</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{t('heroDesc')}</p>
        <ul style={{ listStyle: 'none', color: 'var(--text-muted)' }}>
          <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>🌱 {t('featureSoil')}</li>
          <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>🤖 {t('featureAI')}</li>
          <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>🌤️ {t('featureWeather')}</li>
        </ul>
      </div>

      <div className="glass-panel">
        <h2>{t('soilTitle')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('labelN')}</label>
            <input type="number" name="N" value={formData.N} onChange={handleChange} className="form-input" required placeholder="e.g., 40" />
          </div>
          <div className="form-group">
            <label className="form-label">{t('labelP')}</label>
            <input type="number" name="P" value={formData.P} onChange={handleChange} className="form-input" required placeholder="e.g., 30" />
          </div>
          <div className="form-group">
            <label className="form-label">{t('labelK')}</label>
            <input type="number" name="K" value={formData.K} onChange={handleChange} className="form-input" required placeholder="e.g., 20" />
          </div>
          <div className="form-group">
            <label className="form-label">{t('labelPH')}</label>
            <input type="number" step="0.1" name="pH" value={formData.pH} onChange={handleChange} className="form-input" required placeholder="e.g., 6.5" />
          </div>
          <div className="form-group">
            <label className="form-label">{t('labelLocation')}</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              required
              placeholder={t('placeholderLocation')}
              list="location-suggestions"
              autoComplete="off"
            />
            <datalist id="location-suggestions">
              {/* Maharashtra */}
              <option value="Pune" /><option value="Nashik" /><option value="Nagpur" />
              <option value="Ratnagiri" /><option value="Kolhapur" /><option value="Satara" />
              <option value="Solapur" /><option value="Ahmednagar" /><option value="Sangli" />
              <option value="Jalgaon" /><option value="Amravati" /><option value="Wardha" />
              <option value="Yavatmal" /><option value="Akola" /><option value="Latur" />
              <option value="Nanded" /><option value="Beed" /><option value="Dhule" />
              <option value="Palghar" /><option value="Buldhana" /><option value="Sindhudurg" />
              <option value="Raigad" /><option value="Mahabaleshwar" /><option value="Mumbai" />
              {/* Other Indian states */}
              <option value="Jammu" /><option value="Srinagar" /><option value="Shimla" />
              <option value="Manali" /><option value="Dehradun" /><option value="Amritsar" />
              <option value="Ludhiana" /><option value="Chandigarh" /><option value="Jaipur" />
              <option value="Jodhpur" /><option value="Udaipur" /><option value="Kochi" />
              <option value="Thiruvananthapuram" /><option value="Coimbatore" /><option value="Madurai" />
              <option value="Hyderabad" /><option value="Vijayawada" /><option value="Bengaluru" />
              <option value="Mysuru" /><option value="Bhopal" /><option value="Indore" />
              <option value="Patna" /><option value="Ranchi" /><option value="Bhubaneswar" />
              <option value="Guwahati" /><option value="Imphal" /><option value="Agartala" />
              <option value="Delhi" /><option value="Lucknow" /><option value="Varanasi" />
              <option value="Kolkata" /><option value="Darjeeling" /><option value="Siliguri" />
            </datalist>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
              🌍 Enter any city in India or worldwide
            </small>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? <div className="spinner" style={{width:'20px', height:'20px', borderWidth:'2px'}}/> : t('btnAnalyze')}
          </button>
        </form>
      </div>
    </div>
  );
}
