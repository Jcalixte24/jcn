import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Calendar, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface Experience {
  title: { fr: string; en: string };
  company: string;
  location: { fr: string; en: string };
  period: string;
  description: { fr: string; en: string };
  highlights: { fr: string[]; en: string[] };
  tags: string[];
  color: string;
}

const experiences: Experience[] = [
  {
    title: { fr: "Stage Junior Data Analyst", en: "Junior Data Analyst Intern" },
    company: "QuantCube Technology",
    location: { fr: "Paris, France", en: "Paris, France" },
    period: "Mai – Juin 2025",
    description: {
      fr: "Conception de tableaux de bord Power BI pour indicateurs macroéconomiques (PIB, CPI). Traitement de données de séries temporelles 2015-2025 via SQL.",
      en: "Designing Power BI dashboards for macroeconomic indicators (GDP, CPI). Processing time series data 2015-2025 via SQL."
    },
    highlights: {
      fr: [
        "Tableaux de bord Power BI pour KPIs macroéconomiques",
        "Traitement SQL de données temporelles sur 10 ans",
        "Collaboration avec équipes métiers pour visualisations"
      ],
      en: [
        "Power BI dashboards for macroeconomic KPIs",
        "SQL processing of 10-year time series data",
        "Collaboration with business teams for visualizations"
      ]
    },
    tags: ["PowerBI", "SQL", "Data Visualization", "Excel"],
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: { fr: "Développeur Web Freelance", en: "Freelance Web Developer" },
    company: "Myll Production",
    location: { fr: "Abidjan, Côte d'Ivoire · À distance", en: "Abidjan, Ivory Coast · Remote" },
    period: "Fév. 2023 – Fév. 2025",
    description: {
      fr: "Développement et maintenance de sites web responsives. Intégration de Google Analytics et optimisation SEO. Gestion autonome de la relation client.",
      en: "Development and maintenance of responsive websites. Google Analytics integration and SEO optimization. Autonomous client relationship management."
    },
    highlights: {
      fr: [
        "Sites web responsives et performants",
        "Intégration Google Analytics",
        "Optimisation SEO avancée",
        "Gestion client autonome"
      ],
      en: [
        "Responsive and performant websites",
        "Google Analytics integration",
        "Advanced SEO optimization",
        "Autonomous client management"
      ]
    },
    tags: ["Web Dev", "Analytics", "SEO", "Responsive"],
    color: "from-emerald-500 to-teal-600"
  }
];

const Experience = () => {
  const { language, t } = useLanguage();

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span 
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {language === 'fr' ? 'Parcours' : 'Journey'}
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('experience.title')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto" />
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary" />
            
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative mb-12 md:mb-16 ${
                  index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
                }`}
              >
                {/* Timeline dot */}
                <motion.div 
                  className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br ${exp.color} ring-4 ring-background z-10`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                />
                
                <div className={`ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                  <Card className="p-6 md:p-8 hover:shadow-xl transition-all duration-500 group border-0 shadow-lg">
                    {/* Header */}
                    <div className={`flex flex-col gap-4 mb-6 ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                      <div className={`flex items-center gap-3 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${exp.color}`}>
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div className={index % 2 === 0 ? 'md:text-right' : ''}>
                          <h3 className="text-xl font-bold">{exp.title[language]}</h3>
                          <p className={`text-lg font-semibold bg-gradient-to-r ${exp.color} bg-clip-text text-transparent`}>
                            {exp.company}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`flex flex-wrap gap-3 text-sm text-muted-foreground ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {exp.location[language]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {exp.period}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`text-muted-foreground mb-6 leading-relaxed ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      {exp.description[language]}
                    </p>

                    {/* Highlights */}
                    <ul className={`space-y-2 mb-6 ${index % 2 === 0 ? 'md:items-end' : ''}`}>
                      {exp.highlights[language].map((highlight, idx) => (
                        <motion.li 
                          key={idx} 
                          className={`flex items-start gap-2 text-muted-foreground ${index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''}`}
                          initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <ChevronRight className={`w-4 h-4 text-primary mt-1 flex-shrink-0 ${index % 2 === 0 ? 'md:rotate-180' : ''}`} />
                          <span>{highlight}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Tags */}
                    <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      {exp.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
