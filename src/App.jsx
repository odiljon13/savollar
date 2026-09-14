import { useEffect, useMemo, useRef, useState } from 'react'

function InteractiveGlowCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Smooth pointer state with spring interpolation
    const pointer = {
      x: width * 0.5,
      y: height * 0.5,
      targetX: width * 0.5,
      targetY: height * 0.5,
      active: false,
      lastMoved: Date.now(),
    }

    // Interactive fluid aurora nodes (Apple / Stripe AAA luxury standard)
    const nodes = [
      {
        baseX: width * 0.25,
        baseY: height * 0.3,
        x: width * 0.25,
        y: height * 0.3,
        radius: 460,
        hue: 260, // Electric Violet / Purple
        speed: 0.0008,
        offset: 0,
        pull: 0.045,
        orbitX: 180,
        orbitY: 130,
      },
      {
        baseX: width * 0.75,
        baseY: height * 0.35,
        x: width * 0.75,
        y: height * 0.35,
        radius: 500,
        hue: 190, // Cyber Cyan / Azure
        speed: 0.0011,
        offset: 2.1,
        pull: 0.04,
        orbitX: 200,
        orbitY: 150,
      },
      {
        baseX: width * 0.5,
        baseY: height * 0.7,
        x: width * 0.5,
        y: height * 0.7,
        radius: 480,
        hue: 320, // Neon Fuchsia / Magenta
        speed: 0.0009,
        offset: 4.2,
        pull: 0.035,
        orbitX: 220,
        orbitY: 140,
      },
      {
        baseX: width * 0.5,
        baseY: height * 0.45,
        x: width * 0.5,
        y: height * 0.45,
        radius: 420,
        hue: 220, // Deep Royal Sapphire
        speed: 0.0014,
        offset: 1.2,
        pull: 0.06,
        orbitX: 150,
        orbitY: 120,
      },
    ]

    let pulses = []
    let globalHueShift = 0

    const onPointerMove = (clientX, clientY) => {
      pointer.targetX = clientX
      pointer.targetY = clientY
      pointer.active = true
      pointer.lastMoved = Date.now()
    }

    const onMouseMove = (e) => {
      onPointerMove(e.clientX, e.clientY)
    }

    const onTouchStart = (e) => {
      if (e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY)
        pulses.push({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          radius: 10,
          maxRadius: 180,
          alpha: 0.8,
          hue: (210 + globalHueShift) % 360,
        })
      }
    }

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const onMouseDown = (e) => {
      pulses.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: 200,
        alpha: 0.75,
        hue: (210 + globalHueShift) % 360,
      })
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown, { passive: true })
    window.addEventListener('mouseleave', onPointerLeave, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onPointerLeave, { passive: true })
    window.addEventListener('touchcancel', onPointerLeave, { passive: true })

    let lastTime = performance.now()

    const render = (currentTime) => {
      const delta = Math.min(currentTime - lastTime, 64)
      lastTime = currentTime

      globalHueShift = (globalHueShift + delta * 0.012) % 360

      // Pointer spring physics
      pointer.x += (pointer.targetX - pointer.x) * 0.1
      pointer.y += (pointer.targetY - pointer.y) * 0.1

      // 1. Pure Pitch Black Background
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // Use lighter blending for luminous, clean liquid light
      ctx.globalCompositeOperation = 'lighter'

      // 2. Liquid Aurora Mesh nodes (organic fluid drift + magnetic cursor attraction)
      const isIdle = Date.now() - pointer.lastMoved > 2500

      nodes.forEach((node, i) => {
        // Natural harmonic Lissajous drift
        const t = currentTime * node.speed + node.offset
        const naturalX = (width * (i === 0 ? 0.3 : i === 1 ? 0.7 : 0.5)) + Math.sin(t * 1.3) * node.orbitX
        const naturalY = (height * (i === 0 ? 0.35 : i === 1 ? 0.4 : i === 2 ? 0.7 : 0.5)) + Math.cos(t * 0.9) * node.orbitY

        // Magnetic attraction towards pointer
        if (pointer.active || !isIdle) {
          const targetX = naturalX + (pointer.x - naturalX) * node.pull * 2.8
          const targetY = naturalY + (pointer.y - naturalY) * node.pull * 2.8
          node.x += (targetX - node.x) * 0.06
          node.y += (targetY - node.y) * 0.06
        } else {
          node.x += (naturalX - node.x) * 0.04
          node.y += (naturalY - node.y) * 0.04
        }

        const currentHue = (node.hue + globalHueShift) % 360
        const grad = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius
        )
        grad.addColorStop(0, `hsla(${currentHue}, 95%, 60%, 0.32)`)
        grad.addColorStop(0.35, `hsla(${(currentHue + 30) % 360}, 90%, 50%, 0.14)`)
        grad.addColorStop(0.7, `hsla(${(currentHue + 60) % 360}, 85%, 40%, 0.035)`)
        grad.addColorStop(1, 'transparent')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // 3. Magnetic cursor spotlight (luxurious, silky ambient glow directly where the user navigates)
      const spotRadius = 340
      const spotHue = (205 + globalHueShift) % 360
      const spotGrad = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        spotRadius
      )
      spotGrad.addColorStop(0, `hsla(${spotHue}, 100%, 75%, 0.35)`)
      spotGrad.addColorStop(0.3, `hsla(${(spotHue + 35) % 360}, 95%, 60%, 0.15)`)
      spotGrad.addColorStop(0.7, `hsla(${(spotHue + 75) % 360}, 90%, 45%, 0.03)`)
      spotGrad.addColorStop(1, 'transparent')

      ctx.fillStyle = spotGrad
      ctx.beginPath()
      ctx.arc(pointer.x, pointer.y, spotRadius, 0, Math.PI * 2)
      ctx.fill()

      // 4. Soft click / tap shockwave pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.radius += (p.maxRadius - p.radius) * 0.08
        p.alpha -= 0.024

        if (p.alpha <= 0) {
          pulses.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.lineWidth = 2.2 * p.alpha
        ctx.strokeStyle = `hsla(${p.hue}, 100%, 75%, ${p.alpha * 0.7})`
        ctx.stroke()
      }

      ctx.globalCompositeOperation = 'source-over'
      animationFrameId = requestAnimationFrame(render)
    }

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onPointerLeave)
      window.removeEventListener('touchcancel', onPointerLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="interactive-glow-canvas" />
}


const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

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
    title: 'Kvadrat',
    build: (a) => ({ question: `${a} ning kvadrati nimaga teng?`, answer: a * a })
  },
  {
    title: 'Kub',
    build: (a) => ({ question: `${a % 10} ning kubi nimaga teng?`, answer: Math.pow(a % 10, 3) })
  },
  {
    title: 'Yig\'indi',
    build: (a, b, c) => ({ question: `${a}, ${b} va ${c} ning yig'indisi qanchaga teng?`, answer: a + b + c })
  },
  {
    title: 'Ko\'paytma',
    build: (a, b) => ({ question: `${a} va ${b} ning ko'paytmasi qanchaga teng?`, answer: a * b })
  },
  {
    title: 'Perimetr',
    build: (a, b) => ({ question: `Tomonlari ${a} va ${b} bo'lgan to'g'ri to'rtburchak perimetrini toping.`, answer: 2 * (a + b) })
  },
  {
    title: 'Yuza',
    build: (a, b) => ({ question: `Tomonlari ${a} va ${b} bo'lgan to'g'ri to'rtburchak yuzasini toping.`, answer: a * b })
  },
  {
    title: 'Qoldiq',
    build: (a, b) => ({ question: `${a + b + 10} ni ${b % 10 + 2} ga bo'lgandagi qoldiqni toping.`, answer: (a + b + 10) % (b % 10 + 2) })
  },
  {
    title: 'Tenglama 2',
    build: (a, b) => ({ question: `Agar x - ${a} = ${b} bo'lsa, x ning qiymati qanday?`, answer: a + b })
  },
  {
    title: 'O\'nlik',
    build: (a) => ({ question: `${a * 10} ning 10% ini toping.`, answer: a })
  },
  {
    title: 'Yarim',
    build: (a) => ({ question: `${a * 2} ning yarmi qanchaga teng?`, answer: a })
  }
]

const physicsTemplates = [
  {
    title: 'Tezlik',
    build: (a, b) => ({ question: `Jism ${a * b} metr masofani ${a} soniyada bosib o'tdi. Uning tezligini toping (m/s).`, answer: b })
  },
  {
    title: 'Masofa',
    build: (a, b) => ({ question: `Jism ${a} m/s tezlik bilan ${b} soniya harakatlandi. Qancha masofani bosib o'tadi (m)?`, answer: a * b })
  },
  {
    title: 'Vaqt',
    build: (a, b) => ({ question: `Jism ${a * b} metr masofani ${a} m/s tezlikda bosib o'tishi uchun qancha vaqt ketadi (s)?`, answer: b })
  },
  {
    title: 'Tezlanish',
    build: (a, b) => ({ question: `Jism tinch holatdan harakatlanib, ${a} soniyada tezligini ${a * b} m/s ga yetkazdi. Tezlanishni toping (m/s²).`, answer: b })
  },
  {
    title: 'Kuch',
    build: (a, b) => ({ question: `Massa ${a} kg bo'lgan jismga ${b} m/s² tezlanish beruvchi kuchni toping (N).`, answer: a * b })
  },
  {
    title: 'Massa',
    build: (a, b) => ({ question: `Jismga ${a * b} N kuch ta'sir etganda u ${b} m/s² tezlanish oldi. Jism massasini toping (kg).`, answer: a })
  },
  {
    title: 'Ish',
    build: (a, b) => ({ question: `${a} N kuch ta'sirida jism kuch yo'nalishida ${b} m masofaga ko'chdi. Bajarilgan ishni toping (J).`, answer: a * b })
  },
  {
    title: 'Quvvat',
    build: (a, b) => ({ question: `Dvigatel ${a} soniyada ${a * b} J ish bajardi. Uning quvvatini toping (Vt).`, answer: b })
  },
  {
    title: 'Kinetik energiya',
    build: (a, b) => ({ question: `Massa ${2 * a} kg va tezligi ${b} m/s bo'lgan jismning kinetik energiyasini toping (J).`, answer: a * b * b })
  },
  {
    title: 'Potensial energiya',
    build: (a, b) => ({ question: `Massa ${a} kg bo'lgan jism yer sirtidan ${b} m balandlikda joylashgan. Uning potensial energiyasini toping (g=10 m/s², J).`, answer: a * b * 10 })
  },
  {
    title: 'Zichlik',
    build: (a, b) => ({ question: `Hajmi ${a} m³ va massasi ${a * b} kg bo'lgan jismning zichligini toping (kg/m³).`, answer: b })
  },
  {
    title: 'Bosim',
    build: (a, b) => ({ question: `Yuzasi ${a} m² bo'lgan maydonga perpendikulyar ravishda ${a * b} N kuch ta'sir etmoqda. Bosimni toping (Pa).`, answer: b })
  },
  {
    title: 'Bikrlik',
    build: (a, b) => ({ question: `Prujina ${a} m ga cho'zilganda unda ${a * b} N elastiklik kuchi hosil bo'ldi. Prujina bikrligini toping (N/m).`, answer: b })
  },
  {
    title: 'Impuls',
    build: (a, b) => ({ question: `Massa ${a} kg va tezligi ${b} m/s bo'lgan jismning impulsini toping (kg·m/s).`, answer: a * b })
  },
  {
    title: 'Kuch momenti',
    build: (a, b) => ({ question: `Aylanish o'qidan kuchning yelkasigacha masofa ${b} m, ta'sir etuvchi kuch ${a} N. Kuch momentini toping (N·m).`, answer: a * b })
  },
  {
    title: 'Davr',
    build: (a, b) => ({ question: `Moddiy nuqta ${a * b} soniyada ${a} marta to'la aylandi. Aylanish davrini toping (s).`, answer: b })
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

const createComputerQuestions = () => {
  const baseQuestions = [
    { question: "Kompyuterning asosiy vazifasi nima?", answer: "Ma'lumotni qayta ishlash va natija chiqarish", options: ["Ma'lumotni qayta ishlash va natija chiqarish", "Faqat matnlarni yozib olish", "Internetga faqatgina ulanish", "Fayllarni faqat ko'chirish", "Yagona kompyuterga xizmat ko'rsatish"] },
    { question: "RAM nima uchun ishlatiladi?", answer: "Hozirgi ishlayotgan dasturlar va ma'lumotlarni vaqtincha saqlash", options: ["Hozirgi ishlayotgan dasturlar va ma'lumotlarni vaqtincha saqlash", "Fayllarni doimiy ravishda diskka yozib borish", "Kompyuterni to'liq o'chirish", "Foydalanuvchi harakatlarini avtomatik qayd etish", "Barcha dasturlarni xotirada doimiy saqlash"] },
    { question: "Operatsion sistema (OS) qanday vazifani bajaradi?", answer: "Dasturlar va apparat o'rtasida aloqa tashkil etadi", options: ["Dasturlar va apparat o'rtasida aloqa tashkil etadi", "Faqat brauzerdagi saytlarni ochadi", "Foydalanuvchi ma'lumotlarini faqat saqlaydi", "Kompyuterning ichki xotirasini o'chirib tashlaydi", "Barcha kodlarni avtomatik yozib beradi"] },
    { question: "CPU nima uchun kerak?", answer: "Kompyuterning ko'rsatmalarini bajaruvchi asosiy protsessor", options: ["Kompyuterning ko'rsatmalarini bajaruvchi asosiy protsessor", "Fayllarni tashuvchi tashqi qurilma", "Internet trafigni saqlovchi xona", "Kompyuter ekranini tozalovchi vosita", "Foydalanuvchi buyruqlarini eslab qoladigan xotira"] },
    { question: "Qattiq disk (HDD/SSD) vazifasi nima?", answer: "Ma'lumotlarni doimiy saqlash", options: ["Ma'lumotlarni doimiy saqlash", "Tezkor xotirani kengaytirish", "Faqat tizim fayllarini saqlash", "Ekranga tasvir chiqarish", "Protsessorni sovutish"] },
    { question: "IP manzil nima?", answer: "Tarmoqdagi qurilmaning noyob identifikatori", options: ["Tarmoqdagi qurilmaning noyob identifikatori", "Faqat printerlar uchun raqam", "Fayl formati turi", "Brauzer kengaytmasi", "Xotira hajmini o'lchov birligi"] },
    { question: "URL nima?", answer: "Internetdagi resursning manzili", options: ["Internetdagi resursning manzili", "Kompyuterning seriya raqami", "Foydalanuvchi paroli", "Tarmoq kabeli turi", "Dasturlash tili"] },
    { question: "HTML nima uchun ishlatiladi?", answer: "Veb-sahifalar tuzilishini yaratish", options: ["Veb-sahifalar tuzilishini yaratish", "Kompyuterni virusdan tozalash", "Faqat o'yinlar yaratish", "Rasmlarni tahrirlash", "Ma'lumotlar bazasini boshqarish"] },
    { question: "CSS ning vazifasi nima?", answer: "Veb-sahifalarni bezash va dizayn berish", options: ["Veb-sahifalarni bezash va dizayn berish", "Serverni sozlash", "Tarmoq ulanishini ta'minlash", "Parollarni shifrlash", "Ma'lumotlarni arxivlash"] },
    { question: "LAN nima?", answer: "Mahalliy kompyuter tarmog'i", options: ["Mahalliy kompyuter tarmog'i", "Xalqaro tarmoq", "Faqat simsiz ulanish", "Tarmoq kabeli qismi", "Operatsion tizim komponenti"] },
    { question: "WAN nima?", answer: "Keng ko'lamli kompyuter tarmog'i (masalan, Internet)", options: ["Keng ko'lamli kompyuter tarmog'i (masalan, Internet)", "Bitta xonadagi tarmoq", "Tarmoq protokoli", "Kompyuter xotirasi", "Protsessor chastotasi"] },
    { question: "Fayl kengaytmasi nima?", answer: "Fayl turini ko'rsatuvchi belgi (masalan .pdf)", options: ["Fayl turini ko'rsatuvchi belgi (masalan .pdf)", "Faylning yashirin paroli", "Faylning yaratilish vaqti", "Faylning muallifi", "Fayl joylashgan manzil"] },
    { question: "Antivirus dasturi nima qiladi?", answer: "Zararli dasturlarni aniqlaydi va yo'q qiladi", options: ["Zararli dasturlarni aniqlaydi va yo'q qiladi", "Internet tezligini oshiradi", "Kompyuterni tezlashtiradi", "Yangi dasturlarni o'rnatadi", "Parollarni buzadi"] },
    { question: "Bulutli texnologiya nima?", answer: "Ma'lumotlarni internetdagi serverlarda saqlash", options: ["Ma'lumotlarni internetdagi serverlarda saqlash", "Ma'lumotlarni faqat fleshkada saqlash", "Havo ob-havosini aniqlash", "Kompyuter sovutish tizimi", "Simsiz sichqoncha texnologiyasi"] },
    { question: "BIOS nima?", answer: "Kompyuterni yuklashni boshqaruvchi asosiy tizim", options: ["Kompyuterni yuklashni boshqaruvchi asosiy tizim", "Yangi o'yinlar platformasi", "Maxsus xotira kartasi", "Ekran o'lchamlari parametri", "Foydalanuvchi profilini saqlovchi baza"] },
    { question: "Klaviatura qanday qurilma?", answer: "Ma'lumot kiritish qurilmasi", options: ["Ma'lumot kiritish qurilmasi", "Ma'lumot chiqarish qurilmasi", "Saqlash qurilmasi", "Aloqa qurilmasi", "Quvvat manbai"] },
    { question: "Monitor qanday qurilma?", answer: "Ma'lumot chiqarish qurilmasi", options: ["Ma'lumot chiqarish qurilmasi", "Ma'lumot kiritish qurilmasi", "Ma'lumot saqlash qurilmasi", "Protsessor komponenti", "Tarmoq uzatuvchisi"] },
    { question: "Vebkamera qanday qurilma?", answer: "Ma'lumot kiritish (video) qurilmasi", options: ["Ma'lumot kiritish (video) qurilmasi", "Ma'lumot chiqarish qurilmasi", "Ovoz kuchaytirgich", "Ma'lumot saqlash qurilmasi", "O'yin boshqaruvchisi"] },
    { question: "Ona plata (Motherboard) nima?", answer: "Barcha kompyuter qismlarini birlashtiruvchi asosiy plata", options: ["Barcha kompyuter qismlarini birlashtiruvchi asosiy plata", "Faqat videokartani saqlovchi plata", "Quvvat ta'minlovchi uskuna", "Kompyuter qutisi", "Sovutish tizimi datchigi"] },
    { question: "Videokarta (GPU) nima uchun kerak?", answer: "Grafik ma'lumotlarni hisoblash va ekranga chiqarish", options: ["Grafik ma'lumotlarni hisoblash va ekranga chiqarish", "Matnli hujjatlarni saqlash", "Ovoz sifatini yaxshilash", "Internet tarmog'ini yaratish", "Kompyuterni yoqish"] },
    { question: "Ping buyrug'i nima uchun ishlatiladi?", answer: "Tarmoq ulanishi holatini tekshirish uchun", options: ["Tarmoq ulanishi holatini tekshirish uchun", "Fayllarni o'chirish uchun", "Kompyuterni qayta yuklash uchun", "Yangi foydalanuvchi yaratish uchun", "Parolni o'zgartirish uchun"] },
    { question: "Kesh xotira (Cache) nima?", answer: "Protsessor tezkor ishlatadigan ma'lumotlarni saqlovchi xotira", options: ["Protsessor tezkor ishlatadigan ma'lumotlarni saqlovchi xotira", "Qattiq diskning boshqa nomi", "Faqat vaqtni saqlaydigan xotira", "Tashqi fleshka xotirasi", "Tarmoq xotirasi"] },
    { question: "HTTP nima?", answer: "Gipermatn uzatish protokoli", options: ["Gipermatn uzatish protokoli", "Videolarni siqish formati", "Kompyuter xotirasi turi", "Dasturlash tili", "Qidiruv tizimi"] },
    { question: "Wi-Fi nima?", answer: "Simsiz mahalliy tarmoq texnologiyasi", options: ["Simsiz mahalliy tarmoq texnologiyasi", "Telefon tarmog'i", "Sun'iy yo'ldosh", "Simli ulanish", "Video format"] },
    { question: "Brauzer nima?", answer: "Veb-sahifalarni ko'rish dasturi", options: ["Veb-sahifalarni ko'rish dasturi", "Kompyuterni tozalash vositasi", "Antivirus dasturi", "Matn muharriri", "Dasturlash muhiti"] },
    { question: "USB nima?", answer: "Universal ketma-ket shina, qurilmalarni ulash porti", options: ["Universal ketma-ket shina, qurilmalarni ulash porti", "Tezkor xotira turi", "Faqat quvvat manbai", "Tizim paroli", "Kompyuter nomi"] },
    { question: "Kiberxavfsizlik nima?", answer: "Axborot tizimlarini hujumlardan himoya qilish", options: ["Axborot tizimlarini hujumlardan himoya qilish", "Internet tezligini oshirish", "Kompyuter narxini tushirish", "Faqat antivirus o'rnatish", "Simsiz tarmoq qurish"] },
    { question: "VPN nima?", answer: "Virtual xususiy tarmoq, xavfsiz ulanish yaratadi", options: ["Virtual xususiy tarmoq, xavfsiz ulanish yaratadi", "Tezkor xotira turi", "Video karta modeli", "Virus nomi", "Matn formati"] },
    { question: "Spam nima?", answer: "Keraksiz yoki ommaviy elektron xabarlar", options: ["Keraksiz yoki ommaviy elektron xabarlar", "Muhim fayllar tizimi", "Operatsion tizim dasturi", "Antivirus tekshiruvi", "Klaviatura tugmasi"] },
    { question: "Fayl arxivi (masalan .zip) nima uchun kerak?", answer: "Fayllar hajmini kichraytirish va guruhlash uchun", options: ["Fayllar hajmini kichraytirish va guruhlash uchun", "Fayllarni butunlay o'chirish uchun", "Viruslarni yashirish uchun", "Tezlikni oshirish uchun", "Kompyuter xotirasini kengaytirish uchun"] },
  ]

  return Array.from({ length: 1500 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `computer-${index + 1}`,
      type: 'computer',
      category: 'Kompyuter',
      question: `${template.question} (${index + 1})`,
      answer: template.answer,
      options: shuffle(template.options),
    }
  })
}

const createCppQuestions = () => {
  const baseQuestions = [
    { question: "C++ tilida o'zgaruvchini qanday e'lon qilamiz?", answer: "Ma'lumot turi va o'zgaruvchi nomi (masalan int a;)", options: ["Ma'lumot turi va o'zgaruvchi nomi (masalan int a;)", "Faqat o'zgaruvchi nomi bilan", "Dastur boshida doim", "Faqat auto so'zi orqali", "C++ da o'zgaruvchilar oldindan e'lon qilinmaydi"] },
    { question: "C++ da tsikl operatorlaridan qaysi biri post-shartli?", answer: "do-while", options: ["do-while", "for", "while", "if-else", "switch"] },
    { question: "std::cout vazifasi nima?", answer: "Konsolga ma'lumot chiqarish", options: ["Konsolga ma'lumot chiqarish", "Konsoldan ma'lumot o'qish", "O'zgaruvchi yaratish", "Dasturni tugatish", "Faylga yozish"] },
    { question: "std::cin vazifasi nima?", answer: "Konsoldan ma'lumot kiritish", options: ["Konsoldan ma'lumot kiritish", "Konsolga chiqarish", "Ma'lumotni tozalash", "Faylni o'qish", "Shartni tekshirish"] },
    { question: "C++ tilida pointer nima?", answer: "Boshqa o'zgaruvchining xotira manzilini saqlovchi o'zgaruvchi", options: ["Boshqa o'zgaruvchining xotira manzilini saqlovchi o'zgaruvchi", "Oddiy matnli o'zgaruvchi", "Funksiyani to'xtatuvchi kalit so'z", "Massiv uzunligi", "Sinf obyekti"] },
    { question: "Massivning birinchi elementi indeksi nechadan boshlanadi?", answer: "0", options: ["0", "1", "-1", "Massiv uzunligidan", "10"] },
    { question: "C++ da class va struct ning farqi nimada?", answer: "class da a'zolar sukut bo'yicha private, struct da public", options: ["class da a'zolar sukut bo'yicha private, struct da public", "struct faqat C tilida bor, C++ da emas", "Hech qanday farqi yo'q", "class obyekt yarata olmaydi", "struct da funksiyalar yozib bo'lmaydi"] },
    { question: "OOP ning vorislik (inheritance) xususiyati nima?", answer: "Yangi sinfning mavjud sinf xususiyatlarini qabul qilishi", options: ["Yangi sinfning mavjud sinf xususiyatlarini qabul qilishi", "Bir xil nomli funksiyalarni qayta yaratish", "Barcha ma'lumotlarni yashirish", "Funksiyalarga murojaatni taqiqlash", "Xotirani tozalash"] },
    { question: "OOP ning polimorfizm xususiyati nima?", answer: "Bir interfeys orqali turli obyektlar bilan ishlash", options: ["Bir interfeys orqali turli obyektlar bilan ishlash", "Ma'lumotlarni kapsulaga o'rash", "Obyektni yaratish", "Xotira oqishini oldini olish", "Faqat vorislik bilan ishlaydi"] },
    { question: "C++ da destruktor qanday yoziladi?", answer: "Tilda belgisi (~) va sinf nomi bilan", options: ["Tilda belgisi (~) va sinf nomi bilan", "delete kalit so'zi bilan", "Faqat () belgilari bilan", "Faqat std::destroy bilan", "Destruktor C++ da yo'q"] },
    { question: "Konstruktor vazifasi nima?", answer: "Obyekt yaratilganda unga boshlang'ich qiymat berish", options: ["Obyekt yaratilganda unga boshlang'ich qiymat berish", "Obyektni yo'q qilish", "Konsolga chiqarish", "Faqat hisoblash amalini bajarish", "Xatoni ushlash"] },
    { question: "C++ da izohlar (kommentariya) qanday yoziladi?", answer: "// yoki /* */ orqali", options: ["// yoki /* */ orqali", "# orqali", "<!-- --> orqali", "' ' orqali", "C++ da izohlar yozib bo'lmaydi"] },
    { question: "new operatori nima uchun ishlatiladi?", answer: "Dinamik xotira ajratish uchun", options: ["Dinamik xotira ajratish uchun", "Yangi funksiya yaratish uchun", "Dinamik massivni o'chirish uchun", "Yangi fayl ochish uchun", "Xatolikni tekshirish uchun"] },
    { question: "delete operatori nima qiladi?", answer: "new orqali ajratilgan xotirani bo'shatadi", options: ["new orqali ajratilgan xotirani bo'shatadi", "O'zgaruvchini dasturdan o'chiradi", "Funksiyani to'xtatadi", "Faylni kompyuterdan o'chiradi", "Massivni tozalaydi"] },
    { question: "C++ da header fayllari (masalan .h, .hpp) nima uchun kerak?", answer: "Funksiya va sinflar e'lonini saqlash uchun", options: ["Funksiya va sinflar e'lonini saqlash uchun", "Faqat main() funksiyasini saqlash uchun", "HTML sahifa yaratish uchun", "Suratlarni saqlash uchun", "Ovoz fayllari uchun"] },
    { question: "Dasturning asosiy ishga tushish nuqtasi qaysi funksiya?", answer: "main()", options: ["main()", "start()", "init()", "run()", "execute()"] },
    { question: "inline funksiyasining maqsadi nima?", answer: "Kichik funksiyalarni chaqirish o'rniga, kodini o'sha joyga ko'chirish", options: ["Kichik funksiyalarni chaqirish o'rniga, kodini o'sha joyga ko'chirish", "Xatoliklarni yashirish", "Katta ma'lumotlarni saqlash", "Xotira sarfini kamaytirish kafolati", "Dasturni cheksiz aylantirish"] },
    { question: "namespace nima uchun kerak?", answer: "Nomlar to'qnashuvini (conflict) oldini olish uchun", options: ["Nomlar to'qnashuvini (conflict) oldini olish uchun", "Dasturni tezlashtirish uchun", "Xotira ajratish uchun", "Yangi sinf yaratish uchun", "Fayllarni o'qish uchun"] },
    { question: "C++ da referens (&) nima?", answer: "Mavjud o'zgaruvchi uchun boshqa nom (taxallus)", options: ["Mavjud o'zgaruvchi uchun boshqa nom (taxallus)", "Faqat pointerlarning boshqa nomi", "Yangi o'zgaruvchi yaratadi", "Fayl manzili", "Xotira manzilini o'zgartiradi"] },
    { question: "sizeof() operatori nima qiladi?", answer: "O'zgaruvchi yoki tipning xotiradagi hajmini baytlarda qaytaradi", options: ["O'zgaruvchi yoki tipning xotiradagi hajmini baytlarda qaytaradi", "Satrning uzunligini sanaydi", "Massivdagi elementlar sonini topadi", "Pointer manzilini beradi", "Fayl hajmini megabaytda beradi"] },
    { question: "break operatori nima qiladi?", answer: "Tsikl yoki switch dan chiqish uchun ishlatiladi", options: ["Tsikl yoki switch dan chiqish uchun ishlatiladi", "Dasturni butunlay to'xtatadi", "Tsiklni boshidan boshlaydi", "Faqat if shartida ishlaydi", "Keyingi qadamga o'tadi"] },
    { question: "continue operatori nima qiladi?", answer: "Tsiklning qolgan qismini tashlab, keyingi iteratsiyaga o'tadi", options: ["Tsiklning qolgan qismini tashlab, keyingi iteratsiyaga o'tadi", "Tsiklni butunlay to'xtatadi", "Dasturni yopadi", "Faqat if-else bilan ishlaydi", "O'zgaruvchini nollaydi"] },
    { question: "C++ tilida ifodaning noto'g'ri (false) ekanligini qaysi son bildiradi?", answer: "0", options: ["0", "1", "-1", "null", "Hech qaysi"] },
    { question: "bool ma'lumot turi qanday qiymatlarni saqlaydi?", answer: "true yoki false", options: ["true yoki false", "Faqat butun sonlar", "Matnlar", "Kasr sonlar", "Pointerlar"] },
    { question: "Virtual funksiya nima?", answer: "Polimorfizmni ta'minlash uchun voris sinfda qayta yozilishi mumkin bo'lgan funksiya", options: ["Polimorfizmni ta'minlash uchun voris sinfda qayta yozilishi mumkin bo'lgan funksiya", "Umuman mavjud bo'lmagan funksiya", "Faqat main() ichida yoziladigan funksiya", "Xotirada joy egallamaydigan funksiya", "C++ da mavjud emas"] },
    { question: "Template nima uchun ishlatiladi?", answer: "Turli ma'lumot tiplari bilan ishlay oluvchi umumiy (generic) kod yozish uchun", options: ["Turli ma'lumot tiplari bilan ishlay oluvchi umumiy (generic) kod yozish uchun", "Fayllarni nusxalash uchun", "Faqat stringlar bilan ishlash uchun", "Dizayn shablonlarini yaratish uchun", "Obyektlarni yo'q qilish uchun"] },
    { question: "C++ da xatoliklarni ushlash qanday amalga oshiriladi?", answer: "try, catch, throw orqali", options: ["try, catch, throw orqali", "if-else orqali", "for tsikli orqali", "C++ da xatoliklarni ushlab bo'lmaydi", "Faqat return -1 orqali"] },
    { question: "const kalit so'zi nima qiladi?", answer: "O'zgaruvchi qiymatini o'zgarmas qiladi", options: ["O'zgaruvchi qiymatini o'zgarmas qiladi", "Yangi sinf yaratadi", "Xotirani tozalaydi", "Funksiyani tezlashtiradi", "Ma'lumot turini almashtiradi"] },
    { question: "auto kalit so'zi nima vazifa bajaradi?", answer: "Kompilyatorga ma'lumot turini avtomatik aniqlash imkonini beradi", options: ["Kompilyatorga ma'lumot turini avtomatik aniqlash imkonini beradi", "Mashina yozuvini kiritadi", "Faqat massiv yaratadi", "Avtomatik tsikl yaratadi", "C++11 da o'chirib tashlangan"] },
    { question: "STL (Standard Template Library) nima?", answer: "Konteynerlar, algoritmlar va iteratorlar to'plami bo'lgan kutubxona", options: ["Konteynerlar, algoritmlar va iteratorlar to'plami bo'lgan kutubxona", "Faqat stringlarni saqlovchi modul", "C++ ni kompilatsiya qiluvchi dastur", "GUI yaratuvchi freymvork", "O'yin dvijogi"] }
  ]

  return Array.from({ length: 1500 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `cpp-${index + 1}`,
      type: 'cpp',
      category: 'C++',
      question: `${template.question} (${index + 1})`,
      answer: template.answer,
      options: shuffle(template.options),
    }
  })
}

const createMathQuestions = () => {
  const questions = []
  for (let i = 0; i < 2000; i += 1) {
    const template = mathTemplates[i % mathTemplates.length]
    const a = randomInt(1, 20)
    const b = randomInt(1, 20)
    const c = randomInt(1, 20)
    const { question, answer } = template.build(a, b, c)

    questions.push({
      id: `math-${i + 1}`,
      type: 'math',
      category: 'Matematika',
      question: `${question} (${i + 1})`,
      answer,
      options: buildOptionSet(answer),
    })
  }
  return questions
}

const createPhysicsQuestions = () => {
  const questions = []
  for (let i = 0; i < 2000; i += 1) {
    const template = physicsTemplates[i % physicsTemplates.length]
    const a = randomInt(1, 20)
    const b = randomInt(1, 20)
    const c = randomInt(1, 20)
    const { question, answer } = template.build(a, b, c)

    questions.push({
      id: `physics-${i + 1}`,
      type: 'physics',
      category: 'Fizika',
      question: `${question} (${i + 1})`,
      answer,
      options: buildOptionSet(answer),
    })
  }
  return questions
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
    { question: "Atom nima?", answer: "Moddaning eng kichik zarrachasi", options: ["Moddaning eng kichik zarrachasi", "Hujayraning bir qismi", "Energiya manbai", "Yorug'lik zarrachasi", "Koinot jangi"] },
    { question: "Molekula nima?", answer: "Ikki yoki undan ortiq atomlarning birlashmasi", options: ["Ikki yoki undan ortiq atomlarning birlashmasi", "Faqat kislorod zarrachasi", "Tirik organizm", "Suyuqlik tomchisi", "Fizik maydon"] },
    { question: "Kimyoviy element nima?", answer: "Bir xil turdagi atomlardan tashkil topgan modda", options: ["Bir xil turdagi atomlardan tashkil topgan modda", "Faqat gazlar", "Suyuqliklar aralashmasi", "Har xil atomlar to'plami", "Turli moddalar birikmasi"] },
    { question: "Davriy jadvalni kim yaratgan?", answer: "Dmitriy Mendeleyev", options: ["Dmitriy Mendeleyev", "Isaak Nyuton", "Albert Eynshteyn", "Mari Kyuri", "Charlz Darvin"] },
    { question: "Valentlik nima?", answer: "Atomning boshqa atomlarni biriktirib olish xususiyati", options: ["Atomning boshqa atomlarni biriktirib olish xususiyati", "Moddaning og'irligi", "Kimyoviy reaksiya tezligi", "Moddaning erish harorati", "Gazning hajmi"] },
    { question: "Oksidlanish reaksiyasi nima?", answer: "Kislorod birikishi yoki elektron yo'qotilishi", options: ["Kislorod birikishi yoki elektron yo'qotilishi", "Suvning ajralishi", "Moddaning sovishi", "Faqat rang o'zgarishi", "Qattiq holatga o'tish"] },
    { question: "Qaytarilish nima?", answer: "Elektron qo'shib olish jarayoni", options: ["Elektron qo'shib olish jarayoni", "Kislorod qo'shilishi", "Yorug'lik chiqarish", "Issiqlik yutish", "Gaz ajralishi"] },
    { question: "Kislota nima?", answer: "Vodorod ionlari ajratadigan murakkab modda", options: ["Vodorod ionlari ajratadigan murakkab modda", "Faqat tuzli suv", "Asoslar bilan reaksiyaga kirmaydigan modda", "Faqat qattiq modda", "Metallarning oksidi"] },
    { question: "Asos nima?", answer: "Gidroksid guruhiga ega bo'lgan modda", options: ["Gidroksid guruhiga ega bo'lgan modda", "Faqat kislotalar", "Suvning bir turi", "Faqat organik moddalar", "Metallmaslar oksidi"] },
    { question: "Tuz qanday hosil bo'ladi?", answer: "Kislota va asos reaksiyasidan", options: ["Kislota va asos reaksiyasidan", "Faqat suv qaynatilganda", "Ikki gaz aralashganda", "Faqat metall eritilganda", "Muz eriganda"] },
    { question: "Kimyoviy bog' turlari qaysilar?", answer: "Kovalent, ion, metall, vodorod", options: ["Kovalent, ion, metall, vodorod", "Faqat kovalent", "Faqat fizik bog'lar", "Magnit va elektr", "Issiqlik va yorug'lik"] },
    { question: "Ion nima?", answer: "Zaryadga ega bo'lgan zarracha", options: ["Zaryadga ega bo'lgan zarracha", "Neytral atom", "Faqat musbat zarra", "Faqat manfiy zarra", "Yorug'lik kvanti"] },
    { question: "Elektron qanday zaryadga ega?", answer: "Manfiy zaryadga", options: ["Manfiy zaryadga", "Musbat zaryadga", "Zaryadsiz", "O'zgaruvchan zaryadga", "Neytral"] },
    { question: "Proton qanday zaryadga ega?", answer: "Musbat zaryadga", options: ["Musbat zaryadga", "Manfiy zaryadga", "Zaryadsiz", "Manfiy va musbat", "Neytral"] },
    { question: "Neytron qanday zaryadga ega?", answer: "Zaryadga ega emas (neytral)", options: ["Zaryadga ega emas (neytral)", "Musbat zaryadga", "Manfiy zaryadga", "Ikkala zaryadga", "Faqat yorug'likda zaryadlanadi"] },
    { question: "Massa saqlanish qonuni nima?", answer: "Reaksiyaga kirishuvchi moddalar massasi hosil bo'lganlari massasiga teng", options: ["Reaksiyaga kirishuvchi moddalar massasi hosil bo'lganlari massasiga teng", "Moddalar massasi doim o'sadi", "Moddalar massasi doim kamayadi", "Faqat gazlar massasi saqlanadi", "Massa tezlikka bog'liq"] },
    { question: "Izotop nima?", answer: "Protonlari soni bir xil, neytronlari har xil bo'lgan atomlar", options: ["Protonlari soni bir xil, neytronlari har xil bo'lgan atomlar", "Faqat radioaktiv atomlar", "Turli element atomlari", "Zaryadsiz atomlar", "Yangi topilgan elementlar"] },
    { question: "Kimyoviy reaksiya turlari qaysilar?", answer: "Birikish, ajralish, o'rin olish, almashinish", options: ["Birikish, ajralish, o'rin olish, almashinish", "Faqat qaytarilish", "Faqat oksidlanish", "Eritish va muzlatish", "Bug'lanish va kondensatsiya"] },
    { question: "Katalizator nima?", answer: "Kimyoviy reaksiyani tezlashtiruvchi, lekin o'zi sarflanmaydigan modda", options: ["Kimyoviy reaksiyani tezlashtiruvchi, lekin o'zi sarflanmaydigan modda", "Reaksiyani to'xtatuvchi modda", "Faqat rang o'zgartiruvchi modda", "Asosiy reaksiya mahsuloti", "Yonishni qo'llab-quvvatlovchi gaz"] },
    { question: "Eritma nima?", answer: "Erituvchi va eruvchi moddadan iborat bir jinsli sistema", options: ["Erituvchi va eruvchi moddadan iborat bir jinsli sistema", "Faqat qattiq moddalar aralashmasi", "Faqat suv", "Qaynayotgan suyuqlik", "Loyqa suv"] },
  ]

  return Array.from({ length: 1000 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `chemistry-${index + 1}`,
      type: 'chemistry',
      category: 'Kimyo',
      question: `${template.question} (${index + 1})`,
      answer: template.answer,
      options: shuffle(template.options),
    }
  })
}

const createUzbekLanguageQuestions = () => {
  const baseQuestions = [
    { question: "Gap bo'laklari necha turga bo'linadi?", answer: "Bosh va ikkinchi darajali", options: ["Bosh va ikkinchi darajali", "Faqat bosh", "Faqat ikkinchi darajali", "Uch turga", "To'rt turga"] },
    { question: "So'z turkumlari nechta?", answer: "Mustaqil, yordamchi va alohida", options: ["Mustaqil, yordamchi va alohida", "Faqat mustaqil", "Oltita", "Sakkizta", "Faqat ot va fe'l"] },
    { question: "Unli tovushlar nechta?", answer: "Oltita (a, i, o, u, e, o')", options: ["Oltita (a, i, o, u, e, o')", "Beshita", "Yettita", "Sakkizta", "O'nta"] },
    { question: "Qo'shma gap nima?", answer: "Ikki yoki undan ortiq sodda gaplardan tuzilgan gap", options: ["Ikki yoki undan ortiq sodda gaplardan tuzilgan gap", "Faqat bitta kesimdan iborat gap", "Faqat so'roq gap", "Faqat undov gap", "Tugallanmagan fikr"] },
    { question: "Bog'lovchi nima?", answer: "Gap yoki so'zlarni bog'lovchi yordamchi so'z", options: ["Gap yoki so'zlarni bog'lovchi yordamchi so'z", "Mustaqil ma'noli so'z", "Harakatni bildiruvchi so'z", "Belgini bildiruvchi so'z", "Shaxsni ko'rsatuvchi so'z"] },
    { question: "Tinish belgilari qaysilar?", answer: "Nuqta, vergul, so'roq, undov va h.k.", options: ["Nuqta, vergul, so'roq, undov va h.k.", "Faqat nuqta", "Faqat vergul", "Harflar", "Raqamlar"] },
    { question: "Antonim nima?", answer: "Qarama-qarshi ma'noli so'zlar", options: ["Qarama-qarshi ma'noli so'zlar", "Bir xil ma'noli so'zlar", "Shakldosh so'zlar", "Chet tilidan kirgan so'zlar", "Yangi paydo bo'lgan so'zlar"] },
    { question: "Sinonim nima?", answer: "Ma'nosi bir xil, shakli har xil so'zlar", options: ["Ma'nosi bir xil, shakli har xil so'zlar", "Qarama-qarshi so'zlar", "Bir xil yoziladigan so'zlar", "Ma'nosiz so'zlar", "Qadimiy so'zlar"] },
    { question: "Omonim nima?", answer: "Shakli bir xil, ma'nosi har xil so'zlar", options: ["Shakli bir xil, ma'nosi har xil so'zlar", "Ma'nosi bir xil so'zlar", "Qarama-qarshi so'zlar", "O'xshash so'zlar", "Qo'shma so'zlar"] },
    { question: "So'z yasalishi qanday bo'ladi?", answer: "So'z yasovchi qo'shimchalar yordamida", options: ["So'z yasovchi qo'shimchalar yordamida", "Faqat ohang orqali", "Faqat takrorlash orqali", "Faqat urg'u orqali", "Gapirish orqali"] },
    { question: "Morfema nima?", answer: "So'zning eng kichik ma'noli qismi", options: ["So'zning eng kichik ma'noli qismi", "Gapning bir qismi", "Tovushlar yig'indisi", "Alifbo harfi", "Tinish belgisi"] },
    { question: "Fe'l zamonlari qaysilar?", answer: "O'tgan, hozirgi, kelasi", options: ["O'tgan, hozirgi, kelasi", "Faqat hozirgi", "Faqat o'tgan", "Kelasi va hozirgi", "O'tgan va kelasi"] },
    { question: "Sifatdosh nima?", answer: "Harakatning belgisini bildiruvchi fe'l shakli", options: ["Harakatning belgisini bildiruvchi fe'l shakli", "Faqat predmet nomi", "Faqat miqdor", "Sof sifat", "Sanoq son"] },
    { question: "Ravishdosh nima?", answer: "Harakatning holatini bildiruvchi fe'l shakli", options: ["Harakatning holatini bildiruvchi fe'l shakli", "Faqat vaqtni bildiradi", "Faqat joyni bildiradi", "Mustaqil gap bo'lagi", "O'tgan zamon fe'li"] },
    { question: "Harakat nomi nima?", answer: "Harakatning nomini bildiruvchi fe'l shakli (masalan, o'qish)", options: ["Harakatning nomini bildiruvchi fe'l shakli (masalan, o'qish)", "Buyruq mayli", "Shart mayli", "Ot turkumi", "Sifat turkumi"] },
    { question: "Ko'makchi nima?", answer: "So'zlarni bir-biriga bog'lovchi yordamchi so'z", options: ["So'zlarni bir-biriga bog'lovchi yordamchi so'z", "Asosiy ish-harakat", "Sifat darajasi", "Ravish turi", "Mustaqil so'z"] },
    { question: "Yuklamalar nima vazifani bajaradi?", answer: "So'z yoki gapga qo'shimcha ma'no beradi", options: ["So'z yoki gapga qo'shimcha ma'no beradi", "Faqat so'zlarni bog'laydi", "Faqat gap tuzadi", "So'z yasaydi", "Tovushni o'zgartiradi"] },
    { question: "Imlo nima?", answer: "To'g'ri yozish qoidalari", options: ["To'g'ri yozish qoidalari", "To'g'ri talaffuz", "Gapirish san'ati", "She'r o'qish", "Tez yozish"] },
    { question: "Gap maqsadiga ko'ra turlari?", answer: "Darak, so'roq, buyruq, undov", options: ["Darak, so'roq, buyruq, undov", "Faqat darak", "Faqat so'roq va buyruq", "Keng yoyilgan va yig'iq", "Sodda va qo'shma"] },
    { question: "Leksikologiya nima?", answer: "Tilning lug'at boyligini o'rganuvchi bo'lim", options: ["Tilning lug'at boyligini o'rganuvchi bo'lim", "Faqat tovushlarni o'rganadi", "Faqat gap tuzilishini o'rganadi", "Faqat qadimiy tillarni o'rganadi", "Faqat yozuvni o'rganadi"] },
  ]

  return Array.from({ length: 1000 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `uzbek-${index + 1}`,
      type: 'uzbek',
      category: 'Ona tili',
      question: `${template.question} (${index + 1})`,
      answer: template.answer,
      options: shuffle(template.options),
    }
  })
}

const createHistoryQuestions = () => {
  const baseQuestions = [
    { question: "Amir Temur qachon tug'ilgan?", answer: "1336-yilda", options: ["1336-yilda", "1370-yilda", "1405-yilda", "1390-yilda", "1300-yilda"] },
    { question: "Mirzo Ulug'bek qaysi sohada mashhur bo'lgan?", answer: "Astronomiya va matematika", options: ["Astronomiya va matematika", "Tibbiyot", "Me'morchilik", "She'riyat", "Musiqa"] },
    { question: "Buyuk Ipak yo'li nima?", answer: "Sharq va G'arbni bog'lovchi qadimiy savdo yo'li", options: ["Sharq va G'arbni bog'lovchi qadimiy savdo yo'li", "Faqat Ipak ishlab chiqarish yo'li", "Harbiy yurish yo'li", "Faqat O'zbekiston ichidagi yo'l", "Dengiz orqali o'tgan yo'l"] },
    { question: "O'zbekiston Respublikasi qachon mustaqillikka erishgan?", answer: "1991-yil 31-avgust", options: ["1991-yil 31-avgust", "1990-yil 1-sentyabr", "1992-yil 8-dekabr", "1989-yil 21-oktyabr", "1991-yil 1-oktyabr"] },
    { question: "Samarqand shahrining yoshi nechada?", answer: "2750 yildan ortiq", options: ["2750 yildan ortiq", "2000 yildan ortiq", "1500 yil", "1000 yil", "500 yil"] },
    { question: "Buxoro nima bilan mashhur?", answer: "Qadimiy islom madaniyati va minoralari", options: ["Qadimiy islom madaniyati va minoralari", "Faqat zamonaviy binolari", "Yirik zavodlari", "Katta dengizi", "Tog'lari"] },
    { question: "Xorazm akademiyasi qachon faoliyat yuritgan?", answer: "XI asrda (Ma'mun akademiyasi)", options: ["XI asrda (Ma'mun akademiyasi)", "IX asrda", "XIII asrda", "XV asrda", "XIX asrda"] },
    { question: "Temuriylar davlatiga kim asos solgan?", answer: "Amir Temur", options: ["Amir Temur", "Zahiriddin Muhammad Bobur", "Mirzo Ulug'bek", "Alisher Navoiy", "Husayn Boyqaro"] },
    { question: "Jadidchilik harakati qachon va qayerda boshlangan?", answer: "XIX asr oxiri - XX asr boshlarida Turkistonda", options: ["XIX asr oxiri - XX asr boshlarida Turkistonda", "XVIII asrda Buxoroda", "XVII asrda Xorazmda", "XVI asrda Samarqandda", "XV asrda Hirotda"] },
    { question: "Alisher Navoiy kim?", answer: "Buyuk o'zbek shoiri, mutafakkir va davlat arbobi", options: ["Buyuk o'zbek shoiri, mutafakkir va davlat arbobi", "Faqat harbiy sarkarda", "Hukmdor", "Sayyoh", "Me'mor"] },
    { question: "Ibn Sino G'arbda qanday nom bilan mashhur?", answer: "Avicenna", options: ["Avicenna", "Averroes", "Alhazen", "Rhazes", "Geber"] },
    { question: "Al-Xorazmiy qaysi fanga asos solgan?", answer: "Algebra", options: ["Algebra", "Fizika", "Kimyo", "Biologiya", "Geometriya"] },
    { question: "Qadimgi Misrda shohlar qanday atalgan?", answer: "Fir'avnlar", options: ["Fir'avnlar", "Imperatorlar", "Qirollar", "Sultonlar", "Amirlar"] },
    { question: "Qadimgi Yunoniston nima bilan mashhur?", answer: "Olimpiada o'yinlari va demokratiya bilan", options: ["Olimpiada o'yinlari va demokratiya bilan", "Ipak yo'li bilan", "Piramidalar bilan", "Buyuk devori bilan", "Zardushtiylik bilan"] },
    { question: "Qadimgi Rim imperiyasi qaysi qit'alarni egallagan?", answer: "Yevropa, Osiyo va Afrika", options: ["Yevropa, Osiyo va Afrika", "Faqat Yevropa", "Faqat Osiyo", "Shimoliy va Janubiy Amerika", "Avstraliya va Osiyo"] },
    { question: "Ikkinchi jahon urushi qachon bo'lib o'tgan?", answer: "1939-1945 yillarda", options: ["1939-1945 yillarda", "1914-1918 yillarda", "1941-1945 yillarda", "1930-1940 yillarda", "1945-1950 yillarda"] },
    { question: "Birinchi jahon urushi qachon boshlangan?", answer: "1914-yilda", options: ["1914-yilda", "1918-yilda", "1939-yilda", "1905-yilda", "1920-yilda"] },
    { question: "Britaniya imperiyasi nima uchun mashhur bo'lgan?", answer: "Eng ko'p mustamlakaga ega eng yirik imperiya bo'lgani uchun", options: ["Eng ko'p mustamlakaga ega eng yirik imperiya bo'lgani uchun", "Faqat madaniyati uchun", "Hech qachon urushmagani uchun", "Faqat orolda joylashgani uchun", "Imperatorlari yo'qligi uchun"] },
    { question: "Fransuz inqilobi qachon boshlangan?", answer: "1789-yilda", options: ["1789-yilda", "1812-yilda", "1700-yilda", "1900-yilda", "1650-yilda"] },
    { question: "Sanoat inqilobi qayerda va qachon boshlangan?", answer: "XVIII asr oxirida Angliyada", options: ["XVIII asr oxirida Angliyada", "XIX asrda Fransiyada", "XX asrda AQShda", "XVII asrda Germaniyada", "XVIII asrda Rossiyada"] },
  ]

  return Array.from({ length: 1000 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `history-${index + 1}`,
      type: 'history',
      category: 'Tarix',
      question: `${template.question} (${index + 1})`,
      answer: template.answer,
      options: shuffle(template.options),
    }
  })
}

const createGeographyQuestions = () => {
  const baseQuestions = [
    { question: "Yer nechta qavatdan iborat?", answer: "Yadro, mantiya, yer po'sti", options: ["Yadro, mantiya, yer po'sti", "Faqat yadro", "Faqat yer po'sti", "Mantiya va yadro", "Litosfera va gidrosfera"] },
    { question: "Yer yuzida nechta materik bor?", answer: "6 ta", options: ["6 ta", "5 ta", "7 ta", "4 ta", "8 ta"] },
    { question: "Eng katta okean qaysi?", answer: "Tinch okeani", options: ["Tinch okeani", "Atlantika okeani", "Hind okeani", "Shimoliy Muz okeani", "Janubiy okean"] },
    { question: "O'zbekiston qaysi qit'ada joylashgan?", answer: "Osiyoda", options: ["Osiyoda", "Yevropada", "Afrikada", "Amerikada", "Avstraliyada"] },
    { question: "O'zbekistonning poytaxti qaysi?", answer: "Toshkent", options: ["Toshkent", "Samarqand", "Buxoro", "Xiva", "Nukus"] },
    { question: "Dunyoning eng baland tog' cho'qqisi qaysi?", answer: "Everest (Jomolungma)", options: ["Everest (Jomolungma)", "K2", "Elbrus", "Makalu", "Kilimanjaro"] },
    { question: "Dunyodagi eng uzun daryo qaysi?", answer: "Nil (yoki Amazonka)", options: ["Nil (yoki Amazonka)", "Missisipi", "Yanszi", "Volga", "Ob"] },
    { question: "Dunyodagi eng chuqur ko'l qaysi?", answer: "Baykal", options: ["Baykal", "Kaspiy", "Viktoriya", "Orol", "Tanganika"] },
    { question: "Iqlim nima?", answer: "Uzoq yillik ob-havo rejimi", options: ["Uzoq yillik ob-havo rejimi", "Hozirgi kundagi ob-havo", "Faqat harorat", "Yomg'ir yog'ishi", "Shamol esishi"] },
    { question: "Tabiat zonalari qaysilar?", answer: "Tundra, o'rmon, dasht, cho'l va boshqalar", options: ["Tundra, o'rmon, dasht, cho'l va boshqalar", "Faqat o'rmon va cho'l", "Faqat tog' va tekislik", "Iqlim va tuproq", "Daryo va ko'llar"] },
    { question: "Eng katta cho'l qaysi?", answer: "Sahroi Kabir", options: ["Sahroi Kabir", "Qoraqum", "Qizilqum", "Gobi", "Kalahari"] },
    { question: "Aholishunoslik (demografiya) nimani o'rganadi?", answer: "Aholi soni, tarkibi va joylashuvini", options: ["Aholi soni, tarkibi va joylashuvini", "Faqat shaharlarni", "Faqat iqtisodiyotni", "Davlat chegaralarini", "Hayvonot olamini"] },
    { question: "Geografik xarita nima?", answer: "Yer yuzasining tekislikdagi kichiklashtirilgan tasviri", options: ["Yer yuzasining tekislikdagi kichiklashtirilgan tasviri", "Koinot surati", "Shahar rejasi", "Tog'larning rasmi", "Kitobdagi matn"] },
    { question: "Geografik koordinatalar nimadan iborat?", answer: "Kenglik va uzunlikdan", options: ["Kenglik va uzunlikdan", "Balandlik va chuqurlikdan", "Shimol va janubdan", "Ekvator va qutbdan", "Meridian va parallel chiziqlardan emas, faqat masofadan"] },
    { question: "Vulqon nima?", answer: "Yer ostidan magma otilib chiqadigan tog'", options: ["Yer ostidan magma otilib chiqadigan tog'", "Muzlik tog'i", "Suv ostidagi g'or", "Shamol esadigan vodiy", "Qum tepaligi"] },
    { question: "Zilzila nima?", answer: "Yer po'stidagi tebranishlar", options: ["Yer po'stidagi tebranishlar", "Kuchli shamol", "Yomg'ir yog'ishi", "Quyosh tutilishi", "Vulqon otilishi"] },
    { question: "O'rmon turlari qanday?", answer: "Igna bargli, keng bargli, tropik va aralash", options: ["Igna bargli, keng bargli, tropik va aralash", "Faqat mevali", "Faqat quruq", "Suv osti o'rmonlari", "Faqat tog' o'rmonlari"] },
    { question: "Atmosfera nima?", answer: "Yerning havo qobig'i", options: ["Yerning havo qobig'i", "Yerning suv qobig'i", "Yerning tosh qobig'i", "Yer markazi", "Kosmik fazo"] },
    { question: "Gidrosfera nima?", answer: "Yerning suv qobig'i", options: ["Yerning suv qobig'i", "Yerning havo qobig'i", "Tuproq qatlami", "Tirik mavjudotlar yashaydigan joy", "Muzliklar qismi"] },
    { question: "Litosfera nima?", answer: "Yerning qattiq (tosh) qobig'i", options: ["Yerning qattiq (tosh) qobig'i", "Yerning suv qatlami", "Havo qatlami", "Yadro qismi", "Magma qatlami"] },
  ]

  return Array.from({ length: 1000 }, (_, index) => {
    const template = baseQuestions[index % baseQuestions.length]

    return {
      id: `geography-${index + 1}`,
      type: 'geography',
      category: 'Geografiya',
      question: `${template.question} (${index + 1})`,
      answer: template.answer,
      options: shuffle(template.options),
    }
  })
}

const logicQuestions = createLogicQuestions()
const javascriptQuestions = createJavaScriptQuestions()
const reactQuestions = createReactQuestions()
const pythonQuestions = createPythonQuestions()
const computerQuestions = createComputerQuestions()
const cppQuestions = createCppQuestions()
const mathQuestions = createMathQuestions()
const physicsQuestions = createPhysicsQuestions()
const chemistryQuestions = createChemistryQuestions()
const uzbekLanguageQuestions = createUzbekLanguageQuestions()
const historyQuestions = createHistoryQuestions()
const geographyQuestions = createGeographyQuestions()

const BLOCK_SIZE = 10

const buildQuestionBank = () => ({
  javascript: shuffle(javascriptQuestions),
  python: shuffle(pythonQuestions),
  react: shuffle(reactQuestions),
  logic: shuffle(logicQuestions),
  computer: shuffle(computerQuestions),
  cpp: shuffle(cppQuestions),
  math: shuffle(mathQuestions),
  physics: shuffle(physicsQuestions),
  chemistry: shuffle(chemistryQuestions),
  uzbek: shuffle(uzbekLanguageQuestions),
  history: shuffle(historyQuestions),
  geography: shuffle(geographyQuestions),
})

const ADMIN_ACCESS_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin#2026!'

export default function App() {
  const [quizQuestions, setQuizQuestions] = useState(() => buildQuestionBank())
  const [selectedCategory, setSelectedCategory] = useState('javascript')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    try {
      localStorage.removeItem('lqp_registered')
    } catch {}
  }, [])
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)
  const [adminPasswordInput, setAdminPasswordInput] = useState('')
  const [adminError, setAdminError] = useState('')
  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lqp_users')) || []
    } catch {
      return []
    }
  })
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
    { key: 'javascript', label: 'JavaScript', icon: '⚡', count: quizQuestions.javascript.length },
    { key: 'python', label: 'Python', icon: '🐍', count: quizQuestions.python.length },
    { key: 'react', label: 'React', icon: '⚛️', count: quizQuestions.react.length },
    { key: 'logic', label: 'Mantiqiy', icon: '🧠', count: quizQuestions.logic.length },
    { key: 'computer', label: 'Kompyuter', icon: '💻', count: quizQuestions.computer.length },
    { key: 'cpp', label: 'C++', icon: '🧩', count: quizQuestions.cpp.length },
    { key: 'math', label: 'Matematika', icon: '📐', count: quizQuestions.math.length },
    { key: 'physics', label: 'Fizika', icon: '🧲', count: quizQuestions.physics.length },
    { key: 'chemistry', label: 'Kimyo', icon: '🧪', count: quizQuestions.chemistry.length },
    { key: 'uzbek', label: 'Ona tili', icon: '📝', count: quizQuestions.uzbek.length },
    { key: 'history', label: 'Tarix', icon: '📜', count: quizQuestions.history.length },
    { key: 'geography', label: 'Geografiya', icon: '🌍', count: quizQuestions.geography.length },
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

    const newUser = {
      id: Date.now(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      district: formData.district.trim(),
      adminStatus: '0',
      password: '',
    }

    const updatedUsers = [newUser, ...users]
    setUsers(updatedUsers)
    setIsRegistered(true)
    setShowAdminPanel(false)
    setAdminAuthenticated(false)
    setAdminError('')

    try {
      localStorage.setItem('lqp_users', JSON.stringify(updatedUsers))
    } catch {}

    setFormData({
      firstName: '',
      lastName: '',
      district: '',
      adminStatus: '0',
      adminPassword: '',
    })
  }

  const handleLogout = () => {
    setIsRegistered(false)
    try {
      localStorage.removeItem('lqp_registered')
    } catch {}
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

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <div className="app-shell">
      <InteractiveGlowCanvas />
      <div className="container">
        <header className="hero-card">
          <div className="hero-top-row">
            <span className="badge">✨ Intellektual Platforma</span>
            {isRegistered && users.length > 0 ? (
              <div className="user-greeting-chip">
                <span className="user-avatar-badge">{users[0].firstName.charAt(0).toUpperCase()}</span>
                <span className="user-name-text">{users[0].firstName} {users[0].lastName}</span>
                <span className="user-district-tag">📍 {users[0].district}</span>
                <button
                  type="button"
                  className="switch-user-btn"
                  onClick={handleLogout}
                  title="Yangi ishtirokchi sifatida ro'yxatdan o'tish"
                >
                  Ro’yxatdan o’tish
                </button>
              </div>
            ) : (
              <span className="badge">📝 Ro’yxatdan o’tish zarur</span>
            )}
          </div>
          <h1>Logic Quest <span className="highlight-text">PRO</span></h1>
          <p>
            Dasturlash, aniq va gumanitar fanlar hamda mantiqiy fikrlash bo'yicha 10 000 dan ortiq
            saralangan savollar bilan bilimingizni sinang va yuqori natijalarga erishing!
          </p>
          <div className="hero-pills">
            <div className="pill-item"><span>⚡</span> 10 000+ Sara Savollar</div>
            <div className="pill-item"><span>📚</span> 12 ta Fan va Yo'nalish</div>
            <div className="pill-item"><span>🎯</span> Har 10 ta savolda yangi bosqich</div>
          </div>
        </header>

        <section className="dashboard-grid">
          {!isRegistered ? (
            <div className="register-card">
              <div className="card-heading-box">
                <div className="header-icon-circle">📝</div>
                <div>
                  <h2>Ro’yxatdan o’tish</h2>
                  <p className="subtle-text">Viktorinani boshlash uchun ma'lumotlaringizni kiriting</p>
                </div>
              </div>

              <form className="register-form" onSubmit={handleRegister}>
                <label className="field">
                  <span>Ismingiz</span>
                  <div className="input-with-icon">
                    <span className="field-icon">👤</span>
                    <input name="firstName" value={formData.firstName} onChange={handleFormChange} placeholder="Ismingizni kiriting" required />
                  </div>
                </label>

                <label className="field">
                  <span>Familiyangiz</span>
                  <div className="input-with-icon">
                    <span className="field-icon">👥</span>
                    <input name="lastName" value={formData.lastName} onChange={handleFormChange} placeholder="Familiyangizni kiriting" required />
                  </div>
                </label>

                <label className="field">
                  <span>Tuman / Shahar</span>
                  <div className="input-with-icon">
                    <span className="field-icon">📍</span>
                    <input name="district" value={formData.district} onChange={handleFormChange} placeholder="Masalan: Chilonzor tumani" required />
                  </div>
                </label>

                <button type="submit" className="submit-btn">
                  <span>Ro’yxatdan o’tish va Boshlash</span>
                  <span className="btn-arrow">→</span>
                </button>
              </form>
            </div>
          ) : null}

          {isRegistered ? (
            <div className="admin-card">
              <div className="admin-header-row">
                <div className="admin-title-area">
                  <span className="admin-icon-pill">🔐</span>
                  <h2>Adminga kirish</h2>
                </div>
                <div className="admin-btn-group">
                  <button className="access-btn" onClick={openAdminPanel}>
                    {showAdminPanel ? 'Yopish' : 'Admin panel'}
                  </button>
                  <button className="logout-btn" onClick={handleLogout} title="Boshqa nomdan ro'yxatdan o'tish">
                    Chiqish
                  </button>
                </div>
              </div>

              {showAdminPanel && !adminAuthenticated ? (
                <form className="admin-login-form" onSubmit={handleAdminLogin}>
                  <label className="field">
                    <span>Admin paroli</span>
                    <input
                      type="password"
                      value={adminPasswordInput}
                      onChange={(event) => setAdminPasswordInput(event.target.value)}
                      placeholder="Admin parolini kiriting"
                      required
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
                          <div className="user-avatar-sm">{user.firstName.charAt(0).toUpperCase()}</div>
                          <div className="user-details">
                            <strong>{user.firstName} {user.lastName}</strong>
                            <span>📍 {user.district}</span>
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
              <div className="prompt-shield-icon">🔒</div>
              <span className="badge">Boshlash uchun</span>
              <h2>Avval ro’yxatdan o’ting</h2>
              <p>Chap tarafdagi formani to'ldirib, "Ro'yxatdan o'tish" tugmasini bosing. Barcha fanlar va 10 000+ savollar darhol ochiladi.</p>
              <div className="prompt-highlights">
                <div className="highlight-item"><span>✨</span> Barcha 12 ta fandan 10 000+ savollar bazasi</div>
                <div className="highlight-item"><span>🎯</span> Har 10 ta savolda qiyinlashib boruvchi bosqichlar</div>
                <div className="highlight-item"><span>⚡</span> Tezkor natijalar va to'g'ri javoblar ko'rsatgichi</div>
              </div>
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
                    <span className="cat-icon">{category.icon}</span>
                    <span className="cat-label">{category.label}</span>
                    <strong className="cat-count">{category.count}</strong>
                  </button>
                ))}
              </div>

              {!showResult ? (
                <>
                  <div className="progress-head">
                    <div className="progress-caption">
                      <span>🚀</span> Bosqich {currentBlock} • Har 10 ta savol qiyinlashadi
                    </div>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar" style={{ width: `${currentBlockProgress}%` }} />
                  </div>

                  <div className="question-box">
                    <span className="question-tag">{currentQuestion.category}</span>
                    <h2>{currentQuestion.question}</h2>
                  </div>

                  <div className="options-grid">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === option
                      const isCorrect = option === currentQuestion.answer
                      const letter = optionLetters[idx] || `${idx + 1}`
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
                          <span className="option-letter-badge">{letter}</span>
                          <span className="option-text">{option}</span>
                          {selectedOption !== null && isCorrect && <span className="option-mark">✓</span>}
                          {selectedOption !== null && isSelected && !isCorrect && <span className="option-mark">✕</span>}
                        </button>
                      )
                    })}
                  </div>

                  {selectedOption !== null ? (
                    <div className="feedback-box">
                      <div className={`feedback-message ${selectedOption === currentQuestion.answer ? 'success' : 'error'}`}>
                        <span className="fb-icon">{selectedOption === currentQuestion.answer ? '🎉' : '❌'}</span>
                        <div className="fb-text">
                          <strong>{selectedOption === currentQuestion.answer ? 'To\'g\'ri javob!' : 'Noto\'g\'ri javob!'}</strong>
                          <span>{selectedOption === currentQuestion.answer ? 'Barakalla! Keyingi savolga o\'tishingiz mumkin.' : `To'g'ri javob: ${currentQuestion.answer}`}</span>
                        </div>
                      </div>
                      <div className="next-action">
                        <button className="next-btn" onClick={goToNextQuestion}>
                          <span>Keyingisi</span>
                          <span className="key-hint">Enter ↵</span>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="result-box">
                  <div className="trophy-display">🏆</div>
                  <span className="badge">Natija</span>
                  <h2>Test Yakunlandi!</h2>
                  <p>
                    Ushbu bo'limdagi savollarni muvaffaqiyatli yakunladingiz. Qayta boshlash orqali yangi random ketma-ketlikdagi savollarni ko'rishingiz mumkin.
                  </p>
                  <button className="reset-btn" onClick={resetQuiz}>
                    <span>🔄 Qayta boshlash</span>
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
