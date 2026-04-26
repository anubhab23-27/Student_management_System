import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getNoticesAPI } from "../../service/GlobalApi";

// ─── Chemistry SVG elements ───────────────────────────────────────────────────
const FlaskIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 3h6M9 3v7l-6 11h18L15 10V3M9 3H7M15 3h2" />
    <path d="M8 17h8" opacity="0.5" />
  </svg>
);

const AtomIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="2" fill={color} />
    <ellipse cx="12" cy="12" rx="10" ry="4" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
  </svg>
);

const MoleculeIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="3" fill={color} opacity="0.7" />
    <circle cx="4" cy="6" r="2.5" fill={color} opacity="0.5" />
    <circle cx="20" cy="6" r="2.5" fill={color} opacity="0.5" />
    <circle cx="4" cy="18" r="2.5" fill={color} opacity="0.5" />
    <circle cx="20" cy="18" r="2.5" fill={color} opacity="0.5" />
    <line x1="9.5" y1="10.5" x2="6" y2="7.5" strokeWidth="1.5" />
    <line x1="14.5" y1="10.5" x2="18" y2="7.5" strokeWidth="1.5" />
    <line x1="9.5" y1="13.5" x2="6" y2="16.5" strokeWidth="1.5" />
    <line x1="14.5" y1="13.5" x2="18" y2="16.5" strokeWidth="1.5" />
  </svg>
);

const BeakerIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 3h15M8 3v7.5l-4 9a1 1 0 00.9 1.5h14.2a1 1 0 00.9-1.5l-4-9V3" />
    <path d="M6 17c2-1 4-1 6 0s4 1 6 0" opacity="0.4" />
  </svg>
);

const TestTubeIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2L20 7.5l-10 10a3.5 3.5 0 01-5-5L14.5 2z" />
    <path d="M15 3l4 4M5 18l-1 1" />
  </svg>
);

const PhoneIcon = ({ size = 20, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MailIcon = ({ size = 20, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const MapPinIcon = ({ size = 20, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ChevronDown = ({ size = 20, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const StarIcon = ({ size = 16, color = "#F59E0B" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke={color}
    strokeWidth="1"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const MenuIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Floating chemistry background elements ───────────────────────────────────
const FloatingElement = ({
  icon: Icon,
  size,
  color,
  x,
  y,
  delay,
  duration,
}) => (
  <motion.div
    className="absolute pointer-events-none select-none"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      opacity: [0.12, 0.22, 0.12],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  >
    <Icon size={size} color={color} />
  </motion.div>
);

const floatingElements = [
  {
    icon: AtomIcon,
    size: 64,
    color: "#2563EB",
    x: 5,
    y: 10,
    delay: 0,
    duration: 6,
  },
  {
    icon: FlaskIcon,
    size: 48,
    color: "#0D9488",
    x: 88,
    y: 15,
    delay: 1,
    duration: 7,
  },
  {
    icon: MoleculeIcon,
    size: 80,
    color: "#2563EB",
    x: 15,
    y: 60,
    delay: 2,
    duration: 8,
  },
  {
    icon: BeakerIcon,
    size: 56,
    color: "#0D9488",
    x: 80,
    y: 55,
    delay: 0.5,
    duration: 9,
  },
  {
    icon: TestTubeIcon,
    size: 44,
    color: "#6366F1",
    x: 45,
    y: 5,
    delay: 1.5,
    duration: 6.5,
  },
  {
    icon: AtomIcon,
    size: 40,
    color: "#0D9488",
    x: 92,
    y: 80,
    delay: 3,
    duration: 7.5,
  },
  {
    icon: FlaskIcon,
    size: 36,
    color: "#2563EB",
    x: 3,
    y: 85,
    delay: 2.5,
    duration: 8.5,
  },
  {
    icon: MoleculeIcon,
    size: 52,
    color: "#6366F1",
    x: 60,
    y: 90,
    delay: 1,
    duration: 6,
  },
];

// ─── Section fade-in wrapper ──────────────────────────────────────────────────
const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
// const notices = [
//   {
//     id: 1,
//     title: "Summer Batch Registration Open",
//     date: "April 20, 2025",
//     desc: "New batches for Class 11 & 12 starting May 1st. Limited seats available. Early-bird discount till April 30.",
//     tag: "New",
//   },
//   {
//     id: 2,
//     title: "JEE Mains Results Celebration",
//     date: "April 15, 2025",
//     desc: "Our students achieved outstanding results — 3 in top 100 AIR! Join the celebration on April 22nd.",
//     tag: "Event",
//   },
//   {
//     id: 3,
//     title: "Extra Doubt Classes — Saturdays",
//     date: "April 10, 2025",
//     desc: "Starting April 26, free doubt-clearing sessions every Saturday 10 AM – 12 PM for enrolled students.",
//     tag: "Update",
//   },
//   {
//     id: 4,
//     title: "Mock Test Series Announced",
//     date: "April 5, 2025",
//     desc: "12-week full-syllabus mock test series for NEET & JEE Advanced now available. Enroll before April 30.",
//     tag: "Test",
//   },
// ];

const faqs = [
  {
    q: "What is molarity and how is it calculated?",
    a: "Molarity (M) is the number of moles of solute dissolved per litre of solution. It's calculated as M = moles of solute ÷ volume of solution (in litres). For example, dissolving 2 moles of NaCl in 1L of water gives a 2M solution.",
  },
  {
    q: "What's the difference between ionic and covalent bonds?",
    a: "Ionic bonds form by complete electron transfer between a metal and a non-metal, creating charged ions (e.g., NaCl). Covalent bonds form by sharing electrons between non-metals (e.g., H₂O). Ionic compounds tend to have high melting points and conduct electricity when dissolved; covalent compounds generally don't.",
  },
  {
    q: "Why does pH matter in chemistry?",
    a: "pH measures the concentration of hydrogen ions (H⁺) in a solution on a scale of 0–14. pH 7 is neutral; below 7 is acidic, above 7 is basic. pH affects reaction rates, enzyme activity in biology, solubility of compounds, and the behaviour of indicators — making it foundational in both chemistry and medicine.",
  },
  {
    q: "What is the difference between exothermic and endothermic reactions?",
    a: "Exothermic reactions release energy (heat/light) to surroundings — ΔH is negative (e.g., combustion). Endothermic reactions absorb energy from surroundings — ΔH is positive (e.g., photosynthesis, dissolving ammonium nitrate). You can detect them by temperature change in the reaction vessel.",
  },
  {
    q: "How do I learn the periodic table effectively?",
    a: "Group elements by trends — electronegativity, atomic radius, ionisation energy — rather than memorising individually. Focus on the s, p, d blocks, learn periodic trends, and use mnemonics for groups. Understanding why elements behave as they do makes retention far easier than rote learning.",
  },
];

const tagColors = {
  New: "bg-blue-100 text-blue-700",
  Event: "bg-teal-100 text-teal-700",
  Update: "bg-indigo-100 text-indigo-700",
  Test: "bg-amber-100 text-amber-700",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChemistryCoachingCenter() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNoticesAPI();
        setNotices(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    return scrollY.onChange((v) => setScrolled(v > 40));
  }, [scrollY]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = ["home", "notices", "teacher", "queries", "contact"];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { scroll-behavior: smooth; }
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #93c5fd; border-radius: 999px; }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-body ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-50"
            : "bg-transparent"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => scrollTo("home")}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-md shadow-blue-200">
                <AtomIcon size={20} color="white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 leading-none">
                  ChemWise
                </p>
                <p className="text-[10px] text-teal-600 font-medium tracking-wide uppercase leading-none mt-0.5">
                  Coaching Centre
                </p>
              </div>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <button
                  key={l}
                  onClick={() => scrollTo(l)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-all capitalize"
                >
                  {l === "queries"
                    ? "Q&A"
                    : l === "contact"
                      ? "Contact"
                      : l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="ml-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors"
              >
                Login Now
              </motion.button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-blue-50 text-slate-600 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/98 backdrop-blur-lg border-b border-blue-100 overflow-hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <button
                    key={l}
                    onClick={() => scrollTo(l)}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all capitalize"
                  >
                    {l === "queries"
                      ? "Q&A"
                      : l === "contact"
                        ? "Contact"
                        : l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
                <button
                  onClick={() => navigate("/")}
                  className="mt-1 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold"
                >
                  Login Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-teal-50/30 pt-16"
      >
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {floatingElements.map((el, i) => (
            <FloatingElement key={i} {...el} />
          ))}
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #2563EB 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-10 w-72 h-72 lg:w-[500px] lg:h-[500px] rounded-full bg-blue-400 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 left-0 w-64 h-64 lg:w-96 lg:h-96 rounded-full bg-teal-400 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-blue-700 font-body">
                Admissions Open 2026-28
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight"
            >
              Master Chemistry
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                with Confidence
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-5 text-lg text-slate-600 font-body leading-relaxed max-w-lg"
            >
              From fundamental concepts to advanced problem-solving — we make
              chemistry click for JEE, NEET, and board exams with personalised
              mentorship.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-6 mt-8"
            >
              {[
                ["500+", "Students Taught"],
                ["98%", "Board Results"],
                ["15+", "Years Experience"],
                ["50+", "JEE Selections"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl font-bold text-blue-700">
                    {num}
                  </p>
                  <p className="text-xs text-slate-500 font-body mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="px-7 py-3.5 rounded-2xl bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all font-body"
              >
                Login →
              </motion.button>
            </motion.div>
          </div>

          {/* Right — visual chemistry card */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col gap-4"
          >
            {/* Big periodic element card */}
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-100 border border-blue-50 overflow-hidden p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-teal-50 rounded-bl-full opacity-60" />
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex flex-col items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
                  <span className="text-xs font-medium opacity-80 font-body">
                    6
                  </span>
                  <span className="text-3xl font-bold font-display leading-none">
                    C
                  </span>
                  <span className="text-xs font-medium opacity-80 font-body">
                    Carbon
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-800">
                    Elements of Success
                  </h3>
                  <p className="text-sm text-slate-500 font-body mt-1 leading-relaxed">
                    Just as carbon forms the backbone of organic life, our
                    curriculum forms the backbone of exam success.
                  </p>
                  <div className="flex gap-2 mt-3">
                    {["Organic", "Inorganic", "Physical"].map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold font-body"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Mini periodic table snippet */}
              <div className="mt-5 grid grid-cols-8 gap-1">
                {[
                  "H",
                  "He",
                  "Li",
                  "Be",
                  "B",
                  "C",
                  "N",
                  "O",
                  "F",
                  "Ne",
                  "Na",
                  "Mg",
                  "Al",
                  "Si",
                  "P",
                  "S",
                ].map((el, i) => (
                  <motion.div
                    key={el}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold font-body cursor-default
                      ${el === "C" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-slate-50 text-slate-600 border border-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors"}`}
                  >
                    {el}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mini cards row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: FlaskIcon,
                  label: "NCERT + Advanced ",
                  val: "Concept Building",
                  color: "blue",
                },
                {
                  icon: AtomIcon,
                  label: "Structured ",
                  val: "JEE/NEET Modules",
                  color: "teal",
                },
                {
                  icon: BeakerIcon,
                  label: "Rank Analysis",
                  val: "Mounthly Tests",
                  color: "indigo",
                },
              ].map(({ icon: Icon, label, val, color }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -4, shadow: "2xl" }}
                  className={`bg-white rounded-2xl p-4 border border-${color}-100 shadow-md shadow-${color}-50 text-center`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center mx-auto`}
                  >
                    <Icon
                      size={20}
                      color={
                        color === "teal"
                          ? "#0D9488"
                          : color === "indigo"
                            ? "#6366F1"
                            : "#2563EB"
                      }
                    />
                  </div>
                  <p className="text-xs text-slate-500 font-body mt-2">
                    {label}
                  </p>
                  <p
                    className={`text-sm font-bold text-${color}-700 font-body mt-0.5`}
                  >
                    {val}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer"
          onClick={() => scrollTo("notices")}
        >
          <span className="text-xs text-slate-400 font-body">Scroll down</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-300 flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1.5 rounded-full bg-blue-500"
            />
          </div>
        </motion.div>
      </section>

      {/* ── NOTICE BOARD ────────────────────────────────────────────────────── */}
      <section id="notices" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                <span className="text-base">📢</span>
              </div>
              <span className="text-sm font-semibold text-amber-600 uppercase tracking-widest font-body">
                Latest Updates
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Notice Board
            </h2>
            <p className="text-slate-500 font-body mt-2 max-w-xl">
              Stay up to date with announcements, results, and new batches.
            </p>
          </FadeInSection>

          {/* Ticker */}

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {notices.map((notice, i) => (
              <FadeInSection key={notice.id} delay={i * 0.08}>
                <motion.div
                  whileHover={{
                    y: -6,
                    boxShadow: "0 20px 40px -12px rgba(37,99,235,0.18)",
                  }}
                  className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-md shadow-slate-100 cursor-default h-full transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold font-body ${tagColors[notice.tag]}`}
                    >
                      {notice.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-body">
                      {notice.date}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors">
                    {notice.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 font-body leading-relaxed">
                    {notice.desc}
                  </p>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT THE TEACHER ────────────────────────────────────────────────── */}
      <section
        id="teacher"
        className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30 relative overflow-hidden"
      >
        {/* Background decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full blur-2xl opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
                <span className="text-base">👨‍🏫</span>
              </div>
              <span className="text-sm font-semibold text-teal-600 uppercase tracking-widest font-body">
                Meet Your Mentor
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              About the Teacher
            </h2>
          </FadeInSection>

          <div className="mt-10 grid lg:grid-cols-5 gap-8 items-start">
            {/* Profile card */}
            <FadeInSection delay={0.1} className="lg:col-span-2">
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-blue-100 border border-blue-50">
                {/* Header gradient */}
                <div className="h-28 bg-gradient-to-br from-blue-600 to-teal-500 relative">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>
                {/* Avatar */}
                <div className="px-6 pb-6">
                  <div className="-mt-12 mb-4 relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-display text-3xl font-bold shadow-lg shadow-blue-200 border-4 border-white">
                      NB
                    </div>
                    <div
                      className="absolute top-0 right-0 w-6 h-6 rounded-full bg-green-400 border-2 border-white shadow-sm"
                      title="Online"
                    />
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Dr. Rajesh Kumar
                  </h3>
                  <p className="text-sm text-teal-600 font-semibold font-body mt-0.5">
                    M.Sc., Ph.D. (Chemistry) — IIT Delhi
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon key={s} size={14} />
                    ))}
                    <span className="text-xs text-slate-500 font-body ml-1">
                      4.9 / 5.0
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { label: "Experience", value: "15+ Years" },
                      { label: "Students", value: "500+" },
                      { label: "Success Rate", value: "98%" },
                      { label: "Selections", value: "120+ JEE" },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="bg-slate-50 rounded-xl p-3 text-center"
                      >
                        <p className="font-display text-base font-bold text-blue-700">
                          {value}
                        </p>
                        <p className="text-[11px] text-slate-500 font-body mt-0.5">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInSection>

            {/* Bio & highlights */}
            <FadeInSection delay={0.2} className="lg:col-span-3">
              <div className="space-y-5">
                <div className="bg-white rounded-3xl p-7 shadow-md shadow-slate-100 border border-slate-100">
                  <h4 className="font-display text-lg font-bold text-slate-800 mb-3">
                    About Dr. Rajesh Kumar
                  </h4>
                  <p className="text-slate-600 font-body leading-relaxed text-sm">
                    Dr. Rajesh Kumar is a passionate chemistry educator and
                    researcher with over 15 years of experience preparing
                    students for JEE, NEET, and CBSE/ISC board examinations.
                    Holding a Ph.D. in Physical Chemistry from IIT Delhi, he
                    brings rigorous academic depth combined with a practical,
                    student-first teaching methodology.
                  </p>
                  <p className="text-slate-600 font-body leading-relaxed text-sm mt-3">
                    His hallmark is transforming abstract chemical concepts into
                    intuitive, exam-ready knowledge. Students consistently
                    report that complex topics like electrochemistry,
                    coordination compounds, and thermodynamics feel genuinely
                    accessible under his guidance.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      emoji: "🎯",
                      title: "Exam Specialist",
                      desc: "Deep expertise in JEE Advanced & NEET patterns",
                    },
                    {
                      emoji: "💡",
                      title: "Concept-First Approach",
                      desc: "Builds intuition before formulas — 98% pass rate",
                    },
                  ].map(({ emoji, title, desc }) => (
                    <motion.div
                      key={title}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex gap-3 items-start"
                    >
                      <span className="text-2xl flex-shrink-0 mt-0.5">
                        {emoji}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-800 font-body">
                          {title}
                        </p>
                        <p className="text-xs text-slate-500 font-body mt-0.5">
                          {desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Subjects */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-body mb-3">
                    Subjects Covered
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Organic Chemistry",
                      "Inorganic Chemistry",
                      "Physical Chemistry",
                      "Electrochemistry",
                      "Thermodynamics",
                      "Coordination Compounds",
                      "Chemical Kinetics",
                      "Atomic Structure",
                    ].map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold font-body border border-blue-100"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── CHEMISTRY QUERIES (FAQ) ─────────────────────────────────────────── */}
      <section id="queries" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                <span className="text-base">❓</span>
              </div>
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-widest font-body">
                Student Questions
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Chemistry Queries
            </h2>
            <p className="text-slate-500 font-body mt-3 max-w-lg mx-auto">
              Common questions answered clearly. Understanding these concepts is
              the first step to exam mastery.
            </p>
          </FadeInSection>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeInSection key={i} delay={i * 0.06}>
                <motion.div
                  className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                    openFaq === i
                      ? "border-blue-200 bg-blue-50/50 shadow-lg shadow-blue-100"
                      : "border-slate-100 bg-white shadow-sm hover:border-blue-200 hover:shadow-md hover:shadow-blue-50"
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-body mt-0.5 ${
                          openFaq === i
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`font-body font-semibold text-sm leading-snug ${openFaq === i ? "text-blue-800" : "text-slate-800"}`}
                      >
                        {faq.q}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown
                        size={18}
                        color={openFaq === i ? "#2563EB" : "#94a3b8"}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pl-15 border-t border-blue-100/80">
                          <p className="text-sm text-slate-600 font-body leading-relaxed mt-4 pl-9">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </FadeInSection>
            ))}
          </div>

          {/* CTA below FAQ */}
          <FadeInSection delay={0.2} className="mt-10 text-center">
            <p className="text-slate-500 font-body text-sm">
              Have more questions? Ask us directly.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo("contact")}
              className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-sm font-body shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
            >
              Ask a Question →
            </motion.button>
          </FadeInSection>
        </div>
      </section>

      {/* ── LOCATION & CONTACT ───────────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30 relative overflow-hidden"
      >
        <div className="absolute top-10 left-0 w-56 h-56 bg-teal-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                <span className="text-base">📍</span>
              </div>
              <span className="text-sm font-semibold text-rose-600 uppercase tracking-widest font-body">
                Find Us
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Location & Contact
            </h2>
            <p className="text-slate-500 font-body mt-2">
              Come visit us or reach out — we're always happy to help.
            </p>
          </FadeInSection>

          <div className="mt-10 grid lg:grid-cols-5 gap-6">
            {/* Map placeholder */}
            <FadeInSection delay={0.1} className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-100 border border-blue-50 overflow-hidden h-full min-h-72">
                {/* Decorative map */}
                <div className="relative h-full min-h-72 bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col items-center justify-center gap-3 p-6">
                  <div className="absolute inset-0 opacity-10">
                    {/* Grid lines mimicking a map */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={`h${i}`}
                        className="absolute left-0 right-0 border-t border-blue-300"
                        style={{ top: `${i * 9}%` }}
                      />
                    ))}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={`v${i}`}
                        className="absolute top-0 bottom-0 border-l border-blue-300"
                        style={{ left: `${i * 9}%` }}
                      />
                    ))}
                  </div>
                  {/* Roads */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-20"
                    viewBox="0 0 400 300"
                  >
                    <path
                      d="M0 150 Q100 100 200 150 Q300 200 400 150"
                      stroke="#3B82F6"
                      strokeWidth="8"
                      fill="none"
                    />
                    <path
                      d="M200 0 Q180 100 200 150 Q220 200 200 300"
                      stroke="#3B82F6"
                      strokeWidth="8"
                      fill="none"
                    />
                    <path
                      d="M0 80 L400 80"
                      stroke="#94A3B8"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      d="M0 220 L400 220"
                      stroke="#94A3B8"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      d="M80 0 L80 300"
                      stroke="#94A3B8"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      d="M320 0 L320 300"
                      stroke="#94A3B8"
                      strokeWidth="4"
                      fill="none"
                    />
                  </svg>
                  {/* Pin */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-xl shadow-blue-300">
                      <MapPinIcon size={26} color="white" />
                    </div>
                    <div className="mt-1 w-3 h-3 bg-blue-600 rotate-45 -mt-1.5 mx-auto shadow-lg" />
                  </motion.div>
                  <div className="relative z-10 bg-white/90 backdrop-blur rounded-2xl px-5 py-3 text-center shadow-md border border-blue-100 mt-2">
                    <p className="font-display font-bold text-blue-800 text-base">
                      ChemWise Coaching Centre
                    </p>
                    <p className="text-xs text-slate-500 font-body mt-0.5">
                      12/B, Science Park Road, Sector 4
                    </p>
                    <p className="text-xs text-slate-500 font-body">
                      Kolkata — 700 091, West Bengal
                    </p>
                  </div>
                  <span className="relative z-10 text-xs text-slate-400 font-body mt-1">
                    Open Mon – Sat &nbsp;|&nbsp; 8:00 AM – 8:00 PM
                  </span>
                </div>
              </div>
            </FadeInSection>

            {/* Contact cards */}
            <FadeInSection
              delay={0.15}
              className="lg:col-span-2 flex flex-col gap-4"
            >
              {/* Address */}
              <div className="bg-white rounded-3xl p-6 shadow-md shadow-slate-100 border border-slate-100 flex gap-4 items-start">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                  <MapPinIcon size={20} color="#E11D48" />
                </div>
                <div>
                  <p className="font-body font-bold text-slate-800 text-sm">
                    Centre Address
                  </p>
                  <p className="text-xs text-slate-500 font-body mt-1 leading-relaxed">
                    12/B, Science Park Road, Sector 4,
                    <br />
                    Near Central Library,
                    <br />
                    Kolkata — 700 091, West Bengal
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-3xl p-6 shadow-md shadow-slate-100 border border-slate-100 flex gap-4 items-start">
                <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <PhoneIcon size={20} color="#16A34A" />
                </div>
                <div>
                  <p className="font-body font-bold text-slate-800 text-sm">
                    Phone / WhatsApp
                  </p>
                  <p className="text-xs text-slate-500 font-body mt-1">
                    +91 98300 12345
                  </p>
                  <p className="text-xs text-slate-500 font-body">
                    +91 33 2345 6789
                  </p>
                  <p className="text-xs text-green-600 font-semibold font-body mt-1.5">
                    WhatsApp available
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-3xl p-6 shadow-md shadow-slate-100 border border-slate-100 flex gap-4 items-start">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <MailIcon size={20} color="#2563EB" />
                </div>
                <div>
                  <p className="font-body font-bold text-slate-800 text-sm">
                    Email Us
                  </p>
                  <p className="text-xs text-slate-500 font-body mt-1">
                    info@chemwise.in
                  </p>
                  <p className="text-xs text-slate-500 font-body">
                    admissions@chemwise.in
                  </p>
                  <p className="text-xs text-blue-600 font-semibold font-body mt-1.5">
                    Response within 24 hrs
                  </p>
                </div>
              </div>

              {/* Timings */}
              <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-6 shadow-lg shadow-blue-200 text-white">
                <p className="font-body font-bold text-sm mb-3">
                  Batch Timings
                </p>
                {[
                  ["Morning", "7:00 AM – 9:00 AM"],
                  ["Afternoon", "2:00 PM – 4:00 PM"],
                  ["Evening", "5:00 PM – 7:00 PM"],
                ].map(([shift, time]) => (
                  <div
                    key={shift}
                    className="flex justify-between items-center py-1.5 border-b border-white/20 last:border-0"
                  >
                    <span className="text-xs font-medium text-white/80 font-body">
                      {shift} Batch
                    </span>
                    <span className="text-xs font-bold font-body">{time}</span>
                  </div>
                ))}
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-md">
                  <AtomIcon size={20} color="white" />
                </div>
                <div>
                  <p className="text-sm font-bold font-body">ChemWise</p>
                  <p className="text-[10px] text-teal-400 font-semibold uppercase tracking-wide">
                    Coaching Centre
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-body leading-relaxed">
                Transforming chemistry learners into confident problem-solvers
                since 2010.
              </p>
            </div>

            {/* Quick links */}
            {[
              {
                title: "Quick Links",
                links: ["Home", "Notices", "About Teacher", "Q&A", "Contact"],
              },
              {
                title: "Courses",
                links: [
                  "JEE Main & Advanced",
                  "NEET Chemistry",
                  "Class 11 Chemistry",
                  "Class 12 Chemistry",
                  "Board Exam Special",
                ],
              },
              {
                title: "Resources",
                links: [
                  "Previous Year Papers",
                  "Chapter Notes",
                  "Formula Sheets",
                  "Video Lectures",
                  "Test Series",
                ],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-3 font-body">
                  {title}
                </p>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-xs text-slate-400 hover:text-teal-400 transition-colors font-body"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500 font-body">
              © 2025 ChemWise Coaching Centre. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <FlaskIcon size={14} color="#0D9488" />
              <p className="text-xs text-slate-500 font-body">
                Crafted with chemistry ❤️ in Kolkata
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
