import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { shuffle, getAllQuestionsForCategory, CATEGORIES, BLOCK_SIZE } from '../data/questions';

const QuizPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const categoryInfo = useMemo(() => {
    return CATEGORIES.find(c => c.key === category) || null;
  }, [category]);

  useEffect(() => {
    if (categoryInfo) {
      setQuestions(shuffle(getAllQuestionsForCategory(category)));
    }
  }, [category, categoryInfo]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && selectedOption !== null) {
        goToNextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, currentIndex]);

  if (!categoryInfo) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="quiz-page" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Bunday kategoriya topilmadi</h2>
          <Link to="/home" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>Bosh sahifaga qaytish</Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="quiz-page" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Bu kategoriyada hali savollar yo'q</h2>
          <Link to="/home" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>Bosh sahifaga qaytish</Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentBlock = Math.floor(currentIndex / BLOCK_SIZE) + 1;
  const currentBlockProgress = (((currentIndex % BLOCK_SIZE) + 1) / BLOCK_SIZE) * 100;

  const handleAnswer = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    if (option === currentQuestion.answer) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      navigate('/result', {
        state: { category, totalQuestions: questions.length, correctAnswers }
      });
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="quiz-page">
        <div className="container">
          <div className="quiz-header glass-card">
            <div className="quiz-category-info">
              <span className="quiz-category-icon">{categoryInfo.icon}</span>
              <h2 className="quiz-category-name">{categoryInfo.label}</h2>
            </div>
            <div className="quiz-progress-info">
              <span className="quiz-counter">{currentIndex + 1} / {questions.length}</span>
              <span className="quiz-block">Bosqich {currentBlock}</span>
            </div>
          </div>

          <div className="progress-track">
            <div className="progress-bar" style={{ width: `${currentBlockProgress}%` }} />
          </div>

          <div className="question-card glass-card">
            <span className="question-tag" style={{ '--tag-color': categoryInfo.color }}>{categoryInfo.label}</span>
            <h2 className="question-text">{currentQuestion.question}</h2>
          </div>

          <div className="options-grid">
            {currentQuestion.options.map(option => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQuestion.answer;
              let className = 'option-btn';

              if (selectedOption !== null) {
                if (isCorrect) {
                  className += ' correct';
                }

                if (isSelected && !isCorrect) {
                  className += ' incorrect';
                }
              }

              return (
                <button 
                  key={option} 
                  className={className} 
                  onClick={() => handleAnswer(option)} 
                  disabled={selectedOption !== null}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="feedback-box glass-card">
              <div className={`feedback-message ${selectedOption === currentQuestion.answer ? 'success' : 'error'}`}>
                {selectedOption === currentQuestion.answer
                  ? '✅ To\'g\'ri javob! Ajoyib!'
                  : `❌ Noto\'g\'ri. To\'g\'ri javob: ${currentQuestion.answer}`}
              </div>
              <button className="btn-primary next-btn" onClick={goToNextQuestion}>
                {currentIndex < questions.length - 1 ? 'Keyingisi →' : 'Natijalarni ko\'rish 🏆'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
