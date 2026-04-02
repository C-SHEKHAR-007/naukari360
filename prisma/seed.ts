import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Admin ---
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.admin.upsert({
    where: { email: "admin@naukari360.in" },
    update: {},
    create: {
      email: "admin@naukari360.in",
      password: hashedPassword,
      name: "Super Admin",
      role: "super_admin",
    },
  });
  console.log("✅ Admin created");

  // --- Categories ---
  const categories = [
    {
      name: "Latest Jobs",
      nameHi: "नवीनतम नौकरी",
      slug: "latest-jobs",
      icon: "Briefcase",
      color: "#FF6B00",
      displayOrder: 1,
    },
    {
      name: "Results",
      nameHi: "रिजल्ट",
      slug: "results",
      icon: "FileText",
      color: "#22C55E",
      displayOrder: 2,
    },
    {
      name: "Admit Card",
      nameHi: "एडमिट कार्ड",
      slug: "admit-card",
      icon: "CreditCard",
      color: "#3B82F6",
      displayOrder: 3,
    },
    {
      name: "Answer Key",
      nameHi: "आंसर की",
      slug: "answer-key",
      icon: "ClipboardList",
      color: "#8B5CF6",
      displayOrder: 4,
    },
    {
      name: "Admission",
      nameHi: "एडमिशन",
      slug: "admission",
      icon: "GraduationCap",
      color: "#F59E0B",
      displayOrder: 5,
    },
    {
      name: "Syllabus",
      nameHi: "सिलेबस",
      slug: "syllabus",
      icon: "BookOpen",
      color: "#EF4444",
      displayOrder: 6,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories created");

  // --- States ---
  const states = [
    { name: "All India", nameHi: "अखिल भारतीय", slug: "all-india" },
    { name: "Uttar Pradesh", nameHi: "उत्तर प्रदेश", slug: "uttar-pradesh" },
    { name: "Bihar", nameHi: "बिहार", slug: "bihar" },
    { name: "Madhya Pradesh", nameHi: "मध्य प्रदेश", slug: "madhya-pradesh" },
    { name: "Rajasthan", nameHi: "राजस्थान", slug: "rajasthan" },
    { name: "Maharashtra", nameHi: "महाराष्ट्र", slug: "maharashtra" },
    { name: "Gujarat", nameHi: "गुजरात", slug: "gujarat" },
    { name: "Karnataka", nameHi: "कर्नाटक", slug: "karnataka" },
    { name: "Tamil Nadu", nameHi: "तमिलनाडु", slug: "tamil-nadu" },
    { name: "West Bengal", nameHi: "पश्चिम बंगाल", slug: "west-bengal" },
    { name: "Delhi", nameHi: "दिल्ली", slug: "delhi" },
    { name: "Haryana", nameHi: "हरियाणा", slug: "haryana" },
    { name: "Punjab", nameHi: "पंजाब", slug: "punjab" },
    { name: "Jharkhand", nameHi: "झारखंड", slug: "jharkhand" },
    { name: "Chhattisgarh", nameHi: "छत्तीसगढ़", slug: "chhattisgarh" },
  ];

  for (const state of states) {
    await prisma.state.upsert({
      where: { slug: state.slug },
      update: {},
      create: state,
    });
  }
  console.log("✅ States created");

  // --- Ad Slots ---
  const adSlots = [
    { name: "Header Banner", slotKey: "header_banner", device: "all" },
    { name: "Sidebar Top", slotKey: "sidebar_top", device: "desktop" },
    { name: "Sidebar Bottom", slotKey: "sidebar_bottom", device: "desktop" },
    { name: "Sidebar Sticky", slotKey: "sidebar_sticky", device: "desktop" },
    { name: "In Feed 1", slotKey: "in_feed_1", device: "all" },
    { name: "In Feed 2", slotKey: "in_feed_2", device: "all" },
    { name: "In Article 1", slotKey: "in_article_1", device: "all" },
    { name: "In Article 2", slotKey: "in_article_2", device: "all" },
    { name: "In Article 3", slotKey: "in_article_3", device: "all" },
    { name: "In Article 4", slotKey: "in_article_4", device: "all" },
    { name: "Between Sections", slotKey: "between_sections", device: "all" },
    { name: "Footer Banner", slotKey: "footer_banner", device: "all" },
    { name: "Sticky Mobile Bottom", slotKey: "sticky_mobile_bottom", device: "mobile" },
    { name: "Popup", slotKey: "popup", device: "all", popupDelay: 30 },
    { name: "Exit Intent", slotKey: "exit_intent", device: "desktop" },
    { name: "Interstitial Full", slotKey: "interstitial_full", device: "all" },
    { name: "Before Apply Button", slotKey: "before_apply_btn", device: "all" },
    { name: "Newsletter Popup", slotKey: "newsletter_popup", device: "all", popupDelay: 30 },
  ];

  for (const slot of adSlots) {
    await prisma.adSlot.upsert({
      where: { slotKey: slot.slotKey },
      update: {},
      create: slot,
    });
  }
  console.log("✅ Ad Slots created");

  // --- Site Settings ---
  const settings = [
    { key: "site_name", value: "Naukari360", type: "text" as const },
    {
      key: "tagline",
      value: "सरकारी नौकरी अपडेट 360° — Your 360° Government Jobs Portal",
      type: "text" as const,
    },
    { key: "logo_url", value: "", type: "text" as const },
    { key: "favicon_url", value: "/favicon.ico", type: "text" as const },
    { key: "footer_text", value: "© 2025 Naukari360. All rights reserved.", type: "text" as const },
    { key: "contact_email", value: "admin@naukari360.in", type: "text" as const },
    { key: "contact_phone", value: "", type: "text" as const },
    { key: "address", value: "", type: "text" as const },
    { key: "google_analytics_id", value: "", type: "text" as const },
    { key: "adsense_publisher_id", value: "", type: "text" as const },
    { key: "facebook_url", value: "", type: "text" as const },
    { key: "telegram_url", value: "https://t.me/naukari360", type: "text" as const },
    { key: "whatsapp_url", value: "", type: "text" as const },
    { key: "twitter_url", value: "", type: "text" as const },
    { key: "youtube_url", value: "", type: "text" as const },
    { key: "instagram_url", value: "", type: "text" as const },
    {
      key: "announcement_text",
      value: "Welcome to Naukari360! Get latest government job updates.",
      type: "text" as const,
    },
    { key: "announcement_active", value: "true", type: "boolean" as const },
    {
      key: "robots_txt",
      value: "User-agent: *\nAllow: /\nSitemap: https://naukari360.in/sitemap.xml",
      type: "text" as const,
    },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log("✅ Site Settings created");

  // --- Sample Posts ---
  const latestJobsCat = await prisma.category.findUnique({ where: { slug: "latest-jobs" } });
  const resultsCat = await prisma.category.findUnique({ where: { slug: "results" } });
  const admitCardCat = await prisma.category.findUnique({ where: { slug: "admit-card" } });
  const allIndiaState = await prisma.state.findUnique({ where: { slug: "all-india" } });
  const upState = await prisma.state.findUnique({ where: { slug: "uttar-pradesh" } });
  const biharState = await prisma.state.findUnique({ where: { slug: "bihar" } });

  const samplePosts = [
    {
      titleEn: "SSC CGL 2025 Notification — Apply Online for 17727 Posts",
      titleHi: "SSC CGL 2025 अधिसूचना — 17727 पदों के लिए ऑनलाइन आवेदन करें",
      slug: "ssc-cgl-2025-notification",
      excerptEn:
        "Staff Selection Commission has released CGL 2025 notification for 17727 vacancies.",
      excerptHi: "कर्मचारी चयन आयोग ने 17727 रिक्तियों के लिए CGL 2025 अधिसूचना जारी की है।",
      categoryId: latestJobsCat!.id,
      stateId: allIndiaState!.id,
      status: "published" as const,
      badge: "HOT" as const,
      totalPosts: "17727 Posts",
      organization: "Staff Selection Commission (SSC)",
      qualification: "Graduate",
      qualificationLevel: "graduate" as const,
      minAge: 18,
      maxAge: 32,
      ageLimit: "18-32 Years (Relaxation as per rules)",
      salary: "₹25,500 - ₹1,51,100/month",
      feeGeneral: "₹100",
      feeObc: "₹100",
      feeScSt: "₹0",
      feeWomen: "₹0",
      lastDate: new Date("2025-03-15"),
      applyLink: "https://ssc.gov.in",
      officialLink: "https://ssc.gov.in",
      isHot: true,
      isNew: true,
      isTrending: true,
      metaTitle: "SSC CGL 2025 - Apply Online, Eligibility, Syllabus, Exam Date",
      metaDesc:
        "SSC CGL 2025 recruitment for 17727 posts. Check eligibility, syllabus, exam date, and apply online.",
    },
    {
      titleEn: "Railway RRB NTPC 2025 — 11558 Vacancies",
      titleHi: "रेलवे RRB NTPC 2025 — 11558 रिक्तियाँ",
      slug: "rrb-ntpc-2025-recruitment",
      excerptEn:
        "Railway Recruitment Board NTPC 2025 recruitment for 11558 posts in various zones.",
      categoryId: latestJobsCat!.id,
      stateId: allIndiaState!.id,
      status: "published" as const,
      badge: "NEW" as const,
      totalPosts: "11558 Posts",
      organization: "Railway Recruitment Board (RRB)",
      qualification: "12th Pass / Graduate",
      qualificationLevel: "twelfth" as const,
      minAge: 18,
      maxAge: 33,
      ageLimit: "18-33 Years",
      salary: "₹19,900 - ₹63,200/month",
      feeGeneral: "₹500",
      feeObc: "₹500",
      feeScSt: "₹250",
      feeWomen: "₹250",
      lastDate: new Date("2025-04-10"),
      applyLink: "https://rrbcdg.gov.in",
      officialLink: "https://rrbcdg.gov.in",
      isNew: true,
      isTrending: true,
    },
    {
      titleEn: "UPSC Civil Services 2025 Preliminary Exam Notification",
      titleHi: "UPSC सिविल सेवा 2025 प्रारंभिक परीक्षा अधिसूचना",
      slug: "upsc-civil-services-2025",
      excerptEn: "Union Public Service Commission IAS/IPS 2025 prelim notification released.",
      categoryId: latestJobsCat!.id,
      stateId: allIndiaState!.id,
      status: "published" as const,
      badge: "IMPORTANT" as const,
      totalPosts: "1000+ Posts",
      organization: "Union Public Service Commission (UPSC)",
      qualification: "Graduate (Any Stream)",
      qualificationLevel: "graduate" as const,
      minAge: 21,
      maxAge: 32,
      ageLimit: "21-32 Years (OBC: 35, SC/ST: 37)",
      salary: "₹56,100 - ₹2,50,000/month",
      feeGeneral: "₹100",
      feeObc: "₹100",
      feeScSt: "₹0",
      feeWomen: "₹0",
      lastDate: new Date("2025-03-25"),
      examDate: new Date("2025-05-25"),
      applyLink: "https://upsc.gov.in",
      officialLink: "https://upsc.gov.in",
      isTrending: true,
    },
    {
      titleEn: "UP Police Constable 2025 — 60244 Vacancies",
      titleHi: "UP पुलिस कांस्टेबल 2025 — 60244 रिक्तियाँ",
      slug: "up-police-constable-2025",
      excerptEn: "Uttar Pradesh Police Recruitment Board has announced 60244 constable vacancies.",
      categoryId: latestJobsCat!.id,
      stateId: upState!.id,
      status: "published" as const,
      badge: "HOT" as const,
      totalPosts: "60244 Posts",
      organization: "UP Police Recruitment Board (UPPRPB)",
      qualification: "12th Pass",
      qualificationLevel: "twelfth" as const,
      minAge: 18,
      maxAge: 22,
      ageLimit: "18-22 Years (Relaxation as per rules)",
      salary: "₹21,700 - ₹69,100/month",
      feeGeneral: "₹400",
      feeObc: "₹400",
      feeScSt: "₹0",
      feeWomen: "₹0",
      lastDate: new Date("2025-03-20"),
      applyLink: "https://uppbpb.gov.in",
      officialLink: "https://uppbpb.gov.in",
      isHot: true,
      isNew: true,
    },
    {
      titleEn: "Bihar BPSC 70th Combined Exam 2025",
      titleHi: "बिहार BPSC 70वीं संयुक्त परीक्षा 2025",
      slug: "bpsc-70th-combined-exam-2025",
      excerptEn:
        "Bihar Public Service Commission 70th combined exam for various state-level posts.",
      categoryId: latestJobsCat!.id,
      stateId: biharState!.id,
      status: "published" as const,
      totalPosts: "1929 Posts",
      organization: "Bihar Public Service Commission (BPSC)",
      qualification: "Graduate",
      qualificationLevel: "graduate" as const,
      minAge: 20,
      maxAge: 37,
      ageLimit: "20-37 Years",
      salary: "₹36,000 - ₹1,51,100/month",
      feeGeneral: "₹600",
      feeObc: "₹150",
      feeScSt: "₹150",
      feeWomen: "₹150",
      lastDate: new Date("2025-04-15"),
      examDate: new Date("2025-06-20"),
      applyLink: "https://bpsc.bih.nic.in",
      officialLink: "https://bpsc.bih.nic.in",
    },
    {
      titleEn: "Indian Army Agniveer Recruitment 2025 — 10th Pass",
      titleHi: "भारतीय सेना अग्निवीर भर्ती 2025 — 10वीं पास",
      slug: "indian-army-agniveer-2025",
      excerptEn: "Indian Army Agniveer recruitment 2025 for 10th pass candidates.",
      categoryId: latestJobsCat!.id,
      stateId: allIndiaState!.id,
      status: "published" as const,
      badge: "TRENDING" as const,
      totalPosts: "25000+ Posts",
      organization: "Indian Army",
      qualification: "10th Pass",
      qualificationLevel: "tenth" as const,
      minAge: 17,
      maxAge: 21,
      ageLimit: "17.5 - 21 Years",
      salary: "₹30,000/month (Year 1)",
      feeGeneral: "₹0",
      feeObc: "₹0",
      feeScSt: "₹0",
      feeWomen: "₹0",
      lastDate: new Date("2025-04-30"),
      applyLink: "https://joinindianarmy.nic.in",
      officialLink: "https://joinindianarmy.nic.in",
      isTrending: true,
    },
    {
      titleEn: "SSC CHSL 2025 Result Declared — Check Score Card",
      titleHi: "SSC CHSL 2025 रिजल्ट घोषित — स्कोर कार्ड देखें",
      slug: "ssc-chsl-2025-result",
      excerptEn: "SSC CHSL 2025 Tier 1 result has been declared. Download scorecard.",
      categoryId: resultsCat!.id,
      stateId: allIndiaState!.id,
      status: "published" as const,
      badge: "NEW" as const,
      organization: "Staff Selection Commission (SSC)",
      resultDate: new Date("2025-02-01"),
      officialLink: "https://ssc.gov.in",
      isNew: true,
    },
    {
      titleEn: "UPSC IAS 2024 Final Result — Check Toppers List",
      titleHi: "UPSC IAS 2024 अंतिम परिणाम — टॉपर्स लिस्ट देखें",
      slug: "upsc-ias-2024-final-result",
      excerptEn: "UPSC Civil Services 2024 final result declared. Check toppers and cutoff.",
      categoryId: resultsCat!.id,
      stateId: allIndiaState!.id,
      status: "published" as const,
      badge: "IMPORTANT" as const,
      organization: "Union Public Service Commission (UPSC)",
      resultDate: new Date("2025-01-20"),
      officialLink: "https://upsc.gov.in",
    },
    {
      titleEn: "RRB NTPC CBT-2 Admit Card 2025 — Download Now",
      titleHi: "RRB NTPC CBT-2 एडमिट कार्ड 2025 — अभी डाउनलोड करें",
      slug: "rrb-ntpc-cbt2-admit-card-2025",
      excerptEn: "Railway NTPC CBT-2 admit card released. Download from official website.",
      categoryId: admitCardCat!.id,
      stateId: allIndiaState!.id,
      status: "published" as const,
      badge: "HOT" as const,
      organization: "Railway Recruitment Board (RRB)",
      examDate: new Date("2025-03-10"),
      admitCardLink: "https://rrbcdg.gov.in",
      officialLink: "https://rrbcdg.gov.in",
      isHot: true,
    },
    {
      titleEn: "SSC GD Constable 2025 — 75768 Vacancies",
      titleHi: "SSC GD कांस्टेबल 2025 — 75768 रिक्तियाँ",
      slug: "ssc-gd-constable-2025",
      excerptEn: "SSC GD Constable 2025 recruitment for CRPF, BSF, CISF, SSB, ITBP.",
      categoryId: latestJobsCat!.id,
      stateId: allIndiaState!.id,
      status: "published" as const,
      badge: "HOT" as const,
      totalPosts: "75768 Posts",
      organization: "Staff Selection Commission (SSC)",
      qualification: "10th Pass",
      qualificationLevel: "tenth" as const,
      minAge: 18,
      maxAge: 23,
      ageLimit: "18-23 Years",
      salary: "₹21,700 - ₹69,100/month",
      feeGeneral: "₹100",
      feeObc: "₹100",
      feeScSt: "₹0",
      feeWomen: "₹0",
      lastDate: new Date("2025-03-28"),
      applyLink: "https://ssc.gov.in",
      officialLink: "https://ssc.gov.in",
      isHot: true,
      isTrending: true,
    },
    {
      titleEn: "IBPS PO 2025 Notification — Banking Officer Posts",
      titleHi: "IBPS PO 2025 अधिसूचना — बैंकिंग अधिकारी पद",
      slug: "ibps-po-2025-notification",
      excerptEn: "IBPS PO 2025 recruitment for Probationary Officers in public sector banks.",
      categoryId: latestJobsCat!.id,
      stateId: allIndiaState!.id,
      status: "published" as const,
      totalPosts: "4500+ Posts",
      organization: "Institute of Banking Personnel Selection (IBPS)",
      qualification: "Graduate (Any Stream)",
      qualificationLevel: "graduate" as const,
      minAge: 20,
      maxAge: 30,
      ageLimit: "20-30 Years",
      salary: "₹36,000 - ₹63,840/month",
      feeGeneral: "₹850",
      feeObc: "₹850",
      feeScSt: "₹175",
      feeWomen: "₹175",
      lastDate: new Date("2025-04-20"),
      examDate: new Date("2025-06-15"),
      applyLink: "https://ibps.in",
      officialLink: "https://ibps.in",
    },
    {
      titleEn: "Delhi Police Head Constable 2025 — 1800 Posts",
      titleHi: "दिल्ली पुलिस हेड कांस्टेबल 2025 — 1800 पद",
      slug: "delhi-police-head-constable-2025",
      excerptEn: "Delhi Police recruitment 2025 for Head Constable (Ministerial) posts.",
      categoryId: latestJobsCat!.id,
      stateId: await prisma.state.findUnique({ where: { slug: "delhi" } }).then((s) => s!.id),
      status: "published" as const,
      totalPosts: "1800 Posts",
      organization: "Delhi Police (SSC)",
      qualification: "12th Pass + Typing",
      qualificationLevel: "twelfth" as const,
      minAge: 18,
      maxAge: 27,
      ageLimit: "18-27 Years",
      salary: "₹25,500 - ₹81,100/month",
      feeGeneral: "₹100",
      feeObc: "₹100",
      feeScSt: "₹0",
      feeWomen: "₹0",
      lastDate: new Date("2025-04-05"),
      applyLink: "https://ssc.gov.in",
      officialLink: "https://ssc.gov.in",
    },
    {
      titleEn: "UPSSSC PET 2025 — Preliminary Eligibility Test",
      titleHi: "UPSSSC PET 2025 — प्रारंभिक पात्रता परीक्षा",
      slug: "upsssc-pet-2025",
      excerptEn: "UP Subordinate Services Selection Commission PET 2025 registration open.",
      categoryId: latestJobsCat!.id,
      stateId: upState!.id,
      status: "published" as const,
      organization: "UP Subordinate Services Selection Commission",
      qualification: "10th / 12th / Graduate",
      qualificationLevel: "tenth" as const,
      minAge: 18,
      maxAge: 40,
      ageLimit: "18-40 Years",
      feeGeneral: "₹185",
      feeObc: "₹185",
      feeScSt: "₹95",
      feeWomen: "₹95",
      lastDate: new Date("2025-04-12"),
      examDate: new Date("2025-07-01"),
      applyLink: "https://upsssc.gov.in",
      officialLink: "https://upsssc.gov.in",
    },
    {
      titleEn: "NTA UGC NET June 2025 — Apply Online",
      titleHi: "NTA UGC NET जून 2025 — ऑनलाइन आवेदन करें",
      slug: "ugc-net-june-2025",
      excerptEn: "National Testing Agency UGC NET June 2025 for Assistant Professor and JRF.",
      categoryId: latestJobsCat!.id,
      stateId: allIndiaState!.id,
      status: "published" as const,
      organization: "National Testing Agency (NTA)",
      qualification: "Post Graduate",
      qualificationLevel: "post_graduate" as const,
      minAge: 0,
      maxAge: 0,
      ageLimit: "No Age Limit (for NET), 31 Years (for JRF)",
      feeGeneral: "₹1150",
      feeObc: "₹600",
      feeScSt: "₹325",
      feeWomen: "₹325",
      lastDate: new Date("2025-04-25"),
      examDate: new Date("2025-06-25"),
      applyLink: "https://ugcnet.nta.ac.in",
      officialLink: "https://ugcnet.nta.ac.in",
    },
    {
      titleEn: "Rajasthan RPSC RAS 2025 — State Services Exam",
      titleHi: "राजस्थान RPSC RAS 2025 — राज्य सेवा परीक्षा",
      slug: "rpsc-ras-2025",
      excerptEn: "Rajasthan Public Service Commission RAS/RTS 2025 combined competitive exam.",
      categoryId: latestJobsCat!.id,
      stateId: await prisma.state.findUnique({ where: { slug: "rajasthan" } }).then((s) => s!.id),
      status: "published" as const,
      totalPosts: "900+ Posts",
      organization: "Rajasthan Public Service Commission (RPSC)",
      qualification: "Graduate",
      qualificationLevel: "graduate" as const,
      minAge: 21,
      maxAge: 40,
      ageLimit: "21-40 Years",
      salary: "₹36,000 - ₹1,51,100/month",
      feeGeneral: "₹600",
      feeObc: "₹400",
      feeScSt: "₹400",
      feeWomen: "₹400",
      lastDate: new Date("2025-05-01"),
      applyLink: "https://rpsc.rajasthan.gov.in",
      officialLink: "https://rpsc.rajasthan.gov.in",
    },
  ];

  for (const post of samplePosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log("✅ 15 Sample Posts created");

  // --- Nav Menus ---
  const navMenus = [
    { label: "Latest Jobs", labelHi: "नवीनतम नौकरी", url: "/latest-jobs", displayOrder: 1 },
    { label: "Results", labelHi: "रिजल्ट", url: "/results", displayOrder: 2 },
    { label: "Admit Card", labelHi: "एडमिट कार्ड", url: "/admit-card", displayOrder: 3 },
    { label: "Answer Key", labelHi: "आंसर की", url: "/answer-key", displayOrder: 4 },
    { label: "Admission", labelHi: "एडमिशन", url: "/admission", displayOrder: 5 },
    { label: "Syllabus", labelHi: "सिलेबस", url: "/syllabus", displayOrder: 6 },
    { label: "Exam Calendar", labelHi: "परीक्षा कैलेंडर", url: "/exam-calendar", displayOrder: 7 },
  ];

  for (const menu of navMenus) {
    const existing = await prisma.navMenu.findFirst({ where: { url: menu.url } });
    if (!existing) {
      await prisma.navMenu.create({ data: menu });
    }
  }
  console.log("✅ Nav Menus created");

  // --- Static Pages ---
  const pages = [
    {
      titleEn: "About Us",
      titleHi: "हमारे बारे में",
      slug: "about",
      contentEn:
        "<h1>About Naukari360</h1><p>Naukari360 is your one-stop destination for all government job notifications, exam results, admit cards, and more. We provide accurate and timely information to help you prepare for and apply to government jobs across India.</p>",
      contentHi:
        "<h1>सरकारी पल्स के बारे में</h1><p>सरकारी पल्स सभी सरकारी नौकरी अधिसूचनाओं, परीक्षा परिणामों, एडमिट कार्ड और अन्य जानकारी के लिए आपका एक-स्टॉप डेस्टिनेशन है।</p>",
    },
    {
      titleEn: "Contact Us",
      titleHi: "संपर्क करें",
      slug: "contact",
      contentEn:
        "<h1>Contact Us</h1><p>Have a question or want to advertise with us? Fill out the form below and we'll get back to you.</p>",
      contentHi:
        "<h1>संपर्क करें</h1><p>कोई प्रश्न है या विज्ञापन देना चाहते हैं? नीचे फॉर्म भरें।</p>",
    },
    {
      titleEn: "Privacy Policy",
      titleHi: "गोपनीयता नीति",
      slug: "privacy-policy",
      contentEn:
        "<h1>Privacy Policy</h1><p>This privacy policy explains how Naukari360 collects, uses, and protects your personal information when you use our website.</p>",
      contentHi:
        "<h1>गोपनीयता नीति</h1><p>यह गोपनीयता नीति बताती है कि सरकारी पल्स आपकी व्यक्तिगत जानकारी कैसे एकत्र, उपयोग और सुरक्षित करती है।</p>",
    },
    {
      titleEn: "Disclaimer",
      titleHi: "अस्वीकरण",
      slug: "disclaimer",
      contentEn:
        "<h1>Disclaimer</h1><p>The information provided on Naukari360 is for general informational purposes only. We make every effort to ensure accuracy but recommend verifying details from official sources before applying.</p>",
      contentHi:
        "<h1>अस्वीकरण</h1><p>सरकारी पल्स पर दी गई जानकारी केवल सामान्य सूचना उद्देश्यों के लिए है। आवेदन करने से पहले आधिकारिक स्रोतों से विवरण सत्यापित करें।</p>",
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }
  console.log("✅ Static Pages created");

  // --- Interstitial Page ---
  await prisma.interstitialPage.upsert({
    where: { id: "default-interstitial" },
    update: {},
    create: {
      id: "default-interstitial",
      title: "Redirecting to Official Site...",
      adSlotKey: "interstitial_full",
      delaySeconds: 5,
      isActive: true,
    },
  });
  console.log("✅ Interstitial Page configured");

  console.log("\n🎉 Database seeded successfully!");
  console.log("📧 Admin login: admin@naukari360.in / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
