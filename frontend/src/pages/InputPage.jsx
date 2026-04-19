import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InputPage() {
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
      alert('Failed to save data. Ensure backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-2">
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '3rem' }}>Smart Farming Starts Here</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Enter your soil metrics and location. Our AI will analyze environmental conditions, predict the best crops mathematically, and orchestrate a full farming lifecycle for maximum yield.
        </p>
        <ul style={{ listStyle: 'none', color: 'var(--text-muted)' }}>
          <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>🌱 Precision Soil Analytics</li>
          <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>🤖 AI Generated Action Plans</li>
          <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>🌤️ Real-Time Weather Integration</li>
        </ul>
      </div>

      <div className="glass-panel">
        <h2>Soil & Location Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nitrogen (N)</label>
            <input type="number" name="N" value={formData.N} onChange={handleChange} className="form-input" required placeholder="e.g., 40" />
          </div>
          <div className="form-group">
            <label className="form-label">Phosphorus (P)</label>
            <input type="number" name="P" value={formData.P} onChange={handleChange} className="form-input" required placeholder="e.g., 30" />
          </div>
          <div className="form-group">
            <label className="form-label">Potassium (K)</label>
            <input type="number" name="K" value={formData.K} onChange={handleChange} className="form-input" required placeholder="e.g., 20" />
          </div>
          <div className="form-group">
            <label className="form-label">Soil pH</label>
            <input type="number" step="0.1" name="pH" value={formData.pH} onChange={handleChange} className="form-input" required placeholder="e.g., 6.5" />
          </div>
          <div className="form-group">
            <label className="form-label">Location (City)</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" required placeholder="e.g., Nashik, Nagpur, Pune" list="maharashtra-districts" />
            <datalist id="maharashtra-districts">
              <option value="Pune" /><option value="Nashik" /><option value="Nagpur" />
              <option value="Ratnagiri" /><option value="Sindhudurg" /><option value="Raigad" />
              <option value="Kolhapur" /><option value="Satara" /><option value="Solapur" />
              <option value="Ahmednagar" /><option value="Sangli" /><option value="Jalgaon" />
              <option value="Amravati" /><option value="Wardha" /><option value="Yavatmal" />
              <option value="Akola" /><option value="Latur" /><option value="Nanded" />
              <option value="Beed" /><option value="Dhule" /><option value="Palghar" />
              <option value="Chhatrapati Sambhajinagar" /><option value="Dharashiv" />
              <option value="Mahabaleshwar" /><option value="Panchgani" /><option value="Dahanu" />
              <option value="Aurangabad" /><option value="Mumbai" /><option value="Thane" />
            </datalist>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? <div className="spinner" style={{width:'20px', height:'20px', borderWidth:'2px'}}/> : 'Analyze Data'}
          </button>
        </form>
      </div>
    </div>
  );
}
