import React from 'react';
import { CATEGORIES, getAllQuestionsForCategory } from '../data/questions';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalQuestions = CATEGORIES.reduce((acc, cat) => {
    return acc + getAllQuestionsForCategory(cat.key).length;
  }, 0);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="home-page">
        <div className="container">
          <div className="home-header">
            <div className="welcome-badge">👋 Xush kelibsiz</div>
            <h1 className="home-title">Salom, {user?.firstName || 'Mehmon'}!</h1>
            <p className="home-subtitle">O'zingizga mos kategoriyani tanlang va bilimingizni sinab ko'ring</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <div key={cat.key} className="category-card glass-card" onClick={() => navigate(`/quiz/${cat.key}`)} style={{'--cat-color': cat.color}}>
                <div className="category-icon">{cat.icon}</div>
                <h3 className="category-name">{cat.label}</h3>
                <p className="category-count">{getAllQuestionsForCategory(cat.key).length} ta savol</p>
                <div className="category-arrow">→</div>
              </div>
            ))}
          </div>
          <div className="stats-section">
            <h2 className="section-title">📊 Statistika</h2>
            <div className="stats-grid">
              <div className="stat-card glass-card">
                <div className="stat-value">{totalQuestions}</div>
                <div className="stat-label">Jami savollar</div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-value">{CATEGORIES.length}</div>
                <div className="stat-label">Kategoriyalar</div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-value">∞</div>
                <div className="stat-label">Urinishlar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
