import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Parollar mos kelmadi');
      return;
    }
    
    if (password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);

    try {
      const result = await register(username, password, firstName, lastName);
      if (result.success) {
        navigate('/login', { state: { message: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz. Iltimos, tizimga kiring.' } });
      } else {
        setError(result.error || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
      }
    } catch (err) {
      setError('Kutilmagan xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <div className="auth-logo">🧠</div>
            <h1 className="auth-title">Logic Quest Pro</h1>
            <p className="auth-subtitle">Ro'yxatdan o'tish</p>
          </div>
          {error && <div className="auth-error"><span className="error-icon">⚠️</span>{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Ism</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input className="form-input" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Familiya</label>
              <div className="input-wrapper">
                <span className="input-icon">👥</span>
                <input className="form-input" type="text" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input className="form-input" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Parol</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Parolni tasdiqlang</label>
              <div className="input-wrapper">
                <span className="input-icon">🔐</span>
                <input className="form-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
              </div>
            </div>
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Kutilmoqda...' : 'Ro\'yxatdan o\'tish'}
            </button>
          </form>
          <div className="auth-footer">
            <p>Hisobingiz bormi? <Link to="/login" className="auth-link">Kirish</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
