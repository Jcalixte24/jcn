import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, ExternalLink, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const Education = () => {
  const { language, t } = useLanguage();

  const education = [
    {
      degree: { fr: "Programme Grande École - IA & Data Science", en: "Grande École Program - AI & Data Science" },
      institution: "IA Institut Paris by EPITA & ISG",
      location: { fr: "Kremlin-Bicêtre, France", en: "Kremlin-Bicêtre, France" },
      year: "2024 - Présent",
      description: {
        fr: "Formation d'excellence combinant expertise technique et vision business en IA et Data Science.",
        en: "Excellence program combining technical expertise and business vision in AI and Data Science."
      },
      highlights: {
        fr: ["Data Science & Data Engineering", "Machine Learning & Deep Learning", "Python, R, SQL, JavaScript"],
        en: ["Data Science & Data Engineering", "Machine Learning & Deep Learning", "Python, R, SQL, JavaScript"]
      },
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      degree: { fr: "Baccalauréat Général Français", en: "French General Baccalaureate" },
      institution: "Lycée International Jules Verne",
      location: { fr: "Abidjan, Côte d'Ivoire", en: "Abidjan, Ivory Coast" },
      year: "2024",
      description: {
        fr: "Mention Bien - Spécialités Mathématiques et Numérique & Sciences de l'Informatique (NSI).",
        en: "With Honors - Specializations in Mathematics and Digital & Computer Sciences (NSI)."
      },
      highlights: {
        fr: ["Mention Bien", "Spécialité Mathématiques", "Spécialité NSI"],
        en: ["With Honors", "Mathematics Specialization", "NSI Specialization"]
      },
      gradient: "from-emerald-500 to-teal-600"
    }
  ];

  const certifications = [
    {
      title: "Google Data Analytics Professional Certificate",
      organization: "Google (Coursera)",
      count: 8,
      year: "2025",
      skills: ["Data Analytics", "Data Cleaning", "Visualization", "R Programming", "Tableau"],
      link: "https://www.coursera.org/account/accomplishments/verify/RDXBALWLY24C",
      gradient: "from-red-500 to-orange-500"
    }
  ];

  const columbiaCertifications = [
    {
      title: { fr: "Introduction à la visualisation IA", en: "Introduction to AI Visualization" },
      badgeId: "6b080fba-688b-4d02-b8c5-637a815166e0",
      icon: "🎯"
    },
    {
      title: { fr: "Réseaux de neurones visuels", en: "Visual Neural Networks" },
      badgeId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      icon: "🧠"
    },
    {
      title: { fr: "Arbres de décision interactifs", en: "Interactive Decision Trees" },
      badgeId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      icon: "🌳"
    },
    {
      title: { fr: "Clustering et segmentation", en: "Clustering & Segmentation" },
      badgeId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
      icon: "📊"
    },
    {
      title: { fr: "Régression linéaire visualisée", en: "Visualized Linear Regression" },
      badgeId: "d4e5f6a7-b8c9-0123-def0-234567890123",
      icon: "📈"
    },
    {
      title: { fr: "Éthique de l'IA et données", en: "AI Ethics & Data" },
      badgeId: "e5f6a7b8-c9d0-1234-ef01-345678901234",
      icon: "⚖️"
    }
  ];

  return (
    <section id="education" className="py-24 bg-muted/30 relative overflow-hidden">
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
              {language === 'fr' ? 'Académique' : 'Academic'}
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('education.title')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto" />
          </motion.div>

          {/* Education Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${edu.gradient} shadow-lg`}>
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-xl font-bold">{edu.degree[language]}</h3>
                      </div>
                      <p className={`font-semibold bg-gradient-to-r ${edu.gradient} bg-clip-text text-transparent`}>
                        {edu.institution}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {edu.year}
                    </span>
                    <span>{edu.location[language]}</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{edu.description[language]}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {edu.highlights[language].map((h, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {h}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Certifications */}
          <motion.h3 
            className="text-2xl font-bold mb-8 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="w-8 h-1 bg-gradient-to-r from-accent to-primary rounded-full" />
            {t('education.certifications')}
          </motion.h3>
          
          {/* Google Certification */}
          <div className="grid md:grid-cols-1 gap-6 mb-10">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${cert.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{cert.title}</h4>
                        <Badge variant="secondary" className="text-xs">{cert.count}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{cert.organization} • {cert.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cert.skills.slice(0, 5).map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <a 
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {language === 'fr' ? 'Voir la certification' : 'View certification'}
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Columbia+ Badges */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Learning AI Through Visualization</h4>
                <p className="text-sm text-muted-foreground">Columbia+ • 2025</p>
              </div>
              <Badge variant="secondary" className="ml-auto">6 {language === 'fr' ? 'badges' : 'badges'}</Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {columbiaCertifications.map((badge, index) => (
                <motion.a
                  key={index}
                  href={`https://badges.plus.columbia.edu/${badge.badgeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className="p-4 h-full text-center hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 group-hover:from-purple-100 group-hover:to-pink-100 dark:group-hover:from-purple-900/40 dark:group-hover:to-pink-900/40">
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                      {badge.icon}
                    </div>
                    <p className="text-xs font-medium leading-tight text-muted-foreground group-hover:text-foreground transition-colors">
                      {badge.title[language]}
                    </p>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-3 h-3 mx-auto text-primary" />
                    </div>
                  </Card>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Education;
