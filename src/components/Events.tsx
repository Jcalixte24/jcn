import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Trophy, Users, Code2, Sparkles } from "lucide-react";

interface Event {
  title: string;
  date: { fr: string; en: string };
  description: { fr: string; en: string };
  icon: React.ReactNode;
  color: string;
  highlight?: boolean;
}

const events: Event[] = [
  {
    title: "Nuit du Code",
    date: { fr: "2024", en: "2024" },
    description: {
      fr: "Compétition de programmation intensive de 6h. Développement d'un projet complet en équipe sous pression, mettant à l'épreuve créativité et compétences techniques.",
      en: "Intensive 6-hour programming competition. Full project development in a team under pressure, testing creativity and technical skills.",
    },
    icon: <Code2 className="w-5 h-5" />,
    color: "hsl(280, 70%, 60%)",
    highlight: true,
  },
  {
    title: "Happy Coders",
    date: { fr: "2024", en: "2024" },
    description: {
      fr: "Événement communautaire dédié au partage de connaissances et au networking entre développeurs passionnés. Ateliers pratiques et présentations inspirantes.",
      en: "Community event dedicated to knowledge sharing and networking among passionate developers. Hands-on workshops and inspiring presentations.",
    },
    icon: <Sparkles className="w-5 h-5" />,
    color: "hsl(40, 95%, 60%)",
    highlight: true,
  },
];

const Events = () => {
  const { language } = useLanguage();

  return (
    <section className="px-4 md:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg md:text-xl font-orbitron bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
            {language === "fr" ? "Événements" : "Events"}
          </h2>
        </div>
        <p className="text-xs text-muted-foreground font-exo max-w-md mx-auto">
          {language === "fr"
            ? "Les moments marquants de mon parcours tech"
            : "Key moments in my tech journey"}
        </p>
      </motion.div>

      <div className="grid gap-4 max-w-2xl mx-auto">
        {events.map((event, i) => (
          <motion.div
            key={event.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="group relative overflow-hidden rounded-xl border border-border/30 p-5"
            style={{
              background: "linear-gradient(145deg, hsl(var(--card)) 0%, hsl(var(--card) / 0.6) 100%)",
            }}
          >
            {/* Glow accent */}
            <div
              className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
              style={{ background: event.color }}
            />
            <div
              className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 0% 50%, ${event.color.replace(")", " / 0.08)")}, transparent 60%)`,
              }}
            />

            <div className="flex items-start gap-4 pl-3">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${event.color.replace(")", " / 0.15)")}`, color: event.color }}
              >
                {event.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-orbitron text-sm font-semibold" style={{ color: event.color }}>
                    {event.title}
                  </h3>
                  {event.highlight && (
                    <Trophy className="w-3.5 h-3.5" style={{ color: "hsl(40, 95%, 60%)" }} />
                  )}
                </div>
                <p className="text-[10px] font-exo text-muted-foreground uppercase tracking-wider mb-2">
                  {event.date[language]}
                </p>
                <p className="text-xs font-exo text-foreground/80 leading-relaxed">
                  {event.description[language]}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Events;
