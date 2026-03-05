import { Suspense, useState, useCallback, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSpaceAudio } from "@/hooks/useSpaceAudio";
import WireframeSphere from "./WireframeSphere";
import SpaceEnvironment from "./SpaceEnvironment";
import SectionWaypoint from "./SectionWaypoint";
import ScrollCamera from "./ScrollCamera";
import WarpIntro from "./WarpIntro";
import MouseTrail from "./MouseTrail";
import About from "../About";
import Experience from "../Experience";
import Education from "../Education";
import Projects from "../Projects";
import Skills from "../Skills";
import Hobbies from "../Hobbies";
import Contact from "../Contact";
import { Link } from "react-router-dom";
import { FileText, Map, X, ChevronDown, Volume2, VolumeX } from "lucide-react";
import LanguageSwitch from "../LanguageSwitch";
import { RecruiterChatbot } from "../RecruiterChatbot";
import profileImg from "@/assets/japhet-profile-pro.jpg";

interface SectionNode {
  id: string;
  label: { fr: string; en: string };
  icon: string;
  color: string;
  position: [number, number, number];
}

const sections: SectionNode[] = [
  { id: "about",      label: { fr: "À Propos", en: "About" },        icon: "👤", color: "hsl(260, 60%, 65%)", position: [2.5, 0.5, -8] },
  { id: "experience", label: { fr: "Expériences", en: "Experience" }, icon: "💼", color: "hsl(150, 70%, 50%)", position: [-2.8, -0.3, -22] },
  { id: "education",  label: { fr: "Formation", en: "Education" },    icon: "🎓", color: "hsl(40, 95%, 60%)",  position: [3, 0.8, -36] },
  { id: "projects",   label: { fr: "Projets", en: "Projects" },       icon: "🚀", color: "hsl(0, 80%, 60%)",   position: [-2.5, -0.5, -50] },
  { id: "skills",     label: { fr: "Compétences", en: "Skills" },     icon: "⚡", color: "hsl(280, 70%, 60%)", position: [2.2, 0.3, -64] },
  { id: "hobbies",    label: { fr: "Passions", en: "Hobbies" },       icon: "🎮", color: "hsl(320, 70%, 60%)", position: [-2, -0.6, -78] },
  { id: "contact",    label: { fr: "Contact", en: "Contact" },        icon: "✉️", color: "hsl(195, 90%, 55%)", position: [0, 0, -92] },
];

const MAX_DEPTH = -100;

const sectionComponents: Record<string, React.ComponentType> = {
  about: About, experience: Experience, education: Education,
  projects: Projects, skills: Skills, hobbies: Hobbies, contact: Contact,
};

const Hub3DScene = () => {
  const { language, t } = useLanguage();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [warpActive, setWarpActive] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const cameraZRef = useRef(5);
  const scrollSpeedRef = useRef(0);

  const { initAudio, updateScrollSpeed, toggleMute } = useSpaceAudio();

  // Start audio on first user interaction
  useEffect(() => {
    const start = () => {
      if (!audioStarted) {
        initAudio();
        setAudioStarted(true);
      }
    };
    window.addEventListener("click", start, { once: true });
    window.addEventListener("wheel", start, { once: true });
    window.addEventListener("touchstart", start, { once: true });
    return () => {
      window.removeEventListener("click", start);
      window.removeEventListener("wheel", start);
      window.removeEventListener("touchstart", start);
    };
  }, [audioStarted, initAudio]);

  const handleCameraZ = useCallback((z: number) => {
    cameraZRef.current = z;
  }, []);

  const handleScrollSpeed = useCallback((speed: number) => {
    scrollSpeedRef.current = speed;
    updateScrollSpeed(speed);
  }, [updateScrollSpeed]);

  const handleWarpComplete = useCallback(() => {
    setWarpActive(false);
    setIntroComplete(true);
  }, []);

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

  const handleToggleMute = useCallback(() => {
    const nowMuted = toggleMute();
    setMuted(!!nowMuted);
  }, [toggleMute]);

  const progress = Math.max(0, Math.min(1, (5 - cameraZRef.current) / (5 - MAX_DEPTH + 5)));
  const ActiveComponent = activeSection ? sectionComponents[activeSection] : null;

  return (
    <div id="hub3d-container" className="relative w-full h-screen overflow-hidden bg-background touch-none">
      {/* Warp intro overlay flash */}
      <AnimatePresence>
        {warpActive && (
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none"
            style={{ background: "radial-gradient(circle, transparent 30%, hsl(230 25% 3%) 100%)" }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: activeSection ? 0.1 : 1,
          scale: activeSection ? 1.1 : 1,
          filter: transitioning ? "blur(16px)" : "blur(0px)",
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Canvas
          camera={{ position: [0, 0.3, 5], fov: isMobile ? 65 : 55 }}
          gl={{ antialias: !isMobile, alpha: true, powerPreference: isMobile ? "low-power" : "high-performance" }}
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          frameloop={activeSection ? "demand" : "always"}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.08} />
            <fog attach="fog" args={["hsl(230, 25%, 3%)", 8, 40]} />

            <ScrollCamera
              mobile={isMobile}
              onCameraZ={handleCameraZ}
              onScrollSpeed={handleScrollSpeed}
              maxDepth={MAX_DEPTH}
              autoScroll={introComplete && !activeSection}
              warpActive={warpActive}
            />

            <WarpIntro active={warpActive} onComplete={handleWarpComplete} mobile={isMobile} />
            <WireframeSphere mobile={isMobile} />

            <SpaceEnvironment
              mobile={isMobile}
              scrollSpeed={scrollSpeedRef.current}
              cameraZ={cameraZRef.current}
            />

            {sections.map((section) => (
              <SectionWaypoint
                key={section.id}
                id={section.id}
                label={section.label[language]}
                icon={section.icon}
                color={section.color}
                position={section.position}
                cameraZ={cameraZRef.current}
                onSelect={handleSelect}
                mobile={isMobile}
              />
            ))}
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Progress indicator */}
      {!activeSection && introComplete && (
        <div className="fixed right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1">
          {sections.map((s) => {
            const sectionProgress = (5 - s.position[2]) / (5 - MAX_DEPTH + 5);
            const isActive = Math.abs(progress - sectionProgress) < 0.05;
            return (
              <div key={s.id} className="group relative flex items-center">
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    background: isActive ? s.color : "hsl(var(--muted-foreground) / 0.3)",
                    boxShadow: isActive ? `0 0 8px ${s.color}` : "none",
                    transform: `scale(${isActive ? 1.5 : 1})`,
                  }}
                />
                <span
                  className="absolute right-4 text-[8px] font-exo tracking-wider uppercase whitespace-nowrap transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{ color: s.color }}
                >
                  {s.label[language]}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Top Nav */}
      <AnimatePresence>
        {!activeSection && introComplete && (
          <motion.header
            className="absolute top-0 left-0 right-0 z-40"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
              <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
                <div className="relative">
                  <img src={profileImg} alt="JCN" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-primary/30" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background" style={{ background: "hsl(150, 70%, 50%)" }} />
                </div>
                <div>
                  <h1 className="text-xs md:text-sm font-orbitron font-bold">
                    <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
                      Japhet Calixte
                    </span>
                  </h1>
                  <p className="text-[8px] md:text-[10px] text-muted-foreground font-exo tracking-wider">
                    Junior Data Analyst
                  </p>
                </div>
              </motion.div>

              <div className="hidden md:flex items-center gap-1.5">
                {[
                  { to: "/constellation", icon: <Map className="w-3 h-3" />, label: "Constellation" },
                  { to: "/cv", icon: <FileText className="w-3 h-3" />, label: t("nav.cv") },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-exo text-muted-foreground hover:text-foreground transition-all duration-300 backdrop-blur-xl bg-card/30 border border-border/30 hover:border-primary/30 hover:shadow-glow"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}

                {/* Mute toggle */}
                <button
                  onClick={handleToggleMute}
                  className="p-1.5 rounded-lg backdrop-blur-xl bg-card/30 border border-border/30 text-muted-foreground hover:text-foreground transition-all"
                  title={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>

                <div className="ml-1 backdrop-blur-xl bg-card/30 border border-border/30 rounded-lg px-2 py-1">
                  <LanguageSwitch />
                </div>
              </div>

              <div className="flex md:hidden items-center gap-1.5">
                <button
                  onClick={handleToggleMute}
                  className="p-1.5 rounded-lg backdrop-blur-xl bg-card/30 border border-border/30 text-muted-foreground"
                >
                  {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-lg px-2 py-1">
                  <LanguageSwitch />
                </div>
                <motion.button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1.5 rounded-lg backdrop-blur-xl bg-card/30 border border-border/30 text-muted-foreground"
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
                      {menuOpen ? <X className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className="md:hidden mx-3 mb-2 rounded-xl backdrop-blur-2xl bg-card/60 border border-border/30 overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="p-2 space-y-0.5">
                    {sections.map((s, i) => (
                      <motion.button
                        key={s.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[10px] font-exo text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all"
                        onClick={() => { handleSelect(s.id); setMenuOpen(false); }}
                      >
                        <span className="text-sm">{s.icon}</span>
                        <span className="tracking-wider uppercase">{s.label[language]}</span>
                      </motion.button>
                    ))}
                    <div className="h-px bg-border/30 my-1" />
                    <Link to="/constellation" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[10px] font-exo text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all" onClick={() => setMenuOpen(false)}>
                      <Map className="w-3.5 h-3.5" />
                      <span className="tracking-wider uppercase">Constellation</span>
                    </Link>
                    <Link to="/cv" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[10px] font-exo text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all" onClick={() => setMenuOpen(false)}>
                      <FileText className="w-3.5 h-3.5" />
                      <span className="tracking-wider uppercase">{t("nav.cv")}</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Scroll Hint */}
      <AnimatePresence>
        {!activeSection && introComplete && (
          <motion.div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.div
              className="w-4 h-7 rounded-full border border-primary/30 flex items-start justify-center pt-1"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-0.5 h-1.5 rounded-full bg-primary/60"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </motion.div>
            <motion.p
              className="text-[9px] text-muted-foreground font-exo tracking-[0.15em] uppercase"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {language === "fr" ? "Scrollez pour voyager" : "Scroll to travel"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Content Overlay */}
      <AnimatePresence>
        {activeSection && ActiveComponent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-2xl"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative z-10 w-full max-w-4xl max-h-[88vh] overflow-y-auto cosmic-scrollbar rounded-2xl border border-border/30"
              style={{
                background: "var(--gradient-card)",
                backdropFilter: "blur(24px)",
                boxShadow: "var(--shadow-xl), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
              }}
              initial={{ scale: 0.8, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 28, stiffness: 200 }}
            >
              <div
                className="sticky top-0 z-20 flex items-center justify-between px-4 py-2.5 border-b border-border/20 rounded-t-2xl"
                style={{ background: "hsl(var(--card) / 0.85)", backdropFilter: "blur(16px)" }}
              >
                <span className="text-[9px] font-exo text-muted-foreground tracking-widest uppercase">
                  {sections.find((s) => s.id === activeSection)?.label[language]}
                </span>
                <motion.button
                  onClick={handleClose}
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-3.5 h-3.5" />
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
