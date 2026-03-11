import { Card } from "@/components/ui/card";
import { Dumbbell, Trophy, Mic, Music, Gamepad2, Telescope } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const Hobbies = () => {
  const { language, t } = useLanguage();

  const hobbies = [
    {
      title: { fr: "Basketball", en: "Basketball" },
      description: {
        fr: "Pratique régulière du basketball, développant l'esprit d'équipe, la stratégie et l'endurance.",
        en: "Regular basketball practice, developing teamwork, strategy and endurance."
      },
      icon: Trophy,
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: { fr: "Baby-foot", en: "Foosball" },
      description: {
        fr: "Passionné de baby-foot, alliant réflexes, coordination et convivialité.",
        en: "Foosball enthusiast, combining reflexes, coordination and conviviality."
      },
      icon: Gamepad2,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: { fr: "Art Oratoire", en: "Public Speaking" },
      description: {
        fr: "Formé en art oratoire. Passion pour la prise de parole, le slam et la poésie.",
        en: "Trained in public speaking. Passion for speeches, slam poetry and poetry."
      },
      icon: Mic,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: { fr: "Musique", en: "Music" },
      description: {
        fr: "Intérêt pour la musique et les projets créatifs alliant technologie et expression.",
        en: "Interest in music and creative projects combining technology and expression."
      },
      icon: Music,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: { fr: "Football", en: "Football" },
      description: {
        fr: "Amateur de football, sport qui renforce l'esprit d'équipe et la compétitivité.",
        en: "Football enthusiast, a sport that builds teamwork and competitiveness."
      },
      icon: Dumbbell,
      gradient: "from-lime-500 to-green-600"
    },
    {
      title: { fr: "Astronomie", en: "Astronomy" },
      description: {
        fr: "Membre de l'Association Ivoirienne d'Astronomie. Certifié IASC pour la détection d'astéroïdes.",
        en: "Member of the Ivorian Astronomy Association. IASC certified for asteroid detection."
      },
      icon: Telescope,
      gradient: "from-indigo-500 to-violet-600"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span 
              className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {language === 'fr' ? 'Vie Personnelle' : 'Personal Life'}
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('hobbies.title')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('hobbies.subtitle')}</p>
          </motion.div>

          {/* Hobbies Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hobbies.map((hobby, index) => {
              const Icon = hobby.icon;
              return (
                <motion.div
                  key={hobby.title[language]}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-0 shadow-lg relative overflow-hidden">
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${hobby.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <div className="relative flex items-start gap-4">
                      <motion.div 
                        className={`p-4 rounded-xl bg-gradient-to-br ${hobby.gradient} shadow-lg flex-shrink-0`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold mb-2">{hobby.title[language]}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {hobby.description[language]}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Quote */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-primary/5 to-accent/5 max-w-3xl mx-auto">
              <blockquote className="text-xl md:text-2xl italic text-muted-foreground">
                {language === 'fr' 
                  ? "\"L'équilibre entre passion technologique et activités extra-scolaires forge un esprit créatif et résilient.\""
                  : "\"The balance between technological passion and extracurricular activities forges a creative and resilient mind.\""}
              </blockquote>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hobbies;
