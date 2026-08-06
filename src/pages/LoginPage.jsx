import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin || user?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [isAuthenticated, isAdmin, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        // Redirection will be handled by useEffect or we can do it here
        const isUserAdmin = result.user?.isAdmin || isAdmin;
        if (isUserAdmin) {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
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
            <p className="auth-subtitle">Hisobingizga kiring</p>
          </div>
          {error && <div className="auth-error"><span className="error-icon">⚠️</span>{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input 
                  className="form-input" 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Parol</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  className="form-input" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Kirish...' : 'Kirish'}
            </button>
          </form>
          <div className="auth-footer">
            <p>Hisobingiz yo'qmi? <Link to="/register" className="auth-link">Ro'yxatdan o'ting</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
