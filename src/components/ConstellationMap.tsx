import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Briefcase, GraduationCap, Rocket, Cpu, Mail, Gamepad2, X, ChevronDown, Maximize2 } from "lucide-react";
import profileImg from "@/assets/japhet-profile-pro.jpg";
import SectionPanel from "./SectionPanel";
import { useIsMobile } from "@/hooks/use-mobile";

export interface ConstellationNode {
  id: string;
  label: { fr: string; en: string };
  icon: React.ElementType;
  x: number;
  y: number;
  mx: number;
  my: number;
  size: number;
  mobileSize: number;
  color: string;
  glowColor: string;
  orbitRings?: number;
  connectedTo: string[];
}

const nodes: ConstellationNode[] = [
  {
    id: "home", label: { fr: "Accueil", en: "Home" }, icon: User,
    x: 50, y: 42, mx: 50, my: 18, size: 70, mobileSize: 52,
    color: "hsl(195, 100%, 55%)", glowColor: "195, 100%, 55%", orbitRings: 2, connectedTo: ["about"],
  },
  {
    id: "about", label: { fr: "À Propos", en: "About" }, icon: User,
    x: 25, y: 22, mx: 22, my: 32, size: 50, mobileSize: 40,
    color: "hsl(260, 60%, 55%)", glowColor: "260, 60%, 55%", connectedTo: ["experience", "skills"],
  },
  {
    id: "experience", label: { fr: "Expériences", en: "Experience" }, icon: Briefcase,
    x: 75, y: 18, mx: 78, my: 32, size: 50, mobileSize: 40,
    color: "hsl(150, 70%, 45%)", glowColor: "150, 70%, 45%", connectedTo: ["education"],
  },
  {
    id: "education", label: { fr: "Formation", en: "Education" }, icon: GraduationCap,
    x: 82, y: 50, mx: 80, my: 50, size: 45, mobileSize: 38,
    color: "hsl(40, 95%, 55%)", glowColor: "40, 95%, 55%", connectedTo: ["projects"],
  },
  {
    id: "projects", label: { fr: "Projets", en: "Projects" }, icon: Rocket,
    x: 68, y: 76, mx: 65, my: 66, size: 55, mobileSize: 42,
    color: "hsl(0, 80%, 55%)", glowColor: "0, 80%, 55%", connectedTo: ["hobbies"],
  },
  {
    id: "skills", label: { fr: "Compétences", en: "Skills" }, icon: Cpu,
    x: 18, y: 55, mx: 20, my: 50, size: 48, mobileSize: 38,
    color: "hsl(280, 70%, 55%)", glowColor: "280, 70%, 55%", connectedTo: ["contact"],
  },
  {
    id: "hobbies", label: { fr: "Passions", en: "Hobbies" }, icon: Gamepad2,
    x: 38, y: 78, mx: 35, my: 66, size: 40, mobileSize: 36,
    color: "hsl(320, 70%, 55%)", glowColor: "320, 70%, 55%", connectedTo: ["contact"],
  },
  {
    id: "contact", label: { fr: "Contact", en: "Contact" }, icon: Mail,
    x: 15, y: 80, mx: 20, my: 80, size: 45, mobileSize: 38,
    color: "hsl(195, 90%, 50%)", glowColor: "195, 90%, 50%", connectedTo: [],
  },
];

const journey = ["home", "about", "experience", "education", "projects", "skills", "hobbies", "contact"];

const ConstellationMap = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [overviewMode, setOverviewMode] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);

  const totalSteps = journey.length;

  // Check if content panel is scrolled to bottom
  const isContentAtBottom = useCallback(() => {
    const el = contentRef.current;
    if (!el) return true;
    return el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
  }, []);

  // Check if content panel is scrolled to top
  const isContentAtTop = useCallback(() => {
    const el = contentRef.current;
    if (!el) return true;
    return el.scrollTop <= 10;
  }, []);

  const scrollToStep = useCallback((step: number) => {
    if (isScrolling.current) return;
    const clamped = Math.max(0, Math.min(step, totalSteps));
    if (clamped === activeStep) return;

    isScrolling.current = true;
    setShowContent(false);
    setOverviewMode(false);
    setIsZooming(true);
    setActiveStep(clamped);

    setTimeout(() => {
      setIsZooming(false);
      if (clamped > 0) {
        setShowContent(true);
      }
      isScrolling.current = false;
    }, 900);
  }, [activeStep, totalSteps]);

  const jumpToNode = useCallback((nodeId: string) => {
    const stepIndex = journey.indexOf(nodeId) + 1;
    if (stepIndex > 0) {
      isScrolling.current = true;
      setOverviewMode(false);
      setShowContent(false);
      setIsZooming(true);
      setActiveStep(stepIndex);
      setTimeout(() => {
        setIsZooming(false);
        setShowContent(true);
        isScrolling.current = false;
      }, 900);
    }
  }, []);

  const goToOverview = useCallback(() => {
    setShowContent(false);
    setActiveStep(0);
    setOverviewMode(true);
  }, []);

  // Wheel handler - respects content scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;

      // If content is open, let user scroll inside it first
      if (showContent && contentRef.current) {
        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;

        // Only intercept if at boundary
        if (scrollingDown && !isContentAtBottom()) return;
        if (scrollingUp && !isContentAtTop()) return;
      }

      e.preventDefault();
      if (e.deltaY > 30) scrollToStep(activeStep + 1);
      else if (e.deltaY < -30) scrollToStep(activeStep - 1);
    };

    const el = containerRef.current;
    if (el) el.addEventListener("wheel", handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener("wheel", handleWheel); };
  }, [scrollToStep, activeStep, showContent, isContentAtBottom, isContentAtTop]);

  // Touch handler - respects content scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      const swipingDown = delta > 50;
      const swipingUp = delta < -50;

      if (showContent && contentRef.current) {
        if (swipingDown && !isContentAtBottom()) return;
        if (swipingUp && !isContentAtTop()) return;
      }

      if (swipingDown) scrollToStep(activeStep + 1);
      else if (swipingUp) scrollToStep(activeStep - 1);
    };
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollToStep, activeStep, showContent, isContentAtBottom, isContentAtTop]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        if (showContent && contentRef.current && !isContentAtBottom()) return;
        e.preventDefault();
        scrollToStep(activeStep + 1);
      }
      if (e.key === "ArrowUp") {
        if (showContent && contentRef.current && !isContentAtTop()) return;
        e.preventDefault();
        scrollToStep(activeStep - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [scrollToStep, activeStep, showContent, isContentAtBottom, isContentAtTop]);

  const getPos = (node: ConstellationNode) => ({
    x: isMobile ? node.mx : node.x,
    y: isMobile ? node.my : node.y,
  });
  const getSize = (node: ConstellationNode) => isMobile ? node.mobileSize : node.size;

  const getMapTransform = () => {
    if (activeStep === 0) return { scale: 1, x: 0, y: 0 };
    const nodeId = journey[activeStep - 1];
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { scale: 1, x: 0, y: 0 };
    const pos = getPos(node);
    const scale = isMobile ? 4 : 5;
    return { scale, x: (50 - pos.x) * scale, y: (50 - pos.y) * scale };
  };

  const transform = getMapTransform();
  const currentNodeId = activeStep > 0 ? journey[activeStep - 1] : null;
  const currentNode = currentNodeId ? nodes.find(n => n.id === currentNodeId) : null;

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 gradient-nebula opacity-60" />

      {/* Warp speed lines during zoom */}
      <AnimatePresence>
        {isZooming && (
          <motion.div className="absolute inset-0 z-[45] pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          >
            {/* Warp speed streaks */}
            {Array.from({ length: 50 }).map((_, i) => {
              const angle = (i / 50) * 360;
              const hue = 180 + Math.random() * 80;
              const len = 150 + Math.random() * 400;
              return (
                <motion.div key={i} className="absolute"
                  style={{
                    left: "50%", top: "50%", width: 1.5 + Math.random(), height: 0,
                    background: `linear-gradient(to bottom, transparent, hsla(${hue}, 80%, 70%, 0.7), transparent)`,
                    transformOrigin: "center top",
                    transform: `rotate(${angle}deg)`,
                  }}
                  animate={{ height: [0, len], opacity: [0, 0.9, 0] }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: Math.random() * 0.12 }}
                />
              );
            })}
            {/* Central flash */}
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div className="rounded-full"
                style={{ width: 10, height: 10, background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(180,220,255,0.4) 40%, transparent 70%)" }}
                animate={{ width: [10, 600], height: [10, 600], opacity: [1, 0] }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              />
            </motion.div>
            {/* Radial speed blur */}
            <motion.div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center, transparent 20%, hsl(var(--background) / 0.6) 100%)" }}
              animate={{ opacity: [0, 0.7, 0] }} transition={{ duration: 0.7 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lens flare on arrival */}
      <AnimatePresence>
        {activeStep > 0 && !isZooming && !overviewMode && currentNode && (
          <motion.div className="fixed inset-0 z-[16] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
          >
            {/* Anamorphic streak */}
            <motion.div className="absolute"
              style={{ width: "120vw", height: 1, background: `linear-gradient(90deg, transparent, hsl(${currentNode.glowColor} / 0.2), hsl(${currentNode.glowColor} / 0.4), hsl(${currentNode.glowColor} / 0.2), transparent)` }}
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: [0, 0.6, 0.3] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            {/* Glow orbs */}
            {[0.15, 0.25, 0.4].map((offset, i) => (
              <motion.div key={i} className="absolute rounded-full"
                style={{
                  width: 20 + i * 15, height: 20 + i * 15,
                  left: `${50 + (i - 1) * 12}%`, top: "50%",
                  background: `radial-gradient(circle, hsl(${currentNode.glowColor} / ${0.15 - i * 0.03}), transparent)`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: [0, offset, offset * 0.5] }}
                transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette effect when zoomed in */}
      <AnimatePresence>
        {activeStep > 0 && !overviewMode && (
          <motion.div className="absolute inset-0 z-[15] pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              background: "radial-gradient(ellipse at center, transparent 30%, hsl(var(--background) / 0.6) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Zoomable map */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{ scale: transform.scale, x: `${transform.x}%`, y: `${transform.y}%` }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "50% 50%" }}
      >
        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {nodes.map(node =>
            node.connectedTo.map(targetId => {
              const target = nodes.find(n => n.id === targetId);
              if (!target) return null;
              const p1 = getPos(node); const p2 = getPos(target);
              const isActive = currentNodeId === node.id || currentNodeId === targetId;
              return (
                <motion.line key={`${node.id}-${targetId}`}
                  x1={`${p1.x}%`} y1={`${p1.y}%`} x2={`${p2.x}%`} y2={`${p2.y}%`}
                  stroke={`hsl(${node.glowColor})`} strokeWidth={isActive ? 2.5 : 1.5}
                  opacity={isActive ? 0.8 : 0.4} filter="url(#glow)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />
              );
            })
          )}
        </svg>

        {nodes.map((node, index) => {
          const Icon = node.icon;
          const isHome = node.id === "home";
          const isActive = currentNodeId === node.id;
          const pos = getPos(node);
          const sz = getSize(node);
          return (
            <motion.div key={node.id}
              className={`absolute z-20 ${overviewMode ? "cursor-pointer" : ""}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              onClick={overviewMode ? () => jumpToNode(node.id) : undefined}
              whileHover={overviewMode ? { scale: 1.15 } : undefined}
            >
              <motion.div className="absolute rounded-full"
                style={{ width: sz * 2, height: sz * 2, left: -(sz / 2), top: -(sz / 2),
                  background: `radial-gradient(circle, hsl(${node.glowColor} / ${isActive ? 0.5 : 0.25}) 0%, transparent 70%)` }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              {isHome && !isMobile && (
                <motion.div className="absolute rounded-full border border-primary/20"
                  style={{ width: sz * 2.3, height: sz * 2.3, left: -(sz * 0.65), top: -(sz * 0.65) }}
                  animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
              )}
              {isActive && (
                <motion.div className="absolute rounded-full border-2"
                  style={{ width: sz + 20, height: sz + 20, left: -10, top: -10, borderColor: `hsl(${node.glowColor})` }}
                  animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <motion.div className="relative rounded-full flex items-center justify-center"
                style={{ width: sz, height: sz,
                  background: `radial-gradient(circle at 30% 30%, hsl(${node.glowColor} / 0.9), hsl(${node.glowColor} / 0.4))`,
                  boxShadow: `0 0 ${isActive ? 40 : 20}px hsl(${node.glowColor} / ${isActive ? 0.6 : 0.3}), inset 0 -3px 6px hsl(0 0% 0% / 0.3)` }}
              >
                {isHome ? (
                  <img src={profileImg} alt="Japhet" className="w-full h-full rounded-full object-cover border-2 border-primary/50" />
                ) : (
                  <Icon style={{ width: sz * 0.35, height: sz * 0.35 }} className="text-foreground drop-shadow-lg" />
                )}
              </motion.div>
              <motion.div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center" style={{ top: sz + 6 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 + 0.5 }}
              >
                <span className={`text-[10px] md:text-xs font-orbitron font-medium tracking-wider uppercase ${isActive ? "text-primary" : "text-foreground"}`}>
                  {node.label[language]}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Top bar */}
      <AnimatePresence>
        {activeStep === 0 && (
          <motion.div className="absolute top-0 left-0 right-0 z-30 p-3 md:p-6 flex items-start justify-between"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: 0.3 }}
          >
            <div>
              <h1 className="text-base md:text-2xl font-orbitron font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                JCN<span className="hidden md:inline"> — Japhet Calixte N'DRI</span>
              </h1>
              <p className="text-[10px] md:text-sm text-muted-foreground font-exo">
                {language === "fr" ? "Explorez mon univers" : "Explore my universe"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full glass-card text-[10px] md:text-xs font-exo">
              <span className="text-primary font-semibold">{activeStep}</span>
              <span className="text-muted-foreground">/ {totalSteps}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview button */}
      <AnimatePresence>
        {activeStep > 0 && !overviewMode && !showContent && (
          <motion.button
            className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full glass-card text-xs font-exo text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
            onClick={goToOverview}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <Maximize2 className="w-4 h-4" />
            <span>{language === "fr" ? "Vue d'ensemble" : "Overview"}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Overview mode label */}
      <AnimatePresence>
        {overviewMode && (
          <motion.div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          >
            <span className="text-sm md:text-base font-orbitron font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {language === "fr" ? "Sélectionnez une planète" : "Select a planet"}
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground font-exo">
              {language === "fr" ? "Cliquez pour explorer" : "Click to explore"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step dots */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
        {journey.map((nodeId, i) => {
          const node = nodes.find(n => n.id === nodeId)!;
          const stepIndex = i + 1;
          return (
            <button key={nodeId} onClick={() => scrollToStep(stepIndex)} className="group relative flex items-center justify-end">
              <span className="absolute right-5 whitespace-nowrap text-[10px] font-exo text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                {node.label[language]}
              </span>
              <motion.div className="rounded-full"
                style={{ width: activeStep === stepIndex ? 10 : 6, height: activeStep === stepIndex ? 10 : 6,
                  backgroundColor: activeStep === stepIndex ? `hsl(${node.glowColor})` : "hsl(var(--muted-foreground) / 0.3)",
                  boxShadow: activeStep === stepIndex ? `0 0 8px hsl(${node.glowColor} / 0.6)` : "none" }}
                animate={{ scale: activeStep === stepIndex ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 2, repeat: activeStep === stepIndex ? Infinity : 0 }}
              />
            </button>
          );
        })}
      </div>

      {/* Scroll hint */}
      <AnimatePresence>
        {activeStep === 0 && (
          <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ delay: 1.5 }}
          >
            <motion.p className="text-xs md:text-sm text-muted-foreground font-exo"
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity }}
            >
              {language === "fr" ? "Scrollez pour explorer" : "Scroll to explore"}
            </motion.p>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5 text-primary" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Scroll to continue" hint + overview shortcut on content */}
      <AnimatePresence>
        {showContent && currentNodeId && currentNodeId !== "home" && (
          <motion.div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <motion.p className="text-[10px] md:text-xs text-muted-foreground/70 font-exo px-3 py-1 rounded-full glass-card"
              animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity }}
            >
              {language === "fr" ? "↓ Scrollez pour continuer" : "↓ Scroll to continue"}
            </motion.p>
            <button onClick={goToOverview}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-card text-[10px] md:text-xs font-exo text-muted-foreground hover:text-primary transition-all"
            >
              <Maximize2 className="w-3 h-3" />
              <span>{language === "fr" ? "Vue d'ensemble" : "Overview"}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content overlay */}
      <AnimatePresence>
        {showContent && currentNode && currentNodeId !== "home" && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <SectionPanel ref={contentRef} sectionId={currentNodeId} onClose={() => setShowContent(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home content */}
      <AnimatePresence>
        {showContent && currentNodeId === "home" && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setShowContent(false)} />
            <motion.div className="relative z-10 max-w-md w-full glass-card rounded-2xl p-6 md:p-8 text-center"
              initial={{ scale: 0.8, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <button onClick={() => setShowContent(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                <X className="w-4 h-4" />
              </button>
              <div className="relative inline-block mb-4">
                <motion.div className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, hsl(195 100% 55% / 0.3) 0%, transparent 70%)` }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3, repeat: Infinity }}
                />
                <img src={profileImg} alt="Japhet" className="relative w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-primary/40 shadow-glow" />
              </div>
              <h2 className="text-xl md:text-2xl font-orbitron font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Japhet Calixte N'DRI
              </h2>
              <p className="text-sm text-muted-foreground font-exo mb-3">Junior Data Analyst</p>
              <p className="text-xs md:text-sm text-muted-foreground font-exo leading-relaxed mb-5">
                {language === "fr"
                  ? "Passionné par l'IA et la data science. Scrollez pour découvrir mon parcours !"
                  : "Passionate about AI and data science. Scroll to discover my journey!"}
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {[
                  { href: "https://github.com/Jcalixte24", label: "GitHub" },
                  { href: "https://www.linkedin.com/in/japhet-calixte-n'dri-0b73832a0", label: "LinkedIn" },
                  { href: "mailto:japhetndri15@gmail.com", label: "Email" },
                ].map(link => (
                  <a key={link.label} href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="px-3 py-1.5 rounded-lg glass-card text-xs font-exo text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConstellationMap;
