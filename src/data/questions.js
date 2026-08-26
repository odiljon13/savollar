const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const buildOptionSet = (correctAnswer, extraCount = 4) => {
  const options = [Number(correctAnswer)]

  while (options.length < extraCount + 1) {
    const delta = randomInt(1, 20)
    const candidate = Number((Number(correctAnswer) + (Math.random() > 0.5 ? delta : -delta)).toFixed(2))

    if (!options.includes(candidate)) {
      options.push(candidate)
    }
  }

  return shuffle(options)
}

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
  {
    title: 'Foiz',
    build: (a, p) => ({
      question: `${a} sonining ${p}% i qanchaga teng?`,
      answer: (a * p) / 100,
    }),
  },
  {
    title: 'Yuzasini hisoblash',
    build: (a, b) => ({
      question: `To'g'ri to'rtburchakning bo'yi ${a} va eni ${b} bo'lsa, yuzi qanchaga teng?`,
      answer: a * b,
    }),
  },
  {
    title: 'EKUB',
    build: (a, b) => {
      const gcd = (x, y) => (!y ? x : gcd(y, x % y));
      return {
        question: `${a} va ${b} sonlarining eng katta umumiy bo'luvchisi (EKUB) qanday?`,
        answer: gcd(a, b),
      };
    },
  },
  {
    title: 'EKUK',
    build: (a, b) => {
      const gcd = (x, y) => (!y ? x : gcd(y, x % y));
      return {
        question: `${a} va ${b} sonlarining eng kichik umumiy karralisi (EKUK) qanday?`,
        answer: (a * b) / gcd(a, b),
      };
    },
  },
  {
    title: 'Daraja',
    build: (a, b) => {
      const pow = (b % 4) + 2;
      return {
        question: `${a} ning ${pow}-darajasi necha bo'ladi?`,
        answer: Math.pow(a, pow),
      };
    },
  },
  {
    title: 'Ildiz',
    build: (a) => {
      return {
        question: `${a * a} sonining kvadrat ildizi qanday?`,
        answer: a,
      };
    },
  },
  {
    title: 'Uchburchak perimetri',
    build: (a, b, c) => ({
      question: `Uchburchakning tomonlari ${a}, ${b} va ${c} ga teng bo'lsa, uning perimetri qancha?`,
      answer: a + b + c,
    }),
  },
  {
    title: 'Doira yuzi',
    build: (a) => ({
      question: `Radiusi ${a} ga teng bo'lgan doiraning yuzi qancha (pi=3 deb oling)?`,
      answer: 3 * a * a,
    }),
  },
  {
    title: 'Proporsiya',
    build: (a, b, c) => ({
      question: `Agar ${a}/${b} = x/${b * c} bo'lsa, x ning qiymati qanday?`,
      answer: a * c,
    }),
  },
  {
    title: 'Teskari son',
    build: (a, b) => ({
      question: `Agar x soni ${a} ning teskarisi bo'lsa, ${a} * x + ${b} qanchaga teng?`,
      answer: 1 + b,
    }),
  }
]

const physicsTemplates = [
  {
    title: 'Yo\'l',
    build: (v, t) => ({
      question: `Jism ${v} m/s tezlik bilan ${t} s harakat qilsa, bosib o'tgan yo'l qanday bo'ladi?`,
      answer: v * t,
    }),
  },
  {
    title: 'Tezlik',
    build: (s, t) => ({
      question: `Jism ${s} m masofani ${t} s da bosib o'tsa, o'rtacha tezligi qanday bo'ladi?`,
      answer: s / t,
    }),
  },
  {
    title: 'Kuch',
    build: (m, a) => ({
      question: `${m} kg massali jism ${a} m/s² tezlanish bilan harakatlansa, kuchi nechaga teng?`,
      answer: m * a,
    }),
  },
  {
    title: 'Issiqlik',
    build: (m, c, dt) => ({
      question: `${m} kg massali moddaga ${c} J/(kg·°C) solishtirma issiqlik sig'imi bo'lsa, ${dt}°C qizib ketganda ajralgan issiqlik miqdori qancha bo'ladi?`,
      answer: m * c * dt,
    }),
  },
  {
    title: 'Kinetik energiya',
    build: (m, v) => ({
      question: `${m} kg massali jism ${v} m/s tezlik bilan harakatlansa, kinetik energiyasi qancha bo'ladi?`,
      answer: 0.5 * m * v * v,
    }),
  },
  {
    title: 'Balandlik',
    build: (h, t) => ({
      question: `Erkin tushishdan ${h} m balandlikdan tushayotgan jism ${t} s da necha marta tezlashadi?`,
      answer: h / t,
    }),
  },
  {
    title: 'Potensial energiya',
    build: (v, t, s, m, a, c, dt, h) => ({
      question: `${m} kg massali jism ${h} m balandlikda turgan bo'lsa, uning potensial energiyasi qanday? (g=10 m/s²)`,
      answer: m * 10 * h,
    }),
  },
  {
    title: 'Quvvat',
    build: (v, t, s) => ({
      question: `Dvigatel ${s} J ishni ${t} sekundda bajarsa, uning quvvati qanday (Vt)?`,
      answer: s / t,
    }),
  },
  {
    title: 'Bosim',
    build: (v, t, s, m, a) => ({
      question: `${s} N kuch ${a} m² yuzaga ta'sir etsa, qanday bosim hosil bo'ladi (Pa)?`,
      answer: s / a,
    }),
  },
  {
    title: 'Tok kuchi',
    build: (v, t, s, m, a, c) => ({
      question: `Zanjirning kuchlanishi ${v} V, qarshiligi ${c} Om bo'lsa, tok kuchi qancha (A)?`,
      answer: v / c,
    }),
  },
  {
    title: 'Qarshilik',
    build: (v, t, s, m, a) => ({
      question: `Zanjirning kuchlanishi ${v} V, tok kuchi ${a} A bo'lsa, qarshilik qancha (Om)?`,
      answer: v / a,
    }),
  },
  {
    title: 'Tezlanish',
    build: (v, t) => ({
      question: `Jismning tezligi ${t} sekund ichida ${v} m/s ga o'zgarsa, uning tezlanishi qanday (m/s²)?`,
      answer: v / t,
    }),
  },
  {
    title: 'Chastota',
    build: (v, t) => ({
      question: `To'lqin davri ${t} sekund bo'lsa, uning chastotasi qanday (Gts)?`,
      answer: 1 / t,
    }),
  },
  {
    title: 'Impuls',
    build: (v, t, s, m) => ({
      question: `${m} kg massali jism ${v} m/s tezlik bilan harakatlansa, uning impulsi qancha (kg·m/s)?`,
      answer: m * v,
    }),
  },
  {
    title: 'Zichlik',
    build: (v, t, s, m) => ({
      question: `Moddaning massasi ${s} kg va hajmi ${m} m³ bo'lsa, uning zichligi qanday (kg/m³)?`,
      answer: s / m,
    }),
  },
  {
    title: 'Ish',
    build: (v, t, s, m) => ({
      question: `Jismga ${m} N kuch ta'sir etib, u ${s} metr masofaga siljisa, qilingan ish qancha (J)?`,
      answer: m * s,
    }),
  }
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

const createComputerQuestions = () => {
  const baseQuestions = [
    {
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
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Hard diskning asosiy vazifasi nima?',
      answer: 'Ma\'lumotlarni doimiy tarzda saqlash',
      options: [
        'Ma\'lumotlarni doimiy tarzda saqlash',
        'Tizim tezligini oshirish',
        'Foydalanuvchi klaviaturasi',
        'Internet bilan bog\'lanish',
        'Ona ekranini o\'zgartirish',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Asosiy plata (Motherboard) kompyuterda qanday vazifa bajaradi?',
      answer: 'Barcha qismlarni bir-biriga bog\'laydi',
      options: [
        'Barcha qismlarni bir-biriga bog\'laydi',
        'Faqat elektr bilan ta\'minlaydi',
        'Rasmlarni chizadi',
        'Internetni ulaydi',
        'Fayllarni saqlaydi',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'GPU (Grafik protsessor) nima uchun kerak?',
      answer: 'Tasvir va videolarni qayta ishlash uchun',
      options: [
        'Tasvir va videolarni qayta ishlash uchun',
        'Fayllarni yuklab olish uchun',
        'Musiqani saqlash uchun',
        'Tarmoq yaratish uchun',
        'Matn yozish uchun',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'SSD ning HDD dan asosiy ustunligi nima?',
      answer: 'Ma\'lumotlarni tezroq o\'qish va yozish',
      options: [
        'Ma\'lumotlarni tezroq o\'qish va yozish',
        'Ogirroq bo\'lishi',
        'Faqat matnlarni saqlashi',
        'Elektr sarfini ko\'paytirishi',
        'Viruslardan to\'liq himoyalashi',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'BIOS ning vazifasi nima?',
      answer: 'Operatsion tizimni yuklashdan oldin apparatni tekshirish',
      options: [
        'Operatsion tizimni yuklashdan oldin apparatni tekshirish',
        'Viruslarni tozalash',
        'Internetni tezlashtirish',
        'O\'yinlarni o\'rnatish',
        'Grafikani yaxshilash',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'IP manzil nima uchun ishlatiladi?',
      answer: 'Tarmoqdagi qurilmani aniqlash uchun',
      options: [
        'Tarmoqdagi qurilmani aniqlash uchun',
        'Kompyuter parolini tiklash uchun',
        'Qattiq diskni tozalash uchun',
        'Fayl hajmini qisqartirish uchun',
        'Virus tarqatish uchun',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'DNS tizimi qanday vazifani bajaradi?',
      answer: 'Domen nomlarini IP manzillarga aylantiradi',
      options: [
        'Domen nomlarini IP manzillarga aylantiradi',
        'Kompyuterni o\'chiradi',
        'Tarmoqni uzadi',
        'Ovoz sifatini yaxshilaydi',
        'Elektr ta\'minotini boshqaradi',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Xavfsizlik devori (Firewall) qanday ishlaydi?',
      answer: 'Ruxsatsiz tarmoq trafigini to\'sib qo\'yadi',
      options: [
        'Ruxsatsiz tarmoq trafigini to\'sib qo\'yadi',
        'Barcha saytlarni yopadi',
        'Faqat viruslarni topadi',
        'Parollarni saqlaydi',
        'Internet tezligini oshiradi',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Kompyuter virusi nima?',
      answer: 'Tizimga zarar yetkazuvchi zararli dastur',
      options: [
        'Tizimga zarar yetkazuvchi zararli dastur',
        'Foydali antivirus',
        'Yangi o\'yin',
        'Qurilmaning bir qismi',
        'Internet tarmog\'i',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Ma\'lumotlar bazasi (Database) nima uchun kerak?',
      answer: 'Ma\'lumotlarni tartibli saqlash va boshqarish uchun',
      options: [
        'Ma\'lumotlarni tartibli saqlash va boshqarish uchun',
        'Tasvirlarni tahrirlash uchun',
        'Ovoz yozish uchun',
        'Faqat o\'yin o\'ynash uchun',
        'Kompyuterni isitish uchun',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Algoritm nima?',
      answer: 'Muammoni hal qilish uchun aniq qadamlar ketma-ketligi',
      options: [
        'Muammoni hal qilish uchun aniq qadamlar ketma-ketligi',
        'Internet brauzeri',
        'Dasturlash tili',
        'Kompyuter qismi',
        'Tarmoq kabeli',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Binar kod nima?',
      answer: '0 va 1 raqamlaridan iborat ma\'lumotlar ko\'rinishi',
      options: [
        '0 va 1 raqamlaridan iborat ma\'lumotlar ko\'rinishi',
        'Faqat harflardan iborat kod',
        'Tarmoq paroli',
        'Virus turi',
        'Veb-sayt manzili',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Dasturlash tili nima maqsadda ishlatiladi?',
      answer: 'Kompyuterga tushunarli buyruqlar berish uchun',
      options: [
        'Kompyuterga tushunarli buyruqlar berish uchun',
        'Odamlar o\'zaro gaplashishi uchun',
        'Faqat rasmlar chizish uchun',
        'Tarmoqni uzish uchun',
        'Xotirani tozalash uchun',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Bulutli hisoblash (Cloud computing) nima?',
      answer: 'Internet orqali kompyuter resurslaridan foydalanish',
      options: [
        'Internet orqali kompyuter resurslaridan foydalanish',
        'Yomg\'irli havoda kompyuter ishlatish',
        'Faqat o\'yinlar o\'ynash xizmati',
        'Printerga ulanish',
        'Kompyuter ekranini yoritish',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Virtual xotira nima uchun ishlatiladi?',
      answer: 'RAM yetishmaganda qattiq diskdan qo\'shimcha xotira sifatida foydalanish',
      options: [
        'RAM yetishmaganda qattiq diskdan qo\'shimcha xotira sifatida foydalanish',
        'Internetni tezlashtirish uchun',
        'Fayllarni shifrlash uchun',
        'Videolarni yuklash uchun',
        'Parollarni saqlash uchun',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Kesh (Cache) xotira nima vazifa bajaradi?',
      answer: 'Tezkor kirish talab qilinadigan ma\'lumotlarni vaqtincha saqlash',
      options: [
        'Tezkor kirish talab qilinadigan ma\'lumotlarni vaqtincha saqlash',
        'Barcha fayllarni doimiy saqlash',
        'Kompyuterni sovitish',
        'Viruslarni o\'chirish',
        'Foydalanuvchi IP manzilini yashirish',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'USB porti orqali qanday amal bajariladi?',
      answer: 'Tashqi qurilmalarni kompyuterga ulash',
      options: [
        'Tashqi qurilmalarni kompyuterga ulash',
        'Ichki xotirani o\'chirish',
        'Operatsion tizimni yangilash',
        'Ekran o\'lchamini o\'zgartirish',
        'Protsessorni almashtirish',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'LAN (Local Area Network) nima?',
      answer: 'Kichik hududdagi kompyuterlar tarmog\'i',
      options: [
        'Kichik hududdagi kompyuterlar tarmog\'i',
        'Global internet tarmog\'i',
        'Simsiz sichqoncha ulanishi',
        'Faqat bitta kompyuter',
        'Veb-saytlar to\'plami',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Fayl kengaytmasi nima uchun kerak?',
      answer: 'Faylning qanday formatda ekanligini bildirish uchun',
      options: [
        'Faylning qanday formatda ekanligini bildirish uchun',
        'Fayl hajmini oshirish uchun',
        'Parol qo\'yish uchun',
        'Virusdan himoya qilish uchun',
        'Faylni o\'chirib tashlash uchun',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Zaxira nusxa (Backup) nima uchun olinadi?',
      answer: 'Ma\'lumotlar yo\'qolganda qayta tiklash uchun',
      options: [
        'Ma\'lumotlar yo\'qolganda qayta tiklash uchun',
        'Xotirani to\'ldirish uchun',
        'Internetni tezlashtirish uchun',
        'Dasturlarni o\'chirish uchun',
        'Yangi fayl yaratish uchun',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Ma\'lumotlarni shifrlash (Encryption) maqsadi nima?',
      answer: 'Ma\'lumotlarni faqat ruxsat etilganlar o\'qiy olishi uchun xavfsiz holatga keltirish',
      options: [
        'Ma\'lumotlarni faqat ruxsat etilganlar o\'qiy olishi uchun xavfsiz holatga keltirish',
        'Fayllarni ommaga e\'lon qilish',
        'Kompuyter ishlashini sekinlashtirish',
        'Fayl hajmini oshirish',
        'Rasmlarni rangsizlantirish',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Router qanday vazifa bajaradi?',
      answer: 'Tarmoqlar o\'rtasida ma\'lumotlar paketini yo\'naltiradi',
      options: [
        'Tarmoqlar o\'rtasida ma\'lumotlar paketini yo\'naltiradi',
        'Ekran tasvirini chiqaradi',
        'Musiqa chaladi',
        'Fayllarni o\'chiradi',
        'Kompyuterni yoqadi',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Veb-brauzer nima uchun ishlatiladi?',
      answer: 'Internetdagi veb-saytlarni ko\'rish uchun',
      options: [
        'Internetdagi veb-saytlarni ko\'rish uchun',
        'Faqat matn tahrirlash uchun',
        'Kompyuter sozlamalarini o\'zgartirish uchun',
        'Oflayn o\'yinlar o\'ynash uchun',
        'Fayllarni guruhlash uchun',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'HTTPS ning HTTP dan farqi nima?',
      answer: 'HTTPS ma\'lumotlarni shifrlangan xavfsiz ulanish orqali uzatadi',
      options: [
        'HTTPS ma\'lumotlarni shifrlangan xavfsiz ulanish orqali uzatadi',
        'HTTP tezroq va xavfsizroq',
        'HTTPS faqat rasm yuklaydi',
        'Hech qanday farqi yo\'q',
        'HTTPS oflayn ishlaydi',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'API qanday vazifani bajaradi?',
      answer: 'Turli xil dasturlarning o\'zaro aloqa qilishiga imkon beradi',
      options: [
        'Turli xil dasturlarning o\'zaro aloqa qilishiga imkon beradi',
        'Faqat viruslarni aniqlaydi',
        'Ekranda ranglarni o\'zgartiradi',
        'Tarmoq kabeli hisoblanadi',
        'Qattiq diskni tozalaydi',
      ],
    },
    {
      type: 'computer',
      category: 'Kompyuter',
      question: 'Buyruqlar satri (Command line) nima uchun ishlatiladi?',
      answer: 'Kompyuterga matn ko\'rinishidagi buyruqlar berish uchun',
      options: [
        'Kompyuterga matn ko\'rinishidagi buyruqlar berish uchun',
        'Faqat grafik chizish uchun',
        'Video ko\'rish uchun',
        'Sichqonchani sozlash uchun',
        'Veb-sayt dizaynini yaratish uchun',
      ],
    },
  ]

  return Array.from({ length: 1500 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `computer-${index + 1}`,
      ...template,
      question: `${template.question} (${index + 1})`,
      options: shuffle(template.options),
    }
  })
}

const createCppQuestions = () => {
  const baseQuestions = [
    {
      type: 'cpp',
      category: 'C++',
      question: 'C++ tilida `#include <iostream>` nima maqsadda ishlatiladi?',
      answer: 'Standart input-output kutubxonasini qo\'shish uchun',
      options: [
        'Standart input-output kutubxonasini qo\'shish uchun',
        'Faylni ochish uchun',
        'Matnlarni o\'chirish uchun',
        'Mantiqiy shartlarni bajarish uchun',
        'Sahifani chizish uchun',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: '`cout` nima vazifani bajaradi?',
      answer: 'Konsolga chiqish uchun ma\'lumotni chiqaradi',
      options: [
        'Konsolga chiqish uchun ma\'lumotni chiqaradi',
        'Fayllardan o\'qish uchun ishlatiladi',
        'Sonlarni faqat hisoblaydi',
        'Dasturni yozib beradi',
        'Mantiqiy tekshiruvni ishlatadi',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'C++ tilida `int` ma\'lumot turi nima uchun ishlatiladi?',
      answer: 'Butun sonlarni saqlash uchun',
      options: [
        'Butun sonlarni saqlash uchun',
        'Satrlarni saqlash uchun',
        'Real sonlarni saqlash uchun',
        'Barcha ma\'lumotlarni diskka yozish uchun',
        'Funktsiyalarni saqlash uchun',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: '`for` sikli nima uchun ishlatiladi?',
      answer: 'Takrorlanadigan amallarni ma\'lum sonlar uchun bajarish',
      options: [
        'Takrorlanadigan amallarni ma\'lum sonlar uchun bajarish',
        'Faqat bitta amalni bajarish',
        'Dasturni to\'xtatish',
        'Matnlarni tekislash',
        'Barcha qiymatlarni serverga jo\'natish',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'C++ da `class` nima?',
      answer: 'Obyektga yo\'naltirilgan dasturlash uchun ma\'lumotlar va metodlarni birlashtiruvchi shablon',
      options: [
        'Obyektga yo\'naltirilgan dasturlash uchun ma\'lumotlar va metodlarni birlashtiruvchi shablon',
        'Faqat alohida o\'zgaruvchi',
        'Konsolni tozalovchi funksiya',
        'Barcha foydalanuvchi ma\'lumotlarini saqlash',
        'Satrlarni qirqish uchun vosita',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'Ko\'rsatkich (Pointer) nima vazifa bajaradi?',
      answer: 'Boshqa o\'zgaruvchining xotira manzilini saqlaydi',
      options: [
        'Boshqa o\'zgaruvchining xotira manzilini saqlaydi',
        'Faqat matnlarni birlashtiradi',
        'Massivni o\'chiradi',
        'Dastur xatosini yashiradi',
        'Avtomatik qiymat beradi',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'Shablonlar (Templates) nima uchun kerak?',
      answer: 'Turli xil ma\'lumotlar turlari bilan ishlay oladigan umumiy funksiya yoki sinflar yaratish uchun',
      options: [
        'Turli xil ma\'lumotlar turlari bilan ishlay oladigan umumiy funksiya yoki sinflar yaratish uchun',
        'Faqat HTML sahifa yaratish uchun',
        'Xotirani tozalash uchun',
        'Konsol rangini o\'zgartirish uchun',
        'Fayldan ma\'lumot o\'qish uchun',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'STL `std::vector` nima?',
      answer: 'Dinamik o\'lchamli massiv',
      options: [
        'Dinamik o\'lchamli massiv',
        'Faqat satrlarni saqlovchi o\'zgaruvchi',
        'Matematik funksiya',
        'O\'zgaruvchilar to\'plami (struct)',
        'Xotira tozalovchi obyekt',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: '`std::map` qanday ma\'lumot tuzilmasi?',
      answer: 'Kalit va qiymat (key-value) juftliklarini saqlaydigan tuzilma',
      options: [
        'Kalit va qiymat (key-value) juftliklarini saqlaydigan tuzilma',
        'Faqat raqamlarni saqlaydigan ro\'yxat',
        'Xaritalar chizish vositasi',
        'Doimiy massiv',
        'Obyektlarni o\'chiradigan funksiya',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: '`std::set` ning asosiy xususiyati nima?',
      answer: 'Takrorlanmas elementlarni tartiblangan holda saqlaydi',
      options: [
        'Takrorlanmas elementlarni tartiblangan holda saqlaydi',
        'Elementlarni ixtiyoriy tartibda saqlaydi',
        'Faqat juft sonlarni saqlaydi',
        'Barcha elementlarni o\'chirib turadi',
        'Faqat manfiy sonlarni qabul qiladi',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'Vorislik (Inheritance) nima?',
      answer: 'Bir sinfning boshqa sinf xususiyatlarini va metodlarini qabul qilishi',
      options: [
        'Bir sinfning boshqa sinf xususiyatlarini va metodlarini qabul qilishi',
        'Sinfni butunlay o\'chirish',
        'Ikki sinfni hech qanday bog\'liqsiz yaratish',
        'Faqat o\'zgaruvchilarni nusxalash',
        'Xotirani tejash usuli',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'Polimorfizm qanday tushuncha?',
      answer: 'Turli sinf obyektlarining bir xil interfeys orqali turlicha harakat qilishi',
      options: [
        'Turli sinf obyektlarining bir xil interfeys orqali turlicha harakat qilishi',
        'Obyektlarni xotirada yashirish',
        'Sinflarni himoyalash',
        'Faqat bir xil funksiyalarni ishlatish',
        'Sinflarni birlashtirib o\'chirish',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'Virtual funksiyalar nima uchun kerak?',
      answer: 'Hosilaviy (voris) sinflarda qayta yozilishi mumkin bo\'lgan funksiyalarni yaratish uchun',
      options: [
        'Hosilaviy (voris) sinflarda qayta yozilishi mumkin bo\'lgan funksiyalarni yaratish uchun',
        'Funksiyalarni xotiradan yashirish uchun',
        'Internetga ulanish uchun',
        'Dasturni tezlashtirish uchun',
        'Xatolarni to\'g\'rilash uchun',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'Operatorlarni qayta yuklash (Overloading) nima?',
      answer: 'Standart operatorlarga foydalanuvchi sinflari uchun maxsus ma\'no berish',
      options: [
        'Standart operatorlarga foydalanuvchi sinflari uchun maxsus ma\'no berish',
        'Barcha operatorlarni dasturdan olib tashlash',
        'Matematik operatorlarni ishlashini to\'xtatish',
        'Faqat qo\'shish operatorini ishlatish',
        'Sinfni qayta yuklash',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: '`try/catch` bloklari nima uchun ishlatiladi?',
      answer: 'Dastur ishlash jarayonidagi xatoliklarni ushlab, ularni qayta ishlash uchun',
      options: [
        'Dastur ishlash jarayonidagi xatoliklarni ushlab, ularni qayta ishlash uchun',
        'Faqat fayllarni yuklab olish uchun',
        'Konsolni tozalash uchun',
        'Vaqtni o\'lchash uchun',
        'Obyektlarni nusxalash uchun',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: '`namespace` qanday vazifa bajaradi?',
      answer: 'Identifikatorlar o\'rtasida nomlar to\'qnashuvini oldini olish uchun ishlatiladi',
      options: [
        'Identifikatorlar o\'rtasida nomlar to\'qnashuvini oldini olish uchun ishlatiladi',
        'Xotirani ajratadi',
        'Fayllarni boshqaradi',
        'Internet tarmog\'ini sozlaydi',
        'Kodni shifrlaydi',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'Konstruktor nima?',
      answer: 'Sinf obyekti yaratilganda avtomatik chaqiriladigan maxsus metod',
      options: [
        'Sinf obyekti yaratilganda avtomatik chaqiriladigan maxsus metod',
        'Kodni buzuvchi vosita',
        'Xotirani tozalovchi funksiya',
        'Sinfni o\'chiruvchi obyekt',
        'Boshqa faylga yo\'naltiruvchi modul',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'Destruktor qachon chaqiriladi?',
      answer: 'Sinf obyekti xotiradan o\'chirilayotganda',
      options: [
        'Sinf obyekti xotiradan o\'chirilayotganda',
        'Dastur endi boshlanayotganda',
        'Matn chiqarilayotganda',
        'Fayl saqlanayotganda',
        'Faqat xato yuz berganda',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: '`private` kirish modifikatori nima vazifa bajaradi?',
      answer: 'Sinf elementlariga faqat shu sinf ichidan murojaat qilishga ruxsat beradi',
      options: [
        'Sinf elementlariga faqat shu sinf ichidan murojaat qilishga ruxsat beradi',
        'Sinf elementlarini barchaga ochiq qiladi',
        'Dasturni parollaydi',
        'Internetga ulanishni yopadi',
        'Obyektni o\'chirib yuboradi',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: '`static` o\'zgaruvchi qanday xususiyatga ega?',
      answer: 'Funksiya tugasa ham qiymatini yo\'qotmaydi va butun dastur davomida saqlanadi',
      options: [
        'Funksiya tugasa ham qiymatini yo\'qotmaydi va butun dastur davomida saqlanadi',
        'Har chaqirilganda qayta yaratiladi',
        'Faqat satrlarni saqlaydi',
        'Obyekt bilan birga o\'chib ketadi',
        'Sinf ichida umuman ishlatilmaydi',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: '`#define` direktivasi nima uchun ishlatiladi?',
      answer: 'Makroslar yaratish va konstantalarni e\'lon qilish uchun',
      options: [
        'Makroslar yaratish va konstantalarni e\'lon qilish uchun',
        'Fayllarni o\'chirish uchun',
        'Xotirani tozalash uchun',
        'Dasturni yopish uchun',
        'Faqat izoh yozish uchun',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'Tur konversiyasi (Type casting) nima?',
      answer: 'Bir ma\'lumot turidagi qiymatni boshqa ma\'lumot turiga o\'zgartirish',
      options: [
        'Bir ma\'lumot turidagi qiymatni boshqa ma\'lumot turiga o\'zgartirish',
        'Fayl turini o\'zgartirish',
        'Faqat raqamlarni harfga o\'zgartirish',
        'Obyektni o\'chirish',
        'Kodni avtomatik to\'g\'rilash',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: '`new` va `delete` operatorlari nima qiladi?',
      answer: 'Dinamik xotira ajratadi va uni bo\'shatadi',
      options: [
        'Dinamik xotira ajratadi va uni bo\'shatadi',
        'Yangi fayl ochadi va uni o\'chiradi',
        'Faqat matnlarni tahrirlaydi',
        'Obyektni faqat nusxalaydi',
        'Funksiyalarni yangilaydi',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'Lambda ifodasi nima?',
      answer: 'Nomsiz, qisqa va inkapsulyatsiya qilingan funksiya obyekti',
      options: [
        'Nomsiz, qisqa va inkapsulyatsiya qilingan funksiya obyekti',
        'Faqat satrlarni qirqish uchun funksiya',
        'O\'yin grafikasi yaratuvchi modul',
        'Fayllarni formatlovchi vosita',
        'Matematik doimiy son',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'Fayllar bilan ishlashda `<fstream>` nima uchun kerak?',
      answer: 'Fayllarni o\'qish va yozish uchun zarur sinflarni taqdim etadi',
      options: [
        'Fayllarni o\'qish va yozish uchun zarur sinflarni taqdim etadi',
        'Ekranga rasm chiqarish uchun',
        'Xotirani boshqarish uchun',
        'Tarmoq paketlarini kuzatish uchun',
        'Faqat fayllarni o\'chirish uchun',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'C++ da `std::string` nima?',
      answer: 'Belgilar ketma-ketligini (matnni) saqlovchi va ishlashni osonlashtiruvchi sinf',
      options: [
        'Belgilar ketma-ketligini (matnni) saqlovchi va ishlashni osonlashtiruvchi sinf',
        'Faqat butun sonlarni saqlovchi tur',
        'Matematik tenglama',
        'Tarmoq manzili',
        'Massivning faqat bir belgisi',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: '`enum` nima maqsadida ishlatiladi?',
      answer: 'Nomlangan konstantalar to\'plamini yaratish uchun',
      options: [
        'Nomlangan konstantalar to\'plamini yaratish uchun',
        'Obyektlarni qidirish uchun',
        'Tasvir fayllarini yuklash uchun',
        'Sinfni meros qilib olish uchun',
        'Faqat shart operatorlarini yozish uchun',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'C++ da `struct` va `class` o\'rtasidagi asosiy farq nima?',
      answer: '`struct` da elementlar sukut bo\'yicha public, `class` da esa private bo\'ladi',
      options: [
        '`struct` da elementlar sukut bo\'yicha public, `class` da esa private bo\'ladi',
        'Ularning hech qanday farqi yo\'q',
        '`struct` faqat sonlarni, `class` faqat matnlarni saqlaydi',
        '`struct` funksiya yarata olmaydi',
        '`class` xotirada joy egallamaydi',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: 'Bitwise operatorlari (masalan, `&`, `|`) nima qiladi?',
      answer: 'Ma\'lumotlarni bit darajasida (0 va 1) manipulyatsiya qiladi',
      options: [
        'Ma\'lumotlarni bit darajasida (0 va 1) manipulyatsiya qiladi',
        'Matnlarni bo\'laklarga ajratadi',
        'Fayllarni siqish uchun xizmat qiladi',
        'Obyektlarni biriktiradi',
        'Xatolarni tekshiradi',
      ],
    },
    {
      type: 'cpp',
      category: 'C++',
      question: '`switch` bayonoti qachon ishlatiladi?',
      answer: 'Bitta o\'zgaruvchining ko\'p sonli mumkin bo\'lgan qiymatlarini tekshirish uchun',
      options: [
        'Bitta o\'zgaruvchining ko\'p sonli mumkin bo\'lgan qiymatlarini tekshirish uchun',
        'Sikllarni to\'xtatish uchun',
        'Fayldan faqat bir qatorni o\'qish uchun',
        'Obyekt yaratish uchun',
        'Kodni yashirish uchun',
      ],
    },
  ]

  return Array.from({ length: 1500 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `cpp-${index + 1}`,
      ...template,
      question: `${template.question} (${index + 1})`,
      options: shuffle(template.options),
    }
  })
}

const createMathQuestions = () => {
  return Array.from({ length: 2000 }, (_, index) => {
    const template = mathTemplates[index % mathTemplates.length]
    const a = randomInt(2, 30)
    const b = randomInt(2, 40)
    const c = randomInt(3, 50)
    const p = randomInt(5, 95)
    const generated = template.build(a, b, c, p)
    const answer = Number(generated.answer.toFixed(2))

    return {
      id: `math-${index + 1}`,
      type: 'math',
      category: 'Matematika',
      question: `${generated.question} (${index + 1})`,
      answer,
      options: shuffle(buildOptionSet(answer)),
    }
  })
}

const createPhysicsQuestions = () => {
  return Array.from({ length: 2000 }, (_, index) => {
    const template = physicsTemplates[index % physicsTemplates.length]
    const v = randomInt(5, 40)
    const t = randomInt(2, 12)
    const s = randomInt(20, 200)
    const m = randomInt(2, 25)
    const a = randomInt(1, 12)
    const c = randomInt(3, 20)
    const dt = randomInt(2, 30)
    const h = randomInt(10, 100)
    const generated = template.build(v, t, s, m, a, c, dt, h)
    const answer = Number(generated.answer.toFixed(2))

    return {
      id: `physics-${index + 1}`,
      type: 'physics',
      category: 'Fizika',
      question: `${generated.question} (${index + 1})`,
      answer,
      options: shuffle(buildOptionSet(answer)),
    }
  })
}

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

const createChemistryQuestions = () => {
  const baseQuestions = [
    { type: 'chemistry', category: 'Kimyo', question: 'Atom nima?', answer: 'Moddaning kimyoviy bo\'linmas eng kichik zarrasi', options: ['Moddaning kimyoviy bo\'linmas eng kichik zarrasi', 'Faqat elektrondan iborat zarracha', 'Gaz holatidagi modda', 'Suyuqlikning tarkibiy qismi', 'Yorug\'lik nuri'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Molekula nima?', answer: 'Moddaning kimyoviy xossalarini saqlovchi eng kichik zarrasi', options: ['Moddaning kimyoviy xossalarini saqlovchi eng kichik zarrasi', 'Atomning markaziy qismi', 'Elektr toki tashuvchisi', 'Magnit maydon elementi', 'Yorug\'lik manbai'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Kimyoviy element nima?', answer: 'Yadro zaryadi bir xil bo\'lgan atomlar turi', options: ['Yadro zaryadi bir xil bo\'lgan atomlar turi', 'Murakkab modda', 'Eritma tarkibi', 'Organik modda', 'Katalizator turi'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Davriy jadval (Mendeleyev jadvali) nima?', answer: 'Elementlarning atom massasi va xossalariga ko\'ra tizimi', options: ['Elementlarning atom massasi va xossalariga ko\'ra tizimi', 'Matematik jadvallar to\'plami', 'Fizik kattaliklar jadvali', 'Tarixiy sanalar ro\'yxati', 'Geografik xaritalar to\'plami'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Valentlik nima?', answer: 'Atomning boshqa atomlarni biriktirib olish xususiyati', options: ['Atomning boshqa atomlarni biriktirib olish xususiyati', 'Moddaning erish harorati', 'Elektr o\'tkazuvchanlik xususiyati', 'Moddaning zichligi', 'Atomning massasi'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Oksidlanish nima?', answer: 'Elektron berish jarayoni', options: ['Elektron berish jarayoni', 'Elektron olish jarayoni', 'Proton berish jarayoni', 'Neytron olish jarayoni', 'Yadro bo\'linishi'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Qaytarilish nima?', answer: 'Elektron biriktirib olish jarayoni', options: ['Elektron biriktirib olish jarayoni', 'Elektron berish jarayoni', 'Proton berish jarayoni', 'Neytron olish jarayoni', 'Moddaning erishi'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Kislota nima?', answer: 'Vodorod kationi va kislota qoldig\'idan iborat modda', options: ['Vodorod kationi va kislota qoldig\'idan iborat modda', 'Faqat kisloroddan iborat modda', 'Tuzlarning bir turi', 'Asosiy metall', 'Inert gaz'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Asos (ishqor) nima?', answer: 'Metall atomi va gidroksid guruhidan iborat modda', options: ['Metall atomi va gidroksid guruhidan iborat modda', 'Suvsiz tuz', 'Vodorod birikmasi', 'Kislota qoldig\'i', 'Organik hal qiluvchi'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Tuz nima?', answer: 'Metall kationi va kislota qoldig\'idan iborat modda', options: ['Metall kationi va kislota qoldig\'idan iborat modda', 'Faqat karbonat angidrid', 'Toza suv', 'Suyuq metal', 'Faqat vodoroddan iborat'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Kimyoviy bog\' turlari', answer: 'Kovalent, ion, metall, vodorod', options: ['Kovalent, ion, metall, vodorod', 'Fizik, kimyoviy, biologik', 'Qattiq, suyuq, gaz', 'Organik, anorganik', 'Oddiy, murakkab'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Ion nima?', answer: 'Zaryadlangan zarracha', options: ['Zaryadlangan zarracha', 'Zaryadsiz zarracha', 'Faqat musbat zaryadli zarracha', 'Faqat manfiy zaryadli zarracha', 'Neytral atom'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Elektron nima?', answer: 'Manfiy zaryadli elementar zarracha', options: ['Manfiy zaryadli elementar zarracha', 'Musbat zaryadli zarracha', 'Zaryadsiz zarracha', 'Atom yadrosi', 'Yorug\'lik kvanti'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Proton nima?', answer: 'Musbat zaryadli elementar zarracha', options: ['Musbat zaryadli elementar zarracha', 'Manfiy zaryadli zarracha', 'Zaryadsiz zarracha', 'Elektron qavati', 'Molekula qismi'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Neytron nima?', answer: 'Zaryadsiz elementar zarracha', options: ['Zaryadsiz elementar zarracha', 'Musbat zaryadli zarracha', 'Manfiy zaryadli zarracha', 'Elektron buluti', 'Kation turi'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Massa saqlanish qonuni', answer: 'Reaksiyaga kirishuvchi moddalar massasi hosil bo\'lgan moddalar massasiga teng', options: ['Reaksiyaga kirishuvchi moddalar massasi hosil bo\'lgan moddalar massasiga teng', 'Massaning harorati doimiy', 'Bosim va hajm o\'zgarishi', 'Reaksiya tezligi qonuni', 'Energiya saqlanishi'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Izotoplar nima?', answer: 'Yadro zaryadi bir xil, massasi har xil atomlar', options: ['Yadro zaryadi bir xil, massasi har xil atomlar', 'Faqat elektronlari farq qiladigan atomlar', 'Neytronlari bo\'lmagan atomlar', 'Faqat gaz moddalar', 'Har xil element atomlari'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Kimyoviy reaksiya turlari', answer: 'Birikish, ajralish, o\'rin olish, almashinish', options: ['Birikish, ajralish, o\'rin olish, almashinish', 'Qaynash, erish, muzlash', 'Fizik o\'zgarishlar', 'Faqat yonish', 'Bug\'lanish va kondensatsiya'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Katalizator nima?', answer: 'Reaksiya tezligini o\'zgartiruvchi, o\'zi sarflanmaydigan modda', options: ['Reaksiya tezligini o\'zgartiruvchi, o\'zi sarflanmaydigan modda', 'Reaksiyani to\'xtatuvchi modda', 'Reaksiyaga kirishuvchi asosiy modda', 'Hosil bo\'ladigan mahsulot', 'Reaksiya idishi'] },
    { type: 'chemistry', category: 'Kimyo', question: 'Eritma nima?', answer: 'Kamida ikkita komponentdan iborat bir jinsli sistema', options: ['Kamida ikkita komponentdan iborat bir jinsli sistema', 'Toza tozalangan suv', 'Faqat gazlar aralashmasi', 'Cho\'kma hosil bo\'lgan suyuqlik', 'Faqat bitta modda'] }
  ]

  return Array.from({ length: 1000 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `chemistry-${index + 1}`,
      ...template,
      question: `${template.question} (${index + 1})`,
      options: shuffle(template.options),
    }
  })
}

const createUzbekLanguageQuestions = () => {
  const baseQuestions = [
    { type: 'uzbek', category: 'Ona tili', question: 'Gap bo\'laklari (ega, kesim, to\'ldiruvchi, aniqlovchi, hol)', answer: 'Gapdagi so\'zlarning sintaktik vazifasiga ko\'ra turlari', options: ['Gapdagi so\'zlarning sintaktik vazifasiga ko\'ra turlari', 'So\'z yasalish usullari', 'Tinish belgilari turlari', 'Nutq tovushlari', 'So\'zning ma\'no ko\'chishlari'] },
    { type: 'uzbek', category: 'Ona tili', question: 'So\'z turkumlari (ot, sifat, fe\'l, ravish, son, olmosh)', answer: 'So\'zlarning leksik-grammatik jihatdan guruhlanishi', options: ['So\'zlarning leksik-grammatik jihatdan guruhlanishi', 'Gap bo\'laklari turlari', 'Morfemalar turlari', 'Gap turlari', 'Urg\'u turlari'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Undosh va unli tovushlar', answer: 'O\'pkadan chiqayotgan havoning to\'siqqa uchrashi yoki uchramasligiga ko\'ra tovushlar', options: ['O\'pkadan chiqayotgan havoning to\'siqqa uchrashi yoki uchramasligiga ko\'ra tovushlar', 'Faqat bo\'g\'in hosil qiluvchilar', 'Tinish belgilariga ta\'sir etuvchilar', 'So\'z yasalishi uchun xizmat qiluvchilar', 'Gap tuzilishini belgilovchilar'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Qo\'shma gap turlari', answer: 'Bog\'langan, ergashgan, bog\'lovchisiz', options: ['Bog\'langan, ergashgan, bog\'lovchisiz', 'Sodda va murakkab', 'Darak, so\'roq, buyruq', 'Yoyiq va yig\'iq', 'Egalik va kesimlik'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Bog\'lovchilar', answer: 'So\'zlarni yoki gaplarni o\'zaro bog\'lovchi yordamchi so\'zlar', options: ['So\'zlarni yoki gaplarni o\'zaro bog\'lovchi yordamchi so\'zlar', 'Mustaqil ma\'noga ega so\'zlar', 'Faqat gap bo\'lagi bo\'ladigan so\'zlar', 'So\'z yasovchi qo\'shimchalar', 'Tinish belgilari'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Tinish belgilari', answer: 'Nuqta, vergul, so\'roq, undov kabi yozuv belgilari', options: ['Nuqta, vergul, so\'roq, undov kabi yozuv belgilari', 'Unli harflar', 'Undosh harflar', 'So\'z turkumlari', 'Gap bo\'laklari'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Antonim, sinonim, omonim', answer: 'So\'zlarning ma\'noviy munosabatiga ko\'ra turlari', options: ['So\'zlarning ma\'noviy munosabatiga ko\'ra turlari', 'Gapning tuzilishi', 'Fe\'l zamonlari', 'Otlarning kelishiklari', 'Sifat darajalari'] },
    { type: 'uzbek', category: 'Ona tili', question: 'So\'z yasalishi', answer: 'Asosga yasovchi qo\'shimcha qo\'shish orqali yangi so\'z hosil qilish', options: ['Asosga yasovchi qo\'shimcha qo\'shish orqali yangi so\'z hosil qilish', 'So\'zlarni o\'zaro bog\'lash', 'Gapni bo\'laklarga ajratish', 'Tinish belgilarini qo\'yish', 'Unlilarni tahlil qilish'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Morfema turlari (ildiz, qo\'shimcha, prefiks, suffiks)', answer: 'So\'zning ma\'noli qismlari', options: ['So\'zning ma\'noli qismlari', 'Gapning tuzilish qismlari', 'Tovushlarning yozuvdagi ifodasi', 'Lug\'aviy ma\'nolar to\'plami', 'Nutq uslublari'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Fe\'l zamonlari', answer: 'O\'tgan, hozirgi, kelasi', options: ['O\'tgan, hozirgi, kelasi', 'Sodda, qo\'shma, juft', 'Bosh, ergash, bog\'lovchi', 'Aniqlik, mavhumlik', 'Asosiy, yordamchi'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Sifatdosh', answer: 'Ham fe\'l, ham sifat xususiyatiga ega bo\'lgan shakl', options: ['Ham fe\'l, ham sifat xususiyatiga ega bo\'lgan shakl', 'Faqat sifatni bildiruvchi', 'Ot va son xususiyatini birlashtiruvchi', 'Gapda faqat ega vazifasida keluvchi', 'Hech qanday qo\'shimcha olmaydigan shakl'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Ravishdosh', answer: 'Ham fe\'l, ham ravish xususiyatiga ega bo\'lgan shakl', options: ['Ham fe\'l, ham ravish xususiyatiga ega bo\'lgan shakl', 'Faqat vaqtni bildiruvchi', 'Ot o\'rnida qo\'llanuvchi', 'Har doim aniqlovchi bo\'luvchi', 'Faqat darak gaplarda keluvchi'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Harakat nomi', answer: 'Harakat yoki holatning nomini bildiruvchi fe\'l shakli', options: ['Harakat yoki holatning nomini bildiruvchi fe\'l shakli', 'Shaxs yoki narsaning nomi', 'Belgi-xususiyat nomi', 'Sanoq nomi', 'Faqat son bilan keladigan so\'z'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Ko\'makchi', answer: 'Mustaqil so\'zlarga tobelanib, ularning boshqa so\'zlarga munosabatini bildiruvchi so\'z', options: ['Mustaqil so\'zlarga tobelanib, ularning boshqa so\'zlarga munosabatini bildiruvchi so\'z', 'Gaplarni o\'zaro teng bog\'lovchi', 'Faqat egani ifodalovchi', 'Yangi so\'z yasovchi', 'Asosiy harakatni anglatuvchi'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Yuklamalar', answer: 'So\'z yoki gapga qo\'shimcha ma\'no beruvchi yordamchi so\'zlar', options: ['So\'z yoki gapga qo\'shimcha ma\'no beruvchi yordamchi so\'zlar', 'Faqat harakatni bildiruvchi so\'zlar', 'Ot va sifat o\'rtasidagi munosabat', 'Tinish belgilarining yozma shakli', 'So\'zlarni bo\'g\'inlarga ajratuvchi vosita'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Imlo qoidalari', answer: 'To\'g\'ri yozish qoidalari', options: ['To\'g\'ri yozish qoidalari', 'To\'g\'ri talaffuz qoidalari', 'Gap tuzish qoidalari', 'Matn o\'qish qoidalari', 'Lug\'at boyligi'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Gap turlari (darak, so\'roq, buyruq, undov)', answer: 'Maqsad va intonatsiyasiga ko\'ra gap turlari', options: ['Maqsad va intonatsiyasiga ko\'ra gap turlari', 'Tuzilishiga ko\'ra gap turlari', 'So\'z turkumlariga ko\'ra', 'Tinish belgilariga ko\'ra', 'Morfemalarga ko\'ra'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Urg\'u', answer: 'Bo\'g\'inning boshqalariga nisbatan kuchliroq aytilishi', options: ['Bo\'g\'inning boshqalariga nisbatan kuchliroq aytilishi', 'Harflarning yozma shakli', 'Gapdagi to\'xtam', 'So\'roq ma\'nosini berish', 'Tinish belgisining bir turi'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Bo\'g\'in', answer: 'So\'zning bir marta nafas chiqarish bilan aytiladigan qismi', options: ['So\'zning bir marta nafas chiqarish bilan aytiladigan qismi', 'Eng kichik ma\'noli qism', 'Gapning eng muhim qismi', 'So\'zdagi unlilar soni emas', 'Faqat undoshlardan iborat qism'] },
    { type: 'uzbek', category: 'Ona tili', question: 'Leksikologiya', answer: 'Tilning lug\'at tarkibini o\'rganuvchi bo\'lim', options: ['Tilning lug\'at tarkibini o\'rganuvchi bo\'lim', 'Tovushlarni o\'rganuvchi bo\'lim', 'Gap tuzilishini o\'rganuvchi', 'To\'g\'ri yozishni o\'rganuvchi', 'So\'z qismlarini o\'rganuvchi'] }
  ]

  return Array.from({ length: 1000 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `uzbek-${index + 1}`,
      ...template,
      question: `${template.question} (${index + 1})`,
      options: shuffle(template.options),
    }
  })
}

const createHistoryQuestions = () => {
  const baseQuestions = [
    { type: 'history', category: 'Tarix', question: 'Amir Temur kim?', answer: 'Buyuk sarkarda va davlat arbobi, Movarounnahr hukmdori', options: ['Buyuk sarkarda va davlat arbobi, Movarounnahr hukmdori', 'Qadimgi Misr fir\'avni', 'Yunon faylasufi', 'Rim imperatori', 'Boburiylar sulolasi asoschisi'] },
    { type: 'history', category: 'Tarix', question: 'Ulug\'bek rasadxonasi', answer: 'Samarqandda 15-asrda qurilgan astronomik kuzatuv markazi', options: ['Samarqandda 15-asrda qurilgan astronomik kuzatuv markazi', 'Buxorodagi qadimiy masjid', 'Xivadagi xon saroyi', 'Toshkentdagi muzey', 'Eron shohining qarorgohi'] },
    { type: 'history', category: 'Tarix', question: 'Buyuk Ipak yo\'li', answer: 'Sharq va G\'arbni bog\'lagan qadimiy savdo yo\'li', options: ['Sharq va G\'arbni bog\'lagan qadimiy savdo yo\'li', 'Dengiz qaroqchilari yo\'li', 'Faqat Xitoy ichidagi yo\'l', 'Hindiston va Afrikani bog\'lovchi yo\'l', 'Zamonaviy temir yo\'l tarmog\'i'] },
    { type: 'history', category: 'Tarix', question: 'O\'zbekiston mustaqilligi (1991)', answer: '1991-yil 1-sentyabrda e\'lon qilingan', options: ['1991-yil 1-sentyabrda e\'lon qilingan', '1989-yil 1-oktyabrda', '1992-yil 8-dekabrda', '1924-yil 27-oktyabrda', '1945-yil 9-mayda'] },
    { type: 'history', category: 'Tarix', question: 'Samarqand shahri', answer: 'Amir Temur davlatining poytaxti', options: ['Amir Temur davlatining poytaxti', 'Qoraxoniylar davlatining ilk poytaxti', 'Xiva xonligining markazi', 'Qo\'qon xonligi poytaxti', 'Mintaqadagi eng yosh shahar'] },
    { type: 'history', category: 'Tarix', question: 'Buxoro amirligi', answer: '1756-1920 yillarda O\'rta Osiyoda hukm surgan davlat', options: ['1756-1920 yillarda O\'rta Osiyoda hukm surgan davlat', 'Eron shohligiga qaram viloyat', 'Qadimgi Yunon-Baqtriya podsholigi', 'Faqat 19-asrda mavjud bo\'lgan', 'Afg\'onistonning bir qismi'] },
    { type: 'history', category: 'Tarix', question: 'Xorazm davlati', answer: 'Amudaryo quyi oqimida joylashgan qadimiy va o\'rta asrlar davlati', options: ['Amudaryo quyi oqimida joylashgan qadimiy va o\'rta asrlar davlati', 'Sirdaryo yuqori oqimidagi davlat', 'Qashqadaryo vohasidagi markaz', 'Kavkazortidagi kichik xonlik', 'Qadimgi Xitoy provinsiyasi'] },
    { type: 'history', category: 'Tarix', question: 'Temuriylar davlati', answer: '14-15 asrlarda Amir Temur va uning avlodlari boshqargan davlat', options: ['14-15 asrlarda Amir Temur va uning avlodlari boshqargan davlat', '11-12 asrlardagi davlat', 'Faqat Xurosonda joylashgan', 'Arab xalifaligi tarkibidagi amirlik', 'Qadimiy Rim provinsiyasi'] },
    { type: 'history', category: 'Tarix', question: 'Jadidchilik harakati', answer: '19-asr oxiri va 20-asr boshlaridagi ma\'rifatparvarlik harakati', options: ['19-asr oxiri va 20-asr boshlaridagi ma\'rifatparvarlik harakati', 'Diniy fundamentalistik harakat', 'Harbiy qo\'zg\'olonchilar to\'plami', 'Faqat savdogarlar uyushmasi', 'Chor Rossiyasining rasmiy siyosati'] },
    { type: 'history', category: 'Tarix', question: 'Alisher Navoiy', answer: 'Buyuk o\'zbek shoiri, mutafakkir va davlat arbobi', options: ['Buyuk o\'zbek shoiri, mutafakkir va davlat arbobi', 'Xorazmshohlar davlati hukmdori', 'Mashhur matematik olim', 'Tabib va faylasuf', 'Buxoro amiri'] },
    { type: 'history', category: 'Tarix', question: 'Abu Ali ibn Sino', answer: 'Buyuk qomusiy olim va tibbiyot ilmining sultoni', options: ['Buyuk qomusiy olim va tibbiyot ilmining sultoni', 'Astronomiya asoschisi', 'Buyuk geograf va sayyoh', 'Tarixchi olim', 'Harbiy sarkarda'] },
    { type: 'history', category: 'Tarix', question: 'Al-Xorazmiy', answer: 'Buyuk matematik va astronom, algebra fani asoschisi', options: ['Buyuk matematik va astronom, algebra fani asoschisi', 'Tibbiyot ilmining asoschisi', 'Mashhur adib va shoir', 'Temuriylar davri me\'mori', 'Huquqshunos olim'] },
    { type: 'history', category: 'Tarix', question: 'Qadimgi Misr', answer: 'Nil daryosi vodiysida sivilizatsiya yaratgan qadimgi davlat', options: ['Nil daryosi vodiysida sivilizatsiya yaratgan qadimgi davlat', 'Mesopotamiyadagi qadimiy shahar', 'Yevropadagi ilk imperiya', 'Markaziy Osiyodagi qabila', 'Hind okeani orollaridagi davlat'] },
    { type: 'history', category: 'Tarix', question: 'Qadimgi Yunoniston', answer: 'Demokratiya, falsafa va olimpiada o\'yinlari vatani', options: ['Demokratiya, falsafa va olimpiada o\'yinlari vatani', 'Faqat harbiylardan iborat davlat', 'Amerika qit\'asidagi qadimiy xalq', 'Osiyodagi eng yirik imperiya', 'Piramidalar vatani'] },
    { type: 'history', category: 'Tarix', question: 'Rim imperiyasi', answer: 'O\'rta dengiz havzasini to\'liq nazorat qilgan antik davlat', options: ['O\'rta dengiz havzasini to\'liq nazorat qilgan antik davlat', 'Osiyo qit\'asida paydo bo\'lgan', 'Faqat Italiya yarimorolini egallagan', 'Xitoy devorini qurgan imperiya', 'Markaziy Osiyo cho\'llarida yashagan'] },
    { type: 'history', category: 'Tarix', question: 'Ikkinchi jahon urushi', answer: '1939-1945 yillarda bo\'lib o\'tgan global urush', options: ['1939-1945 yillarda bo\'lib o\'tgan global urush', '1914-1918 yillarda bo\'lgan urush', '18-asrdagi Yevropa urushi', 'Faqat Osiyoda bo\'lib o\'tgan', 'Sovuq urushning bir qismi'] },
    { type: 'history', category: 'Tarix', question: 'Birinchi jahon urushi', answer: '1914-1918 yillarda bo\'lib o\'tgan yirik harbiy ixtilof', options: ['1914-1918 yillarda bo\'lib o\'tgan yirik harbiy ixtilof', '1939-1945 yillardagi urush', 'Napoleon yurishlari', 'Yuz yillik urush', 'Bolqon urushlari'] },
    { type: 'history', category: 'Tarix', question: 'Buyuk Britaniya imperiyasi', answer: 'Tarixdagi eng yirik mustamlakachi imperiya', options: ['Tarixdagi eng yirik mustamlakachi imperiya', 'Antik davrning oxirgi imperiyasi', 'Faqat Yevropada joylashgan', 'Osiyoda paydo bo\'lgan davlat', 'Hech qachon mustamlakaga ega bo\'lmagan'] },
    { type: 'history', category: 'Tarix', question: 'Fransuz inqilobi', answer: '1789 yilda boshlangan va monarxiyani ag\'dargan voqea', options: ['1789 yilda boshlangan va monarxiyani ag\'dargan voqea', '1917 yildagi sotsialistik inqilob', 'Angliya qiroliga qarshi isyon', 'Amerika mustaqillik urushi', 'Faqat dehqonlar qo\'zg\'oloni'] },
    { type: 'history', category: 'Tarix', question: 'Sanoat inqilobi', answer: 'Qo\'l mehnatidan mashina ishlab chiqarishiga o\'tish davri', options: ['Qo\'l mehnatidan mashina ishlab chiqarishiga o\'tish davri', 'Faqat axborot texnologiyalari rivoji', 'Yangi qishloq xo\'jaligi mahsulotlari kashfiyoti', 'Yangi yerlar ochilishi', 'Harbiy sohadagi o\'zgarishlar'] }
  ]

  return Array.from({ length: 1000 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `history-${index + 1}`,
      ...template,
      question: `${template.question} (${index + 1})`,
      options: shuffle(template.options),
    }
  })
}

const createGeographyQuestions = () => {
  const baseQuestions = [
    { type: 'geography', category: 'Geografiya', question: 'Yer sharining tuzilishi', answer: 'Yadro, mantiya, yer qobig\'i', options: ['Yadro, mantiya, yer qobig\'i', 'Atmosfera, biosfera, litosfera', 'Ekvator, meridian, parallel', 'Shimoliy va Janubiy qutb', 'Tog\'lar, tekisliklar, daryolar'] },
    { type: 'geography', category: 'Geografiya', question: 'Materiklar soni va nomlari', answer: '6 ta: Yevroosiyo, Afrika, Shimoliy Amerika, Janubiy Amerika, Antarktida, Avstraliya', options: ['6 ta: Yevroosiyo, Afrika, Shimoliy Amerika, Janubiy Amerika, Antarktida, Avstraliya', '5 ta: Yevropa, Osiyo, Afrika, Amerika, Avstraliya', '4 ta: Shimoliy, Janubiy, Sharqiy, G\'arbiy', '7 ta: barcha orollar bilan birga', '3 ta qadimgi materiklar'] },
    { type: 'geography', category: 'Geografiya', question: 'Okeanlar', answer: 'Tinch, Atlantika, Hind, Shimoliy Muz, Janubiy', options: ['Tinch, Atlantika, Hind, Shimoliy Muz, Janubiy', 'Faqat Tinch va Atlantika', 'O\'rta yer, Qizil, Qora', 'Karib, Arab, Kaspiy', 'Daryo, Ko\'l, Dengiz, Okean'] },
    { type: 'geography', category: 'Geografiya', question: 'O\'zbekiston geografiyasi', answer: 'O\'rta Osiyoning markazida joylashgan, dengizga chiqish yo\'li yo\'q', options: ['O\'rta Osiyoning markazida joylashgan, dengizga chiqish yo\'li yo\'q', 'Kaspiy dengizi bo\'yida joylashgan', 'Yevropa mintaqasiga kiradi', 'Ekvatorda joylashgan', 'Tog\'li orol mamlakat'] },
    { type: 'geography', category: 'Geografiya', question: 'Poytaxtlar', answer: 'Davlatning bosh shahri, boshqaruv markazi', options: ['Davlatning bosh shahri, boshqaruv markazi', 'Faqat eng aholisi ko\'p shahar', 'Faqat sanoatlashgan shahar', 'Sohil bo\'yida joylashgan shahar', 'Tarixiy yodgorliklar shahri'] },
    { type: 'geography', category: 'Geografiya', question: 'Tog\'lar (Tyanshan, Himolay, Alp)', answer: 'Yer yuzasining tekislikdan keskin ko\'tarilib turadigan qismlari', options: ['Yer yuzasining tekislikdan keskin ko\'tarilib turadigan qismlari', 'Suv ostidagi chuqurliklar', 'Okean tubidagi yoriqlar', 'Cho\'ldagi qumtepalar', 'Faqat vulqon otilishidan paydo bo\'lgan'] },
    { type: 'geography', category: 'Geografiya', question: 'Daryolar (Amudaryo, Sirdaryo, Nil, Amazon)', answer: 'Tabiiy o\'zan bo\'ylab doimiy oqadigan suv manbalari', options: ['Tabiiy o\'zan bo\'ylab doimiy oqadigan suv manbalari', 'Faqat yomg\'ir suvlari to\'plami', 'Quruqlik bilan o\'ralgan suv havzasi', 'Tog\' tepasidagi muzliklar', 'Yer osti suvlari zaxirasi'] },
    { type: 'geography', category: 'Geografiya', question: 'Ko\'llar (Orol dengizi, Baykal)', answer: 'Quruqlikdagi tabiiy chuqurliklarga yig\'ilgan suv havzasi', options: ['Quruqlikdagi tabiiy chuqurliklarga yig\'ilgan suv havzasi', 'Faqat sho\'r suvdan iborat dengizlar', 'Sun\'iy qurilgan suv omborlari', 'Okeanning quruqlikka kirib borgan qismi', 'Erigan qor suvlari to\'plami'] },
    { type: 'geography', category: 'Geografiya', question: 'Iqlim mintaqalari', answer: 'Yer sharining o\'xshash iqlimga ega bo\'lgan yirik hududlari', options: ['Yer sharining o\'xshash iqlimga ega bo\'lgan yirik hududlari', 'Faqat bir mamlakat ichidagi hududlar', 'Balandlik mintaqalari', 'Vaqt mintaqalari', 'Sayyoralararo masofalar'] },
    { type: 'geography', category: 'Geografiya', question: 'Tabiat zonalari', answer: 'O\'xshash iqlim, tuproq, o\'simlik va hayvonot olamiga ega hududlar', options: ['O\'xshash iqlim, tuproq, o\'simlik va hayvonot olamiga ega hududlar', 'Faqat shaharlar va qishloqlar', 'Okean osti hududlari', 'Siyosiy xarita qismlari', 'Faqat tog\'li hududlar'] },
    { type: 'geography', category: 'Geografiya', question: 'Cho\'l va sahrolar', answer: 'Yog\'ingarchilik juda kam, iqlimi quruq va issiq hududlar', options: ['Yog\'ingarchilik juda kam, iqlimi quruq va issiq hududlar', 'Yil bo\'yi qor qoplab yotadigan joylar', 'Zich o\'rmon bilan qoplangan maydon', 'Faqat botqoqliklardan iborat joy', 'Dengiz sohilidagi qumli plyajlar'] },
    { type: 'geography', category: 'Geografiya', question: 'Aholishunoslik', answer: 'Aholi soni, tarkibi va joylashuvini o\'rganuvchi fan', options: ['Aholi soni, tarkibi va joylashuvini o\'rganuvchi fan', 'Hayvonlar turlarini o\'rganadi', 'O\'simliklar tarqalishini o\'rganadi', 'Faqat shahar tuzilishini o\'rganadi', 'Iqlim o\'zgarishini o\'rganuvchi fan'] },
    { type: 'geography', category: 'Geografiya', question: 'Xarita turlari', answer: 'Jismoniy, siyosiy, iqlim, iqtisodiy kabi turlarga bo\'linadi', options: ['Jismoniy, siyosiy, iqlim, iqtisodiy kabi turlarga bo\'linadi', 'Faqat globus shaklida bo\'ladi', 'Faqat bitta turga ega', 'Qadimiy va zamonaviy turlarga bo\'linadi', 'Katta va kichik xaritalar'] },
    { type: 'geography', category: 'Geografiya', question: 'Koordinatalar (kenglik, uzunlik)', answer: 'Nuqtaning yer yuzasidagi o\'rnini aniqlovchi o\'lchamlar', options: ['Nuqtaning yer yuzasidagi o\'rnini aniqlovchi o\'lchamlar', 'Tog\'ning balandligi va kengligi', 'Faqat dengiz tubi o\'lchovlari', 'Vaqtni belgilovchi raqamlar', 'Iqlim mintaqalari chegarasi'] },
    { type: 'geography', category: 'Geografiya', question: 'Vulqonlar', answer: 'Yer qobig\'idagi yoriq bo\'lib, undan magma, gaz va kul otilib chiqadi', options: ['Yer qobig\'idagi yoriq bo\'lib, undan magma, gaz va kul otilib chiqadi', 'Faqat zilzila natijasi', 'Sun\'iy yaratilgan tepaliklar', 'Qor va muzdan iborat cho\'qqilar', 'Daryo o\'zanidagi to\'siqlar'] },
    { type: 'geography', category: 'Geografiya', question: 'Zilzilalar', answer: 'Yer qobig\'idagi to\'satdan siljishlar natijasidagi tebranishlar', options: ['Yer qobig\'idagi to\'satdan siljishlar natijasidagi tebranishlar', 'Shamolning qattiq esishi', 'Vulqon otilishigina', 'Tog\' ko\'chkisi', 'Muzliklarning erishi'] },
    { type: 'geography', category: 'Geografiya', question: 'O\'rmonlar', answer: 'Daraxt va butalar qalin o\'sadigan yirik hududlar', options: ['Daraxt va butalar qalin o\'sadigan yirik hududlar', 'Faqat qishloq xo\'jaligi ekinlari', 'Tog\' jinslaridan iborat qatlam', 'Cho\'ldagi alohida daraxtlar', 'Sun\'iy bog\'lar'] },
    { type: 'geography', category: 'Geografiya', question: 'Atmosfera', answer: 'Yerning havo qobig\'i', options: ['Yerning havo qobig\'i', 'Yerning suv qobig\'i', 'Yerning qattiq qobig\'i', 'Hayot tarqalgan qatlam', 'Faqat kosmik fazo'] },
    { type: 'geography', category: 'Geografiya', question: 'Gidrosfera', answer: 'Yerning suv qobig\'i', options: ['Yerning suv qobig\'i', 'Yerning havo qobig\'i', 'Yerning qattiq qobig\'i', 'O\'simliklar qoplami', 'Tog\' jinslari qatlami'] },
    { type: 'geography', category: 'Geografiya', question: 'Litosfera', answer: 'Yerning qattiq qobig\'i', options: ['Yerning qattiq qobig\'i', 'Yerning suv qobig\'i', 'Yerning havo qobig\'i', 'Hayot tarqalgan qatlam', 'Faqat tuproq qatlami'] }
  ]

  return Array.from({ length: 1000 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `geography-${index + 1}`,
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
    cpp: shuffle(createCppQuestions()),
    math: shuffle(createMathQuestions()),
    physics: shuffle(createPhysicsQuestions()),
    chemistry: shuffle(createChemistryQuestions()),
    uzbek: shuffle(createUzbekLanguageQuestions()),
    history: shuffle(createHistoryQuestions()),
    geography: shuffle(createGeographyQuestions()),
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
  { key: 'cpp', label: 'C++', icon: '🧩', color: '#00599c' },
  { key: 'math', label: 'Matematika', icon: '📐', color: '#f59e0b' },
  { key: 'physics', label: 'Fizika', icon: '🧲', color: '#60a5fa' },
  { key: 'chemistry', label: 'Kimyo', icon: '🧪', color: '#ef4444' },
  { key: 'uzbek', label: 'Ona tili', icon: '📝', color: '#14b8a6' },
  { key: 'history', label: 'Tarix', icon: '📜', color: '#a855f7' },
  { key: 'geography', label: 'Geografiya', icon: '🌍', color: '#06b6d4' },
]

export const BLOCK_SIZE = 10
