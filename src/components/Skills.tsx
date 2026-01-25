import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Database, BarChart3, Brain, Globe2, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const Skills = () => {
  const { language, t } = useLanguage();

  const skillCategories = [
    {
      title: { fr: "Data Science & ML", en: "Data Science & ML" },
      icon: Brain,
      gradient: "from-purple-500 to-pink-500",
      skills: ["Scikit-learn", "TensorFlow", "OpenCV", "YOLO", "MediaPipe", "Pandas", "NumPy"]
    },
    {
      title: { fr: "Analyse & Visualisation", en: "Analysis & Visualization" },
      icon: BarChart3,
      gradient: "from-blue-500 to-cyan-500",
      skills: ["Python", "SQL", "Power BI", "Excel", "Tableau", "Matplotlib", "Seaborn"]
    },
    {
      title: { fr: "Développement Web", en: "Web Development" },
      icon: Code2,
      gradient: "from-emerald-500 to-teal-500",
      skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Java", "Bash", "C++"]
    },
    {
      title: { fr: "Bases de Données", en: "Databases" },
      icon: Database,
      gradient: "from-orange-500 to-red-500",
      skills: ["PostgreSQL", "MySQL", "Transact SQL", "Supabase", "Data Engineering"]
    },
    {
      title: { fr: "Outils DevOps", en: "DevOps Tools" },
      icon: Wrench,
      gradient: "from-slate-500 to-zinc-600",
      skills: ["Git", "GitHub", "Linux", "Docker", "Jupyter", "VS Code"]
    },
    {
      title: { fr: "Langues", en: "Languages" },
      icon: Globe2,
      gradient: "from-indigo-500 to-violet-500",
      skills: [
        language === 'fr' ? "Français (Natif)" : "French (Native)",
        language === 'fr' ? "Anglais (Intermédiaire)" : "English (Intermediate)"
      ]
    }
  ];

  const softSkills = {
    fr: [
      "Communication Efficace",
      "Travail d'Équipe", 
      "Résolution de Problèmes",
      "Adaptabilité",
      "Pensée Analytique",
      "Gestion du Temps",
      "Leadership",
      "Créativité"
    ],
    en: [
      "Effective Communication",
      "Teamwork",
      "Problem Solving",
      "Adaptability",
      "Analytical Thinking",
      "Time Management",
      "Leadership",
      "Creativity"
    ]
  };

  return (
    <section id="skills" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <motion.div 
        className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
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
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {language === 'fr' ? 'Expertise' : 'Expertise'}
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('skills.title')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto" />
          </motion.div>

          {/* Technical Skills */}
          <div className="mb-16">
            <motion.h3 
              className="text-2xl font-bold mb-8 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="w-8 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
              {t('skills.technical')}
            </motion.h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.title[language]}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-0 shadow-lg">
                      <div className="flex items-center gap-3 mb-5">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-lg">{category.title[language]}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, idx) => (
                          <motion.div
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + idx * 0.05 }}
                          >
                            <Badge 
                              variant="secondary" 
                              className="text-xs py-1 px-3 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                            >
                              {skill}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <motion.h3 
              className="text-2xl font-bold mb-8 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="w-8 h-1 bg-gradient-to-r from-accent to-primary rounded-full" />
              {t('skills.soft')}
            </motion.h3>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 border-0 shadow-lg">
                <div className="flex flex-wrap gap-3 justify-center">
                  {softSkills[language].map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: index * 0.08,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Badge 
                        variant="outline" 
                        className="text-sm py-2 px-5 hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white hover:border-transparent transition-all cursor-default"
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
