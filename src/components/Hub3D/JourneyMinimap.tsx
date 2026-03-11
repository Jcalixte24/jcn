import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface MinimapSection {
  id: string;
  label: { fr: string; en: string };
  icon: string;
  color: string;
  z: number;
}

interface JourneyMinimapProps {
  sections: MinimapSection[];
  cameraZ: number;
  maxDepth: number;
  onNavigate?: (id: string) => void;
}

const JourneyMinimap = ({ sections, cameraZ, maxDepth, onNavigate }: JourneyMinimapProps) => {
  const { language } = useLanguage();
  const totalRange = 5 - maxDepth;

  return (
    <motion.div
      className="fixed left-3 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      {/* Rocket indicator */}
      <div className="relative h-[280px] w-8 flex flex-col items-center">
        {/* Track line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-border/30 rounded-full" />

        {/* Section markers */}
        {sections.map((s) => {
          const sProgress = (5 - s.z) / totalRange;
          const dist = Math.abs(cameraZ - s.z);
          const isActive = dist < 6;
          return (
            <button
              key={s.id}
              className="absolute left-1/2 -translate-x-1/2 group flex items-center z-10"
              style={{ top: `${sProgress * 100}%` }}
              onClick={() => onNavigate?.(s.id)}
              title={s.label[language]}
            >
              <div
                className="w-2.5 h-2.5 rounded-full transition-all duration-500 border-2"
                style={{
                  borderColor: isActive ? s.color : "hsl(var(--border))",
                  background: isActive ? s.color : "transparent",
                  boxShadow: isActive ? `0 0 10px ${s.color}` : "none",
                  transform: `scale(${isActive ? 1.3 : 1})`,
                }}
              />
              <span
                className="absolute left-6 text-[7px] font-exo tracking-wider uppercase whitespace-nowrap transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{ color: s.color }}
              >
                {s.label[language]}
              </span>
            </button>
          );
        })}

        {/* Rocket position */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-20"
          style={{ top: `${((5 - cameraZ) / totalRange) * 100}%` }}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="relative flex flex-col items-center">
            <span className="text-sm drop-shadow-[0_0_6px_rgba(0,200,255,0.6)]">🚀</span>
            {/* Thrust flame */}
            <motion.div
              className="w-1 rounded-full"
              style={{ background: "linear-gradient(to bottom, hsl(25, 90%, 55%), transparent)" }}
              animate={{ height: [4, 8, 4], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default JourneyMinimap;
