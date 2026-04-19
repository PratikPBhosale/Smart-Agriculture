import React, { useState } from 'react';
import { UploadCloud, Activity } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

export default function DiseaseDetection() {
  const { t } = useLang();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/disease-detect', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Failed to analyze image.');
    }
    setLoading(false);
  };

  return (
    <div className="grid">
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h2><Activity style={{ display: 'inline', marginRight: '10px' }}/> {t('diseaseTitle')}</h2>
        <p>{t('diseaseDesc')}</p>
        
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%', 
            maxWidth: '500px', 
            height: '250px', 
            border: '2px dashed rgba(255,255,255,0.2)', 
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'var(--transition)',
            background: preview ? 'transparent' : 'rgba(0,0,0,0.2)'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
          >
            {preview ? (
              <img src={preview} alt="Crop Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
            ) : (
              <>
                <UploadCloud size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }}/>
                <span style={{ color: 'var(--text-muted)' }}>{t('uploadPrompt')}</span>
              </>
            )}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>

          <button onClick={handleUpload} className="btn btn-primary" style={{ marginTop: '2rem', padding: '1rem 3rem' }} disabled={!file || loading}>
            {loading ? <div className="spinner" style={{width:'24px', height:'24px', borderWidth:'3px'}}/> : t('btnAnalyzeAI')}
          </button>
        </div>

        {result && (
          <div className="glass-panel" style={{ marginTop: '2rem', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <h3 style={{ color: 'var(--primary)' }}>{t('analysisComplete')}</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', margin: '1rem 0' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('detectedCondition')}</span>
                <strong style={{ fontSize: '1.2rem' }}>{result.disease}</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('confidenceScore')}</span>
                <strong style={{ fontSize: '1.2rem' }}>{(result.confidence * 100).toFixed(1)}%</strong>
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
              <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t('recommendedTreatment')}</span>
              <p style={{ color: 'var(--text-main)' }}>{result.treatment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
