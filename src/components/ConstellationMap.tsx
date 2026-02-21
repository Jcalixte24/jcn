import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, Unlock, User, Briefcase, GraduationCap, Rocket, Cpu, Mail, Gamepad2, X } from "lucide-react";
import profileImg from "@/assets/japhet-profile-pro.jpg";
import SectionPanel from "./SectionPanel";

export interface ConstellationNode {
  id: string;
  label: { fr: string; en: string };
  icon: React.ElementType;
  x: number; // percentage
  y: number; // percentage
  size: number; // planet size
  color: string; // hsl
  glowColor: string;
  orbitRings?: number;
  connectedTo: string[];
}

const nodes: ConstellationNode[] = [
  {
    id: "home",
    label: { fr: "Accueil", en: "Home" },
    icon: User,
    x: 50, y: 45,
    size: 70,
    color: "hsl(195, 100%, 55%)",
    glowColor: "195, 100%, 55%",
    orbitRings: 2,
    connectedTo: ["about"],
  },
  {
    id: "about",
    label: { fr: "À Propos", en: "About" },
    icon: User,
    x: 25, y: 25,
    size: 50,
    color: "hsl(260, 60%, 55%)",
    glowColor: "260, 60%, 55%",
    connectedTo: ["experience", "skills"],
  },
  {
    id: "experience",
    label: { fr: "Expériences", en: "Experience" },
    icon: Briefcase,
    x: 75, y: 20,
    size: 50,
    color: "hsl(150, 70%, 45%)",
    glowColor: "150, 70%, 45%",
    connectedTo: ["education"],
  },
  {
    id: "education",
    label: { fr: "Formation", en: "Education" },
    icon: GraduationCap,
    x: 80, y: 55,
    size: 45,
    color: "hsl(40, 95%, 55%)",
    glowColor: "40, 95%, 55%",
    connectedTo: ["projects"],
  },
  {
    id: "projects",
    label: { fr: "Projets", en: "Projects" },
    icon: Rocket,
    x: 65, y: 78,
    size: 55,
    color: "hsl(0, 80%, 55%)",
    glowColor: "0, 80%, 55%",
    connectedTo: ["hobbies"],
  },
  {
    id: "skills",
    label: { fr: "Compétences", en: "Skills" },
    icon: Cpu,
    x: 20, y: 60,
    size: 48,
    color: "hsl(280, 70%, 55%)",
    glowColor: "280, 70%, 55%",
    connectedTo: ["contact"],
  },
  {
    id: "hobbies",
    label: { fr: "Passions", en: "Hobbies" },
    icon: Gamepad2,
    x: 40, y: 80,
    size: 40,
    color: "hsl(320, 70%, 55%)",
    glowColor: "320, 70%, 55%",
    connectedTo: ["contact"],
  },
  {
    id: "contact",
    label: { fr: "Contact", en: "Contact" },
    icon: Mail,
    x: 15, y: 82,
    size: 45,
    color: "hsl(195, 90%, 50%)",
    glowColor: "195, 90%, 50%",
    connectedTo: [],
  },
];

// Unlock order
const unlockSequence = ["home", "about", "experience", "education", "projects", "skills", "hobbies", "contact"];

const ConstellationMap = () => {
  const { language } = useLanguage();
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
    
    // Unlock next nodes
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

  const getNextUnlockable = () => {
    return unlockSequence.find(id => !unlockedNodes.has(id));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Nebula background */}
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
            return (
              <motion.line
                key={`${node.id}-${targetId}`}
                x1={`${node.x}%`} y1={`${node.y}%`}
                x2={`${target.x}%`} y2={`${target.y}%`}
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

        return (
          <motion.div
            key={node.id}
            className="absolute z-20"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
          >
            {/* Orbit rings for home */}
            {isHome && (
              <>
                <motion.div
                  className="absolute rounded-full border border-primary/20"
                  style={{ width: 160, height: 160, left: -45, top: -45 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute rounded-full border border-primary/10"
                  style={{ width: 220, height: 220, left: -75, top: -75 }}
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
                  width: node.size * 2,
                  height: node.size * 2,
                  left: -(node.size / 2),
                  top: -(node.size / 2),
                  background: `radial-gradient(circle, hsl(${node.glowColor} / 0.3) 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Locked pulse for next unlockable */}
            {isNext && (
              <motion.div
                className="absolute rounded-full border-2 border-primary/40"
                style={{
                  width: node.size + 20,
                  height: node.size + 20,
                  left: -10,
                  top: -10,
                }}
                animate={{
                  scale: [1, 1.5],
                  opacity: [0.6, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Planet body */}
            <motion.button
              className="relative rounded-full flex items-center justify-center cursor-pointer focus:outline-none group"
              style={{
                width: node.size,
                height: node.size,
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
              animate={isHome ? { y: [0, -8, 0] } : undefined}
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
                <Icon className="w-1/3 h-1/3 text-foreground drop-shadow-lg" />
              ) : (
                <Lock className="w-1/3 h-1/3 text-muted-foreground/50" />
              )}
            </motion.button>

            {/* Label */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
              style={{ top: node.size + 8 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.15 + 0.5 }}
            >
              <span
                className={`text-xs font-orbitron font-medium tracking-wider uppercase ${
                  isUnlocked ? "text-foreground" : "text-muted-foreground/40"
                }`}
              >
                {node.label[language]}
              </span>
              {!isUnlocked && isNext && (
                <motion.span
                  className="block text-[10px] text-primary/60 mt-0.5"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {language === "fr" ? "Cliquez pour débloquer" : "Click to unlock"}
                </motion.span>
              )}
            </motion.div>
          </motion.div>
        );
      })}

      {/* Top bar with name + controls */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6 flex items-start justify-between">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-xl md:text-2xl font-orbitron font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Japhet Calixte N'DRI
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground font-exo">
            {language === "fr" ? "Junior Data Analyst • Explorez mon univers" : "Junior Data Analyst • Explore my universe"}
          </p>
        </motion.div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Progress */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-exo">
            <span className="text-primary font-semibold">{unlockedNodes.size}</span>
            <span className="text-muted-foreground">/ {nodes.length}</span>
            <span className="text-muted-foreground">
              {language === "fr" ? "débloqué" : "unlocked"}
            </span>
          </div>

          {unlockedNodes.size < nodes.length && (
            <motion.button
              onClick={handleUnlockAll}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-exo text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Unlock className="w-3 h-3" />
              {language === "fr" ? "Tout débloquer" : "Unlock all"}
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Bottom hint */}
      <AnimatePresence>
        {!activeNode && (
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1.5 }}
          >
            <motion.p
              className="text-sm text-muted-foreground font-exo text-center px-6 py-3 rounded-full glass-card"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {language === "fr"
                ? "🪐 Cliquez sur une planète pour explorer"
                : "🪐 Click a planet to explore"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Panel */}
      <AnimatePresence>
        {activeNode && activeNode !== "home" && (
          <SectionPanel
            sectionId={activeNode}
            onClose={() => setActiveNode(null)}
          />
        )}
      </AnimatePresence>

      {/* Home panel (profile) */}
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
              className="relative z-10 max-w-lg w-full glass-card rounded-2xl p-8 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <button
                onClick={() => setActiveNode(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={profileImg}
                alt="Japhet"
                className="w-28 h-28 rounded-full mx-auto mb-4 border-3 border-primary/40 shadow-glow"
              />
              <h2 className="text-2xl font-orbitron font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Japhet Calixte N'DRI
              </h2>
              <p className="text-muted-foreground font-exo mb-4">
                {language === "fr" ? "Junior Data Analyst" : "Junior Data Analyst"}
              </p>
              <p className="text-sm text-muted-foreground font-exo leading-relaxed">
                {language === "fr"
                  ? "Passionné par l'intelligence artificielle et la data science. Explorez les planètes pour découvrir mon parcours !"
                  : "Passionate about AI and data science. Explore the planets to discover my journey!"}
              </p>
              <div className="mt-6 flex justify-center gap-3">
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
                    className="px-4 py-2 rounded-lg glass-card text-xs font-exo text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
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
