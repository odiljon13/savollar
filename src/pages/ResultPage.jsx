import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CATEGORIES } from '../data/questions';

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state) {
      navigate('/home');
    }
  }, [location.state, navigate]);

  if (!location.state) {
    return null;
  }

  const { category, totalQuestions, correctAnswers } = location.state;
  
  const categoryData = CATEGORIES.find(c => c.key === category);
  const categoryLabel = categoryData ? categoryData.label : category;
  
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="result-page">
        <div className="container">
          <div className="result-card glass-card">
            <div className="result-icon">🏆</div>
            <h1 className="result-title">Test tugadi!</h1>
            <p className="result-category">{categoryLabel} bo'yicha natijalar</p>
            <div className="result-stats">
              <div className="result-stat">
                <div className="result-stat-value">{correctAnswers}</div>
                <div className="result-stat-label">To'g'ri javoblar</div>
              </div>
              <div className="result-stat">
                <div className="result-stat-value">{totalQuestions}</div>
                <div className="result-stat-label">Jami savollar</div>
              </div>
              <div className="result-stat">
                <div className="result-stat-value">{percentage}%</div>
                <div className="result-stat-label">Foiz</div>
              </div>
            </div>
            <div className="result-actions">
              <button className="btn-primary" onClick={() => navigate(`/quiz/${category}`)}>Qayta boshlash</button>
              <button className="btn-secondary" onClick={() => navigate('/home')}>Bosh sahifa</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
