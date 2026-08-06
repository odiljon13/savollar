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

export const shuffle = (items) => {
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

export function buildQuestionBank() {
  return {
    javascript: shuffle(createJavaScriptQuestions()),
    python: shuffle(createPythonQuestions()),
    react: shuffle(createReactQuestions()),
    logic: shuffle(createLogicQuestions()),
    computer: shuffle(createComputerQuestions()),
  }
}

export function getCustomQuestions() {
  const custom = localStorage.getItem('lqp_customQuestions')
  return custom ? JSON.parse(custom) : []
}

export function addCustomQuestion(question) {
  const custom = getCustomQuestions()
  custom.push({ ...question, id: `custom-${Date.now()}` })
  localStorage.setItem('lqp_customQuestions', JSON.stringify(custom))
}

export function deleteCustomQuestion(id) {
  const custom = getCustomQuestions()
  const filtered = custom.filter((q) => q.id !== id)
  localStorage.setItem('lqp_customQuestions', JSON.stringify(filtered))
}

export function getAllQuestionsForCategory(category) {
  const bank = buildQuestionBank()
  const custom = getCustomQuestions().filter(
    (q) => q.category === category || q.type === category
  )
  
  return shuffle([...(bank[category] || []), ...custom])
}

export const CATEGORIES = [
  { key: 'javascript', label: 'JavaScript', icon: '⚡', color: '#f7df1e' },
  { key: 'python', label: 'Python', icon: '🐍', color: '#3776ab' },
  { key: 'react', label: 'React', icon: '⚛️', color: '#61dafb' },
  { key: 'logic', label: 'Mantiq', icon: '🧠', color: '#8b5cf6' },
  { key: 'computer', label: 'Kompyuter', icon: '💻', color: '#10b981' },
]

export const BLOCK_SIZE = 10
