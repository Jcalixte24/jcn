import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mouse, Smartphone, Rocket, ArrowDown, Hand } from "lucide-react";

interface IntroOverlayProps {
  visible: boolean;
  mobile: boolean;
  onDismiss: () => void;
}

const IntroOverlay = ({ visible, mobile, onDismiss }: IntroOverlayProps) => {
  const { language } = useLanguage();

  const controls = mobile
    ? [
        {
          icon: <Hand className="w-5 h-5" />,
          label: language === "fr" ? "Glissez vers le haut" : "Swipe up",
          desc: language === "fr" ? "Pour avancer dans l'espace" : "To fly forward through space",
        },
        {
          icon: <ArrowDown className="w-5 h-5" />,
          label: language === "fr" ? "Glissez vers le bas" : "Swipe down",
          desc: language === "fr" ? "Pour revenir en arrière" : "To fly backward",
        },
        {
          icon: <Smartphone className="w-5 h-5" />,
          label: language === "fr" ? "Touchez les cartes" : "Tap the cards",
          desc: language === "fr" ? "Pour explorer chaque section" : "To explore each section",
        },
      ]
    : [
        {
          icon: <Mouse className="w-5 h-5" />,
          label: language === "fr" ? "Molette / Scroll" : "Scroll / Wheel",
          desc: language === "fr" ? "Pilotez votre fusée dans l'espace" : "Pilot your rocket through space",
        },
        {
          icon: <Hand className="w-5 h-5" />,
          label: language === "fr" ? "Bougez la souris" : "Move your mouse",
          desc: language === "fr" ? "Inclinez le vaisseau (±20°)" : "Tilt the spacecraft (±20°)",
        },
        {
          icon: <Rocket className="w-5 h-5" />,
          label: language === "fr" ? "Cliquez les cartes" : "Click the cards",
          desc: language === "fr" ? "Pour explorer chaque section" : "To explore each section",
        },
      ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-6 px-6 py-8 max-w-sm mx-4 rounded-2xl border border-border/30"
            style={{
              background: "var(--gradient-card)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 0 80px hsl(var(--primary) / 0.1), var(--shadow-xl)",
            }}
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 30 }}
            transition={{ type: "spring", damping: 25 }}
          >
            {/* Title */}
            <div className="text-center">
              <motion.div
                className="text-3xl mb-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🚀
              </motion.div>
              <h2 className="text-sm md:text-base font-orbitron font-bold bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
                {language === "fr" ? "Bienvenue à bord" : "Welcome aboard"}
              </h2>
              <p className="text-[10px] md:text-xs text-muted-foreground font-exo mt-1.5 leading-relaxed max-w-[260px]">
                {language === "fr"
                  ? "Explorez mon portfolio comme un voyage spatial. Chaque section est une station sur votre parcours."
                  : "Explore my portfolio as a space journey. Each section is a station along your route."}
              </p>
            </div>

            {/* Controls */}
            <div className="w-full space-y-2.5">
              {controls.map((c, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/20 bg-card/30"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.12 }}
                >
                  <div className="flex-shrink-0 p-1.5 rounded-lg bg-primary/10 text-primary">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-exo font-semibold text-foreground">{c.label}</p>
                    <p className="text-[8px] md:text-[10px] text-muted-foreground font-exo">{c.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-1.5">
              {[
                language === "fr" ? "🗺️ Minimap" : "🗺️ Minimap",
                language === "fr" ? "🎛️ Cockpit HUD" : "🎛️ Cockpit HUD",
                language === "fr" ? "🤖 Chatbot IA" : "🤖 AI Chatbot",
                language === "fr" ? "🔊 Audio spatial" : "🔊 Spatial audio",
              ].map((f, i) => (
                <motion.span
                  key={i}
                  className="px-2 py-0.5 rounded-full text-[7px] md:text-[8px] font-exo text-muted-foreground border border-border/20 bg-card/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                >
                  {f}
                </motion.span>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              onClick={onDismiss}
              className="w-full py-2.5 rounded-xl text-xs font-orbitron font-bold tracking-wider uppercase transition-all"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
              }}
              whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsl(var(--primary) / 0.5)" }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {language === "fr" ? "🚀 Décollage" : "🚀 Launch"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroOverlay;
