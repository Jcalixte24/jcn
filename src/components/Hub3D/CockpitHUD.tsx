import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface CockpitHUDProps {
  cameraZ: number;
  scrollSpeed: number;
  maxDepth: number;
  visible: boolean;
}

const CockpitHUD = ({ cameraZ, scrollSpeed, maxDepth, visible }: CockpitHUDProps) => {
  const { language } = useLanguage();

  // Derived metrics
  const altitude = Math.max(0, Math.round(Math.abs(cameraZ - 5) * 100));
  const speed = Math.abs(Math.round(scrollSpeed * 500));
  const progress = Math.min(100, Math.round(((5 - cameraZ) / (5 - maxDepth)) * 100));
  const heading = Math.round(180 + cameraZ * 3) % 360;

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-20 pointer-events-none select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
    >
      {/* Corner brackets - cockpit frame */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l border-t border-primary/20 rounded-tl-sm" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r border-t border-primary/20 rounded-tr-sm" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l border-b border-primary/20 rounded-bl-sm" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r border-b border-primary/20 rounded-br-sm" />

      {/* Top center - Heading compass */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-md backdrop-blur-sm bg-card/10 border border-border/10">
          <div className="flex gap-3 text-[9px] font-mono text-muted-foreground/60 tracking-wider">
            <span>{String((heading - 30 + 360) % 360).padStart(3, "0")}°</span>
            <span className="text-primary/80 font-bold text-[10px]">{String(heading).padStart(3, "0")}°</span>
            <span>{String((heading + 30) % 360).padStart(3, "0")}°</span>
          </div>
        </div>
        <div className="w-[1px] h-2 bg-primary/30 mt-0.5" />
        <span className="text-[7px] font-exo text-muted-foreground/40 tracking-widest uppercase mt-0.5">
          {language === "fr" ? "CAP" : "HDG"}
        </span>
      </div>

      {/* Left panel - Speed + Altitude */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4">
        {/* Speed gauge */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-10 h-24 rounded border border-border/15 backdrop-blur-sm bg-card/5 overflow-hidden">
            {/* Speed bar fill */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-b"
              style={{
                background: speed > 300
                  ? "linear-gradient(to top, hsl(0 80% 55% / 0.4), hsl(30 90% 55% / 0.2))"
                  : "linear-gradient(to top, hsl(195 90% 55% / 0.3), hsl(195 90% 55% / 0.05))",
              }}
              animate={{ height: `${Math.min(100, speed / 5)}%` }}
              transition={{ duration: 0.3 }}
            />
            {/* Tick marks */}
            {[0.25, 0.5, 0.75].map((p) => (
              <div
                key={p}
                className="absolute left-0 right-0 h-[1px] bg-border/10"
                style={{ bottom: `${p * 100}%` }}
              />
            ))}
            {/* Value */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-mono font-bold text-primary/80 drop-shadow-[0_0_4px_hsl(var(--primary)/0.3)]">
                {speed}
              </span>
            </div>
          </div>
          <span className="text-[6px] font-exo text-muted-foreground/40 tracking-[0.2em] uppercase">
            {language === "fr" ? "VIT" : "SPD"}
          </span>
        </div>

        {/* Altitude */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-10 h-24 rounded border border-border/15 backdrop-blur-sm bg-card/5 overflow-hidden">
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-b"
              style={{
                background: "linear-gradient(to top, hsl(260 60% 55% / 0.3), hsl(260 60% 55% / 0.05))",
              }}
              animate={{ height: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
            {[0.25, 0.5, 0.75].map((p) => (
              <div
                key={p}
                className="absolute left-0 right-0 h-[1px] bg-border/10"
                style={{ bottom: `${p * 100}%` }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-mono font-bold text-accent-foreground/70">
                {altitude}
              </span>
            </div>
          </div>
          <span className="text-[6px] font-exo text-muted-foreground/40 tracking-[0.2em] uppercase">ALT</span>
        </div>
      </div>

      {/* Right panel - Mission progress */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-1.5">
        <span className="text-[6px] font-exo text-muted-foreground/40 tracking-[0.2em] uppercase">
          {language === "fr" ? "MISSION" : "MISSION"}
        </span>
        <div className="relative w-1.5 h-28 rounded-full bg-border/10 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-full"
            style={{
              background: "linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary) / 0.2))",
            }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-[10px] font-mono font-bold text-primary/70">{progress}%</span>
      </div>

      {/* Bottom center - Status bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-6 px-5 py-1.5 rounded-md backdrop-blur-sm bg-card/5 border border-border/10">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/60 animate-pulse" />
          <span className="text-[7px] font-mono text-muted-foreground/50 tracking-wider">SYS OK</span>
        </div>
        <div className="w-[1px] h-3 bg-border/10" />
        <span className="text-[7px] font-mono text-muted-foreground/40 tracking-wider">
          Z: {Math.round(cameraZ * 10) / 10}
        </span>
        <div className="w-[1px] h-3 bg-border/10" />
        <span className="text-[7px] font-mono text-muted-foreground/40 tracking-wider">
          {language === "fr" ? "SECTEURS" : "SECTORS"}: 8
        </span>
      </div>

      {/* Crosshair center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-8 h-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary/15" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary/15" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-primary/15" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-primary/15" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full border border-primary/20" />
        </div>
      </div>

      {/* Mobile: minimal bottom bar */}
      <div className="absolute bottom-3 left-3 right-3 flex md:hidden items-center justify-between px-3 py-1 rounded-md backdrop-blur-sm bg-card/8 border border-border/10">
        <span className="text-[8px] font-mono text-primary/60">{speed} <span className="text-muted-foreground/40">SPD</span></span>
        <span className="text-[8px] font-mono text-muted-foreground/40">{progress}%</span>
        <span className="text-[8px] font-mono text-primary/60">{String(heading).padStart(3, "0")}°</span>
      </div>
    </motion.div>
  );
};

export default CockpitHUD;
