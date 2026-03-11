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
import JourneyMinimap from "./JourneyMinimap";
import FarewellMessage from "./FarewellMessage";
import IntroOverlay from "./IntroOverlay";
import CockpitHUD from "./CockpitHUD";
import SpaceDecor from "./SpaceDecor";
import About from "../About";
import Experience from "../Experience";
import Education from "../Education";
import Projects from "../Projects";
import Skills from "../Skills";
import Hobbies from "../Hobbies";
import Contact from "../Contact";
import Events from "../Events";
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
  { id: "events",     label: { fr: "Événements", en: "Events" },      icon: "🏆", color: "hsl(45, 90%, 55%)",  position: [2.5, 0.2, -92] },
  { id: "contact",    label: { fr: "Contact", en: "Contact" },        icon: "✉️", color: "hsl(195, 90%, 55%)", position: [0, 0, -106] },
];

const MAX_DEPTH = -115;

const sectionComponents: Record<string, React.ComponentType> = {
  about: About, experience: Experience, education: Education,
  projects: Projects, skills: Skills, hobbies: Hobbies,
  events: Events, contact: Contact,
};

const Hub3DScene = () => {
  const { language, t } = useLanguage();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [warpActive, setWarpActive] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showFarewell, setShowFarewell] = useState(false);
  const [returnToStart, setReturnToStart] = useState(false);
  const cameraZRef = useRef(5);
  const [cameraZState, setCameraZState] = useState(5);
  const scrollSpeedRef = useRef(0);
  const [scrollSpeedState, setScrollSpeedState] = useState(0);

  const waypointZs = sections.map(s => s.position[2]);

  const { initAudio, updateScrollSpeed, toggleMute } = useSpaceAudio();

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
    // Update state at lower frequency for minimap
    setCameraZState(z);
    // Show farewell near end of journey
    setShowFarewell(z < MAX_DEPTH + 15);
  }, []);

  const handleScrollSpeed = useCallback((speed: number) => {
    scrollSpeedRef.current = speed;
    setScrollSpeedState(speed);
    updateScrollSpeed(speed);
  }, [updateScrollSpeed]);

  const handleWarpComplete = useCallback(() => {
    setWarpActive(false);
    // Don't set introComplete until user dismisses intro overlay
  }, []);

  const handleIntroDismiss = useCallback(() => {
    setShowIntro(false);
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

  const ActiveComponent = activeSection ? sectionComponents[activeSection] : null;

  // Get active section color for panel accent
  const activeSectionData = sections.find((s) => s.id === activeSection);

  return (
    <div id="hub3d-container" className="relative w-full h-screen overflow-hidden bg-background touch-none">
      {/* Warp intro overlay */}
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

      {/* Intro Overlay */}
      {!warpActive && showIntro && (
        <IntroOverlay visible={true} mobile={isMobile} onDismiss={handleIntroDismiss} />
      )}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: activeSection ? 0.08 : 1,
          scale: activeSection ? 1.15 : 1,
          filter: transitioning ? "blur(20px)" : "blur(0px)",
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
              disabled={!!activeSection}
              warpActive={warpActive}
              returnToStart={returnToStart}
              onReturnComplete={() => setReturnToStart(false)}
              waypointZs={waypointZs}
            />

            <WarpIntro active={warpActive} onComplete={handleWarpComplete} mobile={isMobile} />
            <WireframeSphere mobile={isMobile} />
            <MouseTrail mobile={isMobile} />
            <SpaceDecor mobile={isMobile} />

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

      {/* Cockpit HUD */}
      {!activeSection && introComplete && (
        <CockpitHUD
          cameraZ={cameraZState}
          scrollSpeed={scrollSpeedState}
          maxDepth={MAX_DEPTH}
          visible={true}
        />
      )}

      {/* Journey Minimap (desktop) */}
      {!activeSection && introComplete && (
        <JourneyMinimap
          sections={sections.map((s) => ({
            id: s.id,
            label: s.label,
            icon: s.icon,
            color: s.color,
            z: s.position[2],
          }))}
          cameraZ={cameraZState}
          maxDepth={MAX_DEPTH}
          onNavigate={handleSelect}
        />
      )}

      {/* Progress dots (right side, mobile-friendly) */}
      {!activeSection && introComplete && (
        <div className="fixed right-3 top-1/2 -translate-y-1/2 z-30 flex md:hidden flex-col items-center gap-1.5">
          {sections.map((s) => {
            const dist = Math.abs(cameraZState - s.position[2]);
            const isActive = dist < 6;
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
              </div>
            );
          })}
        </div>
      )}

      {/* Farewell Message */}
      <AnimatePresence>
        {showFarewell && !activeSection && introComplete && (
          <FarewellMessage visible={true} onReturnToStart={() => setReturnToStart(true)} />
        )}
      </AnimatePresence>

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
        {!activeSection && introComplete && !showFarewell && (
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

      {/* ── Immersive zoom portal flash ── */}
      <AnimatePresence>
        {transitioning && activeSection === null && (
          <motion.div
            className="fixed inset-0 z-[60] pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.8, 3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: `radial-gradient(circle, ${activeSectionData?.color ?? "hsl(var(--primary))"} 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Section Content Overlay ── */}
      <AnimatePresence mode="wait">
        {activeSection && ActiveComponent && (
          <motion.div
            key={activeSection}
            className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 backdrop-blur-2xl"
              style={{ background: "hsl(var(--background) / 0.82)" }}
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Immersive glow burst behind card */}
            <motion.div
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.25, 0.1], scale: [0.3, 1.4, 1] }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="w-[600px] h-[600px] rounded-full blur-3xl"
                style={{ background: activeSectionData?.color ?? "hsl(var(--primary))", opacity: 0.18 }}
              />
            </motion.div>

            {/* Panel */}
            <motion.div
              className="relative z-10 w-full max-w-4xl flex flex-col rounded-xl md:rounded-2xl border overflow-hidden"
              style={{
                height: "min(92vh, 780px)",
                borderColor: activeSectionData?.color
                  ? activeSectionData.color.replace(")", " / 0.3)")
                  : "hsl(var(--border) / 0.3)",
                background: "var(--gradient-card)",
                backdropFilter: "blur(28px)",
                boxShadow: activeSectionData
                  ? `0 0 80px ${activeSectionData.color.replace(")", " / 0.15)")}, 0 0 200px ${activeSectionData.color.replace(")", " / 0.06)")}, var(--shadow-xl), inset 0 1px 0 hsl(0 0% 100% / 0.06)`
                  : "var(--shadow-xl)",
              }}
              initial={{ scale: 0.6, opacity: 0, y: 80, rotateX: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.75, opacity: 0, y: 60, rotateX: -8 }}
              transition={{ type: "spring", damping: 24, stiffness: 180 }}
            >
              {/* ── Header ── */}
              <div
                className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-border/20"
                style={{ background: "hsl(var(--card) / 0.95)", backdropFilter: "blur(16px)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{activeSectionData?.icon}</span>
                  <span
                    className="text-[9px] font-exo tracking-widest uppercase font-bold"
                    style={{ color: activeSectionData?.color }}
                  >
                    {activeSectionData?.label[language]}
                  </span>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </div>

              {/* ── Scrollable content ── */}
              <div
                className="flex-1 overflow-y-auto cosmic-scrollbar overscroll-contain"
                style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
                onWheel={(e) => { e.stopPropagation(); }}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="pb-16">
                  <ActiveComponent />
                </div>
              </div>

              {/* ── Bottom fade ── */}
              <div
                className="absolute left-0 right-0 h-16 pointer-events-none"
                style={{
                  bottom: "48px",
                  background: "linear-gradient(to top, hsl(var(--card)), transparent)",
                }}
              />

              {/* ══════════════════════════════════════════
                  HUB — section navigation bar at bottom
              ══════════════════════════════════════════ */}
              <div
                className="flex-shrink-0 border-t border-border/20 px-2 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar"
                style={{ background: "hsl(var(--card) / 0.95)", backdropFilter: "blur(16px)" }}
              >
                {sections.map((s) => {
                  const isActive = s.id === activeSection;
                  return (
                    <motion.button
                      key={s.id}
                      onClick={() => {
                        if (!isActive) handleSelect(s.id);
                      }}
                      className="flex-shrink-0 flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-all duration-300 relative"
                      style={{
                        background: isActive
                          ? `${s.color.replace(")", " / 0.12)")}`
                          : "transparent",
                        minWidth: "44px",
                      }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      title={s.label[language]}
                    >
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-lg"
                          layoutId="hub-active-pill"
                          style={{
                            background: s.color.replace(")", " / 0.12)"),
                            boxShadow: `0 0 12px ${s.color.replace(")", " / 0.3)")}`,
                            border: `1px solid ${s.color.replace(")", " / 0.3)")}`,
                          }}
                          transition={{ type: "spring", damping: 22, stiffness: 260 }}
                        />
                      )}
                      <span
                        className="text-sm relative z-10"
                        style={{ filter: isActive ? "drop-shadow(0 0 4px currentColor)" : "none" }}
                      >
                        {s.icon}
                      </span>
                      <span
                        className="text-[7px] font-exo tracking-wide uppercase relative z-10 leading-none"
                        style={{
                          color: isActive ? s.color : "hsl(var(--muted-foreground))",
                          fontWeight: isActive ? 700 : 400,
                        }}
                      >
                        {s.label[language].length > 6
                          ? s.label[language].slice(0, 5) + "…"
                          : s.label[language]}
                      </span>
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ background: s.color }}
                          layoutId="hub-dot"
                        />
                      )}
                    </motion.button>
                  );
                })}
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
