import { motion } from "framer-motion";
import { X } from "lucide-react";
import About from "./About";
import Experience from "./Experience";
import Education from "./Education";
import Projects from "./Projects";
import Skills from "./Skills";
import Hobbies from "./Hobbies";
import Contact from "./Contact";

interface SectionPanelProps {
  sectionId: string;
  onClose: () => void;
}

const sectionComponents: Record<string, React.ComponentType> = {
  about: About,
  experience: Experience,
  education: Education,
  projects: Projects,
  skills: Skills,
  hobbies: Hobbies,
  contact: Contact,
};

const SectionPanel = ({ sectionId, onClose }: SectionPanelProps) => {
  const SectionComponent = sectionComponents[sectionId];
  if (!SectionComponent) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-background/85 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 ml-auto w-full max-w-4xl h-full overflow-y-auto cosmic-scrollbar"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      >
        <div className="min-h-full glass-card border-l border-border/50" style={{ borderRadius: 0 }}>
          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="sticky top-4 left-4 z-20 ml-4 mt-4 p-2 rounded-full glass-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Content */}
          <div className="pb-12">
            <SectionComponent />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SectionPanel;
