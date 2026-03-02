import { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import WireframeSphere from "./WireframeSphere";
import OrbitingPanel from "./OrbitingPanel";
import ParallaxCamera from "./ParallaxCamera";
import FloatingParticles from "./FloatingParticles";
import NebulaField from "./NebulaField";
import ShootingStars from "./ShootingStars";
import About from "../About";
import Experience from "../Experience";
import Education from "../Education";
import Projects from "../Projects";
import Skills from "../Skills";
import Hobbies from "../Hobbies";
import Contact from "../Contact";
import { Link } from "react-router-dom";
import { FileText, Map, X, ChevronDown } from "lucide-react";
import LanguageSwitch from "../LanguageSwitch";
import { RecruiterChatbot } from "../RecruiterChatbot";
import profileImg from "@/assets/japhet-profile-pro.jpg";

interface SectionNode {
  id: string;
  label: { fr: string; en: string };
  icon: string;
  color: string;
  yOffset: number;
  radius: number;
  speed: number;
}

const sections: SectionNode[] = [
  { id: "about", label: { fr: "À Propos", en: "About" }, icon: "👤", color: "hsl(260, 60%, 65%)", yOffset: 0.8, radius: 4.5, speed: 0.25 },
  { id: "experience", label: { fr: "Expériences", en: "Experience" }, icon: "💼", color: "hsl(150, 70%, 50%)", yOffset: -0.3, radius: 5, speed: 0.2 },
  { id: "education", label: { fr: "Formation", en: "Education" }, icon: "🎓", color: "hsl(40, 95%, 60%)", yOffset: 0.5, radius: 4.8, speed: 0.22 },
  { id: "projects", label: { fr: "Projets", en: "Projects" }, icon: "🚀", color: "hsl(0, 80%, 60%)", yOffset: -0.6, radius: 5.2, speed: 0.18 },
  { id: "skills", label: { fr: "Compétences", en: "Skills" }, icon: "⚡", color: "hsl(280, 70%, 60%)", yOffset: 0.2, radius: 4.6, speed: 0.23 },
  { id: "hobbies", label: { fr: "Passions", en: "Hobbies" }, icon: "🎮", color: "hsl(320, 70%, 60%)", yOffset: -0.8, radius: 5.1, speed: 0.19 },
  { id: "contact", label: { fr: "Contact", en: "Contact" }, icon: "✉️", color: "hsl(195, 90%, 55%)", yOffset: 0.6, radius: 4.7, speed: 0.21 },
];

const sectionComponents: Record<string, React.ComponentType> = {
  about: About,
  experience: Experience,
  education: Education,
  projects: Projects,
  skills: Skills,
  hobbies: Hobbies,
  contact: Contact,
};

const Hub3DScene = () => {
  const { language, t } = useLanguage();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = useCallback((id: string) => {
    setTransitioning(true);
    setTimeout(() => {
      setActiveSection(id);
      setTransitioning(false);
    }, 600);
  }, []);

  const handleClose = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setActiveSection(null);
      setTransitioning(false);
    }, 400);
  }, []);

  const ActiveComponent = activeSection ? sectionComponents[activeSection] : null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Canvas */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: activeSection ? 0.15 : 1,
          scale: activeSection ? 1.15 : 1,
          filter: transitioning ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Canvas
          camera={{ position: [0, 0.5, 8], fov: isMobile ? 60 : 50 }}
          gl={{ antialias: !isMobile, alpha: true, powerPreference: isMobile ? "low-power" : "high-performance" }}
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          frameloop={activeSection ? "demand" : "always"}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.12} />
            <fog attach="fog" args={["hsl(230, 25%, 5%)", 15, 35]} />

            <ParallaxCamera mobile={isMobile} />
            <WireframeSphere mobile={isMobile} />
            <FloatingParticles count={300} mobile={isMobile} />
            <NebulaField mobile={isMobile} />
            <ShootingStars mobile={isMobile} />

            {sections.map((section, i) => (
              <OrbitingPanel
                key={section.id}
                id={section.id}
                label={section.label[language]}
                icon={section.icon}
                color={section.color}
                index={i}
                total={sections.length}
                radius={section.radius}
                yOffset={section.yOffset}
                speed={section.speed}
                onSelect={handleSelect}
                mobile={isMobile}
              />
            ))}
          </Suspense>
        </Canvas>
      </motion.div>

      {/* ─── Top Navigation Bar ─── */}
      <AnimatePresence>
        {!activeSection && (
          <motion.header
            className="absolute top-0 left-0 right-0 z-40"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5">
              {/* Profile badge */}
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <img
                    src={profileImg}
                    alt="JCN"
                    className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border-2 border-primary/30"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-background" />
                </div>
                <div>
                  <h1 className="text-xs md:text-base font-orbitron font-bold text-foreground">
                    <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
                      Japhet Calixte
                    </span>
                  </h1>
                  <p className="text-[9px] md:text-[11px] text-muted-foreground font-exo tracking-wider">
                    Junior Data Analyst
                  </p>
                </div>
              </motion.div>

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-1.5">
                {[
                  { to: "/constellation", icon: <Map className="w-3.5 h-3.5" />, label: "Constellation" },
                  { to: "/cv", icon: <FileText className="w-3.5 h-3.5" />, label: t("nav.cv") },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-exo text-muted-foreground hover:text-foreground transition-all duration-300 backdrop-blur-xl bg-card/30 border border-border/30 hover:border-primary/30 hover:shadow-glow"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                <div className="ml-2 backdrop-blur-xl bg-card/30 border border-border/30 rounded-xl px-3 py-1.5">
                  <LanguageSwitch />
                </div>
              </div>

              {/* Mobile menu toggle */}
              <div className="flex md:hidden items-center gap-2">
                <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-xl px-2 py-1">
                  <LanguageSwitch />
                </div>
                <motion.button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-xl backdrop-blur-xl bg-card/30 border border-border/30 text-muted-foreground"
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={menuOpen ? "close" : "menu"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {menuOpen ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className="md:hidden mx-4 mb-2 rounded-2xl backdrop-blur-2xl bg-card/60 border border-border/30 overflow-hidden"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="p-3 space-y-1">
                    {sections.map((s, i) => (
                      <motion.button
                        key={s.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-exo text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all"
                        onClick={() => { handleSelect(s.id); setMenuOpen(false); }}
                      >
                        <span className="text-base">{s.icon}</span>
                        <span className="tracking-wider uppercase">{s.label[language]}</span>
                      </motion.button>
                    ))}
                    <div className="h-px bg-border/30 my-1" />
                    <Link
                      to="/constellation"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-exo text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Map className="w-4 h-4" />
                      <span className="tracking-wider uppercase">Constellation</span>
                    </Link>
                    <Link
                      to="/cv"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-exo text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="tracking-wider uppercase">{t("nav.cv")}</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ─── Bottom Hint ─── */}
      <AnimatePresence>
        {!activeSection && (
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <motion.div
              className="w-5 h-8 rounded-full border border-primary/30 flex items-start justify-center pt-1.5"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-1.5 rounded-full bg-primary/60"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            <motion.p
              className="text-[10px] text-muted-foreground font-exo tracking-[0.2em] uppercase"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {language === "fr" ? "Explorez l'espace" : "Explore the space"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Section Content Overlay ─── */}
      <AnimatePresence>
        {activeSection && ActiveComponent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-2xl"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="relative z-10 w-full max-w-4xl max-h-[88vh] overflow-y-auto cosmic-scrollbar rounded-3xl border border-border/30"
              style={{
                background: "var(--gradient-card)",
                backdropFilter: "blur(24px)",
                boxShadow: "var(--shadow-xl), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
              }}
              initial={{ scale: 0.8, opacity: 0, y: 60, rotateX: 5 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 28, stiffness: 200 }}
            >
              {/* Close bar */}
              <div
                className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b border-border/20 rounded-t-3xl"
                style={{ background: "hsl(var(--card) / 0.85)", backdropFilter: "blur(16px)" }}
              >
                <span className="text-[10px] font-exo text-muted-foreground tracking-widest uppercase">
                  {sections.find((s) => s.id === activeSection)?.label[language]}
                </span>
                <motion.button
                  onClick={handleClose}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="pb-8">
                <ActiveComponent />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <RecruiterChatbot />
    </div>
  );
};

export default Hub3DScene;
