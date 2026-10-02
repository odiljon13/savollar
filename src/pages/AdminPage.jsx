import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  CATEGORIES, 
  getCustomQuestions, 
  addCustomQuestion, 
  deleteCustomQuestion, 
  updateCustomQuestion,
  shuffle,
  buildQuestionBank
} from '../data/questions';
import { getRegisteredUsers } from '../utils/auth';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dashboard stats
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [users, setUsers] = useState([]);
  const [customQuestionsList, setCustomQuestionsList] = useState([]);

  // Add Question form
  const [category, setCategory] = useState(CATEGORIES[0]?.key || '');
  const [questionText, setQuestionText] = useState('');
  const [answer, setAnswer] = useState('');
  const [options, setOptions] = useState(['', '', '', '', '']);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Questions List
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Question
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editOptions, setEditOptions] = useState(['', '', '', '', '']);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/home');
    }
  }, [isAdmin, navigate]);

  const loadData = () => {
    const allUsers = getRegisteredUsers() || [];
    setUsers(allUsers);
    
    const custom = getCustomQuestions() || [];
    setCustomQuestionsList(custom);

    const bank = buildQuestionBank();
    let total = 0;
    Object.values(bank).forEach(arr => {
      total += arr.length;
    });
    setTotalQuestions(total);
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [activeTab, isAdmin]);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!category || !questionText.trim() || !answer.trim() || options.some(opt => !opt.trim())) {
      setErrorMsg('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }

    const categoryObj = CATEGORIES.find(c => c.key === category);
    if (!categoryObj) {
      setErrorMsg('Noto\'g\'ri kategoriya tanlandi.');
      return;
    }

    const newQuestion = {
      id: 'custom-' + Date.now(),
      type: category,
      category: categoryObj.label,
      question: questionText.trim(),
      answer: answer.trim(),
      options: shuffle([...options.map(opt => opt.trim())])
    };

    addCustomQuestion(newQuestion);
    setSuccessMsg('Savol muvaffaqiyatli qo\'shildi!');
    
    // Reset form
    setQuestionText('');
    setAnswer('');
    setOptions(['', '', '', '', '']);
    
    // Update local stats if staying on same tab
    loadData();
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm('Haqiqatan ham bu savolni o\'chirmoqchimisiz?')) {
      deleteCustomQuestion(id);
      loadData();
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    if (index === 0) {
      setAnswer(value);
    }
  };

  const startEditing = (q) => {
    setEditingQuestion(q);
    setEditCategory(q.type || '');
    setEditQuestionText(q.question);
    setEditAnswer(q.answer);
    setEditOptions(q.options && q.options.length === 5 ? [...q.options] : [q.answer, '', '', '', '']);
  };

  const handleEditOptionChange = (index, value) => {
    const newOptions = [...editOptions];
    newOptions[index] = value;
    setEditOptions(newOptions);
    if (index === 0) {
      setEditAnswer(value);
    }
  };

  const handleSaveEdit = () => {
    if (!editQuestionText.trim() || !editAnswer.trim() || editOptions.some(opt => !opt.trim())) {
      alert('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }
    const categoryObj = CATEGORIES.find(c => c.key === editCategory);
    updateCustomQuestion(editingQuestion.id, {
      type: editCategory,
      category: categoryObj ? categoryObj.label : editingQuestion.category,
      question: editQuestionText.trim(),
      answer: editAnswer.trim(),
      options: shuffle([...editOptions.map(opt => opt.trim())])
    });
    setEditingQuestion(null);
    loadData();
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'add-question', label: 'Savol qo\'shish', icon: '➕' },
    { key: 'questions', label: 'Savollar', icon: '📋' },
    { key: 'users', label: 'Foydalanuvchilar', icon: '👥' }
  ];

  const filteredQuestions = customQuestionsList.filter(q => 
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="admin-page">
        <div className="container">
          <div className="admin-header">
            <h1 className="admin-title">⚙️ Admin Panel</h1>
            <p className="admin-subtitle">Saytni boshqarish va savollar qo'shish</p>
          </div>

          <div className="admin-tabs">
            {tabs.map(tab => (
              <button 
                key={tab.key} 
                className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`} 
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="admin-content glass-card">
            {activeTab === 'dashboard' && (
              <div className="dashboard-tab">
                <h2>Umumiy statistika</h2>
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                  <div className="stat-card glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h3>Jami savollar</h3>
                    <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: '10px 0 0' }}>{totalQuestions}</p>
                  </div>
                  <div className="stat-card glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h3>Kategoriyalar soni</h3>
                    <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: '10px 0 0' }}>{CATEGORIES.length}</p>
                  </div>
                  <div className="stat-card glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h3>Foydalanuvchilar soni</h3>
                    <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: '10px 0 0' }}>{users.length}</p>
                  </div>
                  <div className="stat-card glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h3>Qo'shilgan savollar</h3>
                    <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: '10px 0 0' }}>{customQuestionsList.length}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'add-question' && (
              <div className="add-question-tab">
                <h2>Yangi savol qo'shish</h2>
                {successMsg && <div className="alert success" style={{ background: 'rgba(76, 175, 80, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '15px', color: '#4caf50' }}>{successMsg}</div>}
                {errorMsg && <div className="alert error" style={{ background: 'rgba(244, 67, 54, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '15px', color: '#f44336' }}>{errorMsg}</div>}
                
                <form onSubmit={handleAddQuestion} className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px' }}>Kategoriya</label>
                    <select 
                      value={category} 
                      onChange={e => setCategory(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }}
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px' }}>Savol matni</label>
                    <textarea 
                      value={questionText} 
                      onChange={e => setQuestionText(e.target.value)} 
                      placeholder="Savolni kiriting..."
                      rows={3}
                      style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white', resize: 'vertical' }}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px' }}>Variantlar (birinchisi to'g'ri javob bo'lishi kerak)</label>
                    {options.map((opt, i) => (
                      <input 
                        key={i} 
                        type="text" 
                        value={opt} 
                        onChange={e => handleOptionChange(i, e.target.value)} 
                        placeholder={`${i + 1}-variant ${i === 0 ? "(To'g'ri javob)" : ""}`} 
                        style={{ marginBottom: '10px', display: 'block', width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }}
                      />
                    ))}
                  </div>

                  <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Savolni saqlash</button>
                </form>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="questions-tab">
                <h2>Qo'shilgan savollar ({customQuestionsList.length})</h2>
                <input 
                  type="text" 
                  placeholder="Savolni qidirish..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', marginBottom: '20px', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }}
                />
                
                {filteredQuestions.length === 0 ? (
                  <p>Savollar topilmadi.</p>
                ) : (
                  <div className="questions-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {filteredQuestions.map(q => (
                      <div key={q.id} className="question-item glass-card" style={{ padding: '15px' }}>
                        {editingQuestion && editingQuestion.id === q.id ? (
                          // Edit form
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Kategoriya</label>
                              <select 
                                value={editCategory} 
                                onChange={e => setEditCategory(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }}
                              >
                                {CATEGORIES.map(c => (
                                  <option key={c.key} value={c.key}>{c.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Savol matni</label>
                              <textarea 
                                value={editQuestionText} 
                                onChange={e => setEditQuestionText(e.target.value)} 
                                rows={3}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white', resize: 'vertical' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Variantlar (birinchisi to'g'ri javob)</label>
                              {editOptions.map((opt, i) => (
                                <input 
                                  key={i} 
                                  type="text" 
                                  value={opt} 
                                  onChange={e => handleEditOptionChange(i, e.target.value)} 
                                  placeholder={`${i + 1}-variant ${i === 0 ? "(To'g'ri javob)" : ""}`} 
                                  style={{ marginBottom: '8px', display: 'block', width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }}
                                />
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button 
                                onClick={handleSaveEdit} 
                                style={{ padding: '8px 20px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                              >
                                ✅ Saqlash
                              </button>
                              <button 
                                onClick={handleCancelEdit} 
                                style={{ padding: '8px 20px', background: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                              >
                                ❌ Bekor qilish
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Display mode
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8em' }}>{q.category}</span>
                              <h4 style={{ margin: '10px 0' }}>{q.question}</h4>
                              <p style={{ margin: '0', color: '#4caf50' }}>To'g'ri javob: {q.answer}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                              <button 
                                onClick={() => startEditing(q)} 
                                style={{ padding: '8px 15px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                              >
                                ✏️ Tahrirlash
                              </button>
                              <button 
                                className="btn-danger" 
                                onClick={() => handleDeleteQuestion(q.id)} 
                                style={{ padding: '8px 15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                              >
                                O'chirish
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-tab">
                <h2>Foydalanuvchilar ({users.length})</h2>
                <div className="users-table-wrapper" style={{ overflowX: 'auto', marginTop: '15px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Rasm</th>
                        <th style={{ padding: '12px' }}>Username</th>
                        <th style={{ padding: '12px' }}>Ism Familiya</th>
                        <th style={{ padding: '12px' }}>Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => {
                        const initials = `${(u.firstName || '').charAt(0)}${(u.lastName || '').charAt(0)}`.toUpperCase() || '?';
                        const colors = ['4f46e5', '2563eb', '7c3aed', '0891b2', 'db2777', 'ea580c', '16a34a', 'd97706'];
                        const bgColor = colors[i % colors.length];
                        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent((u.firstName || '') + ' ' + (u.lastName || ''))}&background=${bgColor}&color=fff&size=128&bold=true&font-size=0.4`;
                        
                        return (
                          <tr key={u.username || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <td style={{ padding: '12px' }}>
                              <img 
                                src={avatarUrl}
                                alt={initials}
                                style={{
                                  width: '45px',
                                  height: '45px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '2px solid rgba(255,255,255,0.2)',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>{u.username}</td>
                            <td style={{ padding: '12px' }}>{u.firstName} {u.lastName}</td>
                            <td style={{ padding: '12px' }}>
                              {u.isAdmin ? (
                                <span style={{ background: '#ff9800', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85em', color: 'white' }}>Admin</span>
                              ) : (
                                <span style={{ background: '#2196f3', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85em', color: 'white' }}>User</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
