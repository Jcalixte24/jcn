import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, Unlock, User, Briefcase, GraduationCap, Rocket, Cpu, Mail, Gamepad2, X } from "lucide-react";
import profileImg from "@/assets/japhet-profile-pro.jpg";
import SectionPanel from "./SectionPanel";
import { useIsMobile } from "@/hooks/use-mobile";

export interface ConstellationNode {
  id: string;
  label: { fr: string; en: string };
  icon: React.ElementType;
  x: number;
  y: number;
  mx: number; // mobile x
  my: number; // mobile y
  size: number;
  mobileSize: number;
  color: string;
  glowColor: string;
  orbitRings?: number;
  connectedTo: string[];
}

const nodes: ConstellationNode[] = [
  {
    id: "home",
    label: { fr: "Accueil", en: "Home" },
    icon: User,
    x: 50, y: 42, mx: 50, my: 18,
    size: 70, mobileSize: 52,
    color: "hsl(195, 100%, 55%)",
    glowColor: "195, 100%, 55%",
    orbitRings: 2,
    connectedTo: ["about"],
  },
  {
    id: "about",
    label: { fr: "À Propos", en: "About" },
    icon: User,
    x: 25, y: 22, mx: 22, my: 32,
    size: 50, mobileSize: 40,
    color: "hsl(260, 60%, 55%)",
    glowColor: "260, 60%, 55%",
    connectedTo: ["experience", "skills"],
  },
  {
    id: "experience",
    label: { fr: "Expériences", en: "Experience" },
    icon: Briefcase,
    x: 75, y: 18, mx: 78, my: 32,
    size: 50, mobileSize: 40,
    color: "hsl(150, 70%, 45%)",
    glowColor: "150, 70%, 45%",
    connectedTo: ["education"],
  },
  {
    id: "education",
    label: { fr: "Formation", en: "Education" },
    icon: GraduationCap,
    x: 82, y: 50, mx: 80, my: 50,
    size: 45, mobileSize: 38,
    color: "hsl(40, 95%, 55%)",
    glowColor: "40, 95%, 55%",
    connectedTo: ["projects"],
  },
  {
    id: "projects",
    label: { fr: "Projets", en: "Projects" },
    icon: Rocket,
    x: 68, y: 76, mx: 65, my: 66,
    size: 55, mobileSize: 42,
    color: "hsl(0, 80%, 55%)",
    glowColor: "0, 80%, 55%",
    connectedTo: ["hobbies"],
  },
  {
    id: "skills",
    label: { fr: "Compétences", en: "Skills" },
    icon: Cpu,
    x: 18, y: 55, mx: 20, my: 50,
    size: 48, mobileSize: 38,
    color: "hsl(280, 70%, 55%)",
    glowColor: "280, 70%, 55%",
    connectedTo: ["contact"],
  },
  {
    id: "hobbies",
    label: { fr: "Passions", en: "Hobbies" },
    icon: Gamepad2,
    x: 38, y: 78, mx: 35, my: 66,
    size: 40, mobileSize: 36,
    color: "hsl(320, 70%, 55%)",
    glowColor: "320, 70%, 55%",
    connectedTo: ["contact"],
  },
  {
    id: "contact",
    label: { fr: "Contact", en: "Contact" },
    icon: Mail,
    x: 15, y: 80, mx: 20, my: 80,
    size: 45, mobileSize: 38,
    color: "hsl(195, 90%, 50%)",
    glowColor: "195, 90%, 50%",
    connectedTo: [],
  },
];

const unlockSequence = ["home", "about", "experience", "education", "projects", "skills", "hobbies", "contact"];

const ConstellationMap = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [unlockedNodes, setUnlockedNodes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("constellation-unlocked");
    return saved ? new Set(JSON.parse(saved)) : new Set(["home"]);
  });
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("constellation-unlocked", JSON.stringify([...unlockedNodes]));
  }, [unlockedNodes]);

  const handleNodeClick = useCallback((nodeId: string) => {
    if (!unlockedNodes.has(nodeId)) return;
    setActiveNode(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setUnlockedNodes(prev => {
        const next = new Set(prev);
        node.connectedTo.forEach(id => next.add(id));
        return next;
      });
    }
  }, [unlockedNodes]);

  const handleUnlockAll = () => {
    setUnlockedNodes(new Set(unlockSequence));
  };

  const getPos = (node: ConstellationNode) => ({
    x: isMobile ? node.mx : node.x,
    y: isMobile ? node.my : node.y,
  });

  const getSize = (node: ConstellationNode) => isMobile ? node.mobileSize : node.size;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 gradient-nebula opacity-60" />

      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {nodes.map(node =>
          node.connectedTo.map(targetId => {
            const target = nodes.find(n => n.id === targetId);
            if (!target) return null;
            const isUnlocked = unlockedNodes.has(node.id) && unlockedNodes.has(targetId);
            const isNextPath = unlockedNodes.has(node.id) && !unlockedNodes.has(targetId);
            const p1 = getPos(node);
            const p2 = getPos(target);
            return (
              <motion.line
                key={`${node.id}-${targetId}`}
                x1={`${p1.x}%`} y1={`${p1.y}%`}
                x2={`${p2.x}%`} y2={`${p2.y}%`}
                stroke={isUnlocked ? `hsl(${node.glowColor})` : isNextPath ? "hsl(195, 100%, 55%)" : "hsl(230, 20%, 20%)"}
                strokeWidth={isUnlocked ? 2 : 1}
                strokeDasharray={isUnlocked ? "none" : "8 4"}
                opacity={isUnlocked ? 0.6 : isNextPath ? 0.4 : 0.15}
                filter={isUnlocked ? "url(#glow)" : undefined}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            );
          })
        )}
      </svg>

      {/* Nodes */}
      {nodes.map((node, index) => {
        const Icon = node.icon;
        const isUnlocked = unlockedNodes.has(node.id);
        const isHome = node.id === "home";
        const isHovered = hoveredNode === node.id;
        const isNext = !isUnlocked && nodes.some(n => n.connectedTo.includes(node.id) && unlockedNodes.has(n.id));
        const pos = getPos(node);
        const sz = getSize(node);

        return (
          <motion.div
            key={node.id}
            className="absolute z-20"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.12, type: "spring", stiffness: 100 }}
          >
            {/* Orbit rings for home */}
            {isHome && !isMobile && (
              <>
                <motion.div
                  className="absolute rounded-full border border-primary/20"
                  style={{ width: sz * 2.3, height: sz * 2.3, left: -(sz * 0.65), top: -(sz * 0.65) }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute rounded-full border border-primary/10"
                  style={{ width: sz * 3.2, height: sz * 3.2, left: -(sz * 1.1), top: -(sz * 1.1) }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                />
              </>
            )}

            {/* Planet glow */}
            {isUnlocked && (
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: sz * 2,
                  height: sz * 2,
                  left: -(sz / 2),
                  top: -(sz / 2),
                  background: `radial-gradient(circle, hsl(${node.glowColor} / 0.3) 0%, transparent 70%)`,
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Locked pulse */}
            {isNext && (
              <motion.div
                className="absolute rounded-full border-2 border-primary/40"
                style={{
                  width: sz + 16,
                  height: sz + 16,
                  left: -8,
                  top: -8,
                }}
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Planet body */}
            <motion.button
              className="relative rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
              style={{
                width: sz,
                height: sz,
                background: isUnlocked
                  ? `radial-gradient(circle at 30% 30%, hsl(${node.glowColor} / 0.9), hsl(${node.glowColor} / 0.4))`
                  : "radial-gradient(circle at 30% 30%, hsl(230, 20%, 20%), hsl(230, 25%, 10%))",
                boxShadow: isUnlocked
                  ? `0 0 ${isHovered ? 40 : 20}px hsl(${node.glowColor} / ${isHovered ? 0.6 : 0.3}), inset 0 -3px 6px hsl(0 0% 0% / 0.3)`
                  : "inset 0 -3px 6px hsl(0 0% 0% / 0.5)",
              }}
              onClick={() => handleNodeClick(node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              whileHover={isUnlocked ? { scale: 1.15 } : { scale: 1.05 }}
              whileTap={isUnlocked ? { scale: 0.95 } : undefined}
              animate={isHome ? { y: [0, -6, 0] } : undefined}
              transition={isHome ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : undefined}
              disabled={!isUnlocked}
            >
              {isHome ? (
                <img
                  src={profileImg}
                  alt="Japhet"
                  className="w-full h-full rounded-full object-cover border-2 border-primary/50"
                />
              ) : isUnlocked ? (
                <Icon style={{ width: sz * 0.35, height: sz * 0.35 }} className="text-foreground drop-shadow-lg" />
              ) : (
                <Lock style={{ width: sz * 0.3, height: sz * 0.3 }} className="text-muted-foreground/50" />
              )}
            </motion.button>

            {/* Label */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
              style={{ top: sz + 6 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.12 + 0.5 }}
            >
              <span
                className={`text-[10px] md:text-xs font-orbitron font-medium tracking-wider uppercase ${
                  isUnlocked ? "text-foreground" : "text-muted-foreground/40"
                }`}
              >
                {node.label[language]}
              </span>
              {!isUnlocked && isNext && (
                <motion.span
                  className="block text-[8px] md:text-[10px] text-primary/60 mt-0.5"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {language === "fr" ? "Débloquer" : "Unlock"}
                </motion.span>
              )}
            </motion.div>
          </motion.div>
        );
      })}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 md:p-6 flex items-start justify-between">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-base md:text-2xl font-orbitron font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            JCN
            <span className="hidden md:inline"> — Japhet Calixte N'DRI</span>
          </h1>
          <p className="text-[10px] md:text-sm text-muted-foreground font-exo">
            {language === "fr" ? "Explorez mon univers" : "Explore my universe"}
          </p>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full glass-card text-[10px] md:text-xs font-exo">
            <span className="text-primary font-semibold">{unlockedNodes.size}</span>
            <span className="text-muted-foreground">/ {nodes.length}</span>
          </div>

          {unlockedNodes.size < nodes.length && (
            <motion.button
              onClick={handleUnlockAll}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full glass-card text-[10px] md:text-xs font-exo text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Unlock className="w-3 h-3" />
              <span className="hidden sm:inline">{language === "fr" ? "Tout débloquer" : "Unlock all"}</span>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Bottom hint */}
      <AnimatePresence>
        {!activeNode && (
          <motion.div
            className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1.5 }}
          >
            <motion.p
              className="text-xs md:text-sm text-muted-foreground font-exo text-center px-4 py-2 md:px-6 md:py-3 rounded-full glass-card"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {language === "fr"
                ? "🪐 Cliquez sur une planète"
                : "🪐 Click a planet"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Panel — centered modal */}
      <AnimatePresence>
        {activeNode && activeNode !== "home" && (
          <SectionPanel
            sectionId={activeNode}
            onClose={() => setActiveNode(null)}
          />
        )}
      </AnimatePresence>

      {/* Home panel (profile) — centered */}
      <AnimatePresence>
        {activeNode === "home" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setActiveNode(null)}
            />
            <motion.div
              className="relative z-10 max-w-md w-full glass-card rounded-2xl p-6 md:p-8 text-center"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <button
                onClick={() => setActiveNode(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative inline-block mb-4">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, hsl(195 100% 55% / 0.3) 0%, transparent 70%)` }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <img
                  src={profileImg}
                  alt="Japhet"
                  className="relative w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-primary/40 shadow-glow"
                />
              </div>
              <h2 className="text-xl md:text-2xl font-orbitron font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Japhet Calixte N'DRI
              </h2>
              <p className="text-sm text-muted-foreground font-exo mb-3">Junior Data Analyst</p>
              <p className="text-xs md:text-sm text-muted-foreground font-exo leading-relaxed mb-5">
                {language === "fr"
                  ? "Passionné par l'IA et la data science. Explorez les planètes pour découvrir mon parcours !"
                  : "Passionate about AI and data science. Explore the planets to discover my journey!"}
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {[
                  { href: "https://github.com/Jcalixte24", label: "GitHub" },
                  { href: "https://www.linkedin.com/in/japhet-calixte-n'dri-0b73832a0", label: "LinkedIn" },
                  { href: "mailto:japhetndri15@gmail.com", label: "Email" },
                ].map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="px-3 py-1.5 rounded-lg glass-card text-xs font-exo text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                  >
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
