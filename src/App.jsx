import { useEffect, useMemo, useState } from 'react'

const mathTemplates = [
  {
    title: 'Tenglama',
    build: (a, b) => ({
      question: `Agar x + ${a} = ${b} bo'lsa, x ning qiymati qanday?`,
      answer: b - a,
    }),
  },
  {
    title: 'Ikki bosqichli tenglama',
    build: (a, b, c) => ({
      question: `Agar ${a}x + ${b} = ${c} bo'lsa, x ning qiymati qanday?`,
      answer: (c - b) / a,
    }),
  },
  {
    title: 'Ifodani hisoblash',
    build: (a, b, c) => ({
      question: `${a} + ${b} × ${c} - ${a} = ?`,
      answer: b * c,
    }),
  },
  {
    title: 'Ketma-ketlik',
    build: (a, b, n) => ({
      question: `${a}, ${a + b}, ${a + 2 * b}, ${a + 3 * b}, ... ketma-ketlik berilgan. 6-chi had qanday?`,
      answer: a + 5 * b,
    }),
  },
  {
    title: 'Mantiqiy son',
    build: (a, b) => ({
      question: `${a} va ${b} sonlari o'rtasidagi farq qanchaga teng?`,
      answer: Math.abs(a - b),
    }),
  },
]

const logicTemplates = [
  {
    question: "Bir so'z bilan aytganda: 'A' ning hamma elementi 'B' ga, 'B' ning hamma elementi 'C' ga tegishli bo'lsa, unda nima bo'ladi?",
    answer: "A ning hamma elementi C ga tegishli bo'ladi",
    options: [
      "A ning hamma elementi C ga tegishli bo'ladi",
      "A ning faqat ba'zi elementlari C ga tegishli bo'ladi",
      "C ning hamma elementi A ga tegishli bo'ladi",
      "A va C o'rtasida hech qanday bog'lanish yo'q",
      "A ning hech bir elementi B ga tegishli bo'lmaydi",
    ],
  },
  {
    question: "Agar har bir hayvon o'lik bo'lmasa, va barcha mushuklar hayvon bo'lsa, quyidagilardan qaysi xulosa to'g'ri?",
    answer: "Mushuklar o'lik bo'lmasligi mumkin",
    options: [
      "Mushuklar o'lik bo'lmasligi mumkin",
      "Barcha mushuklar doim o'lib ketadi",
      "Mushuklar hech qachon hayvon bo'lmaydi",
      "Mushuklar faqat qushlar bo'ladi",
      "Hayvonlar hech qachon tirik bo'lmaydi",
    ],
  },
  {
    question: "Agar P => Q va Q => R bo'lsa, quyidagilardan qaysi biri mantiqan kelib chiqadi?",
    answer: "P => R",
    options: [
      "P => R",
      "R => P",
      "Q => P",
      "P => Q => R emas",
      "Faqat Q to'g'ri",
    ],
  },
  {
    question: "Bir kishi: 'Mening to'plamimdagi har bir narsa, uning to'plamidagi barcha narsalarni ichiga oladi.' Bu gapning sirli ma'nosi nima?",
    answer: "S ning har bir elementi P ga tegishli",
    options: [
      "S ning har bir elementi P ga tegishli",
      "S ning faqat bir qismi P ga tegishli",
      "P hech qachon S bilan bog'liq emas",
      "S ning hech bir elementi P ga tegishli emas",
      "P va S bir xil to'plamdir",
    ],
  },
  {
    question: "Quyidagi bayonlardan qaysi biri mantiqan to'g'ri?",
    answer: "Agar barcha X lar Y bo'lsa, unda X dan Y ga o'tish mumkin",
    options: [
      "Agar barcha X lar Y bo'lsa, unda X dan Y ga o'tish mumkin",
      "Agar Y lar X bo'lsa, unda X lar Y bo'ladi",
      "Agar Xlar Y bo'lmasa, unda Y lar X bo'ladi",
      "Barcha X lar Y bo'lsa, unda X va Y bir xil emas",
      "Agar X lar Y bo'lsa, unda Y lar X bo'ladi",
    ],
  },
]

const shuffle = (items) => {
  const copy = [...items]

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy
}

const buildOptionSet = (correctAnswer, offset = 1) => {
  const options = [correctAnswer]

  while (options.length < 5) {
    const variant = correctAnswer + (Math.floor(Math.random() * 9) + offset) * (Math.random() > 0.5 ? 1 : -1)

    if (!options.includes(variant)) {
      options.push(variant)
    }
  }

  return shuffle(options)
}

const createLogicQuestions = () => {
  const questions = []

  for (let i = 0; i < 1500; i += 1) {
    const template = logicTemplates[i % logicTemplates.length]
    const questionText = `${template.question} (${i + 1})`

    questions.push({
      id: `logic-${i + 1}`,
      type: 'logic',
      category: 'Mantiq',
      question: questionText,
      answer: template.answer,
      options: shuffle(template.options),
    })
  }

  return questions
}

const createComputerQuestions = () => [
  {
    id: 'computer-1',
    type: 'computer',
    category: 'Kompyuter',
    question: 'Kompyuterning asosiy vazifasi nima?',
    answer: 'Ma\'lumotni qayta ishlash va natija chiqarish',
    options: [
      'Ma\'lumotni qayta ishlash va natija chiqarish',
      'Faqat matnlarni yozib olish',
      'Internetga faqatgina ulanish',
      'Fayllarni faqat ko\'chirish',
      'Yagona kompyuterga xizmat ko\'rsatish',
    ],
  },
  {
    id: 'computer-2',
    type: 'computer',
    category: 'Kompyuter',
    question: 'RAM nima uchun ishlatiladi?',
    answer: 'Hozirgi ishlayotgan dasturlar va ma\'lumotlarni vaqtincha saqlash',
    options: [
      'Hozirgi ishlayotgan dasturlar va ma\'lumotlarni vaqtincha saqlash',
      'Fayllarni doimiy ravishda diskka yozib borish',
      'Kompyuterni to\'liq o\'chirish',
      'Foydalanuvchi harakatlarini avtomatik qayd etish',
      'Barcha dasturlarni xotirada doimiy saqlash',
    ],
  },
  {
    id: 'computer-3',
    type: 'computer',
    category: 'Kompyuter',
    question: 'Operatsion sistema (OS) qanday vazifani bajaradi?',
    answer: 'Dasturlar va apparat o\'rtasida aloqa tashkil etadi',
    options: [
      'Dasturlar va apparat o\'rtasida aloqa tashkil etadi',
      'Faqat brauzerdagi saytlarni ochadi',
      'Foydalanuvchi ma\'lumotlarini faqat saqlaydi',
      'Kompyuterning ichki xotirasini o\'chirib tashlaydi',
      'Barcha kodlarni avtomatik yozib beradi',
    ],
  },
  {
    id: 'computer-4',
    type: 'computer',
    category: 'Kompyuter',
    question: 'CPU nima uchun kerak?',
    answer: 'Kompyuterning ko\'rsatmalarini bajaruvchi asosiy protsessor',
    options: [
      'Kompyuterning ko\'rsatmalarini bajaruvchi asosiy protsessor',
      'Fayllarni tashuvchi tashqi qurilma',
      'Internet trafigni saqlovchi xona',
      'Kompyuter ekranini tozalovchi vosita',
      'Foydalanuvchi buyruqlarini eslab qoladigan xotira',
    ],
  },
]

const createJavaScriptQuestions = () => {
  const baseQuestions = [
    {
      type: 'javascript',
      category: 'JavaScript',
      question: 'JavaScriptda `const` bilan e\'lon qilingan o\'zgaruvchiga yangi qiymat berish mumkinmi?',
      answer: 'Yo\'q, uning qiymati o\'zgarmaydi',
      options: [
        'Yo\'q, uning qiymati o\'zgarmaydi',
        'Ha, har doim o\'zgartiriladi',
        'Faqat sonlar uchun',
        'Faqat function ichida bo\'ladi',
        'Bunday holat xatolikka olib keladi',
      ],
    },
    {
      type: 'javascript',
      category: 'JavaScript',
      question: 'JavaScriptdagi `===` operatori nima qiladi?',
      answer: 'Qiymat va turini bir biriga solishtiradi',
      options: [
        'Qiymat va turini bir biriga solishtiradi',
        'Faqat qiymatni solishtiradi',
        'Faqat turini solishtiradi',
        'Satrlarni birlashtiradi',
        'Bitlarni o\'zgartiradi',
      ],
    },
    {
      type: 'javascript',
      category: 'JavaScript',
      question: '`filter()` metodi nima uchun ishlatiladi?',
      answer: 'Massivdan shartga mos keladigan elementlarni ajratib olish uchun',
      options: [
        'Massivdan shartga mos keladigan elementlarni ajratib olish uchun',
        'Massivni butunlay o\'chirish uchun',
        'Faqat stringlarni tekislash uchun',
        'Har bir elementni bitta marta chop etish uchun',
        'Massivda yangi qiymat qo\'shish uchun',
      ],
    },
    {
      type: 'javascript',
      category: 'JavaScript',
      question: '`async` va `await` nimaga xizmat qiladi?',
      answer: 'Asinxron operatsiyalarni soddaroq va o\'qilishi qulayroq yozish uchun',
      options: [
        'Asinxron operatsiyalarni soddaroq va o\'qilishi qulayroq yozish uchun',
        'Faqat sonlarni hisoblash uchun',
        'Barcha funktsiyalarni sinxron qilish uchun',
        'Fayllarni o\'chirish uchun',
        'Satrlarni boshqasiga aylantirish uchun',
      ],
    },
  ]

  return Array.from({ length: 500 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `js-${index + 1}`,
      ...template,
      question: `${template.question} (${index + 1})`,
      options: shuffle(template.options),
    }
  })
}

const createReactQuestions = () => {
  const baseQuestions = [
    {
      type: 'react',
      category: 'React',
      question: 'React komponenti qaysi ko\'rinishda yoziladi?',
      answer: 'UI qismi bo\'lib, JSX orqali yoziladi',
      options: [
        'UI qismi bo\'lib, JSX orqali yoziladi',
        'Faqat CSS faylida yoziladi',
        'Backend server uchun ishlatiladi',
        'So\'zlarni tanlash vositasi',
        'Har doim faqat bir faylda bo\'ladi',
      ],
    },
    {
      type: 'react',
      category: 'React',
      question: 'Reactda `state` nima uchun ishlatiladi?',
      answer: 'Komponent ichidagi o\'zgaruvchan ma\'lumotni kuzatish',
      options: [
        'Komponent ichidagi o\'zgaruvchan ma\'lumotni kuzatish',
        'Fayllarni doimiy saqlash',
        'Barcha komponentlarni qayta ishlash',
        'Biror xususiyatni CSS ga o\'tkazish',
        'Shunchaki tekshirish maqsadida ishlatiladi',
      ],
    },
    {
      type: 'react',
      category: 'React',
      question: 'Reactda `props` nima?',
      answer: 'Parent komponentdan child komponentga beriladigan ma\'lumot',
      options: [
        'Parent komponentdan child komponentga beriladigan ma\'lumot',
        'Faqat ichki o\'zgaruvchi',
        'Komponentning ichki holatini saqlovchi obyekt',
        'Foydalanuvchi so\'rovini qaytaruvchi funksiya',
        'Dizaynni faqat ranglar bilan boshqaradi',
      ],
    },
    {
      type: 'react',
      category: 'React',
      question: 'React hooklaridan `useState` nima vazifa bajaradi?',
      answer: 'Komponent ichidagi holatni boshqarish va yangilash',
      options: [
        'Komponent ichidagi holatni boshqarish va yangilash',
        'Foydalanuvchi kiritgan ma\'lumotni saqlash',
        'Yagona ishlov beruvchi server',
        'Faylni to\'g\'ridan-to\'g\'ri o\'chirish',
        'Barcha komponentlarni raqamlashtirish',
      ],
    },
  ]

  return Array.from({ length: 500 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `react-${index + 1}`,
      ...template,
      question: `${template.question} (${index + 1})`,
      options: shuffle(template.options),
    }
  })
}

const createPythonQuestions = () => {
  const baseQuestions = [
    {
      type: 'python',
      category: 'Python',
      question: 'Python tilida `list` nima?',
      answer: 'Elementlar ketma-ket saqlanadigan ro\'yxat',
      options: [
        'Elementlar ketma-ket saqlanadigan ro\'yxat',
        'Faqat sonlarni saqlaydigan obyekt',
        'Foydalanuvchi inputi',
        'Barcha funksiyalarni saqlaydigan to\'plam',
        'Mantiqiy ifodalar uchun maxsus fayl',
      ],
    },
    {
      type: 'python',
      category: 'Python',
      question: 'Pythonning `for` tsikli nimaga xizmat qiladi?',
      answer: 'Takrorlanuvchi obyektlar bo\'yicha takrorlash',
      options: [
        'Takrorlanuvchi obyektlar bo\'yicha takrorlash',
        'Faylni o\'chirish',
        'Faqat sonlarni hisoblash',
        'Serverni qayta ishga tushirish',
        'Barcha kodlarni yozishni osonlashtirish',
      ],
    },
    {
      type: 'python',
      category: 'Python',
      question: 'Python funksiyasida `return` nima qiladi?',
      answer: 'Funksiyadan qiymat qaytaradi',
      options: [
        'Funksiyadan qiymat qaytaradi',
        'Funksiyani to\'xtatib yuboradi',
        'O\'zgaruvchini yaratadi',
        'Faylni yozadi',
        'Faqat print uchun ishlatiladi',
      ],
    },
    {
      type: 'python',
      category: 'Python',
      question: 'Python tilida `dictionary` nima maqsadda ishlatiladi?',
      answer: 'Kalit so\'zlar va ularga mos keladigan qiymatlarni saqlash',
      options: [
        'Kalit so\'zlar va ularga mos keladigan qiymatlarni saqlash',
        'Faqat sonlarni tartiblaydi',
        'HTML sahifalarni yaratadi',
        'Fayllarni tekshiradi',
        'Tepadagi barcha fayllarni o\'chirishga yordam beradi',
      ],
    },
  ]

  return Array.from({ length: 500 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `python-${index + 1}`,
      ...template,
      question: `${template.question} (${index + 1})`,
      options: shuffle(template.options),
    }
  })
}

const logicQuestions = createLogicQuestions()
const javascriptQuestions = createJavaScriptQuestions()
const reactQuestions = createReactQuestions()
const pythonQuestions = createPythonQuestions()

const BLOCK_SIZE = 10

const buildQuestionBank = () => ({
  javascript: shuffle(javascriptQuestions),
  python: shuffle(pythonQuestions),
  react: shuffle(reactQuestions),
  logic: shuffle(logicQuestions),
})

const ADMIN_ACCESS_PASSWORD = '09876543211234567890A'

export default function App() {
  const [quizQuestions, setQuizQuestions] = useState(() => buildQuestionBank())
  const [selectedCategory, setSelectedCategory] = useState('javascript')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)
  const [adminPasswordInput, setAdminPasswordInput] = useState('')
  const [adminError, setAdminError] = useState('')
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    district: '',
    adminStatus: '0',
    adminPassword: '',
  })

  const currentQuestion = useMemo(() => quizQuestions[selectedCategory][currentIndex], [currentIndex, quizQuestions, selectedCategory])
  const currentBlock = Math.floor(currentIndex / BLOCK_SIZE) + 1
  const currentBlockProgress = ((currentIndex % BLOCK_SIZE) + 1) / BLOCK_SIZE * 100
  const categoryCards = [
    { key: 'javascript', label: 'JavaScript savollari', count: quizQuestions.javascript.length },
    { key: 'python', label: 'Python savollari', count: quizQuestions.python.length },
    { key: 'react', label: 'React savollari', count: quizQuestions.react.length },
    { key: 'logic', label: 'Mantiqiy savollar', count: quizQuestions.logic.length },
  ]

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleRegister = (event) => {
    event.preventDefault()

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.district.trim()) {
      return
    }

    setUsers((previous) => [
      {
        id: Date.now(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        district: formData.district.trim(),
        adminStatus: '0',
        password: '',
      },
      ...previous,
    ])

    setIsRegistered(true)
    setShowAdminPanel(false)
    setAdminAuthenticated(false)
    setAdminError('')

    setFormData({
      firstName: '',
      lastName: '',
      district: '',
      adminStatus: '0',
      adminPassword: '',
    })
  }

  const goToNextQuestion = () => {
    const nextIndex = currentIndex + 1
    const categoryPool = quizQuestions[selectedCategory]

    if (nextIndex >= categoryPool.length) {
      setShowResult(true)
    } else {
      setCurrentIndex(nextIndex)
    }

    setSelectedOption(null)
  }

  const handleAnswer = (option) => {
    setSelectedOption(option)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && selectedOption !== null && !showResult) {
        event.preventDefault()
        goToNextQuestion()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedOption, showResult, currentIndex, selectedCategory, quizQuestions])

  const resetQuiz = () => {
    setQuizQuestions(buildQuestionBank())
    setCurrentIndex(0)
    setSelectedOption(null)
    setShowResult(false)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentIndex(0)
    setSelectedOption(null)
    setShowResult(false)
  }

  const openAdminPanel = () => {
    setShowAdminPanel((previous) => !previous)
    setAdminAuthenticated(false)
    setAdminError('')
  }

  const handleAdminLogin = (event) => {
    event.preventDefault()

    if (adminPasswordInput === ADMIN_ACCESS_PASSWORD) {
      setAdminAuthenticated(true)
      setAdminError('')
    } else {
      setAdminAuthenticated(false)
      setAdminError('Noto\'g\'ri parol.')
    }
  }

  return (
    <div className="app-shell">
      <div className="container">
        <header className="hero-card">
          <span className="badge">Savollar platformasi</span>
          <h1>Logic Quest Pro</h1>
          <p>
            Kompyuter, JavaScript, React, Python va mantiqiy savollar bilan tayyorlangan zamonaviy
            va interaktiv viktorina. Har bir savol faqat bir marta chiqadi va javobingiz aniq
            ko'rsatiladi.
          </p>
        </header>

        <section className="dashboard-grid">
          {!isRegistered ? (
            <div className="register-card">
              <h2>Ro’yxatdan o’tish</h2>
              <p className="subtle-text">Admin panelga kirish faqat maxsus parol orqali mumkin.</p>
              <form className="register-form" onSubmit={handleRegister}>
                <label className="field">
                  <span>Ism</span>
                  <input name="firstName" value={formData.firstName} onChange={handleFormChange} placeholder="Ismingiz" />
                </label>

                <label className="field">
                  <span>Familiya</span>
                  <input name="lastName" value={formData.lastName} onChange={handleFormChange} placeholder="Familiyangiz" />
                </label>

                <label className="field">
                  <span>Tuman</span>
                  <input name="district" value={formData.district} onChange={handleFormChange} placeholder="Tuman nomi" />
                </label>

                <button type="submit" className="submit-btn">Ro’yxatdan o’tish</button>
              </form>
            </div>
          ) : null}

          {isRegistered ? (
            <div className="admin-card">
              <div className="admin-header-row">
                <h2>Adminga kirish</h2>
                <button className="access-btn" onClick={openAdminPanel}>
                  {showAdminPanel ? 'Admin panelni yopish' : 'Admin panelga kirish'}
                </button>
              </div>

              {showAdminPanel && !adminAuthenticated ? (
                <form className="admin-login-form" onSubmit={handleAdminLogin}>
                  <label className="field">
                    <span>Parol</span>
                    <input
                      type="password"
                      value={adminPasswordInput}
                      onChange={(event) => setAdminPasswordInput(event.target.value)}
                      placeholder="Admin parolini kiriting"
                    />
                  </label>
                  {adminError ? <p className="error-text">{adminError}</p> : null}
                  <button type="submit" className="submit-btn">Kirish</button>
                </form>
              ) : null}

              {showAdminPanel && adminAuthenticated ? (
                <>
                  <div className="admin-summary">
                    <div className="summary-item">
                      <strong>{users.length}</strong>
                      <span>Jami foydalanuvchi</span>
                    </div>
                    <div className="summary-item">
                      <strong>{users.filter((user) => user.adminStatus === '1').length}</strong>
                      <span>Adminlar</span>
                    </div>
                  </div>

                  <div className="admin-list">
                    {users.length === 0 ? (
                      <p className="empty-state">Hali foydalanuvchi ro’yxatdan o’tmagan.</p>
                    ) : (
                      users.map((user) => (
                        <div key={user.id} className="user-row">
                          <div>
                            <strong>{user.firstName} {user.lastName}</strong>
                            <span>{user.district}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </section>

        <main className="quiz-card">
          {!isRegistered ? (
            <div className="register-prompt">
              <span className="badge">Boshlash uchun</span>
              <h2>Avval ro’yxatdan o’ting</h2>
              <p>Ro’yxatdan o’tganingizdan keyin savollar ko’rsatiladi.</p>
            </div>
          ) : (
            <>
              <div className="category-list">
                {categoryCards.map((category) => (
                  <button
                    key={category.key}
                    type="button"
                    className={`category-chip ${selectedCategory === category.key ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.key)}
                  >
                    <span>{category.label}</span>
                    <strong>{category.count}</strong>
                  </button>
                ))}
              </div>

              {!showResult ? (
                <>
                  <div className="progress-head">
                    <div className="progress-caption">Bosqich {currentBlock} • Har 10 ta savol qiyinlashadi</div>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar" style={{ width: `${currentBlockProgress}%` }} />
                  </div>

                  <div className="question-box">
                    <span className="question-tag">{currentQuestion.category}</span>
                    <h2>{currentQuestion.question}</h2>
                  </div>

                  <div className="options-grid">
                    {currentQuestion.options.map((option) => {
                      const isSelected = selectedOption === option
                      const isCorrect = option === currentQuestion.answer
                      const buttonClass = [
                        'option-btn',
                        isSelected ? 'selected' : '',
                        selectedOption !== null && isCorrect ? 'correct' : '',
                        selectedOption !== null && isSelected && !isCorrect ? 'incorrect' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')

                      return (
                        <button
                          key={option}
                          className={buttonClass}
                          onClick={() => handleAnswer(option)}
                          disabled={selectedOption !== null}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>

                  {selectedOption !== null ? (
                    <div className="feedback-box">
                      <div className={`feedback-message ${selectedOption === currentQuestion.answer ? 'success' : 'error'}`}>
                        {selectedOption === currentQuestion.answer
                          ? 'To\'g\'ri javob! Keyingisi tugmasini bosing.'
                          : `Noto\'g\'ri javob. To\'g\'ri javob: ${currentQuestion.answer}`}
                      </div>
                      <div className="next-action">
                        <button className="next-btn" onClick={goToNextQuestion}>Keyingisi</button>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="result-box">
                  <span className="badge">Natija</span>
                  <h2>Test tugadi</h2>
                  <p>
                    Savollar tugadi. Qayta boshlash orqali yana yangi random ketma-ketlikni ko'rishingiz
                    mumkin.
                  </p>
                  <button className="reset-btn" onClick={resetQuiz}>Qayta boshlash</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
