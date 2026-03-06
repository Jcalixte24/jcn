import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Rocket, Heart, ArrowUp } from "lucide-react";

interface FarewellMessageProps {
  visible: boolean;
}

const FarewellMessage = ({ visible }: FarewellMessageProps) => {
  const { language } = useLanguage();

  if (!visible) return null;

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 max-w-md text-center"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="rounded-2xl border border-border/30 px-6 py-5 backdrop-blur-2xl"
        style={{
          background: "linear-gradient(145deg, hsl(var(--card) / 0.8), hsl(var(--card) / 0.4))",
          boxShadow: "var(--shadow-glow), var(--shadow-xl)",
        }}
      >
        <motion.div
          className="flex items-center justify-center gap-2 mb-3"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Rocket className="w-5 h-5 text-primary" />
          <span className="text-lg">✨</span>
        </motion.div>

        <h3 className="font-orbitron text-sm md:text-base font-bold mb-2 bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
          {language === "fr" ? "Merci d'avoir voyagé !" : "Thanks for traveling!"}
        </h3>

        <p className="text-[10px] md:text-xs font-exo text-muted-foreground leading-relaxed mb-3">
          {language === "fr"
            ? "Vous avez exploré tout mon univers. J'espère que ce voyage vous a plu !"
            : "You've explored my entire universe. I hope you enjoyed the journey!"}
        </p>

        <div className="flex items-center justify-center gap-1 text-[9px] font-exo text-muted-foreground/60">
          <span>{language === "fr" ? "Fait avec" : "Made with"}</span>
          <Heart className="w-2.5 h-2.5 text-destructive fill-destructive" />
          <span>— Japhet Calixte</span>
        </div>

        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-3 flex items-center gap-1 mx-auto px-3 py-1 rounded-lg text-[9px] font-exo uppercase tracking-wider text-primary/80 hover:text-primary border border-primary/20 hover:border-primary/40 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUp className="w-3 h-3" />
          {language === "fr" ? "Retour au début" : "Back to top"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FarewellMessage;
