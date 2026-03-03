// server.js — Tula's Institute Chatbot (tulas.edu.in)
console.log("🔥 TULAS INSTITUTE SERVER.JS - PRODUCTION VERSION 🔥");

const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// ==============================================
// API KEYS
// ==============================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let genAI = null;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log('✅ Gemini API initialized');
} else {
  console.log('⚠️ Gemini API key not found - using Knowledge Base only');
}

// ==============================================
// EMAIL CONFIGURATION
// ==============================================
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@tulas.edu.in';
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// ==============================================
// OTP STORE (in-memory)
// ==============================================
const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ==============================================
// COMPREHENSIVE KNOWLEDGE BASE — TULA'S INSTITUTE
// ==============================================
const KNOWLEDGE_BASE = {

  // ============================================
  // ABOUT / OVERVIEW
  // ============================================
  about: {
    keywords: [
      'about', 'about tulas', 'about tula', 'about college', 'tell me about',
      'overview', 'introduction', 'what is tulas', 'who is tulas',
      'tulas institute', "tula's institute", 'college info', 'college details',
      'history', 'founded', 'established', 'when started', 'inception',
      'rishabh educational trust', 'sunil kumar jain', 'chairman', 'director',
      'trust', 'management college', 'engineering college dehradun'
    ],
    answer: "🎓 About Tula's Institute:\n\nTula's Institute (The Engineering & Management College) was established in **2006** under the **Rishabh Educational Trust**, chaired by **Mr. Sunil Kumar Jain**.\n\n🏆 Key Highlights:\n• NAAC A+ Accredited — Highest in Uttarakhand\n• NBA Accredited Programs\n• Approved by AICTE & UGC\n• Affiliated to Uttarakhand Technical University (UTU)\n• 20-acre lush green eco-friendly campus\n• 150+ highly qualified faculty members (PhD holders)\n• 7,000+ alumni network\n• Microsoft Innovation Centre on campus\n\n📍 Located in Dhoolkot Village, Selaqui, Dehradun\n\n🔗 More About Us: https://tulas.edu.in/about/why-tulas/"
  },

  // ============================================
  // RANKINGS & ACCREDITATIONS
  // ============================================
  rankings: {
    keywords: [
      'ranking', 'rank', 'ranked', 'accreditation', 'accredited', 'naac', 'nba',
      'aicte', 'ugc', 'recognition', 'awards', 'achievements', 'top college',
      'best college', 'rating', 'outlook ranking', 'times ranking', 'india today ranking',
      'nirf', 'careers360', 'qs ranking', 'how good is tulas', 'reputation'
    ],
    answer: "🏆 Rankings & Accreditations:\n\n🥇 Accreditations:\n✅ NAAC A+ Grade — Highest in Uttarakhand\n✅ NBA Accredited Programs\n✅ AICTE Approved\n✅ UGC Recognized\n✅ Affiliated to UTU (Uttarakhand Technical University)\n\n📊 Rankings:\n• 🏅 Ranked Among **Top 50 Private Colleges** in India\n• 📰 **86th** by Times of India B-School Rankings\n• 📰 **65th** Best Engineering College — Outlook 2023\n• 📰 **130th** — India Today Engineering (Private) 2023\n• 📰 **125th** — India Today BBA 2023\n• ⭐ **AAA Rating** by Careers 360\n\n🔗 Full Details: https://tulas.edu.in/about/why-tulas/"
  },

  // ============================================
  // COURSES OFFERED
  // ============================================
  courses: {
    keywords: [
      'courses', 'course', 'programs', 'programme', 'what courses', 'courses offered',
      'which courses', 'degree', 'btech', 'b.tech', 'mtech', 'm.tech', 'mba', 'bba',
      'bca', 'mca', 'bsc', 'b.sc', 'bjmc', 'b.com', 'diploma', 'polytechnic',
      'b pharma', 'agriculture', 'forestry', 'what can i study', 'all courses',
      'list of courses', 'streams available', 'specializations', 'branches',
      'computer science', 'cse', 'civil engineering', 'mechanical', 'ece',
      'ai ml', 'data science', 'cyber security', 'information technology', 'it branch'
    ],
    answer: "📚 Courses Offered at Tula's Institute:\n\n🔧 **B.Tech (4 years):**\n• Computer Science Engineering (CSE)\n• CSE with AI & ML\n• CSE with Data Science\n• CSE with Cyber Security\n• Information Technology (IT)\n• Electronics & Communication Engineering (ECE)\n• Mechanical Engineering\n• Civil Engineering\n\n💼 **Management & Commerce:**\n• BBA (Bachelor of Business Administration)\n• MBA (Master of Business Administration)\n• B.Com (Honors)\n\n💻 **Computer Applications:**\n• BCA (Bachelor of Computer Applications)\n• MCA (Master of Computer Applications)\n\n🌾 **Agriculture & Sciences:**\n• B.Sc. Agriculture\n• B.Sc. Forestry\n• M.Sc. (various)\n\n📰 **Mass Communication:**\n• BJMC (Bachelor of Journalism & Mass Communication)\n\n💊 **Pharmacy:**\n• B.Pharma\n\n🔨 **Polytechnic / Diploma (3 years)**\n\n🎓 **Postgraduate Engineering:**\n• M.Tech (various specializations)\n\n🔗 All Courses: https://tulas.edu.in/courses/"
  },

  btech_courses: {
    keywords: [
      'btech courses', 'b.tech branches', 'engineering branches', 'which engineering',
      'cse specialization', 'ai ml branch', 'data science branch', 'cyber security branch',
      'mechanical branch', 'civil branch', 'ece branch', 'it branch btech',
      'computer science btech', 'best branch tulas', 'which btech is good'
    ],
    answer: "🔧 B.Tech Programs at Tula's Institute:\n\n💻 **Computer Science & IT:**\n• B.Tech CSE (Computer Science Engineering)\n• B.Tech CSE with AI & Machine Learning\n• B.Tech CSE with Data Science\n• B.Tech CSE with Cyber Security\n• B.Tech Information Technology (IT)\n\n⚡ **Electronics:**\n• B.Tech ECE (Electronics & Communication Engineering)\n\n⚙️ **Core Engineering:**\n• B.Tech Mechanical Engineering\n• B.Tech Civil Engineering\n• B.Tech Civil Engineering (Lateral Entry)\n\n📌 All B.Tech programs are **4 years** duration\n📌 Affiliated to **Uttarakhand Technical University (UTU)**\n📌 Approved by **AICTE**\n\n🔗 CSE Details: https://tulas.edu.in/courses/btech/computer-science/\n🔗 All Courses: https://tulas.edu.in/courses/"
  },

  // ============================================
  // ADMISSION PROCESS
  // ============================================
  admission: {
    keywords: [
      'admission', 'admissions', 'apply', 'apply now', 'how to apply', 'apply for admission',
      'admission process', 'admission procedure', 'enrollment', 'enroll', 'join',
      'how to get admission', 'steps to apply', 'application form', 'registration form',
      'selection process', 'merit list', 'counseling', 'counselling', 'seat allotment',
      'entrance test', 'admission criteria', 'when to apply', 'application deadline',
      'admission open', 'admission 2025', 'admission 2026'
    ],
    answer: "📝 Admission Process at Tula's Institute:\n\n🎯 **Step-by-Step Process:**\n✅ Step 1: Fill the online application form\n✅ Step 2: Submit required documents\n✅ Step 3: Appear for entrance exam / submit valid scores\n✅ Step 4: Attend counseling session\n✅ Step 5: Confirm seat by depositing registration fee\n✅ Step 6: Complete admission formalities\n\n📌 **Registration Fee:**\n• Higher Education Courses: ₹5,000\n• Polytechnic: ₹2,000\n\n🔗 Admission Procedure: https://tulas.edu.in/admission-procedure/\n🔗 Apply Now: https://tulas.edu.in/apply-now/\n\n📞 Helpline: **+91-9837983721**\n📧 info@tulas.edu.in"
  },

  eligibility: {
    keywords: [
      'eligibility', 'eligible', 'criteria', 'qualification required', 'minimum marks',
      'who can apply', 'percentage required', 'pcm marks', 'cutoff', 'cut off',
      'jee cutoff', 'minimum percentage', 'required marks', '12th marks', 'board marks',
      'eligibility criteria', 'admission criteria', 'requirement for admission',
      'percentage needed', 'marks needed', 'what percentage for btech'
    ],
    answer: "📋 Eligibility Criteria:\n\n🔧 **B.Tech:**\n• Minimum **60% in PCM** (Physics, Chemistry, Mathematics) in 12th\n• Valid JEE Main score OR UKSEE/UBTER JEEP\n• Lateral Entry: Diploma with **45%+** in relevant branch\n\n💼 **BBA / B.Com:**\n• 12th passed in any stream\n• Minimum **45%** (General) / **40%** (SC/ST)\n\n💊 **B.Pharma:**\n• 12th with PCB/PCM with **50%+**\n\n🌾 **B.Sc. Agriculture / Forestry:**\n• 12th with Science stream **50%+**\n\n🎓 **MBA:**\n• Graduation with minimum **50%** marks\n• Valid CAT / MAT / XAT / CMAT / UKSEE score\n\n💻 **MCA:**\n• Graduation with **50%+** marks\n\n🎓 **M.Tech:**\n• B.Tech / B.E. with **50%+**, valid GATE score preferred\n\n🔨 **Polytechnic:**\n• 10th passed with minimum **35%** marks\n\n🔗 Full Eligibility Details: https://tulas.edu.in/admission-procedure/"
  },

  entrance_exams: {
    keywords: [
      'entrance exam', 'entrance test', 'jee', 'jee main', 'gate', 'cat', 'mat',
      'uksee', 'ubter jeep', 'jeep', 'cmat', 'xat', 'gmat', 'cuet',
      'which exam', 'exam accepted', 'entrance required', 'exam for admission',
      'jee required', 'gate required', 'which entrance exam'
    ],
    answer: "📝 Entrance Exams Accepted at Tula's Institute:\n\n🔧 **B.Tech:**\n• JEE Main\n• UKSEE (Uttarakhand State Entrance Exam)\n• UBTER JEEP\n• Merit based on 12th PCM %\n\n💼 **MBA:**\n• CAT / MAT / XAT / CMAT / GMAT\n• UKSEE (Management)\n\n🎓 **M.Tech:**\n• GATE (preferred)\n• University level test\n\n💻 **MCA:**\n• University entrance test\n• Graduation merit\n\n🔨 **Polytechnic:**\n• UBTER JEEP (Uttarakhand)\n• 10th merit-based\n\n🔗 Admission Details: https://tulas.edu.in/admission-procedure/"
  },

  documents: {
    keywords: [
      'documents', 'document required', 'papers needed', 'certificates needed',
      'what to bring', 'required documents', 'mark sheet', 'transfer certificate',
      'aadhaar', 'pan card', 'birth certificate', 'character certificate',
      'caste certificate', 'domicile certificate', 'passport size', 'photo required',
      'migration certificate', 'documents for admission'
    ],
    answer: "📄 Documents Required for Admission:\n\n✅ **Academic Documents:**\n• 10th Mark Sheet & Certificate\n• 12th Mark Sheet & Certificate\n• Transfer Certificate (TC)\n• Migration Certificate (if applicable)\n• Character Certificate\n\n✅ **Personal Documents:**\n• Aadhaar Card (Student)\n• Passport-size photographs (6-8)\n• Birth Certificate\n\n✅ **Category Documents (if applicable):**\n• Caste Certificate (SC/ST/OBC)\n• Uttarakhand Domicile Certificate\n• Bihar DRCC Certificate\n\n✅ **Entrance Exam:**\n• JEE Main / GATE / CAT / MAT scorecard\n\n🔗 Admission Procedure: https://tulas.edu.in/admission-procedure/"
  },

  // ============================================
  // FEE STRUCTURE
  // ============================================
  fee: {
    keywords: [
      'fee', 'fees', 'fee structure', 'tuition fee', 'cost', 'charges',
      'annual fee', 'semester fee', 'how much fee', 'total fee', 'fee details',
      'course fee', 'btech fee', 'mba fee', 'bba fee', 'mca fee', 'bca fee',
      'polytechnic fee', 'diploma fee', 'bsc fee', 'bjmc fee', 'b pharma fee',
      'how much does it cost', 'affordable', 'fee payment', 'installment'
    ],
    answer: "💰 Fee Structure at Tula's Institute:\n\n🔧 **B.Tech (4 Years Total):**\n• CSE / IT / ECE / Mech / Civil: ₹4.63 Lakhs – ₹6.81 Lakhs\n• AI & ML / Data Science / Cyber Security specialization: +₹25,000/year extra\n• Per Year Approx: ₹1,34,100 – ₹1,65,000\n\n💼 **BBA (3 Years Total):** ₹2.91 Lakhs (~₹70,000–95,000/year)\n\n🎓 **MBA (2 Years Total):** ₹4.21 Lakhs (~₹2,00,000/year)\n\n💻 **BCA (3 Years Total):** ₹2.61 Lakhs\n💻 **MCA:** Approx ₹2.05 Lakhs (2 years)\n\n🔨 **Polytechnic / Diploma (3 Years Total):** ₹1.1L – ₹1.57L\n\n🌾 **B.Sc Agriculture/Forestry:** ₹70,000 – ₹1.1L/year\n\n🏨 **Hostel Fee (per year):**\n• Non-AC Room: ₹95,000 – ₹1,03,000\n• AC Room: ₹1,31,000 – ₹1,39,000\n(Includes laundry charges of ₹2,500)\n\n📌 Fees can be paid in **3 installments**: 30% + 30% + 40%\n\n🔗 Pay Online: https://tulas.edu.in/pay-fee-online/\n🔗 Admission Details: https://tulas.edu.in/admission-procedure/"
  },

  fee_payment: {
    keywords: [
      'pay fee', 'fee payment online', 'pay online', 'how to pay fee',
      'online payment', 'payment portal', 'pay academic fee', 'pay hostel fee',
      'installment payment', 'fee installment', 'payment method', 'dd payment',
      'cash payment', 'fee portal'
    ],
    answer: "💳 Fee Payment at Tula's Institute:\n\n✅ **Online Payment:**\n• Visit: https://tulas.edu.in/pay-fee-online/\n• Two options: Pay Academic Fee / Pay Hostel Fee\n\n✅ **Installment Plan (Academic Fee):**\n• Installment 1: 30%\n• Installment 2: 30%\n• Installment 3: 40%\n\n✅ **Offline Payment:**\n• Cash / DD at college campus\n• Must be deposited within **15 days** of seat allotment\n\n📞 Helpline: **+91-9837983721**\n\n🔗 Pay Fee: https://tulas.edu.in/pay-fee-online/"
  },

  // ============================================
  // SCHOLARSHIPS
  // ============================================
  scholarships: {
    keywords: [
      'scholarship', 'scholarships', 'financial aid', 'fee waiver', 'discount',
      'merit scholarship', 'jee scholarship', 'domicile scholarship', 'sc st scholarship',
      'free seat', 'scholarship criteria', 'how to get scholarship',
      'bright future scholarship', 'scholarship amount', 'scholarship available',
      'uttarakhand scholarship', 'bihar scholarship', 'drcc', 'concession',
      'defense scholarship', 'girl scholarship', 'financial assistance'
    ],
    answer: "🎓 Scholarships at Tula's Institute:\n\n✅ **Merit-Based Scholarships:**\n• Bright Future Scholarship: ₹10,000 to meritorious students\n• JEE Main high scorers: Tuition fee concession\n• 12th Board toppers: Special discounts\n\n✅ **Category-Based:**\n• Uttarakhand Domicile: ₹10,000 scholarship + 15% fee concession\n• Bihar DRCC: Government scholarship available\n• SC/ST Category: Government scholarship applicable\n• Defense Personnel Wards: Special scholarship\n• Female Students: Scholarship support available\n\n✅ **Financial Need-Based:**\n• Families affected by COVID-19: Special fee payment policy\n• Economically weaker sections: Financial assistance\n\n📌 **Note:** Scholarships are renewed annually based on academic performance\n\n🔗 Scholarship Details: https://tulas.edu.in/admission-procedure/\n📞 Enquire: **+91-9837983721**"
  },

  // ============================================
  // PLACEMENTS
  // ============================================
  placements: {
    keywords: [
      'placement', 'placements', 'job', 'jobs', 'career', 'recruitment', 'recruiters',
      'companies', 'hiring', 'campus placement', 'placement record', 'salary',
      'package', 'lpa', 'highest package', 'average package', 'placement percentage',
      'placement cell', 'training placement', 'internship', 'job opportunities',
      'after college job', 'does tulas have good placements', 'placement guarantee',
      'top recruiters', 'placement 2024', 'placement 2025', 'adobe placement',
      'microsoft placement', 'ibm placement', 'wipro placement', 'infosys placement'
    ],
    answer: "💼 Placements at Tula's Institute:\n\n🏆 **Placement Highlights:**\n• Highest Package: **₹36 LPA** (Overall)\n• Highest Package 2024: **₹22 LPA** — Adobe\n• Average Package: **₹4–6 LPA**\n• **75% Placement Guarantee** to students\n• 300+ alumni working in Private & Government sectors\n• 7,000+ alumni network\n\n🏢 **Top Recruiters Include:**\nMicrosoft • IBM • Adobe • HCL • Wipro • TCS • Infosys • Amazon • Oracle • Samsung • Deutsche Bank • Barclays • Vodafone • Hero Honda • Genpact • NIIT • Bosch • Byju's • Vivo • Aditya Birla Group • Indian Army • Hexaware • Collabera • Square Yards • Cummins India • Aon Hewitt and many more!\n\n✅ **Training & Placement Cell:**\n• Skill development programs\n• Mock interviews & group discussions\n• Industry collaborations & pre-placement talks\n• Internship opportunities\n\n🔗 Placement Details: https://tulas.edu.in/"
  },

  internship: {
    keywords: [
      'internship', 'internships', 'industry training', 'summer training',
      'industry exposure', 'live project', 'practical training', 'on job training',
      'internship opportunity', 'bharat electronics', 'internship in final year'
    ],
    answer: "🏭 Internships & Industry Exposure:\n\nTula's Institute provides excellent internship opportunities:\n\n✅ Tie-ups with leading companies\n✅ Internship drives on campus\n✅ Industry visits & field exposure\n✅ Students have interned at: Bharat Electronics Limited (BEL), IT companies, government organizations, and more\n✅ Practical labs for real-world skill development\n✅ Microsoft Innovation Centre for tech training\n\n📞 Contact Placement Cell: **+91-9837983721**\n🔗 Learn More: https://tulas.edu.in/"
  },

  // ============================================
  // CAMPUS & INFRASTRUCTURE
  // ============================================
  campus: {
    keywords: [
      'campus', 'infrastructure', 'facilities', 'campus facilities',
      'college facilities', 'auditorium', 'library', 'labs', 'laboratory',
      'campus life', 'college life', 'campus area', 'campus size', 'how big',
      '20 acres', '22 acres', 'green campus', 'campus tour', 'virtual tour',
      'what facilities', 'amenities', 'modern campus', 'campus environment'
    ],
    answer: "🏛️ Campus & Infrastructure at Tula's Institute:\n\n📐 **Campus:** 20-acre lush green, eco-friendly campus\n\n🏫 **Academic Facilities:**\n• Modern ICT-enabled classrooms\n• Civil, Electrical, Electronics, Mechanical, Physics Labs\n• Computer Labs with latest hardware & software\n• VLAB (Virtual Laboratory)\n• Remote Robotics Lab (Germany tie-up)\n• Microsoft Innovation Centre\n• D-Link Academic Campus Connect Programme\n\n📚 **Library:**\n• 52,200+ volumes of books\n• 17,500+ e-books\n• 2,200+ e-Journals (24x7 FTP access)\n• Digital library with intranet access\n\n🎭 **Auditorium:**\n• 550-seat fully air-conditioned auditorium\n• State-of-the-art lighting & audiovisual equipment\n\n🛒 **Shopping Arcade:**\n• Barber shop, Laundry, Stationery, Tuck shop\n\n🍽️ **Multi-Cuisine Cafeteria** — open till 9 PM\n\n🏋️ **Gymnasium:** Treadmill, Rowing machine, Cycle, Cross trainer, Steppers, Ab rollers (with trainers)\n\n🏧 **ATM, Guest House, Medical Facility**\n\n📡 **Wi-Fi:** 205 Mbps speed, 24x7 campus-wide\n\n🔗 Virtual Tour: https://tulas.edu.in/virtual-tour/\n🔗 About Campus: https://tulas.edu.in/about/why-tulas/"
  },

  library: {
    keywords: [
      'library', 'books', 'e-books', 'digital library', 'journals', 'e-journals',
      'reading room', 'study material', 'reference books', 'library hours',
      'library resources', 'how many books', 'library access'
    ],
    answer: "📚 Library at Tula's Institute:\n\n✅ **Physical Collection:**\n• 52,200+ volumes of books\n• Journals, periodicals & magazines\n• Reference books and project reports\n\n✅ **Digital Library:**\n• 17,500+ e-books\n• 2,200+ e-Journals\n• 24x7 access via FTP server on intranet\n• Students can access from anywhere on campus\n\n✅ **Features:**\n• Regularly updated with latest publications\n• Study and reading rooms\n• Peaceful academic environment\n\n🔗 Campus Details: https://tulas.edu.in/about/why-tulas/"
  },

  sports: {
    keywords: [
      'sports', 'sport', 'games', 'sports facility', 'cricket', 'football',
      'basketball', 'badminton', 'volleyball', 'table tennis', 'gym', 'gymnasium',
      'outdoor sports', 'indoor sports', 'playing field', 'sports ground',
      'physical education', 'fitness', 'sports at tulas', 'sports activities'
    ],
    answer: "⚽ Sports & Physical Activities at Tula's Institute:\n\n🏟️ **Outdoor Sports:**\n• Cricket Ground\n• Football Field\n• Basketball Court\n• Volleyball Court\n• Hockey\n\n🏸 **Indoor Sports:**\n• 3 Badminton Courts\n• Table Tennis Room\n• Recreation Room\n\n🏋️ **Gymnasium:**\n• Treadmill, Rowing Machine, Cycle\n• Cross Trainer, Steppers, Ab Rollers, Twister\n• Specialized trainers on staff\n\n✅ Regular inter-hostel sports competitions\n✅ Annual Sports Day events\n✅ Students encouraged to maintain fitness throughout the year\n\n🔗 Campus Details: https://tulas.edu.in/about/why-tulas/"
  },

  // ============================================
  // HOSTEL FACILITIES
  // ============================================
  hostel: {
    keywords: [
      'hostel', 'hostels', 'accommodation', 'residential', 'boarding', 'dorm',
      'dormitory', 'hostel facility', 'hostel facilities', 'boys hostel', 'girls hostel',
      'room', 'rooms', 'twin sharing', 'hostel life', 'hostel rules',
      'hostel fee', 'hostel charges', 'ac room', 'non ac room', 'hostel food',
      'hostel wifi', 'hostel security', 'hostel mess', 'hostel timing',
      'hostel amenities', 'hostel available', 'hostel at tulas', 'can i stay in hostel'
    ],
    answer: "🏠 Hostel Facilities at Tula's Institute:\n\n🏢 **Hostels:**\n• **4 Boys' Hostels** + **2 Girls' Hostels** on campus\n• Twin-sharing rooms — wide, ventilated & well-lit\n\n🛏️ **Room Amenities:**\n• 2 Beds, 2 Tables, 2 Chairs, 2 Cupboards per room\n• Personal bookshelf for each student\n• Wi-Fi 24x7 in all rooms\n• Hot water supply\n• Power backup\n\n🍽️ **Mess / Food:**\n• Breakfast, Lunch, Evening Tea, Dinner daily\n• Hygienic and nutritious meals\n• Multi-cuisine options\n\n🛡️ **Security:**\n• 24x7 CCTV surveillance\n• Security personnel round the clock\n• Controlled entry/exit\n\n💰 **Hostel Fee (per year):**\n• Non-AC: ₹95,000 – ₹1,03,000 (incl. ₹2,500 laundry)\n• AC: ₹1,31,000 – ₹1,39,000\n\n🎬 **Extras:**\n• Regular movie screenings in theater\n• Inter-hostel sports competitions\n• Recreational outings\n\n📌 Hostel closing time: **9:00 PM**\n\n🔗 Pay Hostel Fee: https://tulas.edu.in/pay-fee-online/\n🔗 About Campus: https://tulas.edu.in/about/why-tulas/"
  },

  hostel_food: {
    keywords: [
      'hostel food', 'mess food', 'mess menu', 'what food in hostel', 'food quality',
      'mess timing', 'breakfast time', 'lunch time', 'dinner time',
      'food in hostel', 'canteen hostel', 'is food good', 'hostel mess timing',
      'food available', 'mess charges', 'meal timing', 'hostel meal'
    ],
    answer: "🍽️ Hostel Mess & Food at Tula's Institute:\n\n📅 **Daily Meal Schedule:**\n• ☀️ Breakfast — Morning\n• 🍽️ Lunch — 12:15 PM area\n• 🫖 Evening Tea & Snacks\n• 🍲 Dinner — Evening\n\n✅ **Food Quality:**\n• Hygienic, nutritious meals daily\n• Menu designed to cater to students from all states of India\n• Multi-cuisine options available\n• Mess is supervised for quality\n\n🍎 **Cafeteria:**\n• Open till **9:00 PM**\n• Multi-cuisine — breakfast to dinner\n• Popular hangout spot during breaks\n\n🔗 Hostel Info: https://tulas.edu.in/about/why-tulas/"
  },

  // ============================================
  // FACULTY
  // ============================================
  faculty: {
    keywords: [
      'faculty', 'teachers', 'professors', 'teaching staff', 'faculty qualification',
      'phd faculty', 'how many teachers', 'faculty members', 'teacher quality',
      'good teachers', 'faculty tulas', 'academic staff', 'teaching quality',
      'faculty details', 'who teaches', 'faculty expertise', '150 faculty'
    ],
    answer: "👨‍🏫 Faculty at Tula's Institute:\n\n✅ **150+ Highly Qualified Faculty Members**\n✅ Most faculty hold **PhD degrees** from reputed universities\n✅ M.Tech faculty pursuing PhDs\n✅ Faculty trained in industry practices\n\n🌟 **Faculty Highlights:**\n• PhD holders in respective fields\n• Industry experienced professionals\n• Friendly yet disciplined teaching approach\n• Practical, innovative teaching methods\n• 25+ research papers published in reputed journals\n• Active in conferences, workshops & seminars\n\n📌 Faculty available for individual doubt clearing and mentoring\n\n🔗 Meet Faculty: https://tulas.edu.in/about/why-tulas/"
  },

  // ============================================
  // CLUBS & EXTRACURRICULAR
  // ============================================
  clubs: {
    keywords: [
      'clubs', 'club', 'activities', 'extracurricular', 'co-curricular',
      'student clubs', 'societies', 'hobby clubs', 'dance club', 'singing club',
      'theatre club', 'writing club', 'fashion', 'rampwalk', 'student activities',
      'cultural club', 'technical club', 'student life', 'sargam', 'footloose',
      'manchan', 'stylexa', 'expresso', 'what clubs in tulas'
    ],
    answer: "🎨 Clubs & Societies at Tula's Institute:\n\n🎭 **Student Clubs:**\n• 🎵 **Sargam** — Music & Singing Club\n• 💃 **Footloose** — Dance Club\n• 🎭 **Manchan** — Theatre & Drama Club\n• 👗 **Stylexa** — Fashion & Ramp Walk Club\n• ✍️ **Expresso** — Writing & Editorial Club\n• 📣 **PR Team** — Events & Funding\n• 🔬 Technical Club\n• ⚽ Sports Club\n\n📅 **Annual Fests:**\n• 🚀 **Utkrish** — Annual Technical Fest\n• 🎉 **Sanskriti** — Annual Cultural Fest\n\n✅ College life is vibrant with year-round co-curricular activities\n✅ Students actively manage events, workshops & competitions\n\n🔗 Campus Life: https://tulas.edu.in/about/why-tulas/"
  },

  events: {
    keywords: [
      'events', 'fest', 'festival', 'annual fest', 'cultural fest', 'technical fest',
      'sanskriti', 'utkrish', 'annual day', 'celebration', 'college events',
      'cultural events', 'hackathon', 'seminar', 'workshop', 'conference',
      'inter college', 'competition', 'college competition', 'tech fest'
    ],
    answer: "🎉 Events & Fests at Tula's Institute:\n\n🏆 **Annual Fests:**\n• 🚀 **Utkrish** — Annual Technical Fest\n  (Tech competitions, hackathons, paper presentations, robotics)\n• 🎉 **Sanskriti** — Annual Cultural Fest\n  (Dance, music, drama, fashion, literary events)\n\n📅 **Regular Events:**\n• National & International Seminars\n• Guest Lectures & Industry Expert Talks\n• Inter-hostel Sports Competitions\n• Academic Workshops & Conferences\n• National Service Scheme (NSS) programs\n• Independence Day, Republic Day celebrations\n• Educational Trips & Industrial Visits\n\n🔗 Campus Details: https://tulas.edu.in/about/why-tulas/"
  },

  // ============================================
  // COLLEGE TIMINGS
  // ============================================
  timings: {
    keywords: [
      'timing', 'timings', 'college hours', 'class time', 'schedule',
      'what time', 'college start', 'college end', 'class schedule',
      'daily schedule', 'timetable', 'college timing', 'when do classes start',
      'morning timing', 'lab timing', 'lecture time', '9:45', '4:15'
    ],
    answer: "🕐 College Timings at Tula's Institute:\n\n⏰ **Daily Schedule:**\n• 🏫 College Start: **9:45 AM**\n• 🍽️ Lunch Break: **12:15 PM** (50 minutes)\n• 🔬 Labs: After lunch\n• 🏫 College End: **4:15 PM**\n\n📚 **Academic Schedule:**\n• Lectures: Theoretical + Practical implementation\n• Assignments given at regular intervals\n• Weekly tests + Monthly tests\n• Two internal exams per semester\n• Final semester exam (conducted by university)\n\n🍽️ **Cafeteria:** Open till 9:00 PM\n🏠 **Hostel Curfew:** 9:00 PM\n\n🔗 Virtual Tour: https://tulas.edu.in/virtual-tour/"
  },

  // ============================================
  // AFFILIATION & APPROVALS
  // ============================================
  affiliation: {
    keywords: [
      'affiliation', 'affiliated', 'university', 'utu', 'uttarakhand technical university',
      'sdsu', 'sri dev suman', 'approved by', 'aicte approved', 'ugc approved',
      'government approved', 'recognized', 'which university', 'government degree',
      'state university', 'university affiliated', 'degree from which university'
    ],
    answer: "🎓 Affiliation & Approvals:\n\n🏛️ **University Affiliations:**\n• **Veer Madho Singh Bhandari Uttarakhand Technical University (UTU)** — for Engineering & Technical Programs\n• **Sri Dev Suman Uttarakhand University (SDSU)** — for Professional/Agriculture Programs\n\n✅ **Approvals:**\n• AICTE (All India Council for Technical Education)\n• UGC (University Grants Commission)\n• PCI (Pharmacy Council of India) — for B.Pharma\n• UBTER (Uttarakhand Board of Technical Education) — for Polytechnic\n\n🏆 **Accreditations:**\n• NAAC A+ Grade (Highest in Uttarakhand)\n• NBA Accredited Programs\n\n🔗 More Info: https://tulas.edu.in/about/why-tulas/"
  },

  // ============================================
  // LOCATION & CONTACT
  // ============================================
  contact: {
    keywords: [
      'contact', 'phone', 'email', 'address', 'reach', 'call', 'number',
      'how to contact', 'get in touch', 'contact details', 'contact info',
      'helpline', 'admission helpline', 'location', 'where is tulas',
      'college address', 'office number', 'email address', 'whatsapp'
    ],
    answer: "📞 Contact Tula's Institute:\n\n📍 **Address:**\nTula's Institute (The Engineering & Management College)\nChakrata Road (NH-72), Dhoolkot Village\nTown Selaqui, Dehradun — Uttarakhand\n\n📞 **Admissions Helpline:** +91-9837983721\n📧 **Email:** info@tulas.edu.in\n\n🗺️ **How to Reach:**\n• 16 km from Dehradun Railway Station\n• 43 km from Jolly Grant Airport\n\n🌐 **Website:** https://tulas.edu.in/\n📋 **Contact Page:** https://tulas.edu.in/contact/\n\n⏰ **Office Hours:** Monday to Saturday, 9:00 AM – 5:00 PM"
  },

  location: {
    keywords: [
      'where', 'located', 'location', 'map', 'how to reach', 'directions',
      'address', 'chakrata road', 'selaqui', 'dhoolkot', 'dehradun',
      'distance from station', 'distance from airport', 'near railway station',
      'near airport', 'bus stop', 'transport', 'how far', 'route to tulas'
    ],
    answer: "📍 Location & How to Reach Tula's Institute:\n\n🏫 **Campus Address:**\nTula's Institute\nChakrata Road (NH-72), Dhoolkot Village\nTown Selaqui, Dehradun\nUttarakhand\n\n🚂 **From Dehradun Railway Station:** ~16 km\n✈️ **From Jolly Grant Airport:** ~43 km\n\n🚌 **Transport:**\n• College provides transportation facility to students & faculty\n• Auto-rickshaw & taxis readily available\n• Chakrata Road is a major highway — easy to reach\n\n🗺️ **Map & Directions:** https://tulas.edu.in/contact/\n🔗 **Virtual Tour:** https://tulas.edu.in/virtual-tour/"
  },

  // ============================================
  // MEDICAL FACILITY
  // ============================================
  medical: {
    keywords: [
      'medical', 'medical facility', 'doctor', 'infirmary', 'health',
      'medical room', 'hospital', 'sick', 'medical help', 'health facility',
      'medical care', 'clinic', 'physician', '24x7 doctor', 'health center',
      'first aid', 'ambulance', 'medical emergency'
    ],
    answer: "🏥 Medical Facility at Tula's Institute:\n\n✅ **On-Campus Medical Centre:**\n• Fully equipped infirmary within campus\n• Qualified **Physician** available **24x7 on call**\n• Medical staff trained to handle emergencies\n• Basic amenities and treatment provided\n\n🚑 **Emergency Handling:**\n• Immediate first aid on campus\n• Tie-ups with nearby hospitals in Dehradun for advanced treatment\n• Students' health is a top priority\n\n📞 Campus Emergency: **+91-9837983721**\n🔗 Campus Info: https://tulas.edu.in/about/why-tulas/"
  },

  // ============================================
  // TECHNOLOGY & IT INFRASTRUCTURE
  // ============================================
  technology: {
    keywords: [
      'wifi', 'wi-fi', 'internet', 'technology', 'it infrastructure', 'computer lab',
      'software', 'digital', 'smart class', 'e-learning', 'microsoft innovation',
      'dlink', 'high speed internet', 'internet speed', 'campus wifi',
      'online learning', 'virtual lab', 'remote lab', 'erp', 'online portal',
      'student portal', 'software tools', 'autocad', 'autodesk', 'matlab'
    ],
    answer: "💻 Technology & IT Infrastructure:\n\n📡 **Internet & Connectivity:**\n• **205 Mbps Wi-Fi** — 24x7 campus-wide coverage\n• High-end servers and workstations\n• Windows & Linux based systems\n• Comprehensive e-learning environment\n\n🖥️ **Special Labs & Centres:**\n• **Microsoft Innovation Centre** (on campus)\n• **D-Link Academic Campus Connect Programme**\n• Remote Robotics Lab — Germany tie-up\n• Virtual Labs (VLAB)\n• Computer Labs with latest hardware\n\n🛠️ **Software & Tools:**\n• Autodesk, Bentley, D-Link training software\n• MATLAB, AutoCAD and engineering software\n• Latest development environments for CSE/IT\n\n🔗 Virtual Tour: https://tulas.edu.in/virtual-tour/\n🔗 About Campus: https://tulas.edu.in/about/why-tulas/"
  },

  // ============================================
  // INTERNATIONAL COLLABORATIONS & MOUs
  // ============================================
  international: {
    keywords: [
      'international', 'collaboration', 'mou', 'tie up', 'foreign university',
      'study abroad', 'exchange program', 'andorra', 'argentina', 'global',
      'international exposure', 'foreign collaboration', 'research collaboration',
      'university tie-up', 'inter american university', 'global education'
    ],
    answer: "🌍 International Collaborations at Tula's Institute:\n\n✅ **MoU Partners:**\n• University of Andorra, Europe\n• Inter American University, Argentina\n• Various national institutions & research bodies\n\n✅ **International Exposure:**\n• Joint events & conferences with global partners\n• Research collaborations with international universities\n• Students exposed to global academic trends\n• Career guidance for study abroad programs\n\n🔗 More Info: https://tulas.edu.in/about/why-tulas/"
  },

  // ============================================
  // EXAMINATION SYSTEM
  // ============================================
  examination: {
    keywords: [
      'exam', 'exams', 'examination', 'test', 'internal exam', 'semester exam',
      'university exam', 'exam pattern', 'assessment', 'grading', 'marks',
      'how many exams', 'exam schedule', 'external exam', 'internal marks',
      'sessional', 'end sem', 'mid term', 'unit test'
    ],
    answer: "📝 Examination System at Tula's Institute:\n\n📊 **Exam Pattern (per semester):**\n• **2 Internal Exams** per semester\n• **1 External Semester Exam** (University conducted)\n• Exam fee: ~₹2,500–₹2,960 per semester\n• Assignments at regular intervals\n• Weekly & monthly tests\n\n📅 **Semester Structure:**\n• Odd Semester: ~6 months\n• Even Semester: ~4 months (considered tougher)\n• Total 24 exams in a full academic year (Internal + External)\n\n✅ Exams conducted by:\n• Institute: Internal assessments\n• UTU / SDSU: Final semester exams\n\n🔗 Academic Details: https://tulas.edu.in/courses/"
  },

  // ============================================
  // TRANSPORT
  // ============================================
  transport: {
    keywords: [
      'transport', 'bus', 'college bus', 'transportation', 'vehicle',
      'commuting', 'how to reach campus daily', 'transport facility',
      'bus facility', 'van', 'pickup drop', 'daily transport'
    ],
    answer: "🚌 Transportation at Tula's Institute:\n\n✅ College provides **transportation facility** for students and faculty to prime locations in Dehradun\n\n🗺️ **Campus Location:**\n• Chakrata Road (NH-72), Selaqui\n• 16 km from Dehradun Railway Station\n• 43 km from Jolly Grant Airport\n\n🚕 Other Options:\n• Autos, taxis & shared cabs easily available on Chakrata Road\n• PG/flat options near campus for day scholars\n\n📞 For transport enquiry: **+91-9837983721**\n🔗 Contact Page: https://tulas.edu.in/contact/"
  },

  // ============================================
  // THANK YOU / GREETINGS
  // ============================================
  thanks: {
    keywords: [
      'thank you', 'thanks', 'thnx', 'thankyou', 'thank u', 'ty',
      'ok', 'okay', 'okk', 'k', 'great', 'good', 'nice', 'alright',
      'awesome', 'perfect', 'got it', 'understood', 'helpful', 'very helpful'
    ],
    answer: "😊 You're Welcome!\n\nHappy to assist you! If you have more questions about Tula's Institute — whether about admissions, courses, fees, hostels, or placements — feel free to ask anytime! 🎓\n\n📞 Admissions Helpline: **+91-9837983721**\n📧 info@tulas.edu.in\n\n🔗 Apply Now: https://tulas.edu.in/apply-now/\n\nHave a great day! 🌟"
  },

  // ============================================
  // FAQ MENU
  // ============================================
  faq_menu: {
    keywords: ['faq', 'faqs', 'frequently asked', 'common questions', 'quick questions', 'top questions'],
    answer: "❓ FAQ — Frequently Asked Questions:\n\nChoose a topic:",
    hasOptions: true,
    isFAQMenu: true,
    options: [
      {
        id: 1,
        label: "1️⃣ Admissions & Eligibility",
        trigger: ['1', 'admission', 'eligibility', 'apply'],
        response: "📝 Admissions & Eligibility:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "📋 What is the eligibility for B.Tech?",
            trigger: ['1', 'btech eligibility', 'pcm marks', 'jee required'],
            response: "📋 B.Tech Eligibility:\n\n✅ Minimum **60% in PCM** (Physics, Chemistry, Maths) in 12th\n✅ Valid JEE Main score OR UKSEE / UBTER JEEP score\n✅ Lateral Entry: Diploma in relevant branch with 45%+\n\n📌 No rigid hard-and-fast rule — merit-based selection\n\n🔗 Apply: https://tulas.edu.in/apply-now/\n📞 +91-9837983721"
          },
          {
            id: 2,
            label: "🎓 What exams are accepted?",
            trigger: ['2', 'entrance exam', 'jee main', 'uksee', 'cat mat'],
            response: "🎓 Accepted Entrance Exams:\n\n🔧 B.Tech: JEE Main, UKSEE, UBTER JEEP\n💼 MBA: CAT, MAT, XAT, CMAT, GMAT, UKSEE\n🎓 M.Tech: GATE\n💻 BCA/MCA: University test / Merit\n🔨 Polytechnic: UBTER JEEP\n\n🔗 Admission Process: https://tulas.edu.in/admission-procedure/"
          },
          {
            id: 3,
            label: "📄 What documents are needed?",
            trigger: ['3', 'documents', 'papers needed', 'certificates'],
            response: "📄 Documents Required:\n\n✅ 10th & 12th Mark Sheets\n✅ Transfer Certificate (TC)\n✅ Character Certificate\n✅ Aadhaar Card (student + parents)\n✅ Passport-size photographs (6-8)\n✅ Caste / Domicile Certificate (if applicable)\n✅ Entrance Exam Scorecard (JEE/GATE/CAT etc.)\n\n🔗 Full Details: https://tulas.edu.in/admission-procedure/"
          },
          {
            id: 4,
            label: "📅 When do admissions open?",
            trigger: ['4', 'admission date', 'when open', 'registration date'],
            response: "📅 Admission Timeline:\n\n• Registrations: Open typically from **April–July** (UG) and **April–June** (PG)\n• Session Begins: **August–September**\n• Registration Fee: ₹5,000 (Higher Ed.) / ₹2,000 (Polytechnic)\n\n📞 For exact current dates: **+91-9837983721**\n🔗 Apply Online: https://tulas.edu.in/apply-now/"
          }
        ]
      },
      {
        id: 2,
        label: "2️⃣ Fees & Scholarships",
        trigger: ['2', 'fees', 'fee', 'scholarship', 'cost'],
        response: "💰 Fees & Scholarships:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "💰 What is the B.Tech fee?",
            trigger: ['1', 'btech fee', 'engineering fee'],
            response: "💰 B.Tech Fee Structure:\n\n• Annual Fee: ₹1,34,100 – ₹1,65,000/year\n• Total (4 years): ₹4.63 Lakhs – ₹6.81 Lakhs\n• AI/ML / Data Science / Cyber Security: +₹25,000/year\n• Exam Fee: ~₹2,500–₹2,960/semester\n• Registration Fee: ₹20,000 (one-time)\n\n📌 Fees are same each year — no increment!\n📌 Pay in 3 installments: 30% + 30% + 40%\n\n🔗 Pay Online: https://tulas.edu.in/pay-fee-online/"
          },
          {
            id: 2,
            label: "🎓 What scholarships are available?",
            trigger: ['2', 'scholarship', 'discount', 'fee waiver'],
            response: "🎓 Scholarships Available:\n\n✅ Bright Future Scholarship: ₹10,000\n✅ Uttarakhand Domicile: ₹10,000 + 15% concession\n✅ JEE Main merit-based discounts\n✅ Bihar DRCC scholarship\n✅ SC/ST government scholarships\n✅ Defense personnel wards support\n✅ Female student scholarships\n\n📞 Enquire: **+91-9837983721**"
          },
          {
            id: 3,
            label: "🏠 What is the hostel fee?",
            trigger: ['3', 'hostel fee', 'hostel cost', 'accommodation fee'],
            response: "🏠 Hostel Fee (per year):\n\n• Non-AC Room: ₹95,000 – ₹1,03,000\n(incl. ₹2,500 laundry charges)\n• AC Room: ₹1,31,000 – ₹1,39,000\n\n✅ Includes mess (breakfast, lunch, tea, dinner)\n✅ Wi-Fi included\n✅ Laundry facility included\n\n🔗 Pay Hostel Fee: https://tulas.edu.in/pay-fee-online/"
          }
        ]
      },
      {
        id: 3,
        label: "3️⃣ Placements & Career",
        trigger: ['3', 'placement', 'career', 'job', 'salary'],
        response: "💼 Placements & Career:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "💼 What are the placement stats?",
            trigger: ['1', 'placement stats', 'placement record', 'how many placed'],
            response: "💼 Placement Stats:\n\n🏆 Highest Package: ₹36 LPA (overall)\n🏆 Highest Package 2024: ₹22 LPA (Adobe)\n📊 Average Package: ₹4–6 LPA\n✅ 75% Placement Guarantee\n👥 7,000+ Alumni Network\n\n📌 Placement Cell runs year-round skill development programs"
          },
          {
            id: 2,
            label: "🏢 Which companies recruit?",
            trigger: ['2', 'companies', 'top recruiters', 'which company'],
            response: "🏢 Top Recruiting Companies:\n\nMicrosoft • IBM • Adobe • HCL • Wipro • TCS • Infosys • Amazon • Oracle • Samsung • Deutsche Bank • Barclays • Vodafone • Hero Honda • Genpact • NIIT • Bosch • Byju's • Vivo • Aditya Birla Group • Indian Army • Hexaware • Square Yards • Cummins India • Aon Hewitt\n\n✅ 17+ companies recruit regularly from campus!"
          },
          {
            id: 3,
            label: "🔬 What internship support is offered?",
            trigger: ['3', 'internship', 'internship support', 'training'],
            response: "🔬 Internship & Training Support:\n\n✅ Tie-ups with leading companies\n✅ Campus internship drives\n✅ Industry visits & field exposure\n✅ Microsoft Innovation Centre training\n✅ Students have interned at BEL, IT firms, government sectors\n✅ Pre-placement talks & mock interviews\n\n📞 Placement Cell: **+91-9837983721**"
          }
        ]
      },
      {
        id: 4,
        label: "4️⃣ Campus & Hostel",
        trigger: ['4', 'campus', 'hostel', 'facilities', 'infrastructure'],
        response: "🏛️ Campus & Hostel:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "🏛️ What campus facilities are there?",
            trigger: ['1', 'campus facility', 'what facilities', 'infrastructure'],
            response: "🏛️ Campus Facilities:\n\n✅ 20-acre eco-friendly green campus\n✅ 52,200+ volume library + 17,500+ e-books\n✅ 550-seat AC auditorium\n✅ Computer, Civil, Electronics, Mech, Physics Labs\n✅ Microsoft Innovation Centre\n✅ Remote Robotics Lab (Germany)\n✅ Gymnasium\n✅ Multi-cuisine cafeteria (till 9 PM)\n✅ Shopping arcade (barber, laundry, stationery)\n✅ ATM, Medical Facility, Guest House\n✅ 205 Mbps Wi-Fi campus-wide\n\n🔗 Virtual Tour: https://tulas.edu.in/virtual-tour/"
          },
          {
            id: 2,
            label: "🏠 What are the hostel facilities?",
            trigger: ['2', 'hostel facility', 'hostel amenities', 'hostel rooms'],
            response: "🏠 Hostel Facilities:\n\n✅ 4 Boys' Hostels + 2 Girls' Hostels\n✅ Twin-sharing rooms (2 beds, 2 tables, 2 chairs, 2 cupboards, bookshelf)\n✅ Wi-Fi 24x7 in all rooms\n✅ Hot water + power backup\n✅ Daily mess (Breakfast, Lunch, Evening Tea, Dinner)\n✅ 24x7 CCTV surveillance & security\n✅ Movie screenings, recreational outings\n✅ Hostel curfew: 9:00 PM"
          },
          {
            id: 3,
            label: "⚽ What sports facilities are there?",
            trigger: ['3', 'sports facility', 'sports', 'games facility'],
            response: "⚽ Sports Facilities:\n\n🏟️ Outdoor: Cricket, Football, Basketball, Volleyball, Hockey\n🏸 Indoor: 3 Badminton courts, Table Tennis, Recreation Room\n🏋️ Gymnasium: Full equipment + specialized trainers\n\n✅ Inter-hostel sports competitions\n✅ Annual Sports Day\n✅ Regular recreational outings for hostel students"
          }
        ]
      },
      {
        id: 5,
        label: "5️⃣ Academic & Exams",
        trigger: ['5', 'academic', 'exam', 'syllabus', 'subjects'],
        response: "📚 Academics & Exams:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "📝 What is the exam pattern?",
            trigger: ['1', 'exam pattern', 'internal exam', 'semester exam'],
            response: "📝 Exam Pattern:\n\n• 2 Internal exams per semester\n• 1 External semester exam (UTU/SDSU)\n• Weekly + Monthly tests\n• Assignments per interval\n• Exam fee: ~₹2,500–₹2,960/semester\n\nOdd semester: ~6 months | Even semester: ~4 months"
          },
          {
            id: 2,
            label: "⏰ What are college timings?",
            trigger: ['2', 'college timing', 'class timing', 'schedule'],
            response: "⏰ College Timings:\n\n• Start: 9:45 AM\n• Lunch Break: 12:15 PM (50 minutes)\n• Labs: Post-lunch\n• End: 4:15 PM\n• Cafeteria: Till 9:00 PM\n• Hostel Curfew: 9:00 PM"
          },
          {
            id: 3,
            label: "🎓 What streams are available in B.Tech?",
            trigger: ['3', 'btech streams', 'branches available', 'which branch'],
            response: "🎓 B.Tech Branches at Tula's:\n\n💻 CSE • CSE (AI & ML) • CSE (Data Science) • CSE (Cyber Security) • IT • ECE • Mechanical Engineering • Civil Engineering\n\n🔗 Course Details: https://tulas.edu.in/courses/\n🔗 CSE: https://tulas.edu.in/courses/btech/computer-science/"
          }
        ]
      }
    ]
  },

  // ============================================
  // EMOTIONAL / STUDENT SUPPORT MENU
  // ============================================
  emotional_menu: {
    keywords: [
      'student support', 'support', 'counseling', 'counselling', 'mental health',
      'emotional support', 'wellbeing', 'college life', 'adjustment', 'new student',
      'nervous about college', 'first time college', 'away from home', 'hostel life',
      'worried about college', 'career counseling', 'student welfare', 'guidance'
    ],
    answer: "💚 Student Support & Wellbeing:\n\nChoose a topic:",
    hasOptions: true,
    isEmotionalMenu: true,
    options: [
      {
        id: 1,
        label: "1️⃣ Adjusting to College Life",
        trigger: ['1', 'adjustment', 'new student', 'first year'],
        response: "🎒 Adjusting to College Life:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "😟 Will I feel alone or lost?",
            trigger: ['1', 'feel alone', 'lost', 'nervous', 'scared'],
            response: "💙 You Won't Feel Alone!\n\nTula's Institute has a vibrant, welcoming student community:\n\n✅ Students from all across India — you'll find your group!\n✅ Active clubs & societies from Day 1\n✅ Orientation programs for new students\n✅ Seniors & faculty are friendly and approachable\n✅ Events, fests & activities keep campus life fun\n\nFrom classes to cafeteria to hostel — you'll always have company! 😊\n\n🔗 Campus Life: https://tulas.edu.in/about/why-tulas/"
          },
          {
            id: 2,
            label: "🤝 How do I make friends?",
            trigger: ['2', 'make friends', 'social life', 'meet people'],
            response: "🤝 Making Friends at Tula's:\n\n✅ Students come from **all states of India** — diverse community!\n✅ Join clubs: Sargam, Footloose, Manchan, Stylexa, Expresso\n✅ Attend Utkrish (Tech Fest) & Sanskriti (Cultural Fest)\n✅ Participate in hostel sports & movie screenings\n✅ Cafeteria & shopping arcade are great social spots\n✅ Group assignments & lab work build natural friendships\n\nYou'll build lifelong friendships at Tula's! 🌟"
          },
          {
            id: 3,
            label: "📚 How do I manage studies?",
            trigger: ['3', 'manage studies', 'study tips', 'study pressure'],
            response: "📚 Managing Studies at Tula's:\n\n✅ Faculty are friendly — always approachable for doubts\n✅ Regular assignments keep you on track\n✅ Library & digital resources available 24x7\n✅ 205 Mbps Wi-Fi for online study anytime\n✅ Lab sessions for practical reinforcement\n✅ Remedial support available if needed\n\n📌 Remember: Faculty want you to succeed — never hesitate to ask!\n\n🔗 Academic Info: https://tulas.edu.in/courses/"
          }
        ]
      },
      {
        id: 2,
        label: "2️⃣ Career & Future Guidance",
        trigger: ['2', 'career', 'future', 'after college', 'job guidance'],
        response: "🎯 Career & Future Guidance:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "🎯 Does Tula's help in career planning?",
            trigger: ['1', 'career planning', 'career guidance', 'career help'],
            response: "🎯 Career Guidance at Tula's:\n\n✅ Dedicated **Training & Placement Cell**\n✅ Skill development programs throughout the year\n✅ Industry expert guest lectures\n✅ Mock interviews & GD preparation\n✅ Resume building workshops\n✅ Internship facilitation from 2nd year\n✅ Career counseling sessions available\n✅ Guidance for higher studies (GATE/CAT/GMAT)\n\n🔗 More: https://tulas.edu.in/"
          },
          {
            id: 2,
            label: "🌍 Can I study abroad from Tula's?",
            trigger: ['2', 'study abroad', 'foreign university', 'international'],
            response: "🌍 International Opportunities:\n\n✅ MoU with University of Andorra, Europe\n✅ MoU with Inter American University, Argentina\n✅ Career guidance for international admissions\n✅ SAT / GRE / GMAT support resources\n✅ Exposure to global academic standards\n\n📞 Career Counseling: **+91-9837983721**\n🔗 About Us: https://tulas.edu.in/about/why-tulas/"
          },
          {
            id: 3,
            label: "🏛️ Can I prepare for government jobs?",
            trigger: ['3', 'government job', 'govt job', 'upsc', 'ssc', 'defence'],
            response: "🏛️ Government Job Preparation:\n\n✅ Indian Army is a top recruiter from Tula's campus!\n✅ Strong academic base helps in competitive exams\n✅ Students have joined government sectors after graduating\n✅ Faculty mentorship available for GATE, PSU preparations\n✅ Library resources support competitive exam study\n\n📞 Career Guidance: **+91-9837983721**"
          }
        ]
      },
      {
        id: 3,
        label: "3️⃣ Hostel Life & Safety",
        trigger: ['3', 'hostel life', 'hostel safety', 'is hostel safe'],
        response: "🏠 Hostel Life & Safety:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "🛡️ Is the hostel safe?",
            trigger: ['1', 'is hostel safe', 'security hostel', 'hostel security'],
            response: "🛡️ Hostel Safety:\n\n✅ **24x7 CCTV** surveillance in all hostel areas\n✅ **Security guards** round the clock\n✅ **Controlled entry/exit** system\n✅ Separate hostels for boys and girls\n✅ Wardens & caretakers present\n✅ Hostel curfew: **9:00 PM**\n✅ Emergency medical access 24x7\n\nYour safety is the institute's top priority! 💙\n\n🔗 Campus Info: https://tulas.edu.in/about/why-tulas/"
          },
          {
            id: 2,
            label: "🍽️ Is hostel food good?",
            trigger: ['2', 'hostel food', 'mess quality', 'is food good'],
            response: "🍽️ Hostel Food:\n\n✅ Meals served: Breakfast, Lunch, Evening Tea, Dinner\n✅ Multi-cuisine menu — students from all states of India are catered to\n✅ Hygienic and nutritious meals\n✅ Cafeteria also available till 9 PM\n\n📌 Note: Some students feel food can be spicy — you can adjust with time or use the cafeteria for alternatives!"
          },
          {
            id: 3,
            label: "📱 Can I have my phone in hostel?",
            trigger: ['3', 'phone in hostel', 'mobile hostel', 'gadgets hostel'],
            response: "📱 Phone & Gadgets in Hostel:\n\n✅ Students are generally allowed to keep personal phones\n✅ Wi-Fi 24x7 available in hostel rooms\n✅ Responsible usage expected\n✅ Hostel timing: Entry by **9:00 PM**\n\n📌 For specific gadget/device policies, contact the hostel warden or admin:\n📞 **+91-9837983721**"
          }
        ]
      },
      {
        id: 4,
        label: "4️⃣ Financial Support & Loans",
        trigger: ['4', 'financial', 'loan', 'education loan', 'financial support'],
        response: "💰 Financial Support & Loans:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "🏦 Is education loan available?",
            trigger: ['1', 'education loan', 'bank loan', 'loan available'],
            response: "🏦 Education Loan at Tula's:\n\n✅ Tula's Institute helps students connect with banks for education loans\n✅ All nationalized banks provide education loans for AICTE-approved colleges\n✅ Bihar students: DRCC scholarship loan options\n✅ Uttarakhand students: State government schemes\n✅ SC/ST students: Government loan/scholarship programs\n\n📞 For guidance: **+91-9837983721**\n📧 info@tulas.edu.in"
          },
          {
            id: 2,
            label: "💸 Is fee affordable compared to other colleges?",
            trigger: ['2', 'affordable', 'cheaper', 'compared to other', 'value for money'],
            response: "💸 Affordability — Tula's vs Others:\n\n✅ Tula's is considered one of the **most affordable private engineering colleges** in Dehradun\n✅ B.Tech fee: ~₹1.5 Lakhs/year (vs ₹3–5 Lakhs at many other private colleges)\n✅ Affiliated to **state university (UTU)** — government-recognized degree\n✅ NAAC A+ — quality education at fair cost\n\nGreat value for money! 🎓\n\n🔗 Fee Details: https://tulas.edu.in/pay-fee-online/"
          }
        ]
      }
    ]
  },

  // ============================================
  // VISION & MISSION
  // ============================================
  vision: {
    keywords: [
      'vision', 'mission', 'goal', 'objective', 'values', 'core values',
      'philosophy', 'institute philosophy', 'what is the goal',
      'educational philosophy', 'motto', 'aim of tulas'
    ],
    answer: "🎯 Vision & Mission of Tula's Institute:\n\n🌟 **Vision:**\nTo cultivate talent in a welcoming environment with the assistance and mentoring of experienced academics and access to cutting-edge facilities — creating industry-ready professionals with strong ethical values.\n\n🎯 **Mission:**\n• Provide quality technical & professional education\n• Foster innovation, research & critical thinking\n• Develop leaders with moral values\n• Ensure holistic development — academic, personal & professional\n• Create globally competitive graduates\n\n💬 **Our Motto:** *\"Education is the best friend\"*\n\n🔗 More: https://tulas.edu.in/about/why-tulas/"
  },

  // ============================================
  // ONLINE PORTAL / ERP
  // ============================================
  online_portal: {
    keywords: [
      'erp', 'student portal', 'online portal', 'attendance online',
      'check attendance', 'online marks', 'student login', 'parent portal',
      'fee receipt', 'online certificate', 'student dashboard'
    ],
    answer: "💻 Student Online Portal:\n\n✅ Tula's Institute provides an online portal for students to access:\n• Attendance records\n• Academic performance / marks\n• Fee payment status\n• Academic calendar & notices\n• Course materials\n\n🔗 **Pay Fees Online:** https://tulas.edu.in/pay-fee-online/\n🔗 **Apply Online:** https://tulas.edu.in/apply-now/\n\n📞 For portal access issues: **+91-9837983721**\n📧 info@tulas.edu.in"
  },

  // ============================================
  // APPLY NOW
  // ============================================
  apply: {
    keywords: [
      'apply now', 'apply online', 'application', 'application form',
      'how to apply online', 'fill form', 'online application',
      'where to apply', 'application link', 'admission form online'
    ],
    answer: "🚀 Apply to Tula's Institute:\n\n✅ **Apply Online Now:**\n🔗 https://tulas.edu.in/apply-now/\n\n✅ **Steps to Apply:**\n1️⃣ Visit the apply-now page\n2️⃣ Fill in your personal & academic details\n3️⃣ Upload required documents\n4️⃣ Submit the application\n5️⃣ Pay registration fee (₹5,000 for higher ed.)\n6️⃣ Await confirmation & counseling call\n\n📞 Admissions Helpline: **+91-9837983721**\n📧 info@tulas.edu.in\n\n🔗 Admission Procedure: https://tulas.edu.in/admission-procedure/"
  },

  // ============================================
  // VIRTUAL TOUR
  // ============================================
  virtual_tour: {
    keywords: [
      'virtual tour', '360 tour', 'see campus', 'campus tour', 'view campus',
      'campus video', 'campus photos', 'how does campus look', 'campus view',
      '360 virtual', 'campus images'
    ],
    answer: "📷 Virtual Tour of Tula's Institute:\n\n🔗 **Take a 360° Virtual Tour:** https://tulas.edu.in/virtual-tour/\n\nExplore the campus from anywhere:\n✅ Academic blocks & classrooms\n✅ Labs & innovation centres\n✅ Library & auditorium\n✅ Hostels & cafeteria\n✅ Sports grounds\n✅ Shopping arcade & campus greenery\n\n📞 Schedule a Physical Campus Visit: **+91-9837983721**"
  }
};

// ==============================================
// EMAIL FUNCTIONS
// ==============================================
async function sendAdminEmail(userDetails) {
  try {
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: ADMIN_EMAIL,
      subject: "🎓 New User — Tula's Institute Chatbot",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8">
        <style>
          * { margin:0;padding:0;box-sizing:border-box; }
          body { font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8; }
          .wrapper { max-width:580px;margin:30px auto;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.12); }
          .header { background:linear-gradient(135deg,#003d82 0%,#001f42 100%);padding:40px 30px;text-align:center;position:relative; }
          .header::after { content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#e8502a,#f4854e,#e8502a); }
          .logo-circle { width:90px;height:90px;border-radius:50%;overflow:hidden;margin:0 auto 18px;border:3px solid rgba(232,80,42,0.6);box-shadow:0 0 0 6px rgba(232,80,42,0.15);background:white; }
          .logo-circle img { width:100%;height:100%;object-fit:contain;display:block; }
          .header h1 { color:#fff;font-size:22px;font-weight:700;letter-spacing:1px;margin-bottom:6px; }
          .header p { color:rgba(255,255,255,0.6);font-size:12px; }
          .new-badge { display:inline-block;background:linear-gradient(135deg,#e8502a,#c73d1a);color:white;padding:6px 18px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-top:14px; }
          .body { background:#fff;padding:35px 30px; }
          .section-label { font-size:11px;font-weight:700;color:#a0aec0;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid #e8502a;display:inline-block; }
          .user-header { display:flex;align-items:center;gap:16px;background:linear-gradient(135deg,#f7fafc,#edf2f7);border-radius:12px;padding:20px;margin-bottom:20px;border-left:4px solid #003d82; }
          .avatar { width:55px;height:55px;background:linear-gradient(135deg,#003d82,#0056b3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0; }
          .uname { font-size:20px;font-weight:700;color:#1a202c; }
          .utag { font-size:12px;color:#718096;margin-top:3px; }
          .info-list { display:grid;gap:10px; }
          .info-item { background:#f7fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:14px; }
          .iicon { width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0; }
          .ilabel { font-size:10px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px; }
          .ivalue { font-size:14px;color:#2d3748;font-weight:600;margin-top:2px; }
          .note-box { background:#fff8f6;border:1px solid rgba(232,80,42,0.2);border-radius:10px;padding:16px 18px;margin-top:20px;display:flex;gap:12px;align-items:flex-start; }
          .footer { background:#003d82;padding:25px 30px;text-align:center; }
          .footer .school { color:rgba(255,255,255,0.9);font-size:13px;font-weight:600;margin-bottom:6px; }
          .divider { width:40px;height:2px;background:#e8502a;margin:8px auto 10px;border-radius:2px; }
          .footer p { color:rgba(255,255,255,0.45);font-size:11px;line-height:1.8; }
        </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <div class="logo-circle">
                <img src="https://tulas.edu.in/_next/static/media/TulasLogo.f88dd71b.png" alt="Tula's Institute Logo" onerror="this.parentElement.innerHTML='<div style=width:100%;height:100%;background:#003d82;display:flex;align-items:center;justify-content:center;font-size:28px;>🎓</div>'" />
              </div>
              <h1>New User Started Chat</h1>
              <p>A visitor has registered on Tula's Institute Chatbot</p>
              <span class="new-badge">✨ New Registration</span>
            </div>
            <div class="body">
              <div class="section-label">User Details</div>
              <div class="user-header">
                <div class="avatar">👤</div>
                <div>
                  <div class="uname">${userDetails.name}</div>
                  <div class="utag">New Chatbot Enquiry</div>
                </div>
              </div>
              <div class="info-list">
                <div class="info-item">
                  <div class="iicon" style="background:#fff5f0;border:1px solid rgba(232,80,42,0.2);">📧</div>
                  <div><div class="ilabel">Email Address</div><div class="ivalue">${userDetails.email}</div></div>
                </div>
                <div class="info-item">
                  <div class="iicon" style="background:#f0fff4;border:1px solid rgba(72,187,120,0.2);">📱</div>
                  <div><div class="ilabel">Phone Number</div><div class="ivalue">${userDetails.phone}</div></div>
                </div>
                <div class="info-item">
                  <div class="iicon" style="background:#fffff0;border:1px solid rgba(236,201,75,0.3);">⏰</div>
                  <div><div class="ilabel">Registration Time</div><div class="ivalue">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} IST</div></div>
                </div>
              </div>
              <div class="note-box">
                <div style="font-size:20px;flex-shrink:0;margin-top:2px;">💡</div>
                <p style="color:#744210;font-size:13px;line-height:1.6;">This user has registered on Tula's Institute chatbot and may have an admission enquiry. Consider following up if no callback is received.</p>
              </div>
            </div>
            <div class="footer">
              <div class="school">Tula's Institute — Dehradun, Uttarakhand</div>
              <div class="divider"></div>
              <p>Automated notification from Tula's Institute Chatbot System</p>
              <p>© ${new Date().getFullYear()} Tula's Institute · Chakrata Road, Selaqui, Dehradun</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log('✅ Admin email sent!');
    return true;
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    return false;
  }
}

async function sendCallbackEmail(userDetails, query, callbackNumber) {
  try {
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: ADMIN_EMAIL,
      subject: "📞 Callback Request — Tula's Institute Chatbot",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8">
        <style>
          * { margin:0;padding:0;box-sizing:border-box; }
          body { font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8; }
          .wrapper { max-width:620px;margin:30px auto;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.15); }
          .header { background:linear-gradient(135deg,#003d82 0%,#001f42 100%);padding:40px 30px;text-align:center;position:relative; }
          .header::after { content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#e8502a,#f4854e,#e8502a); }
          .logo-circle { width:90px;height:90px;border-radius:50%;overflow:hidden;margin:0 auto 18px;border:3px solid rgba(232,80,42,0.6);background:white; }
          .logo-circle img { width:100%;height:100%;object-fit:contain;display:block; }
          .header h1 { color:#fff;font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:5px; }
          .header p { color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:1px; }
          .alert-banner { background:linear-gradient(90deg,#e8502a,#c73d1a);padding:14px 30px;text-align:center; }
          .alert-banner span { color:white;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase; }
          .body { background:#fff;padding:35px 30px; }
          .phone-box { background:linear-gradient(135deg,#003d82 0%,#001f42 100%);border-radius:14px;padding:28px;text-align:center;margin-bottom:28px;box-shadow:0 8px 25px rgba(0,61,130,0.3);border:2px solid rgba(232,80,42,0.4); }
          .phone-box .plabel { color:rgba(255,255,255,0.6);font-size:10px;letter-spacing:4px;text-transform:uppercase;margin-bottom:10px; }
          .phone-box .pnumber { color:#fff;font-size:34px;font-weight:800;letter-spacing:4px; }
          .section-label { font-size:11px;font-weight:700;color:#a0aec0;text-transform:uppercase;letter-spacing:2px;margin-bottom:14px;padding-bottom:8px;border-bottom:2px solid #e8502a;display:inline-block; }
          .info-grid { display:grid;gap:12px;margin-bottom:24px; }
          .info-card { background:#f7fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:14px;border-left:4px solid #003d82; }
          .icon-box { width:42px;height:42px;background:linear-gradient(135deg,#003d82,#0056b3);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0; }
          .ilabel { font-size:10px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px; }
          .ivalue { font-size:15px;color:#2d3748;font-weight:600; }
          .query-box { background:#fff8f6;border:1px solid rgba(232,80,42,0.2);border-left:4px solid #e8502a;border-radius:10px;padding:20px;margin-top:5px; }
          .qlabel { color:#e8502a;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:10px; }
          .qtext { color:#4a5568;font-size:15px;line-height:1.7; }
          .time-bar { background:#f7fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 18px;margin-top:20px;display:flex;align-items:center;gap:8px; }
          .footer { background:#003d82;padding:25px 30px;text-align:center; }
          .footer p { color:rgba(255,255,255,0.5);font-size:12px;line-height:1.8; }
          .footer .school { color:rgba(255,255,255,0.8);font-size:13px;font-weight:600;margin-bottom:5px; }
          .divider { width:40px;height:2px;background:#e8502a;margin:10px auto;border-radius:2px; }
        </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <div class="logo-circle">
                <img src="https://tulas.edu.in/_next/static/media/TulasLogo.f88dd71b.png" alt="Tula's Institute" onerror="this.parentElement.innerHTML='<div style=width:100%;height:100%;background:#003d82;display:flex;align-items:center;justify-content:center;font-size:28px;>🎓</div>'" />
              </div>
              <h1>Callback Request</h1>
              <p>Tula's Institute — Dehradun, Uttarakhand</p>
            </div>
            <div class="alert-banner"><span>⚡ Action Required — Please Call Back</span></div>
            <div class="body">
              <div class="phone-box">
                <div class="plabel">Callback Number</div>
                <div class="pnumber">📱 ${callbackNumber}</div>
              </div>
              <div class="section-label">User Information</div>
              <div class="info-grid">
                <div class="info-card"><div class="icon-box">👤</div><div><div class="ilabel">Full Name</div><div class="ivalue">${userDetails.name}</div></div></div>
                <div class="info-card"><div class="icon-box">📧</div><div><div class="ilabel">Email Address</div><div class="ivalue">${userDetails.email}</div></div></div>
                <div class="info-card"><div class="icon-box">📱</div><div><div class="ilabel">Registered Phone</div><div class="ivalue">${userDetails.phone}</div></div></div>
              </div>
              <div class="section-label">Query Details</div>
              <div class="query-box">
                <div class="qlabel">❓ User's Question</div>
                <div class="qtext">${query}</div>
              </div>
              <div class="time-bar">
                <span>⏰</span>
                <span style="color:#718096;font-size:13px;">Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} IST</span>
              </div>
            </div>
            <div class="footer">
              <div class="school">Tula's Institute — Chakrata Road, Selaqui, Dehradun</div>
              <div class="divider"></div>
              <p>Automated message from Tula's Institute Chatbot System</p>
              <p>Please call back at your earliest convenience</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log('✅ Callback email sent!');
    return true;
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    return false;
  }
}

// ==============================================
// SMART KEYWORD MATCHING
// ==============================================
function findBestMatch(userMessage, lastTopic = null, lastOptionLevel = null, lastSelectedOption = null) {
  const msg = userMessage.toLowerCase().trim();

  if (lastTopic && KNOWLEDGE_BASE[lastTopic]) {
    const topicData = KNOWLEDGE_BASE[lastTopic];

    if (topicData.hasOptions) {
      if (lastOptionLevel === 'sub' && lastSelectedOption !== null && lastSelectedOption !== undefined) {
        const mainOption = topicData.options[lastSelectedOption];
        if (mainOption && mainOption.subOptions) {
          for (const subOption of mainOption.subOptions) {
            for (const trigger of subOption.trigger) {
              if (msg === trigger.toLowerCase()) {
                return { answer: subOption.response, topic: lastTopic, hasOptions: false, selectedOption: null, optionLevel: null, isFAQMenu: topicData.isFAQMenu || false, isEmotionalMenu: topicData.isEmotionalMenu || false };
              }
            }
          }
          for (const subOption of mainOption.subOptions) {
            for (const trigger of subOption.trigger) {
              if (trigger.toLowerCase().length > 1 && msg.includes(trigger.toLowerCase())) {
                return { answer: subOption.response, topic: lastTopic, hasOptions: false, selectedOption: null, optionLevel: null, isFAQMenu: topicData.isFAQMenu || false, isEmotionalMenu: topicData.isEmotionalMenu || false };
              }
            }
          }
        }
      }

      if (lastOptionLevel === 'main' || !lastOptionLevel) {
        for (let i = 0; i < topicData.options.length; i++) {
          const option = topicData.options[i];
          for (const trigger of option.trigger) {
            if (msg === trigger.toLowerCase()) {
              if (option.subOptions) {
                return { answer: option.response, topic: lastTopic, hasOptions: true, options: option.subOptions, selectedOption: i, optionLevel: 'sub', isFAQMenu: topicData.isFAQMenu || false, isEmotionalMenu: topicData.isEmotionalMenu || false };
              }
              return { answer: option.response, topic: lastTopic, hasOptions: false, selectedOption: null, optionLevel: null, isFAQMenu: topicData.isFAQMenu || false, isEmotionalMenu: topicData.isEmotionalMenu || false };
            }
          }
        }
        for (let i = 0; i < topicData.options.length; i++) {
          const option = topicData.options[i];
          for (const trigger of option.trigger) {
            if (trigger.toLowerCase().length > 1 && msg.includes(trigger.toLowerCase())) {
              if (option.subOptions) {
                return { answer: option.response, topic: lastTopic, hasOptions: true, options: option.subOptions, selectedOption: i, optionLevel: 'sub', isFAQMenu: topicData.isFAQMenu || false, isEmotionalMenu: topicData.isEmotionalMenu || false };
              }
              return { answer: option.response, topic: lastTopic, hasOptions: false, selectedOption: null, optionLevel: null, isFAQMenu: topicData.isFAQMenu || false, isEmotionalMenu: topicData.isEmotionalMenu || false };
            }
          }
        }
      }
    }
  }

  let bestMatch = null;
  let highestScore = 0;

  for (const [topic, data] of Object.entries(KNOWLEDGE_BASE)) {
    let score = 0;
    for (const keyword of data.keywords) {
      const kl = keyword.toLowerCase();
      if (msg === kl) { score += 100; }
      else if (new RegExp(`\\b${kl}\\b`, 'i').test(msg)) { score += 50; }
      else if (msg.includes(kl)) { score += 10; }
    }
    if (score > highestScore && score > 0) {
      highestScore = score;
      bestMatch = {
        answer: data.answer, topic, score, hasOptions: data.hasOptions || false,
        options: data.options || null, isFAQMenu: data.isFAQMenu || false,
        isEmotionalMenu: data.isEmotionalMenu || false,
        selectedOption: null, optionLevel: data.hasOptions ? 'main' : null
      };
    }
  }

  return (bestMatch && bestMatch.score >= 10) ? bestMatch : null;
}

// ==============================================
// GEMINI API
// ==============================================
async function callGemini(prompt) {
  if (!genAI) throw new Error('Gemini API not initialized');
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const systemContext = `You are a friendly assistant for Tula's Institute, Dehradun (tulas.edu.in).

About Tula's Institute:
- Established: 2006 by Rishabh Educational Trust
- Location: Chakrata Road (NH-72), Dhoolkot Village, Selaqui, Dehradun, Uttarakhand
- Phone: +91-9837983721
- Email: info@tulas.edu.in
- Accredited: NAAC A+, NBA, AICTE approved, UTU affiliated

Guidelines:
- Answer ONLY questions about Tula's Institute
- Be friendly, warm, and concise
- Use emojis appropriately
- Suggest contacting the college for very specific queries

User question: ${prompt}`;
  const result = await model.generateContent(systemContext);
  const response = await result.response;
  const text = response.text();
  if (!text) throw new Error('No response from Gemini');
  return text;
}

// ==============================================
// ENDPOINTS
// ==============================================
app.get('/', (req, res) => {
  res.json({
    status: "✅ Server Running",
    message: "Tula's Institute Chatbot API — Production Ready",
    knowledgeBaseTopics: Object.keys(KNOWLEDGE_BASE).length,
    geminiConfigured: !!GEMINI_API_KEY,
    endpoints: { health: '/api/health', chat: '/api/chat (POST)', register: '/api/register (POST)', callback: '/api/callback-request (POST)', sendOtp: '/api/send-otp (POST)', verifyOtp: '/api/verify-otp (POST)' }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), geminiConfigured: !!GEMINI_API_KEY });
});

app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address' });
    }
    if (otpStore.has(email)) {
      const existing = otpStore.get(email);
      const timeLeft = Math.ceil((existing.expiry - Date.now()) / 1000);
      if (timeLeft > 90) {
        return res.status(429).json({ success: false, error: `Please wait ${Math.ceil(timeLeft / 60)} minute(s) before requesting again` });
      }
    }
    const otp = generateOTP();
    otpStore.set(email, { otp, expiry: Date.now() + 2 * 60 * 1000, attempts: 0 });

    await transporter.sendMail({
      from: EMAIL_CONFIG.auth.user,
      to: email,
      subject: "🔐 Your OTP — Tula's Institute Chatbot",
      html: `
        <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
        <body style="font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8;margin:0;padding:20px;">
          <div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.1);">
            <div style="background:linear-gradient(135deg,#003d82,#001f42);padding:35px 30px;text-align:center;position:relative;">
              <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#e8502a,#f4854e,#e8502a);"></div>
              <div style="width:200px;height:70px;background:white;border-radius:8px;margin:0 auto 15px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;font-size:28px;">🎓</div>
              <h1 style="color:white;margin:0;font-size:22px;letter-spacing:1px;">Tula's Institute</h1>
              <p style="color:rgba(255,255,255,0.7);margin:5px 0 0;font-size:13px;">Dehradun, Uttarakhand</p>
            </div>
            <div style="padding:35px 30px;text-align:center;">
              <h2 style="color:#003d82;margin-bottom:8px;font-size:20px;">Email Verification</h2>
              <p style="color:#666;font-size:14px;margin-bottom:25px;">Use the OTP below to verify your email address</p>
              <div style="background:linear-gradient(135deg,#f0f8ff,#e8f4fd);border:2px dashed #003d82;border-radius:14px;padding:30px;margin:0 0 20px;">
                <p style="color:#888;font-size:11px;margin:0 0 10px;text-transform:uppercase;letter-spacing:3px;">Your One-Time Password</p>
                <div style="font-size:46px;font-weight:900;color:#003d82;letter-spacing:14px;">${otp}</div>
                <p style="color:#e8502a;font-size:12px;margin:12px 0 0;font-weight:600;">⏱️ Valid for 2 minutes only</p>
              </div>
              <div style="background:#fff8f6;border-left:4px solid #e8502a;border-radius:8px;padding:14px 18px;text-align:left;">
                <p style="color:#744210;font-size:13px;margin:0;">⚠️ <strong>Do not share</strong> this OTP with anyone. Tula's Institute staff will never ask for your OTP.</p>
              </div>
            </div>
            <div style="background:#003d82;padding:20px 30px;text-align:center;">
              <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:0;">© ${new Date().getFullYear()} Tula's Institute · Dehradun, Uttarakhand · tulas.edu.in</p>
            </div>
          </div>
        </body></html>
      `
    });
    console.log(`✅ OTP sent to: ${email}`);
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('❌ OTP send error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send OTP. Please try again.' });
  }
});

app.post('/api/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, error: 'Email and OTP are required' });
    const stored = otpStore.get(email);
    if (!stored) return res.status(400).json({ success: false, error: 'OTP expired or not found. Please request a new one.' });
    if (Date.now() > stored.expiry) { otpStore.delete(email); return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new one.' }); }
    if (stored.attempts >= 5) { otpStore.delete(email); return res.status(429).json({ success: false, error: 'Too many attempts. Please request a new OTP.' }); }
    if (stored.otp !== otp.toString()) {
      stored.attempts++;
      otpStore.set(email, stored);
      const remaining = 5 - stored.attempts;
      return res.status(400).json({ success: false, error: `Incorrect OTP. ${remaining} attempt(s) remaining.` });
    }
    otpStore.delete(email);
    res.json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Verification failed. Please try again.' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ success: false, error: 'All fields (name, email, phone) are required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: 'Invalid email format' });
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, '').slice(-10))) return res.status(400).json({ success: false, error: 'Invalid phone number' });
    console.log('📝 New user registration:', { name, email, phone });
    const emailSent = await sendAdminEmail({ name, email, phone });
    res.json({ success: true, message: 'Registration successful! You can now start chatting.', emailSent });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
});

app.post('/api/callback-request', async (req, res) => {
  try {
    const { name, email, phone, query, callback_number } = req.body;
    if (!name || !email || !phone || !query || !callback_number) return res.status(400).json({ success: false, error: 'All fields are required' });
    const cleanedNumber = callback_number.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanedNumber)) return res.status(400).json({ success: false, error: 'Invalid callback number' });
    console.log('📞 New callback request:', { name, callback_number, query });
    const emailSent = await sendCallbackEmail({ name, email, phone }, query, cleanedNumber);
    res.json({ success: emailSent, message: emailSent ? 'Callback request received successfully' : 'Failed to send email notification' });
  } catch (error) {
    console.error('❌ Callback request error:', error);
    res.status(500).json({ success: false, error: 'Failed to process callback request' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, lastTopic, lastOptionLevel, lastSelectedOption } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'Message is required' });

    console.log(`📩 User: ${message}`);

    const GREETINGS = [
      "Hello! 👋 Welcome to Tula's Institute, Dehradun! I'm your AI assistant. How can I help you today?\n\nI can assist with Admissions, Courses, Fees, Placements, Hostel, Scholarships and much more! 🎓",
      "Hi there! 😊 Welcome to Tula's Institute! I'm here to answer all your questions about admissions, programs, fees, campus life, and placements. What would you like to know? 🎓"
    ];

    if (/^(hi|hello|hey|good morning|good afternoon|good evening|hii|helo|namaste)/i.test(message.trim())) {
      return res.json({ success: true, reply: GREETINGS[Math.floor(Math.random() * GREETINGS.length)], mode: 'greeting' });
    }

    const knowledgeMatch = findBestMatch(message, lastTopic, lastOptionLevel, lastSelectedOption);

    if (knowledgeMatch) {
      console.log(`✅ Knowledge Base Match — Topic: ${knowledgeMatch.topic}`);
      let reply = knowledgeMatch.answer;
      if (knowledgeMatch.hasOptions && knowledgeMatch.options) {
        reply += "\n\n";
        knowledgeMatch.options.forEach(opt => { reply += `${opt.label}\n`; });
      }
      return res.json({
        success: true, reply, mode: 'knowledge-base',
        hasOptions: knowledgeMatch.hasOptions, options: knowledgeMatch.options || null,
        currentTopic: knowledgeMatch.topic, optionLevel: knowledgeMatch.optionLevel || null,
        selectedOption: knowledgeMatch.selectedOption,
        isFAQMenu: knowledgeMatch.isFAQMenu || false, isEmotionalMenu: knowledgeMatch.isEmotionalMenu || false
      });
    }

    if (GEMINI_API_KEY) {
      try {
        const reply = await callGemini(message);
        return res.json({ success: true, reply: reply.trim() + "\n\n🤖 *Powered by Google Gemini*", mode: 'ai-powered' });
      } catch (geminiError) {
        console.log('⚠️ Gemini unavailable, triggering callback');
      }
    }

    return res.json({
      success: true,
      reply: "I apologize, but I don't have specific information about that right now. 😊\n\nWould you like me to have someone from our team call you back to answer your question?\n\nIf yes, please provide your contact number below:",
      mode: 'callback-request', requiresCallback: true, userQuery: message
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.json({
      success: true,
      reply: "I can help you with Tula's Institute information! 😊\n\nFor detailed assistance:\n📞 Call: +91-9837983721\n📧 Email: info@tulas.edu.in\n🌐 Website: https://tulas.edu.in/",
      mode: 'emergency-fallback'
    });
  }
});

app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log("║  🎓 TULA'S INSTITUTE CHATBOT — PRODUCTION    ║");
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`🤖 AI Model: ${GEMINI_API_KEY ? 'Google Gemini Pro ✅' : 'Not Configured ⚠️'}`);
  console.log(`📚 Knowledge Base: ${Object.keys(KNOWLEDGE_BASE).length} topics ✅`);
  console.log(`📧 Email: ${EMAIL_CONFIG.auth.user !== 'your-email@gmail.com' ? 'Configured ✅' : 'Not Configured ❌'}`);
  console.log(`✅ FAQ Navigation: Working`);
  console.log(`💚 Student Support Menu: Active`);
  console.log(`📞 Callback System: Active ✅`);
  console.log(`🔐 OTP System: Active ✅`);
  console.log('╚══════════════════════════════════════════════\n');
});