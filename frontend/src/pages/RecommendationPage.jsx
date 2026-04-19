import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Sprout } from 'lucide-react';

// Comprehensive crop image map — covers all 22 standard crops + extras
// Keys are case-insensitive matched below
const CROP_IMAGES = {
  wheat:       "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
  rice:        "https://images.unsplash.com/photo-1536304993881-ff86e0c9b4b5?auto=format&fit=crop&q=80&w=600",
  maize:       "https://images.unsplash.com/photo-1601379327928-bedfddca1b3c?auto=format&fit=crop&q=80&w=600",
  corn:        "https://images.unsplash.com/photo-1601379327928-bedfddca1b3c?auto=format&fit=crop&q=80&w=600",
  cotton:      "https://images.unsplash.com/photo-1592079927431-3f8ced0dcee9?auto=format&fit=crop&q=80&w=600",
  sugarcane:   "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=600",
  jute:        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=600",
  coffee:      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=600",
  chickpea:    "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&q=80&w=600",
  kidneybeans: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600",
  pigeonpeas:  "https://images.unsplash.com/photo-1585664811087-47f65abbad64?auto=format&fit=crop&q=80&w=600",
  mothbeans:   "https://images.unsplash.com/photo-1585664811087-47f65abbad64?auto=format&fit=crop&q=80&w=600",
  mungbean:    "https://images.unsplash.com/photo-1585664811087-47f65abbad64?auto=format&fit=crop&q=80&w=600",
  blackgram:   "https://images.unsplash.com/photo-1585664811087-47f65abbad64?auto=format&fit=crop&q=80&w=600",
  lentil:      "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&q=80&w=600",
  pomegranate: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600",
  banana:      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=600",
  mango:       "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600",
  grapes:      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=600",
  watermelon:  "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600",
  muskmelon:   "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?auto=format&fit=crop&q=80&w=600",
  apple:       "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=600",
  orange:      "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=600",
  papaya:      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&q=80&w=600",
  coconut:     "https://images.unsplash.com/photo-1580984969071-a8da8e2e6a2e?auto=format&fit=crop&q=80&w=600",
  tobacco:     "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
  soybean:     "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600",
  sunflower:   "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=600",
  tomato:      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&q=80&w=600",
  potato:      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600",
  onion:       "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=600",
  garlic:      "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=600",
};

const RANK_STYLES = [
  { label: '🥇 Best Match', border: '2px solid gold',     glow: 'rgba(255,215,0,0.25)' },
  { label: '🥈 2nd Match', border: '2px solid silver',   glow: 'rgba(192,192,192,0.15)' },
  { label: '🥉 3rd Match', border: '2px solid #cd7f32',  glow: 'rgba(205,127,50,0.15)' },
];

function getCropImage(cropName) {
  const key = cropName.toLowerCase().replace(/\s+/g, '');
  return (
    CROP_IMAGES[key] ||
    `https://source.unsplash.com/600x400/?${encodeURIComponent(cropName + ' crop farming')}` 
  );
}

export default function RecommendationPage() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const inputId = localStorage.getItem('inputId');
    if (!inputId) return navigate('/');

    fetch(`http://localhost:8000/recommend?input_id=${inputId}`)
      .then(res => res.json())
      .then(data => {
        setRecommendations(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [navigate]);

  const handleGeneratePlan = async () => {
    setGenerating(true);
    const inputId = localStorage.getItem('inputId');
    try {
      const response = await fetch(`http://localhost:8000/generate-plan?input_id=${inputId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recommendations.top_crops)
      });
      const planData = await response.json();
      // Store full plan for dashboard rendering
      localStorage.setItem('farmingPlan', JSON.stringify(planData));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to generate plan.');
    }
    setGenerating(false);
  };

  const handleImgError = (idx, cropName) => {
    setImgErrors(prev => ({ ...prev, [idx]: true }));
  };

  if (loading) return <div className="spinner" style={{ margin: '100px auto' }} />;

  return (
    <div className="grid">
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Trophy size={26} color="gold" /> AI Crop Recommendations
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Based on your soil parameters and current weather conditions.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem', margin: '3rem 0' }}>
          {recommendations?.top_crops.map((crop, idx) => {
            const rank = RANK_STYLES[idx] || { label: `#${idx + 1}`, border: '1px solid rgba(255,255,255,0.1)', glow: 'transparent' };
            const score = recommendations.scores[idx] ?? 0;
            const imgSrc = imgErrors[idx]
              ? `https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=600`
              : getCropImage(crop);

            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '0',
                  overflow: 'hidden',
                  width: '260px',
                  display: 'flex',
                  flexDirection: 'column',
                  border: rank.border,
                  boxShadow: `0 0 24px ${rank.glow}`,
                  transition: 'transform 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Crop Image */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={imgSrc}
                    alt={crop}
                    onError={() => handleImgError(idx, crop)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Rank badge overlay */}
                  <span style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
                    padding: '4px 10px', borderRadius: '20px',
                    fontSize: '0.78rem', fontWeight: 600, color: '#fff'
                  }}>
                    {rank.label}
                  </span>
                </div>

                {/* Info */}
                <div style={{ padding: '1.2rem 1.2rem 1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sprout size={16} color="var(--primary)" /> {crop}
                  </h3>

                  {/* Score bar */}
                  <div style={{ marginTop: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Match Score</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{(score * 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(score * 100).toFixed(0)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                        borderRadius: '999px',
                        transition: 'width 0.8s ease'
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleGeneratePlan}
          className="btn btn-accent"
          disabled={generating}
          style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}
        >
          {generating
            ? <div className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px' }} />
            : 'Generate Farming Plan'}
        </button>

        {/* Maharashtra Regional Crops Section */}
        {recommendations?.is_maharashtra && (
          <div className="glass-panel" style={{
            marginTop: '2.5rem', textAlign: 'left',
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.25)'
          }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              🌾 {recommendations.region_label} Specialty Crops
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
              Crops traditionally grown in <strong>{recommendations.district}</strong> district — consider these alongside the ML recommendations.
            </p>
            {recommendations.regional_crops?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {recommendations.regional_crops.map((crop, i) => (
                  <span key={i} style={{
                    background: 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(16,185,129,0.4)',
                    color: '#10b981',
                    borderRadius: '20px',
                    padding: '5px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '5px'
                  }}>
                    🌱 {crop}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
