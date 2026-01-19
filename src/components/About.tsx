import { Card } from "@/components/ui/card";
import { Target, Globe, Lightbulb, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const About = () => {
  const { t } = useLanguage();

  const cards = [
    { icon: Target, title: t('about.ambition'), desc: t('about.ambition.desc'), color: 'primary' },
    { icon: Globe, title: t('about.vision'), desc: t('about.vision.desc'), color: 'accent' },
    { icon: Lightbulb, title: t('about.innovation'), desc: t('about.innovation.desc'), color: 'primary' },
  ];

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('about.title')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-lg leading-relaxed text-muted-foreground">{t('about.description1')}</p>
              <p className="text-lg leading-relaxed text-muted-foreground">{t('about.description2')}</p>
              <p className="text-lg leading-relaxed text-muted-foreground">{t('about.description3')}</p>
              
              {/* Availability Badge */}
              <Card className="p-4 bg-primary/10 border-primary/30 inline-flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{t('about.availability')}</p>
                  <p className="text-primary font-bold">{t('about.availability.date')}</p>
                </div>
              </Card>
            </motion.div>

            <div className="space-y-4">
              {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-${card.color}/10 group-hover:bg-${card.color}/20 transition-colors`}>
                          <Icon className={`w-6 h-6 text-${card.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                          <p className="text-muted-foreground">{card.desc}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
