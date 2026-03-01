import { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import WireframeSphere from "./WireframeSphere";
import OrbitingPanel from "./OrbitingPanel";
import ParallaxCamera from "./ParallaxCamera";
import FloatingParticles from "./FloatingParticles";
import About from "../About";
import Experience from "../Experience";
import Education from "../Education";
import Projects from "../Projects";
import Skills from "../Skills";
import Hobbies from "../Hobbies";
import Contact from "../Contact";
import { Link } from "react-router-dom";
import { FileText, Map } from "lucide-react";
import LanguageSwitch from "../LanguageSwitch";
import { RecruiterChatbot } from "../RecruiterChatbot";
import profileImg from "@/assets/japhet-profile-pro.jpg";
import { X } from "lucide-react";

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
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const handleSelect = useCallback((id: string) => {
    setTransitioning(true);
    setTimeout(() => {
      setActiveSection(id);
      setTransitioning(false);
    }, 500);
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
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "hsl(230, 25%, 5%)" }}>
      {/* 3D Canvas */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: activeSection ? 0 : 1,
          scale: activeSection ? 1.1 : 1,
          filter: transitioning ? "blur(8px)" : "blur(0px)",
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Canvas
          camera={{ position: [0, 0.5, 8], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.15} />

            <ParallaxCamera />
            <WireframeSphere />
            <FloatingParticles count={250} />

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
              />
            ))}

            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Top overlay UI */}
      <AnimatePresence>
        {!activeSection && (
          <motion.div
            className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6 flex items-start justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <img
                src={profileImg}
                alt="JCN"
                className="w-10 h-10 rounded-full border border-white/10 object-cover"
              />
              <div>
                <h1 className="text-sm md:text-lg font-orbitron font-bold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(195,100%,55%)] to-[hsl(260,60%,65%)]">
                  Japhet Calixte N'DRI
                </h1>
                <p className="text-[10px] md:text-xs text-white/40 font-exo">
                  Junior Data Analyst
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/constellation"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-exo text-white/50 hover:text-white/80 transition-colors backdrop-blur-md bg-white/5 border border-white/10"
              >
                <Map className="w-3 h-3" />
                <span className="hidden md:inline">Constellation</span>
              </Link>
              <Link
                to="/cv"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-exo text-white/50 hover:text-white/80 transition-colors backdrop-blur-md bg-white/5 border border-white/10"
              >
                <FileText className="w-3 h-3" />
                <span className="hidden md:inline">{t("nav.cv")}</span>
              </Link>
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-2 py-1">
                <LanguageSwitch />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom hint */}
      <AnimatePresence>
        {!activeSection && (
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1.5 }}
          >
            <motion.p
              className="text-xs text-white/30 font-exo tracking-wider"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {language === "fr" ? "Survolez et cliquez pour explorer" : "Hover & click to explore"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section content overlay */}
      <AnimatePresence>
        {activeSection && ActiveComponent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Background */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "hsl(230, 25%, 5% / 0.85)", backdropFilter: "blur(12px)" }}
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto cosmic-scrollbar rounded-2xl border border-white/10"
              style={{
                background: "linear-gradient(145deg, hsl(230, 20%, 9% / 0.9), hsl(230, 25%, 12% / 0.9))",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 60px hsl(0 0% 0% / 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
              }}
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Close bar */}
              <div className="sticky top-0 z-20 flex items-center justify-end px-4 py-3 border-b border-white/5" style={{ background: "hsl(230, 20%, 9% / 0.8)", backdropFilter: "blur(12px)" }}>
                <motion.button
                  onClick={handleClose}
                  className="p-1.5 rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
                  whileHover={{ scale: 1.1 }}
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
