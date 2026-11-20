/**
 * PhD Диссертация Мониторинги - JavaScript Application
 * Ихтисослик: 03.00.05 — Ботаника
 * Мавзу: MEDIASIA MACROHYLLA (REGEL & SCHMALH.) PIMENOVNING JANUBI-G‘ARBIY HISOR TOG‘ TIZMALARI SHAROITIDAGI BIOEKOLOGIYASI
 */

const STORAGE_KEY = 'phd_botany_tracker_data_v3';

// ==================== OAK A4 OFFICIAL FORMATTING RULES ====================
// Standard dissertation page according to Uzbekistan OAK (Higher Attestation Commission):
// - Paper: A4 (210 x 297 mm)
// - Margins: Left 30mm, Right 15mm, Top 20mm, Bottom 20mm
// - Font: Times New Roman, 14 pt
// - Line spacing: 1.5 lines (полуторный интервал)
// - Density: 1 standard page is strictly ~1,800 characters with spaces (or ~250-280 words)
const OAK_A4_CHARS_PER_PAGE = 1800;

function calculateA4Stats(htmlContent) {
  if (!htmlContent || !htmlContent.trim()) {
    return { pages: 0, progress: 0, words: 0, chars: 0 };
  }
  const tmp = document.createElement('div');
  tmp.innerHTML = htmlContent;
  const clean = (tmp.innerText || tmp.textContent || '').replace(/\u00a0/g, ' ').trim();
  if (!clean) {
    return { pages: 0, progress: 0, words: 0, chars: 0 };
  }

  const chars = clean.length;
  const words = clean.split(/\s+/).filter(Boolean).length;
  // Calculate exact A4 pages: 1 decimal place (e.g. 4.2 pages)
  const rawPages = chars / OAK_A4_CHARS_PER_PAGE;
  const pages = Math.round(rawPages * 10) / 10;

  return { pages, words, chars };
}

// Recalculates all sections strictly based on actual written or uploaded text volume
function recalculateAllSectionsFromActualContent() {
  if (!state || !state.structure) return;

  state.structure.forEach(item => {
    if (item.subsections && item.subsections.length > 0) {
      item.subsections.forEach(sub => {
        const stats = calculateA4Stats(sub.content);
        sub.pages = stats.pages;
        sub.wordCount = stats.words;
        sub.charCount = stats.chars;

        const target = Number(sub.targetPages) || 12;
        sub.progress = target > 0 ? Math.min(100, Math.round((stats.pages / target) * 100)) : 0;

        // Automatic status update based on actual content
        if (sub.progress >= 100) {
          sub.status = 'completed';
        } else if (sub.progress > 0) {
          if (sub.status === 'not_started') sub.status = 'in_progress';
        } else {
          sub.status = 'not_started';
        }
      });
    } else {
      const stats = calculateA4Stats(item.content);
      item.pages = stats.pages;
      item.wordCount = stats.words;
      item.charCount = stats.chars;

      const target = Number(item.targetPages) || 15;
      item.progress = target > 0 ? Math.min(100, Math.round((stats.pages / target) * 100)) : 0;

      if (item.progress >= 100) {
        item.status = 'completed';
      } else if (item.progress > 0) {
        if (item.status === 'not_started') item.status = 'in_progress';
      } else {
        item.status = 'not_started';
      }
    }
  });
}

// Initial default data tailored to the user's specific dissertation plan
const DEFAULT_DATA = {
  settings: {
    topic: "MEDIASIA MACROHYLLA (REGEL & SCHMALH.) PIMENOVNING JANUBI-G‘ARBIY HISOR TOG‘ TIZMALARI SHAROITIDAGI BIOEKOLOGIYASI",
    author: "Саидмуродова Иноят",
    specialty: "03.00.05 — Ботаника",
    supervisor: "Илмий раҳбар: б.ф.д., профессор",
    targetPages: 140,
    targetArticles: 7,
    defenseDate: "2027-10-15",
    herbariumCount: "120+ намуна",
    speciesCount: "Mediasia macrohylla",
    populationsCount: "8 та сенопопуляция",
    labStatus: "Уруғ ва ер устки органлар таҳлили"
  },
  structure: [
    {
      id: "sec-kirish",
      code: "КИРИШ",
      title: "KIRISH (Mavzuning dolzarbligi, maqsad, vazifalar, ilmiy yangilik va amaliy natijalar)",
      status: "in_progress",
      progress: 50,
      pages: 12,
      targetPages: 15,
      deadline: "2026-12-30",
      notes: "Dolzarblik, ilmiy yangiliklar va OAK talabi bo'yicha dissertatsiya pasporti shakllantirilmoqda."
    },
    {
      id: "sec-bob1",
      code: "I BOB",
      title: "BOTANIK TADQIQOTLARDA SENOPOPULYATSION IZLANISHLARNING O‘RNI, HUDUDNING VA O‘RGANILAYOTGAN TURNING QISQACHA TAVSIFI",
      isChapterHeader: true,
      subsections: [
        {
          id: "sec-1-1",
          code: "§1.1",
          title: "Tadqiqot olib borilgan hududning qisqacha tavsifi",
          status: "in_progress",
          progress: 60,
          pages: 10,
          targetPages: 12,
          deadline: "2027-01-20",
          notes: "Janubi-G'arbiy Hisor tog' tizmalarining orografiyasi, iqlimi va tuproq sharoitlari yozilmoqda."
        },
        {
          id: "sec-1-2",
          code: "§1.2",
          title: "Mediasia macrohylla ning qisqacha botanik tavsifi",
          status: "in_progress",
          progress: 40,
          pages: 8,
          targetPages: 14,
          deadline: "2027-02-15",
          notes: "Turning taksonomik o'rni, sistematikasi va morfologik belgilari adabiyotlar tahlili bilan to'ldirilmoqda."
        }
      ]
    },
    {
      id: "sec-bob2",
      code: "II BOB",
      title: "JANUBI-G‘ARBIY HISOR TOG‘ TIZMALARI SHAROITLARIDA MEDIASIA MACROHYLLA (REGEL & SCHMALH.) PIMENOVNING BIOEKOLOGIK TAVSIFI",
      isChapterHeader: true,
      subsections: [
        {
          id: "sec-2-1",
          code: "§2.1",
          title: "Mediasia macrohylla ning ontogenezi",
          status: "in_progress",
          progress: 35,
          pages: 9,
          targetPages: 16,
          deadline: "2027-03-30",
          notes: "Ontogenetik davrlar: latent, virginal, generativ va senil bosqichlarining tavsifi."
        },
        {
          id: "sec-2-2",
          code: "§2.2",
          title: "Mediasia macrohylla ning fenologiyasi",
          status: "not_started",
          progress: 10,
          pages: 2,
          targetPages: 12,
          deadline: "2027-04-25",
          notes: "O'suv davri, kurtak yozish, shonalash, gullash va meva yetilish fenofazalari."
        },
        {
          id: "sec-2-3",
          code: "§2.3",
          title: "Mediasia macrohylla ning sutkalik gullash dinamikasi",
          status: "not_started",
          progress: 0,
          pages: 0,
          targetPages: 10,
          deadline: "2027-05-20",
          notes: "To'pgulda gullarning ochilish tartibi, changchi va urug'chining yetilish dinamikasi."
        }
      ]
    },
    {
      id: "sec-bob3",
      code: "III BOB",
      title: "MEDIASIA MACROHYLLA (REGEL & SCHMALH.) PIMENOVNING SENOPOPULYATSION TAVSIFI",
      isChapterHeader: true,
      subsections: [
        {
          id: "sec-3-1",
          code: "§3.1",
          title: "Turning fitotsenotik tavsifi",
          status: "in_progress",
          progress: 25,
          pages: 6,
          targetPages: 15,
          deadline: "2027-06-30",
          notes: "Mediasia macrohylla ishtirokidagi o'simlik jamoalari va dominant turlar tavsifi."
        },
        {
          id: "sec-3-2",
          code: "§3.2",
          title: "Senopopulyatsiyalarning demografik tavsifi",
          status: "not_started",
          progress: 0,
          pages: 0,
          targetPages: 15,
          deadline: "2027-07-30",
          notes: "Yosh spektrlari (normal, invazion, regressiv tiplar) va populyatsiya ko'rsatkichlari."
        },
        {
          id: "sec-3-3",
          code: "§3.3",
          title: "Senopopulyatsiyalarning fazoviy strukturasi",
          status: "not_started",
          progress: 0,
          pages: 0,
          targetPages: 12,
          deadline: "2027-08-30",
          notes: "Individlarning maydon bo'yicha tarqalish qonuniyatlari va klasterlar tahlili."
        }
      ]
    },
    {
      id: "sec-bob4",
      code: "IV BOB",
      title: "O‘ZBEKISTON JANUBI SHAROITIDA MEDIASIA MACROHYLLA (REGEL & SCHMALH.) PIMENOVNING ONTOGENETIK TAKTIKA VA STRATEGIYALARI",
      isChapterHeader: true,
      subsections: [
        {
          id: "sec-4-1",
          code: "§4.1",
          title: "Mediasia macrohylla vitalitetining tahlili",
          status: "not_started",
          progress: 0,
          pages: 0,
          targetPages: 12,
          deadline: "2027-09-30",
          notes: "Vitalitet spektrlari, turning hayotiylik darajasi (a, b, c sinflar bo'yicha)."
        },
        {
          id: "sec-4-2",
          code: "§4.2",
          title: "Mediasia macrohylla ning ontogenetik taktika va strategiyalari",
          status: "not_started",
          progress: 0,
          pages: 0,
          targetPages: 12,
          deadline: "2027-10-30",
          notes: "Ekolik-senotik strategiyalar (Ramenskiy-Graim bo'yicha) va moslashuvchanlik xususiyatlari."
        }
      ]
    },
    {
      id: "sec-bob5",
      code: "V BOB",
      title: "MEDIASIA MACROHYLLA (REGEL & SCHMALH.) PIMENOVDAN AMALIY FOYDALANISH VA UNI MUHOFAZA QILISH CHORALARI",
      isChapterHeader: true,
      subsections: [
        {
          id: "sec-5-1",
          code: "§5.1",
          title: "Mediasia macrohylla ning yer ustki organlari va urug‘ining kimyoviy tarkibi",
          status: "in_progress",
          progress: 20,
          pages: 4,
          targetPages: 14,
          deadline: "2027-11-30",
          notes: "Efir moylari, flavonoidlar va boshqa biologik faol moddalar tahlili laboratoriya natijalari."
        },
        {
          id: "sec-5-2",
          code: "§5.2",
          title: "Mediasia macrohylla ni ko‘paytirish choralari",
          status: "not_started",
          progress: 0,
          pages: 0,
          targetPages: 10,
          deadline: "2027-12-20",
          notes: "Urug'idan va vegetativ ko'paytirish, introduktsiya imkoniyatlari."
        },
        {
          id: "sec-5-3",
          code: "§5.3",
          title: "Mediasia macrohylla ni muhofaza qilish choralari",
          status: "not_started",
          progress: 0,
          pages: 0,
          targetPages: 10,
          deadline: "2028-01-20",
          notes: "Qizil kitob mezonlari (IUCN) va tabiiy populyatsiyalarni saqlash tavsiyalari."
        }
      ]
    },
    {
      id: "sec-xulosalar",
      code: "ХУЛОСАЛАР",
      title: "XULOSALAR VA AMALIY TAVSIYALAR",
      status: "not_started",
      progress: 0,
      pages: 0,
      targetPages: 5,
      deadline: "2028-02-15",
      notes: "Tadqiqot natijalari bo'yicha umumlashtirilgan 8-10 ta asosiy xulosa va ishlab chiqarish tavsiyalari."
    },
    {
      id: "sec-adabiyotlar",
      code: "АДАБИЁТЛАР",
      title: "FOYDALANILGAN ADABIYOTLAR RO‘YXATI VA ILOVALAR",
      status: "in_progress",
      progress: 45,
      pages: 14,
      targetPages: 25,
      deadline: "2028-03-01",
      notes: "OAK talablari asosida shakllantirilgan milliy va xorijiy ilmiy manbalar, gerbariy jadvallari."
    }
  ],
  articles: [
    {
      id: "art-1",
      title: "Janubi-G'arbiy Hisor sharoitida Mediasia macrohylla ning ontogenezi va fenologik xususiyatlari",
      journal: "O'zbekiston biologiya jurnali",
      category: "oak",
      authors: "Saidmurodova I., Ilmiy rahbar",
      status: "review",
      date: "2026-12-15",
      link: ""
    },
    {
      id: "art-2",
      title: "Cenopopulation structure and ontogenetic strategy of Mediasia macrohylla (Apiaceae) in the South-Western Hissar Range",
      journal: "Plant Science / Phytotaxa (Scopus)",
      category: "scopus",
      authors: "Saidmurodova I., et al.",
      status: "draft",
      date: "2027-04-10",
      link: ""
    },
    {
      id: "art-3",
      title: "Mediasia macrohylla ning tabiiy senopopulyatsiyalarida urug' mahsuldorligi va ko'payish imkoniyatlari",
      journal: "O'zMU xabarlari (OAK)",
      category: "oak",
      authors: "Saidmurodova I.",
      status: "draft",
      date: "2027-06-20",
      link: ""
    },
    {
      id: "art-4",
      title: "Mediasia macrohylla yer ustki qismi efir moylarining komponent tarkibi va amaliy ahamiyati",
      journal: "O'zbekiston kimyo jurnali (OAK)",
      category: "oak",
      authors: "Saidmurodova I., Hammualliflar",
      status: "draft",
      date: "2027-09-15",
      link: ""
    },
    {
      id: "art-5",
      title: "Hisor tog' tizmasi sharoitida noyob dorivor o'simliklarni saqlash va muhofaza qilish istiqbollari",
      journal: "Xalqaro ilmiy-amaliy anjuman materiallari",
      category: "conf_intl",
      authors: "Saidmurodova I.",
      status: "accepted",
      date: "2026-11-10",
      link: ""
    }
  ],
  literature: [
    {
      id: "lit-1",
      title: "Определитель растений Средней Азии (Umbelliferae / Apiaceae)",
      author: "Пименов М.Г., Клюйков Е.В.",
      year: 1983,
      type: "flora",
      status: "cited",
      notes: "Mediasia macrohylla taksonomiyasining tavsifi va kalitlari."
    },
    {
      id: "lit-2",
      title: "Жизненные формы и онтогенез растений",
      author: "Серебряков И.Г.",
      year: 1962,
      type: "book",
      status: "cited",
      notes: "Ontogenez bosqichlarini tasniflash metodikasi."
    },
    {
      id: "lit-3",
      title: "Ценопопуляции растений (основные понятия и структура)",
      author: "Уранов А.А., Работнов Т.А.",
      year: 1976,
      type: "book",
      status: "cited",
      notes: "Senopopulyatsiyalarning yosh spektrlari va demografiyasi metodikasi."
    },
    {
      id: "lit-4",
      title: "Популяционная экология растений",
      author: "Злобин Ю.А.",
      year: 1989,
      type: "book",
      status: "read",
      notes: "Vitalitet spektrlari va ontogenetik strategiyalarni hisoblash usullari."
    },
    {
      id: "lit-5",
      title: "O'zbekiston florasi va o'simliklar qoplami",
      author: "Tojiboyev K.Sh. va boshqalar",
      year: 2018,
      type: "book",
      status: "read",
      notes: "Hisor tizmasi floristik tahlili va areallari."
    }
  ],
  roadmap: [
    {
      id: "road-1",
      step: "1-босқич",
      title: "Мавзу ва илмий раҳбарни Кенгашда тасдиқлаш",
      desc: "Диссертация мавзуси, ихтисослик шифри (03.00.05) ва илмий раҳбарнинг ОТМ/Илмий кенгаш қарори билан расмий тасдиқланиши.",
      status: "done",
      date: "2025-10-15"
    },
    {
      id: "road-2",
      step: "2-босқич",
      title: "Малакавий имтиҳонларни топшириш",
      desc: "Чет тили ва мутахассислик (Ботаника) бўйича малакавий имтиҳонларни муваффақиятли топшириш ва сертификат олиш.",
      status: "in_progress",
      date: "2026-12-25"
    },
    {
      id: "road-3",
      step: "3-босқич",
      title: "Дала экспедициялари ва лаборатория тадқиқотлари",
      desc: "Жануби-Ғарбий Ҳисор тоғларида дала изланишлари, гербарий йиғиш, фенология ва сенопопуляцияларни тўлиқ ўрганиш.",
      status: "in_progress",
      date: "2027-08-30"
    },
    {
      id: "road-4",
      step: "4-босқич",
      title: "Илмий мақолалар меъёрини бажариш (ОАК ва Scopus)",
      desc: "ОАК эътироф этган журналларда камида 3 та ва халқаро журналда (Scopus) 1 та мақола нашр эттириш.",
      status: "in_progress",
      date: "2027-10-01"
    },
    {
      id: "road-5",
      step: "5-босқич",
      title: "Диссертация дастлабки матнини ёзиб тугатиш",
      desc: "Кириш, 5 та боб, хулосалар ва иловаларни тўлиқ шакллантириб, илмий раҳбар кўригига топшириш.",
      status: "pending",
      date: "2027-11-15"
    },
    {
      id: "road-6",
      step: "6-босқич",
      title: "Кафедра / Лаборатория муҳокамаси (Дастлабки экспертиза)",
      desc: "Мутахассис олимлар олдида диссертация дастлабки натижалари бўйича маъруза қилиш ва хулоса олиш.",
      status: "pending",
      date: "2027-12-20"
    },
    {
      id: "road-7",
      step: "7-босқич",
      title: "Илмий семинар (Апробация)",
      desc: "Илмий даражалар берувчи кенгаш қошидаги Илмий семинар муҳокамасидан ўтиш ва ҳимояга тавсия олиш.",
      status: "pending",
      date: "2028-02-15"
    },
    {
      id: "road-8",
      step: "8-босқич",
      title: "Ҳужжатларни Илмий кенгашга тақдим этиш",
      desc: "Авторефератни чоп этиш, тақризчиларни тайинлаш ва расмий ҳимоя кунини белгилаш.",
      status: "pending",
      date: "2028-03-20"
    },
    {
      id: "road-9",
      step: "9-босқич",
      title: "Диссертациянинг РАСМИЙ ҲИМОЯСИ",
      desc: "Илмий кенгаш мажлисида диссертацияни муваффақиятли ҳимоя қилиш ва PhD дипломи тасдиғи.",
      status: "pending",
      date: "2028-05-15"
    }
  ],
  notes: [
    {
      id: "note-1",
      date: "2026-11-15",
      subject: "I боб ва §1.2 мазмуни бўйича",
      text: "Mediasia macrohylla турининг Janubi-G'arbiy Hisor bo'yicha tarqalish nuqtalari koordinatalarini xaritaga tushirish va gerbariy raqamlarini jadvalga kiritish.",
      status: "in_progress"
    },
    {
      id: "note-2",
      date: "2026-10-20",
      subject: "II боб ва онтогенез даврлари",
      text: "O'simlikning yosh bosqichlarini tasniflashda A.A.Uranov va Rabotnov uslubidan aniq foydalanish, fotosuratlarni sifatli qilib tayyorlash.",
      status: "done"
    }
  ]
};

// Global App State
let state = loadData();

// Chart instances
let overallChartInstance = null;
let chaptersChartInstance = null;

// ==================== STORAGE & LIFECYCLE ====================

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch (e) {
    console.error("Local storage error:", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state:", e);
  }
  updateUI();
  if (typeof cloudConfig !== 'undefined' && cloudConfig && cloudConfig.enabled) {
    pushToCloud(false);
  }
}

function resetToDefaultData() {
  if (confirm("Диссертациянинг барча маълумотларини дастлабки намуна ҳолатига қайтармоқчимисиз?")) {
    state = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveData();
    alert("Маълумотлар қайта тикланди!");
  }
}

function exportData() {
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", jsonStr);
  dlAnchor.setAttribute("download", `PhD_Botany_Tracker_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported.settings && imported.structure) {
        state = imported;
        saveData();
        alert("Маълумотлар муваффақиятли тикланди!");
      } else {
        alert("Файл формати нотўғри!");
      }
    } catch (err) {
      alert("Файлни ўқишда хатолик: " + err.message);
    }
  };
  reader.readAsText(file);
}

// ==================== TAB SWITCHING ====================

function switchTab(tabId) {
  document.querySelectorAll('.tab-view').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

  const view = document.getElementById(`view-${tabId}`);
  const btn = document.getElementById(`tab-${tabId}`);

  if (view) view.classList.remove('hidden');
  if (btn) btn.classList.add('active');

  // If switched to dashboard, re-render charts to prevent sizing glitches
  if (tabId === 'dashboard') {
    renderCharts();
  }
}

// ==================== CALCULATIONS & METRICS ====================

function calculateProgress() {
  // 0. Recalculate all sections strictly from actual written or uploaded Word content
  recalculateAllSectionsFromActualContent();

  // 1. Structure Progress & Page counts
  let totalSections = 0;
  let sumSectionProgress = 0;
  let totalPagesWritten = 0;

  state.structure.forEach(item => {
    if (item.subsections && item.subsections.length > 0) {
      item.subsections.forEach(sub => {
        totalSections++;
        sumSectionProgress += (Number(sub.progress) || 0);
        totalPagesWritten += (Number(sub.pages) || 0);
      });
    } else {
      totalSections++;
      sumSectionProgress += (Number(item.progress) || 0);
      totalPagesWritten += (Number(item.pages) || 0);
    }
  });

  totalPagesWritten = Math.round(totalPagesWritten * 10) / 10;
  const structurePercent = totalSections > 0 ? Math.round(sumSectionProgress / totalSections) : 0;

  // 2. Articles Progress
  const publishedCount = state.articles.filter(a => a.status === 'published').length;
  const targetArticles = Number(state.settings.targetArticles) || 7;
  // Weighted: published = 1, accepted = 0.8, review = 0.5, draft = 0.2
  let articleScore = 0;
  state.articles.forEach(a => {
    if (a.status === 'published') articleScore += 1;
    else if (a.status === 'accepted') articleScore += 0.85;
    else if (a.status === 'review') articleScore += 0.5;
    else if (a.status === 'draft') articleScore += 0.25;
  });
  const articlesPercent = Math.min(100, Math.round((articleScore / targetArticles) * 100));

  // 3. Roadmap Progress
  const totalMilestones = state.roadmap.length;
  let milestoneScore = 0;
  state.roadmap.forEach(m => {
    if (m.status === 'done') milestoneScore += 1;
    else if (m.status === 'in_progress') milestoneScore += 0.5;
  });
  const roadmapPercent = totalMilestones > 0 ? Math.round((milestoneScore / totalMilestones) * 100) : 0;
  const milestonesDoneCount = state.roadmap.filter(m => m.status === 'done').length;

  // 4. Literature Count
  const readLitCount = state.literature.filter(l => l.status === 'read' || l.status === 'cited').length;
  const targetLit = 120;
  const litPercent = Math.min(100, Math.round((readLitCount / targetLit) * 100));

  // 5. Total Integral Progress (Structure: 50%, Articles: 30%, Roadmap: 20%)
  const totalIntegralProgress = Math.round(
    (structurePercent * 0.5) + (articlesPercent * 0.3) + (roadmapPercent * 0.2)
  );

  return {
    totalIntegralProgress,
    structurePercent,
    articlesPercent,
    roadmapPercent,
    totalPagesWritten,
    targetPages: Number(state.settings.targetPages) || 140,
    publishedCount,
    targetArticles,
    readLitCount,
    targetLit,
    milestonesDoneCount,
    totalMilestones
  };
}

// ==================== RENDERING UI ====================

function updateUI() {
  const metrics = calculateProgress();

  // Top banner & Header
  document.getElementById('headerProgressText').innerText = `${metrics.totalIntegralProgress}%`;
  document.getElementById('headerProgressBar').style.width = `${metrics.totalIntegralProgress}%`;

  document.getElementById('bannerTopic').innerText = state.settings.topic || '';
  document.getElementById('bannerAuthor').innerText = state.settings.author || '';
  if (document.getElementById('sidebarAuthor')) {
    document.getElementById('sidebarAuthor').innerText = state.settings.author || '';
  }
  document.getElementById('bannerSupervisor').innerText = state.settings.supervisor || '';
  document.getElementById('bannerDefenseDate').innerText = state.settings.defenseDate ? formatDatePretty(state.settings.defenseDate) : '2027 йил';

  // Countdown
  renderCountdown();

  // Dashboard Metric Cards
  document.getElementById('metricPagesActual').innerText = metrics.totalPagesWritten;
  document.getElementById('metricPagesTarget').innerText = metrics.targetPages;
  const pagesPercent = Math.min(100, Math.round((metrics.totalPagesWritten / metrics.targetPages) * 100));
  document.getElementById('metricPagesPercent').innerText = `${pagesPercent}%`;
  document.getElementById('metricPagesBar').style.width = `${pagesPercent}%`;

  document.getElementById('metricArticlesPublished').innerText = metrics.publishedCount;
  document.getElementById('metricArticlesTarget').innerText = metrics.targetArticles;
  document.getElementById('metricArticlesPercent').innerText = `${metrics.articlesPercent}%`;
  document.getElementById('metricArticlesBar').style.width = `${metrics.articlesPercent}%`;

  document.getElementById('metricLitRead').innerText = metrics.readLitCount;
  document.getElementById('metricLitTarget').innerText = metrics.targetLit;
  document.getElementById('metricLitPercent').innerText = `${metrics.litPercent}%`;
  document.getElementById('metricLitBar').style.width = `${metrics.litPercent}%`;

  document.getElementById('metricMilestonesDone').innerText = metrics.milestonesDoneCount;
  document.getElementById('metricMilestonesTotal').innerText = metrics.totalMilestones;
  document.getElementById('metricMilestonesPercent').innerText = `${metrics.roadmapPercent}%`;
  document.getElementById('metricMilestonesBar').style.width = `${metrics.roadmapPercent}%`;

  // Weights on Dashboard
  document.getElementById('weightTextChapters').innerText = `${metrics.structurePercent}%`;
  document.getElementById('weightTextArticles').innerText = `${metrics.articlesPercent}%`;
  document.getElementById('weightTextRoadmap').innerText = `${metrics.roadmapPercent}%`;
  document.getElementById('chartOverallNumber').innerText = `${metrics.totalIntegralProgress}%`;

  // Botanical quick stats
  if (state.settings.herbariumCount) document.getElementById('statHerbarium').innerText = state.settings.herbariumCount;
  if (state.settings.speciesCount) document.getElementById('statSpecies').innerText = state.settings.speciesCount;
  if (state.settings.populationsCount) document.getElementById('statPopulations').innerText = state.settings.populationsCount;
  if (state.settings.labStatus) document.getElementById('statLab').innerText = state.settings.labStatus;

  // Render individual tabs
  renderSidebarChaptersProgress();
  renderUpcomingDeadlines();
  renderStructure();
  renderArticles();
  renderLiterature();
  renderRoadmap();
  renderNotes();
  renderCharts();
}

// Sidebar Chapters Progress List
function renderSidebarChaptersProgress() {
  const container = document.getElementById('sidebarChaptersList');
  if (!container) return;

  // Filter out conclusions (Хулосалар) as requested
  const visibleItems = state.structure.filter(item => {
    const code = (item.code || '').toUpperCase();
    const title = (item.title || '').toUpperCase();
    return !code.includes('ХУЛОСА') && !title.includes('XULOSA') && item.id !== 'sec-xulosalar';
  });

  container.innerHTML = visibleItems.map(item => {
    let progress = 0;
    if (item.subsections && item.subsections.length > 0) {
      let sum = 0;
      item.subsections.forEach(s => sum += (Number(s.progress) || 0));
      progress = Math.round(sum / item.subsections.length);
    } else {
      progress = Number(item.progress) || 0;
    }

    // Short label for neat display
    let shortName = item.code;
    if (item.code === 'КИРИШ') shortName = 'Кириш';
    else if (item.code === 'АДАБИЁТЛАР') shortName = 'Адабиётлар';

    // Color based on completion
    let barColor = 'bg-botany-600';
    let textColor = 'text-slate-700';
    if (progress === 100) {
      barColor = 'bg-emerald-500';
      textColor = 'text-emerald-700 font-bold';
    } else if (progress === 0) {
      barColor = 'bg-slate-300';
      textColor = 'text-slate-400';
    }

    return `
      <div onclick="switchTab('structure')" class="group flex items-center justify-between text-[11px] cursor-pointer hover:bg-white/80 p-1 rounded-md transition" title="${item.title}: ${progress}% тайёр">
        <span class="font-semibold text-slate-700 group-hover:text-botany-800 truncate w-14 shrink-0">${shortName}</span>
        <div class="flex-1 mx-2 bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
          <div class="${barColor} h-full rounded-full transition-all duration-500" style="width: ${progress}%"></div>
        </div>
        <span class="font-bold text-[10px] ${textColor} w-7 text-right shrink-0">${progress}%</span>
      </div>
    `;
  }).join('');
}

// Countdown Calculation
function renderCountdown() {
  const defDateStr = state.settings.defenseDate;
  if (!defDateStr) {
    document.getElementById('countdownDays').innerText = "---";
    return;
  }
  const defDate = new Date(defDateStr);
  const now = new Date();
  const diffTime = defDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    document.getElementById('countdownDays').innerText = `${diffDays} кун`;
    document.getElementById('countdownSub').innerText = "Ҳимоя муддатигача";
  } else if (diffDays === 0) {
    document.getElementById('countdownDays').innerText = `БУГУН!`;
    document.getElementById('countdownSub').innerText = "Ҳимоя куни келди!";
  } else {
    document.getElementById('countdownDays').innerText = `Якунланган`;
    document.getElementById('countdownSub').innerText = "Муддат ўтган";
  }
}

// Upcoming Deadlines (Next 4 items)
function renderUpcomingDeadlines() {
  const container = document.getElementById('upcomingTasksList');
  if (!container) return;

  const tasks = [];

  // From Structure
  state.structure.forEach(ch => {
    if (ch.subsections) {
      ch.subsections.forEach(s => {
        if (s.deadline && s.progress < 100) {
          tasks.push({ title: `${s.code} ${s.title}`, date: s.deadline, type: 'Боб бўлими', progress: s.progress });
        }
      });
    } else {
      if (ch.deadline && ch.progress < 100) {
        tasks.push({ title: `${ch.code} ${ch.title}`, date: ch.deadline, type: 'Боб бўлими', progress: ch.progress });
      }
    }
  });

  // From Articles
  state.articles.forEach(a => {
    if (a.date && a.status !== 'published') {
      tasks.push({ title: `Мақола: ${a.title}`, date: a.date, type: 'Нашр', progress: a.status === 'review' ? 70 : 30 });
    }
  });

  // Sort by date ascending
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (tasks.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 py-4 text-center">Муддати белгиланган кечиктириб бўлмас вазифалар мавжуд эмас.</div>`;
    return;
  }

  container.innerHTML = tasks.slice(0, 4).map(t => {
    const isUrgent = new Date(t.date) < new Date(Date.now() + 14 * 24 * 3600 * 1000);
    return `
      <div class="flex items-center justify-between p-3 rounded-xl ${isUrgent ? 'bg-rose-50/70 border border-rose-100' : 'bg-slate-50 border border-slate-100'}">
        <div class="flex-1 pr-3">
          <div class="flex items-center gap-2">
            <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isUrgent ? 'bg-rose-200 text-rose-800' : 'bg-slate-200 text-slate-700'}">${t.type}</span>
            <span class="text-xs font-semibold text-slate-800 line-clamp-1">${t.title}</span>
          </div>
          <div class="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
            <span><i class="fa-regular fa-calendar text-[10px]"></i> ${formatDatePretty(t.date)}</span>
            <span>Тайёрлиги: <strong>${t.progress}%</strong></span>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold ${isUrgent ? 'text-rose-600' : 'text-slate-600'}">
            ${getDaysLeft(t.date)}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== TAB 2: STRUCTURE RENDERING ====================

function renderStructure() {
  const container = document.getElementById('chaptersContainer');
  if (!container) return;

  container.innerHTML = state.structure.map((item, chIdx) => {
    if (item.subsections && item.subsections.length > 0) {
      // Calculate chapter total pages & progress average
      let chPages = 0;
      let chProgSum = 0;
      item.subsections.forEach(s => {
        chPages += Number(s.pages) || 0;
        chProgSum += Number(s.progress) || 0;
      });
      const chAvgProgress = Math.round(chProgSum / item.subsections.length);

      return `
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <!-- Chapter Header -->
          <div class="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-botany-700 text-white tracking-wide">${item.code}</span>
                <h3 class="text-sm font-bold text-slate-900 leading-tight">${item.title}</h3>
              </div>
              <div class="flex items-center gap-4 text-xs text-slate-500 mt-2">
                <span>Жами ҳажм: <strong>${chPages}</strong> бет</span>
                <span>Параграфлар: <strong>${item.subsections.length}</strong> та</span>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="text-right">
                <div class="text-xs text-slate-400 font-medium">Боб тайёрлиги</div>
                <div class="text-sm font-bold text-botany-800">${chAvgProgress}%</div>
              </div>
              <div class="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-botany-600 h-full transition-all duration-500" style="width: ${chAvgProgress}%"></div>
              </div>
            </div>
          </div>

          <!-- Subsections List -->
          <div class="divide-y divide-slate-100 p-2 sm:p-3">
            ${item.subsections.map((sub, sIdx) => renderSectionItem(sub, chIdx, sIdx)).join('')}
          </div>
        </div>
      `;
    } else {
      // Single section like Kirish or Xulosalar
      return `
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-800 text-white tracking-wide">${item.code}</span>
                <h3 class="text-sm font-bold text-slate-900">${item.title}</h3>
              </div>
              <div class="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span>Ҳажм: <strong>${item.pages || 0}</strong> / ${item.targetPages || 15} бет</span>
                ${item.deadline ? `<span><i class="fa-regular fa-calendar"></i> Муддат: ${formatDatePretty(item.deadline)}</span>` : ''}
                ${getStatusBadge(item.status)}
              </div>
              ${item.notes ? `<p class="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">${item.notes}</p>` : ''}
            </div>

            <div class="flex items-center gap-3 sm:self-center">
              <div class="text-right">
                <span class="text-sm font-bold text-botany-700">${item.progress}%</span>
                <div class="w-16 bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                  <div class="bg-botany-600 h-full" style="width: ${item.progress}%"></div>
                </div>
              </div>
              <button onclick="openTextEditor('${item.id}', ${chIdx}, -1)" class="px-3 py-1.5 bg-botany-50 hover:bg-botany-100 text-botany-800 border border-botany-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition" title="Матнни ёзиш ёки Ворд юклаш">
                <i class="fa-solid fa-file-pen text-botany-600"></i>
                <span class="hidden sm:inline">${item.content ? 'Матнни кўриш/ёзиш' : 'Матн / Ворд юклаш'}</span>
              </button>
              <button onclick="openEditSectionModal('${item.id}', ${chIdx}, -1)" class="p-2 text-slate-400 hover:text-botany-700 hover:bg-slate-50 rounded-lg transition" title="Параметрларни таҳрирлаш">
                <i class="fa-solid fa-gear"></i>
              </button>
            </div>
          </div>
          ${item.wordCount ? `<div class="mt-2 pt-2 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
            <span><i class="fa-solid fa-align-left text-botany-600"></i> <strong>${item.wordCount}</strong> сўз</span>
            <span><i class="fa-solid fa-file-lines text-slate-400"></i> ~<strong>${item.pages || 0}</strong> бет</span>
            ${item.attachedFileName ? `<span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-medium border border-blue-200"><i class="fa-solid fa-file-word text-blue-600"></i> ${item.attachedFileName}</span>` : ''}
          </div>` : ''}
        </div>
      `;
    }
  }).join('');
}

function renderSectionItem(sub, chIdx, sIdx) {
  return `
    <div class="p-3 hover:bg-slate-50/70 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <span class="font-bold text-xs text-botany-800 bg-botany-50 px-2 py-0.5 rounded border border-botany-200">${sub.code}</span>
          <span class="text-xs sm:text-sm font-medium text-slate-800">${sub.title}</span>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5 pl-1">
          <span>Ёзилган ҳажм: <strong>${sub.pages || 0}</strong> бет</span>
          ${sub.deadline ? `<span><i class="fa-regular fa-clock"></i> ${formatDatePretty(sub.deadline)}</span>` : ''}
          ${getStatusBadge(sub.status)}
        </div>
        
        <!-- Text Editor & Word status badges -->
        <div class="mt-2.5 flex flex-wrap items-center gap-2 pl-1">
          <button onclick="openTextEditor('${sub.id}', ${chIdx}, ${sIdx})" class="px-2.5 py-1 bg-white hover:bg-botany-50 text-slate-700 hover:text-botany-800 border border-slate-200 hover:border-botany-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition">
            <i class="fa-solid fa-file-pen text-botany-600"></i>
            <span>${sub.content ? 'Матнни кўриш / ёзиш' : 'Матн киритиш / Ворд юклаш'}</span>
          </button>
          ${sub.wordCount ? `<span class="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium flex items-center gap-1"><i class="fa-solid fa-align-left text-slate-400"></i> ${sub.wordCount} сўз</span>` : ''}
          ${sub.attachedFileName ? `<span class="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium flex items-center gap-1"><i class="fa-solid fa-file-word text-blue-600"></i> ${sub.attachedFileName}</span>` : ''}
        </div>

        ${sub.notes ? `<div class="text-[11px] text-slate-600 mt-2 pl-1 text-slate-500"><i class="fa-regular fa-note-sticky mr-1 text-amber-500"></i>${sub.notes}</div>` : ''}
      </div>

      <div class="flex items-center gap-3 self-end sm:self-center">
        <!-- Automatic A4 Progress Indicator (no manual slider) -->
        <div class="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs" title="ОАК А4 стандарти (1800 белги) бўйича автоматик ҳисобланган">
          <div class="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-botany-600 h-full rounded-full transition-all duration-500" style="width: ${sub.progress || 0}%"></div>
          </div>
          <span class="text-xs font-bold ${sub.progress > 0 ? 'text-botany-800' : 'text-slate-400'} w-8 text-right">${sub.progress || 0}%</span>
        </div>
        <button onclick="openEditSectionModal('${sub.id}', ${chIdx}, ${sIdx})" class="p-1.5 text-slate-400 hover:text-botany-700 rounded-lg transition" title="Параметрларни кўриш">
          <i class="fa-solid fa-gear text-xs"></i>
        </button>
      </div>
    </div>
  `;
}

// ==================== TAB 3: ARTICLES RENDERING ====================

function renderArticles() {
  const tbody = document.getElementById('articlesTableBody');
  if (!tbody) return;

  const categoryFilter = document.getElementById('articleFilterCategory') ? document.getElementById('articleFilterCategory').value : 'all';

  // Summary counts
  document.getElementById('countArtDraft').innerText = state.articles.filter(a => a.status === 'draft').length;
  document.getElementById('countArtReview').innerText = state.articles.filter(a => a.status === 'review' || a.status === 'submitted').length;
  document.getElementById('countArtPublished').innerText = state.articles.filter(a => a.status === 'published').length;
  document.getElementById('countArtScopus').innerText = state.articles.filter(a => a.category === 'scopus').length;

  const filtered = state.articles.filter(a => {
    if (categoryFilter === 'all') return true;
    return a.category === categoryFilter;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-xs text-slate-400">Мақолалар топилмади. Юқоридаги тугма орқали янги мақола қўшишингиз мумкин.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(a => `
    <tr class="hover:bg-slate-50/70 transition">
      <td class="py-3 px-4 font-semibold text-slate-800">
        <div class="line-clamp-2">${a.title}</div>
        ${a.link ? `<a href="${a.link}" target="_blank" class="text-[10px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"><i class="fa-solid fa-arrow-up-right-from-square"></i> Ҳаволани очиш</a>` : ''}
      </td>
      <td class="py-3 px-3 text-slate-600 font-medium">${a.journal}</td>
      <td class="py-3 px-3">${getArticleCategoryBadge(a.category)}</td>
      <td class="py-3 px-3 text-slate-500">${a.authors || '-'}</td>
      <td class="py-3 px-3">${getArticleStatusBadge(a.status)}</td>
      <td class="py-3 px-3 text-slate-500">${a.date ? formatDatePretty(a.date) : '-'}</td>
      <td class="py-3 px-3 text-right whitespace-nowrap">
        <button onclick="openEditArticleModal('${a.id}')" class="p-1 text-slate-400 hover:text-blue-600 transition" title="Таҳрирлаш">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button onclick="deleteArticle('${a.id}')" class="p-1 text-slate-400 hover:text-red-600 transition ml-1" title="Ўчириш">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// ==================== TAB 4: LITERATURE RENDERING ====================

function renderLiterature() {
  const container = document.getElementById('literatureListContainer');
  if (!container) return;

  const search = document.getElementById('literatureSearchInput') ? document.getElementById('literatureSearchInput').value.toLowerCase() : '';
  const statusFilter = document.getElementById('literatureStatusFilter') ? document.getElementById('literatureStatusFilter').value : 'all';

  const filtered = state.literature.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search) || l.author.toLowerCase().includes(search) || (l.notes && l.notes.toLowerCase().includes(search));
    const matchStatus = (statusFilter === 'all') || (l.status === statusFilter);
    return matchSearch && matchStatus;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-400">Манбалар топилмади.</div>`;
    return;
  }

  container.innerHTML = filtered.map(l => `
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-900">${l.title}</span>
          ${l.year ? `<span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">${l.year} йил</span>` : ''}
          ${getLitStatusBadge(l.status)}
        </div>
        <div class="text-xs text-slate-500 mt-1">
          <i class="fa-solid fa-feather-pointed text-[10px] text-purple-600 mr-1"></i> <strong>${l.author}</strong>
          <span class="mx-2">•</span>
          <span class="text-slate-400">Тури: ${getLitTypeName(l.type)}</span>
        </div>
        ${l.notes ? `<div class="text-xs text-slate-600 mt-2 bg-purple-50/50 p-2 rounded-lg border border-purple-100 italic">${l.notes}</div>` : ''}
      </div>

      <div class="flex items-center gap-2 self-end sm:self-center">
        <select onchange="updateLitStatus('${l.id}', this.value)" class="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700">
          <option value="read" ${l.status === 'read' ? 'selected' : ''}>Ўқилган</option>
          <option value="cited" ${l.status === 'cited' ? 'selected' : ''}>Иқтибос олинган</option>
          <option value="planned" ${l.status === 'planned' ? 'selected' : ''}>Режада</option>
        </select>
        <button onclick="deleteLiterature('${l.id}')" class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition" title="Ўчириш">
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function updateLitStatus(id, newStatus) {
  const item = state.literature.find(l => l.id === id);
  if (item) {
    item.status = newStatus;
    saveData();
  }
}

// ==================== TAB 5: ROADMAP RENDERING ====================

function renderRoadmap() {
  const container = document.getElementById('roadmapTimelineContainer');
  if (!container) return;

  const doneCount = state.roadmap.filter(m => m.status === 'done').length;
  document.getElementById('roadmapStatusText').innerText = `${doneCount} / ${state.roadmap.length}`;

  container.innerHTML = state.roadmap.map((m, idx) => {
    let dotClass = 'timeline-dot';
    let cardBorder = 'border-slate-200';
    let bgBadge = 'bg-slate-100 text-slate-600';

    if (m.status === 'done') {
      dotClass += ' done';
      cardBorder = 'border-emerald-200 bg-emerald-50/20';
      bgBadge = 'bg-emerald-100 text-emerald-800';
    } else if (m.status === 'in_progress') {
      dotClass += ' active';
      cardBorder = 'border-amber-200 bg-amber-50/20';
      bgBadge = 'bg-amber-100 text-amber-800';
    }

    return `
      <div class="relative pl-6">
        <div class="${dotClass}">
          ${m.status === 'done' ? '<i class="fa-solid fa-check text-xs"></i>' : (idx + 1)}
        </div>
        <div class="p-4 rounded-xl border ${cardBorder} bg-white shadow-sm hover:shadow-md transition">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded ${bgBadge}">${m.step}</span>
                <h4 class="text-sm font-bold text-slate-900">${m.title}</h4>
              </div>
              <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">${m.desc}</p>
            </div>
            
            <div class="flex items-center gap-3 self-end sm:self-center">
              <span class="text-xs text-slate-400 whitespace-nowrap"><i class="fa-regular fa-calendar"></i> ${formatDatePretty(m.date)}</span>
              <select onchange="updateMilestoneStatus('${m.id}', this.value)" class="text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:outline-none">
                <option value="pending" ${m.status === 'pending' ? 'selected' : ''}>Кутилмоқда</option>
                <option value="in_progress" ${m.status === 'in_progress' ? 'selected' : ''}>Жараёнда</option>
                <option value="done" ${m.status === 'done' ? 'selected' : ''}>Бажарилди ✔</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updateMilestoneStatus(id, newStatus) {
  const m = state.roadmap.find(x => x.id === id);
  if (m) {
    m.status = newStatus;
    saveData();
  }
}

// ==================== TAB 6: NOTES RENDERING ====================

function renderNotes() {
  const container = document.getElementById('notesContainer');
  if (!container) return;

  if (state.notes.length === 0) {
    container.innerHTML = `<div class="col-span-2 bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-400">Ҳозирча кўрсатмалар қайд этилмаган. Янги қайд қўшиш учун юқоридаги тугмани босинг.</div>`;
    return;
  }

  container.innerHTML = state.notes.map(n => `
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <span class="text-xs font-bold text-slate-800">${n.subject}</span>
          <span class="text-[10px] text-slate-400"><i class="fa-regular fa-calendar"></i> ${formatDatePretty(n.date)}</span>
        </div>
        <p class="text-xs text-slate-700 mt-2.5 leading-relaxed whitespace-pre-line">${n.text}</p>
      </div>

      <div class="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
        <select onchange="updateNoteStatus('${n.id}', this.value)" class="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white font-medium text-slate-700">
          <option value="pending" ${n.status === 'pending' ? 'selected' : ''}>Кутилмоқда</option>
          <option value="in_progress" ${n.status === 'in_progress' ? 'selected' : ''}>Ишланмоқда</option>
          <option value="done" ${n.status === 'done' ? 'selected' : ''}>Бажарилди ✔</option>
        </select>
        <button onclick="deleteNote('${n.id}')" class="p-1 text-slate-400 hover:text-red-600 transition" title="Ўчириш">
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function updateNoteStatus(id, newStatus) {
  const n = state.notes.find(x => x.id === id);
  if (n) {
    n.status = newStatus;
    saveData();
  }
}

// ==================== CHARTS (CHART.JS) ====================

function renderCharts() {
  if (typeof Chart === 'undefined') return;

  const metrics = calculateProgress();

  // 1. Overall Doughnut
  const ctxOverall = document.getElementById('overallProgressChart');
  if (ctxOverall) {
    if (overallChartInstance) overallChartInstance.destroy();
    overallChartInstance = new Chart(ctxOverall, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [metrics.totalIntegralProgress, 100 - metrics.totalIntegralProgress],
          backgroundColor: ['#15803d', '#f1f5f9'],
          borderWidth: 0,
          cutout: '78%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: { enabled: false }
        }
      }
    });
  }

  // 2. Chapters Bar Chart
  const ctxChapters = document.getElementById('chaptersBarChart');
  if (ctxChapters) {
    if (chaptersChartInstance) chaptersChartInstance.destroy();

    const labels = [];
    const values = [];

    state.structure.forEach(item => {
      labels.push(item.code);
      if (item.subsections && item.subsections.length > 0) {
        let sum = 0;
        item.subsections.forEach(s => sum += (Number(s.progress) || 0));
        values.push(Math.round(sum / item.subsections.length));
      } else {
        values.push(Number(item.progress) || 0);
      }
    });

    chaptersChartInstance = new Chart(ctxChapters, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Тайёрлик фоизи (%)',
          data: values,
          backgroundColor: '#16a34a',
          borderRadius: 6,
          maxBarThickness: 32
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: val => `${val}%`,
              font: { size: 10 }
            },
            grid: { color: '#f1f5f9' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10, weight: '600' } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` Тайёрлиги: ${ctx.parsed.y}%`
            }
          }
        }
      }
    });
  }
}

// ==================== MODALS & FORM ACTIONS ====================

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// Settings Modal
function openSettingsModal() {
  if (currentSession && currentSession.role !== 'admin') {
    alert("Кечирасиз, тизим созламаларини фақат Админ ўзгартириши мумкин!");
    return;
  }

  document.getElementById('settingTopic').value = state.settings.topic || '';
  document.getElementById('settingAuthor').value = state.settings.author || '';
  document.getElementById('settingSpecialty').value = state.settings.specialty || '';
  document.getElementById('settingSupervisor').value = state.settings.supervisor || '';
  document.getElementById('settingDefenseDate').value = state.settings.defenseDate || '';
  document.getElementById('settingTargetPages').value = state.settings.targetPages || 140;
  document.getElementById('settingTargetArticles').value = state.settings.targetArticles || 7;

  if (document.getElementById('settingAdminUser')) document.getElementById('settingAdminUser').value = credentials.admin.username;
  if (document.getElementById('settingAdminPass')) document.getElementById('settingAdminPass').value = credentials.admin.password;
  if (document.getElementById('settingViewerUser')) document.getElementById('settingViewerUser').value = credentials.viewer.username;
  if (document.getElementById('settingViewerPass')) document.getElementById('settingViewerPass').value = credentials.viewer.password;

  openModal('settingsModal');
}

function saveSettings(e) {
  e.preventDefault();
  state.settings.topic = document.getElementById('settingTopic').value;
  state.settings.author = document.getElementById('settingAuthor').value;
  state.settings.specialty = document.getElementById('settingSpecialty').value;
  state.settings.supervisor = document.getElementById('settingSupervisor').value;
  state.settings.defenseDate = document.getElementById('settingDefenseDate').value;
  state.settings.targetPages = Number(document.getElementById('settingTargetPages').value) || 140;
  state.settings.targetArticles = Number(document.getElementById('settingTargetArticles').value) || 7;

  // Save new credentials if changed
  const newAdminUser = document.getElementById('settingAdminUser') ? document.getElementById('settingAdminUser').value.trim() : '';
  const newAdminPass = document.getElementById('settingAdminPass') ? document.getElementById('settingAdminPass').value.trim() : '';
  const newViewerUser = document.getElementById('settingViewerUser') ? document.getElementById('settingViewerUser').value.trim() : '';
  const newViewerPass = document.getElementById('settingViewerPass') ? document.getElementById('settingViewerPass').value.trim() : '';

  if (newAdminUser && newAdminPass) {
    credentials.admin.username = newAdminUser;
    credentials.admin.password = newAdminPass;
  }
  if (newViewerUser && newViewerPass) {
    credentials.viewer.username = newViewerUser;
    credentials.viewer.password = newViewerPass;
  }
  saveCredentials(credentials);

  closeModal('settingsModal');
  saveData();
  alert("Диссертация маълумотлари ва кириш пароллари муваффақиятли сақланди!");
}

// Section Edit Modal
function openEditSectionModal(id, chIdx, sIdx) {
  document.getElementById('sectionId').value = id;
  document.getElementById('sectionChapterIndex').value = chIdx;

  let item = null;
  if (sIdx >= 0) {
    item = state.structure[chIdx].subsections[sIdx];
  } else {
    item = state.structure[chIdx];
  }

  if (!item) return;

  document.getElementById('sectionModalTitle').innerText = `${item.code} — Таҳрирлаш`;
  document.getElementById('sectionTitle').value = item.title;
  document.getElementById('sectionStatus').value = item.status || 'not_started';
  document.getElementById('sectionProgress').value = item.progress || 0;
  document.getElementById('sectionPages').value = item.pages || 0;
  document.getElementById('sectionDeadline').value = item.deadline || '';
  document.getElementById('sectionNotes').value = item.notes || '';

  openModal('sectionModal');
}

function saveSection(e) {
  e.preventDefault();
  const id = document.getElementById('sectionId').value;
  const chIdx = Number(document.getElementById('sectionChapterIndex').value);

  const title = document.getElementById('sectionTitle').value;
  const status = document.getElementById('sectionStatus').value;
  const deadline = document.getElementById('sectionDeadline').value;
  const notes = document.getElementById('sectionNotes').value;

  // Search and update metadata without touching strictly calculated pages/progress
  state.structure.forEach(ch => {
    if (ch.id === id) {
      ch.title = title;
      ch.status = status;
      ch.deadline = deadline;
      ch.notes = notes;
    }
    if (ch.subsections) {
      ch.subsections.forEach(s => {
        if (s.id === id) {
          s.title = title;
          s.status = status;
          s.deadline = deadline;
          s.notes = notes;
        }
      });
    }
  });

  closeModal('sectionModal');
  saveData();
}

// Article Modal
function openAddArticleModal() {
  document.getElementById('articleId').value = '';
  document.getElementById('articleModalTitle').innerText = 'Янги илмий мақола қўшиш';
  document.getElementById('articleTitle').value = '';
  document.getElementById('articleJournal').value = '';
  document.getElementById('articleCategory').value = 'oak';
  document.getElementById('articleStatus').value = 'draft';
  document.getElementById('articleDate').value = '';
  document.getElementById('articleAuthors').value = state.settings.author || '';
  document.getElementById('articleLink').value = '';
  openModal('articleModal');
}

function openEditArticleModal(id) {
  const art = state.articles.find(a => a.id === id);
  if (!art) return;

  document.getElementById('articleId').value = art.id;
  document.getElementById('articleModalTitle').innerText = 'Мақолани таҳрирлаш';
  document.getElementById('articleTitle').value = art.title;
  document.getElementById('articleJournal').value = art.journal;
  document.getElementById('articleCategory').value = art.category;
  document.getElementById('articleStatus').value = art.status;
  document.getElementById('articleDate').value = art.date || '';
  document.getElementById('articleAuthors').value = art.authors || '';
  document.getElementById('articleLink').value = art.link || '';

  openModal('articleModal');
}

function saveArticle(e) {
  e.preventDefault();
  const id = document.getElementById('articleId').value;
  const artData = {
    title: document.getElementById('articleTitle').value,
    journal: document.getElementById('articleJournal').value,
    category: document.getElementById('articleCategory').value,
    status: document.getElementById('articleStatus').value,
    date: document.getElementById('articleDate').value,
    authors: document.getElementById('articleAuthors').value,
    link: document.getElementById('articleLink').value
  };

  if (id) {
    const existing = state.articles.find(a => a.id === id);
    if (existing) Object.assign(existing, artData);
  } else {
    artData.id = 'art-' + Date.now();
    state.articles.push(artData);
  }

  closeModal('articleModal');
  saveData();
}

function deleteArticle(id) {
  if (confirm("Ушбу мақолани рўйхатдан ўчирмоқчимисиз?")) {
    state.articles = state.articles.filter(a => a.id !== id);
    saveData();
  }
}

// Literature Modal
function openAddLiteratureModal() {
  document.getElementById('litId').value = '';
  document.getElementById('litTitle').value = '';
  document.getElementById('litAuthor').value = '';
  document.getElementById('litYear').value = new Date().getFullYear();
  document.getElementById('litType').value = 'book';
  document.getElementById('litStatus').value = 'read';
  document.getElementById('litNotes').value = '';
  openModal('literatureModal');
}

function saveLiterature(e) {
  e.preventDefault();
  const id = document.getElementById('litId').value;
  const litData = {
    title: document.getElementById('litTitle').value,
    author: document.getElementById('litAuthor').value,
    year: Number(document.getElementById('litYear').value) || '',
    type: document.getElementById('litType').value,
    status: document.getElementById('litStatus').value,
    notes: document.getElementById('litNotes').value
  };

  if (id) {
    const existing = state.literature.find(l => l.id === id);
    if (existing) Object.assign(existing, litData);
  } else {
    litData.id = 'lit-' + Date.now();
    state.literature.push(litData);
  }

  closeModal('literatureModal');
  saveData();
}

function deleteLiterature(id) {
  if (confirm("Ушбу адабиёт манбасини ўчирмоқчимисиз?")) {
    state.literature = state.literature.filter(l => l.id !== id);
    saveData();
  }
}

// Note Modal
function openAddNoteModal() {
  document.getElementById('noteId').value = '';
  document.getElementById('noteDate').value = new Date().toISOString().slice(0, 10);
  document.getElementById('noteSubject').value = '';
  document.getElementById('noteText').value = '';
  document.getElementById('noteStatus').value = 'pending';
  openModal('noteModal');
}

function saveNote(e) {
  e.preventDefault();
  const id = document.getElementById('noteId').value;
  const noteData = {
    date: document.getElementById('noteDate').value,
    subject: document.getElementById('noteSubject').value,
    text: document.getElementById('noteText').value,
    status: document.getElementById('noteStatus').value
  };

  if (id) {
    const existing = state.notes.find(n => n.id === id);
    if (existing) Object.assign(existing, noteData);
  } else {
    noteData.id = 'note-' + Date.now();
    state.notes.unshift(noteData);
  }

  closeModal('noteModal');
  saveData();
}

function deleteNote(id) {
  if (confirm("Ушбу қайдни ўчирмоқчимисиз?")) {
    state.notes = state.notes.filter(n => n.id !== id);
    saveData();
  }
}

// Add Section Modal (for adding custom subsection to any chapter)
function openAddSectionModal() {
  const chapterTitles = state.structure.filter(s => s.isChapterHeader).map((c, i) => `${i+1}. ${c.code}`).join('\n');
  const chapterNum = prompt(`Қайси бобга параграф қўшмоқчисиз?\n${chapterTitles}\n\nБоб рақамини киритинг (1, 2, 3, 4, 5):`, "1");
  if (!chapterNum) return;

  const targetChapter = state.structure.find(s => s.code.includes(chapterNum));
  if (!targetChapter || !targetChapter.subsections) {
    alert("Кўрсатилган боб топилмади!");
    return;
  }

  const newCode = `§${chapterNum}.${targetChapter.subsections.length + 1}`;
  const newTitle = prompt("Янги параграф номини киритинг:", "");
  if (!newTitle) return;

  targetChapter.subsections.push({
    id: 'sec-' + Date.now(),
    code: newCode,
    title: newTitle,
    status: 'not_started',
    progress: 0,
    pages: 0,
    targetPages: 12,
    deadline: '',
    notes: ''
  });

  saveData();
}

// ==================== HELPER FORMATTERS ====================

function getStatusBadge(status) {
  switch (status) {
    case 'not_started': return `<span class="badge-status badge-not-started"><i class="fa-regular fa-circle text-[8px]"></i> Режалаштирилган</span>`;
    case 'in_progress': return `<span class="badge-status badge-in-progress"><i class="fa-solid fa-spinner text-[8px] animate-spin"></i> Ёзилмоқда</span>`;
    case 'under_review': return `<span class="badge-status badge-review"><i class="fa-solid fa-eye text-[8px]"></i> Раҳбар кўригида</span>`;
    case 'revision': return `<span class="badge-status badge-revision"><i class="fa-solid fa-wrench text-[8px]"></i> Тузатилмоқда</span>`;
    case 'completed': return `<span class="badge-status badge-completed"><i class="fa-solid fa-check text-[8px]"></i> Тайёр</span>`;
    default: return `<span class="badge-status badge-not-started">${status}</span>`;
  }
}

function getArticleStatusBadge(status) {
  switch (status) {
    case 'draft': return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Қоралама / Ёзиляпти</span>`;
    case 'submitted': return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Топширилган</span>`;
    case 'review': return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Тақризда</span>`;
    case 'accepted': return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Қабул қилинди</span>`;
    case 'published': return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-botany-700 text-white">Нашр этилди ✔</span>`;
    default: return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100">${status}</span>`;
  }
}

function getArticleCategoryBadge(cat) {
  switch (cat) {
    case 'oak': return `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">ОАК журнали</span>`;
    case 'scopus': return `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Scopus / WoS</span>`;
    case 'conf_intl': return `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Халқаро конф.</span>`;
    case 'conf_nat': return `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Республика конф.</span>`;
    default: return `<span class="text-[10px]">${cat}</span>`;
  }
}

function getLitStatusBadge(status) {
  switch (status) {
    case 'read': return `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Ўқилган</span>`;
    case 'cited': return `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Иқтибос олинган</span>`;
    case 'planned': return `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">Режада</span>`;
    default: return '';
  }
}

function getLitTypeName(type) {
  switch (type) {
    case 'book': return 'Монография / Китоб';
    case 'article': return 'Илмий мақола';
    case 'flora': return 'Флора тўплами';
    case 'dissertation': return 'Диссертация / Автореферат';
    default: return type;
  }
}

function formatDatePretty(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function getDaysLeft(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((d - now) / (1000 * 3600 * 24));
  if (diffDays < 0) return `${Math.abs(diffDays)} кун кечикди`;
  if (diffDays === 0) return `Бугун!`;
  return `${diffDays} кун қолди`;
}

// ==================== DISSERTATION TEXT EDITOR & WORD (.DOCX) IMPORT ====================

let currentEditing = { id: null, chIdx: -1, sIdx: -1, item: null };

function openTextEditor(id, chIdx, sIdx) {
  currentEditing.id = id;
  currentEditing.chIdx = chIdx;
  currentEditing.sIdx = sIdx;

  let item = null;
  if (sIdx >= 0) {
    item = state.structure[chIdx].subsections[sIdx];
  } else {
    item = state.structure[chIdx];
  }
  currentEditing.item = item;
  if (!item) return;

  // Set titles
  document.getElementById('editorSectionCode').innerText = item.code || '';
  document.getElementById('editorSectionTitle').innerText = item.title || '';

  // Load content
  const area = document.getElementById('editorContentArea');
  if (item.content && item.content.trim()) {
    area.innerHTML = item.content;
  } else {
    area.innerHTML = '<p>Бу ерга диссертация матнини тўғридан-тўғри ёзинг ёки «Ворд (.docx) юклаш» тугмаси орқали тайёр файлни киритинг...</p>';
  }

  // Update counters
  updateTextCounters();

  const statusEl = document.getElementById('editorAutoSaveStatus');
  if (statusEl) {
    statusEl.innerText = item.content ? 'Матн юкланди' : 'Янги бўлим';
    statusEl.className = 'text-slate-400';
  }

  openModal('textEditorModal');
}

function handleEditorInput() {
  updateTextCounters();
  const statusEl = document.getElementById('editorAutoSaveStatus');
  if (statusEl) {
    statusEl.innerText = 'Сақланмаган ўзгаришлар мавжуд';
    statusEl.className = 'text-amber-600 font-medium';
  }
}

function updateTextCounters() {
  const area = document.getElementById('editorContentArea');
  if (!area) return { words: 0, chars: 0, pages: 0 };

  const rawText = area.innerText || '';
  const cleanText = rawText.replace(/\u00a0/g, ' ').trim();

  // Words
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  // Characters
  const chars = cleanText.length;
  // OAK dissertation standard: 1 page ~ 1,800 characters with spaces (14pt Times New Roman, 1.5 line spacing)
  const pages = chars > 0 ? Math.round((chars / OAK_A4_CHARS_PER_PAGE) * 10) / 10 : 0;

  if (document.getElementById('editorWordCount')) document.getElementById('editorWordCount').innerText = words.toLocaleString('uz-UZ');
  if (document.getElementById('editorCharCount')) document.getElementById('editorCharCount').innerText = chars.toLocaleString('uz-UZ');
  if (document.getElementById('editorPageCount')) document.getElementById('editorPageCount').innerText = `${pages} бет`;

  return { words, chars, pages };
}

function formatEditor(cmd, val = null) {
  document.execCommand(cmd, false, val);
  const area = document.getElementById('editorContentArea');
  if (area) area.focus();
  handleEditorInput();
}

function handleWordUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const area = document.getElementById('editorContentArea');
  const statusEl = document.getElementById('editorAutoSaveStatus');

  if (statusEl) {
    statusEl.innerText = 'Ворд файли ўқилмоқда...';
    statusEl.className = 'text-blue-600 font-semibold';
  }

  const reader = new FileReader();

  if (file.name.endsWith('.docx') && typeof mammoth !== 'undefined') {
    reader.onload = function(loadEvent) {
      const arrayBuffer = loadEvent.target.result;
      mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
        .then(function(result) {
          area.innerHTML = result.value || '<p>' + result.rawText + '</p>';
          if (currentEditing.item) {
            currentEditing.item.attachedFileName = file.name;
          }
          updateTextCounters();
          if (statusEl) {
            statusEl.innerText = `Word (.docx) юкланди: ${file.name}`;
            statusEl.className = 'text-emerald-600 font-bold';
          }
        })
        .catch(function(err) {
          console.error("Mammoth error:", err);
          alert("Ворд файлини очишда хатолик бўлди: " + err.message);
          if (statusEl) {
            statusEl.innerText = 'Хатолик юз берди';
            statusEl.className = 'text-rose-600';
          }
        });
    };
    reader.readAsArrayBuffer(file);
  } else {
    // Fallback: Read as text (.txt or plain)
    reader.onload = function(loadEvent) {
      const text = loadEvent.target.result;
      area.innerText = text;
      if (currentEditing.item) {
        currentEditing.item.attachedFileName = file.name;
      }
      updateTextCounters();
      if (statusEl) {
        statusEl.innerText = `Файл юкланди: ${file.name}`;
        statusEl.className = 'text-emerald-600 font-bold';
      }
    };
    reader.readAsText(file);
  }

  // Reset input value so same file can be selected again
  event.target.value = '';
}

function saveEditorContent(notifyUser = true) {
  if (!currentEditing.item) return;

  const area = document.getElementById('editorContentArea');
  const htmlContent = area.innerHTML;
  const stats = updateTextCounters();

  const item = currentEditing.item;
  item.content = htmlContent;
  item.wordCount = stats.words;
  item.charCount = stats.chars;
  item.pages = stats.pages; // strictly OAK A4 calculated pages
  item.lastUpdated = new Date().toISOString();

  // Strict A4 calculation: progress = (actual A4 pages / target pages) * 100%
  const target = Number(item.targetPages) || 12;
  const calcProgress = target > 0 ? Math.min(100, Math.round((stats.pages / target) * 100)) : 0;
  item.progress = calcProgress;

  if (calcProgress >= 100) item.status = 'completed';
  else if (calcProgress > 0) item.status = 'in_progress';
  else item.status = 'not_started';

  saveData();

  const statusEl = document.getElementById('editorAutoSaveStatus');
  if (statusEl) {
    statusEl.innerText = 'Муваффақиятли сақланди ✔';
    statusEl.className = 'text-emerald-600 font-bold';
  }

  if (notifyUser) {
    closeModal('textEditorModal');
    alert(`«${item.code}» бўлими матни ОАК А4 стандарти бўйича ҳисобланди!\n• Ҳажми: ${stats.pages} бет (1800 белги = 1 бет)\n• Сўзлар сони: ${stats.words} та сўз\n• Бажарилиш фоизи: ${calcProgress}%`);
  }
}

function exportCurrentSectionToDoc() {
  if (!currentEditing.item) return;

  const item = currentEditing.item;
  const area = document.getElementById('editorContentArea');
  const bodyHtml = area.innerHTML || '';

  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${item.code} ${item.title}</title>
    <style>
      body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; margin: 2.5cm 1.5cm 2cm 3cm; text-align: justify; }
      h2 { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 20px; }
      p { text-indent: 1.25cm; margin-bottom: 0; margin-top: 0; }
    </style>
    </head><body>
    <h2>${item.code}. ${item.title}</h2>
    ${bodyHtml}
    </body></html>
  `;

  const blob = new Blob(['\ufeff', header], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${item.code.replace(/[^a-zA-Z0-9_§.-]/g, '_')}_matni.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==================== AUTHENTICATION & LOGIN MANAGEMENT ====================

const AUTH_SESSION_KEY = 'phd_auth_session_v1';
const AUTH_CREDENTIALS_KEY = 'phd_auth_credentials_v1';

const DEFAULT_CREDENTIALS = {
  admin: {
    username: 'admin',
    password: 'inoyat2026',
    role: 'admin',
    displayName: 'Саидмуродова Иноят (Админ)'
  },
  viewer: {
    username: 'rahbar',
    password: 'phd2026',
    role: 'viewer',
    displayName: 'Илмий раҳбар (Кузатувчи)'
  }
};

let currentSession = null;

function loadCredentials() {
  try {
    const raw = localStorage.getItem(AUTH_CREDENTIALS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_CREDENTIALS));
}

function saveCredentials(creds) {
  try {
    localStorage.setItem(AUTH_CREDENTIALS_KEY, JSON.stringify(creds));
  } catch (e) {}
}

let credentials = loadCredentials();

function checkAuth() {
  const loginOverlay = document.getElementById('loginScreen');
  let session = null;
  try {
    const local = localStorage.getItem(AUTH_SESSION_KEY);
    const sess = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (local) session = JSON.parse(local);
    else if (sess) session = JSON.parse(sess);
  } catch (e) {}

  if (session && session.username && session.role) {
    currentSession = session;
    if (loginOverlay) loginOverlay.classList.add('hidden');
    updateAuthUI();
    return true;
  } else {
    currentSession = null;
    if (loginOverlay) loginOverlay.classList.remove('hidden');
    return false;
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const user = document.getElementById('loginUsername').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();
  const remember = document.getElementById('rememberMe').checked;
  const alertEl = document.getElementById('loginErrorAlert');

  // Verify against Admin
  if (
    (user.toLowerCase() === credentials.admin.username.toLowerCase() || user.toLowerCase() === 'inoyat') &&
    pass === credentials.admin.password
  ) {
    currentSession = {
      username: credentials.admin.username,
      role: 'admin',
      displayName: credentials.admin.displayName || state.settings.author,
      time: Date.now()
    };
  } else if (
    user.toLowerCase() === credentials.viewer.username.toLowerCase() &&
    pass === credentials.viewer.password
  ) {
    currentSession = {
      username: credentials.viewer.username,
      role: 'viewer',
      displayName: credentials.viewer.displayName || 'Илмий раҳбар (Кузатувчи)',
      time: Date.now()
    };
  } else {
    if (alertEl) {
      alertEl.classList.remove('hidden');
      document.getElementById('loginErrorMessage').innerText = 'Логин ёки пароль нотўғри! Қайтадан текшириб киритинг.';
    }
    return;
  }

  // Success
  if (alertEl) alertEl.classList.add('hidden');
  const sessionStr = JSON.stringify(currentSession);
  if (remember) {
    localStorage.setItem(AUTH_SESSION_KEY, sessionStr);
  } else {
    sessionStorage.setItem(AUTH_SESSION_KEY, sessionStr);
  }

  document.getElementById('loginScreen').classList.add('hidden');
  updateAuthUI();
}

function logout() {
  if (confirm("Тизимдан чиқмоқчимисиз?")) {
    currentSession = null;
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginScreen').classList.remove('hidden');
  }
}

function togglePasswordVisibility() {
  const input = document.getElementById('loginPassword');
  const icon = document.getElementById('passwordEyeIcon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

function updateAuthUI() {
  if (!currentSession) return;

  const nameEl = document.getElementById('currentUserNameDisplay');
  const badgeEl = document.getElementById('currentUserRoleBadge');

  if (nameEl) nameEl.innerText = currentSession.displayName || currentSession.username;
  if (badgeEl) {
    if (currentSession.role === 'admin') {
      badgeEl.innerText = 'Админ';
      badgeEl.className = 'text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200';
    } else {
      badgeEl.innerText = 'Кузатувчи';
      badgeEl.className = 'text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200';
    }
  }
}

// ==================== CLOUD DATABASE SYNC (FIREBASE / REST) ====================

const CLOUD_CONFIG_KEY = 'phd_botany_cloud_config_v1';

let cloudConfig = loadCloudConfig();

function loadCloudConfig() {
  try {
    const raw = localStorage.getItem(CLOUD_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    enabled: true,
    dbUrl: 'https://saidmurodova-inoyat-phd-default-rtdb.asia-southeast1.firebasedatabase.app',
    syncKey: 'inoyat2026',
    autoSync: true,
    lastSyncTime: Date.now()
  };
}

function openCloudModal() {
  document.getElementById('cloudDbUrl').value = cloudConfig.dbUrl || '';
  document.getElementById('cloudSyncKey').value = cloudConfig.syncKey || 'inoyat2026';
  document.getElementById('cloudAutoSync').value = cloudConfig.autoSync ? 'true' : 'false';
  updateCloudModalUI();
  openModal('cloudSyncModal');
}

function updateCloudModalUI() {
  const dot = document.getElementById('cloudModalStatusDot');
  const title = document.getElementById('cloudModalStatusTitle');
  const desc = document.getElementById('cloudModalStatusDesc');

  if (cloudConfig.enabled && cloudConfig.dbUrl) {
    if (dot) dot.className = 'w-3 h-3 rounded-full bg-emerald-500 animate-pulse';
    if (title) title.innerText = 'Булутли базага муваффақиятли уланган ✔';
    if (desc) desc.innerText = `Охирги синхронизация: ${cloudConfig.lastSyncTime ? new Date(cloudConfig.lastSyncTime).toLocaleTimeString('uz-UZ') : 'Ҳозиргина'}`;
  } else {
    if (dot) dot.className = 'w-3 h-3 rounded-full bg-slate-400';
    if (title) title.innerText = 'Ҳозирча локал режимда';
    if (desc) desc.innerText = 'Маълумотлар фақат ушбу компьютер хотирасида сақланмоқда';
  }
  updateSidebarCloudBadge();
}

function updateSidebarCloudBadge() {
  const dot = document.getElementById('cloudSyncDot');
  const title = document.getElementById('cloudSyncTitle');
  const sub = document.getElementById('cloudSyncSubtitle');

  if (cloudConfig.enabled && cloudConfig.dbUrl) {
    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0';
    if (title) title.innerText = 'Булутга уланган ✔';
    if (sub) sub.innerText = 'Реал вақтда синхронланмоқда';
  } else {
    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0';
    if (title) title.innerText = 'Булутли синхронизация';
    if (sub) sub.innerText = 'Созлаш учун босинг';
  }
}

async function saveCloudConfig(e) {
  if (e) e.preventDefault();
  const dbUrl = document.getElementById('cloudDbUrl').value.trim().replace(/\/$/, '');
  const syncKey = document.getElementById('cloudSyncKey').value.trim() || 'inoyat2026';
  const autoSync = document.getElementById('cloudAutoSync').value === 'true';

  if (!dbUrl.startsWith('https://')) {
    alert("Булутли база манзили https:// билан бошланиши керак!");
    return;
  }

  cloudConfig.dbUrl = dbUrl;
  cloudConfig.syncKey = syncKey;
  cloudConfig.autoSync = autoSync;
  cloudConfig.enabled = true;
  cloudConfig.lastSyncTime = Date.now();

  localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(cloudConfig));

  // Push current data to cloud
  await pushToCloud(true);
  updateCloudModalUI();
  alert("Булутли база муваффақиятли уланди ва маълумотлар юкланди!");
  closeModal('cloudSyncModal');
}

function disconnectCloud() {
  if (confirm("Булутли синхронизацияни ўчирмоқчимисиз?")) {
    cloudConfig.enabled = false;
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(cloudConfig));
    updateCloudModalUI();
    alert("Булутли уланиш бекор қилинди. Тизим локал режимга ўтди.");
  }
}

async function pushToCloud(showToast = false) {
  if (!cloudConfig.enabled || !cloudConfig.dbUrl) return;

  const endpoint = `${cloudConfig.dbUrl}/phd_${cloudConfig.syncKey}.json`;
  state.lastCloudUpdate = Date.now();

  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
    if (res.ok) {
      cloudConfig.lastSyncTime = Date.now();
      localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(cloudConfig));
      updateSidebarCloudBadge();
    }
  } catch (err) {
    console.warn("Cloud sync push error:", err);
  }
}

async function pullFromCloud(silent = true) {
  if (!cloudConfig.enabled || !cloudConfig.dbUrl) return;

  const endpoint = `${cloudConfig.dbUrl}/phd_${cloudConfig.syncKey}.json`;
  try {
    const res = await fetch(endpoint);
    if (res.ok) {
      const cloudData = await res.json();
      if (cloudData && cloudData.structure) {
        if (!state.lastCloudUpdate || (cloudData.lastCloudUpdate && cloudData.lastCloudUpdate > state.lastCloudUpdate)) {
          state = cloudData;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          updateUI();
          if (!silent) alert("Булутдан энг сўнгги маълумотлар юкланди ва янгиланди!");
        }
        cloudConfig.lastSyncTime = Date.now();
        localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(cloudConfig));
        updateSidebarCloudBadge();
      }
    }
  } catch (err) {
    console.warn("Cloud sync pull error:", err);
  }
}

async function syncNowWithCloud() {
  const btn = document.getElementById('btnSyncNow');
  if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Синхронланмоқда...';
  await pullFromCloud(false);
  await pushToCloud();
  if (btn) btn.innerHTML = '<i class="fa-solid fa-rotate text-blue-600"></i> Ҳозир синхронлаш';
  updateCloudModalUI();
}

// Auto-sync listener (on window focus / tab switch)
window.addEventListener('focus', () => {
  if (cloudConfig && cloudConfig.enabled && cloudConfig.autoSync) {
    pullFromCloud(true);
  }
});

// ==================== INITIALIZATION ====================

window.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  updateUI();
  updateSidebarCloudBadge();
  if (cloudConfig && cloudConfig.enabled) {
    pullFromCloud(true);
  }
});
