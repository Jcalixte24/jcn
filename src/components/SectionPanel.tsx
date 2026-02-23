import { forwardRef } from "react";
import { motion } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import About from "./About";
import Experience from "./Experience";
import Education from "./Education";
import Projects from "./Projects";
import Skills from "./Skills";
import Hobbies from "./Hobbies";
import Contact from "./Contact";
import { useLanguage } from "@/contexts/LanguageContext";

interface SectionPanelProps {
  sectionId: string;
  onClose: () => void;
}

const sectionMeta: Record<string, { icon: string; gradient: string }> = {
  about: { icon: "👤", gradient: "from-purple-500 to-indigo-600" },
  experience: { icon: "💼", gradient: "from-emerald-500 to-teal-600" },
  education: { icon: "🎓", gradient: "from-amber-500 to-orange-600" },
  projects: { icon: "🚀", gradient: "from-red-500 to-rose-600" },
  skills: { icon: "⚡", gradient: "from-violet-500 to-purple-600" },
  hobbies: { icon: "🎮", gradient: "from-pink-500 to-rose-500" },
  contact: { icon: "✉️", gradient: "from-cyan-500 to-blue-600" },
};

const sectionComponents: Record<string, React.ComponentType> = {
  about: About,
  experience: Experience,
  education: Education,
  projects: Projects,
  skills: Skills,
  hobbies: Hobbies,
  contact: Contact,
};

const SectionPanel = forwardRef<HTMLDivElement, SectionPanelProps>(({ sectionId, onClose }, ref) => {
  const { language } = useLanguage();
  const SectionComponent = sectionComponents[sectionId];
  const meta = sectionMeta[sectionId];
  if (!SectionComponent || !meta) return null;

  return (
    <motion.div
      ref={ref}
      className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto cosmic-scrollbar rounded-2xl glass-card border border-border/50"
      initial={{ scale: 0.85, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 40 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${meta.gradient} rounded-t-2xl`} />

      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-md border-b border-border/30">
        <motion.button onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all text-xs font-exo"
          whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{language === "fr" ? "Fermer" : "Close"}</span>
        </motion.button>
        <motion.button onClick={onClose}
          className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="pb-8">
        <SectionComponent />
      </div>
    </motion.div>
  );
});

SectionPanel.displayName = "SectionPanel";

export default SectionPanel;
