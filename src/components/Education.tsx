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
    },
    {
      title: "Learning AI Through Visualization",
      organization: "Columbia+",
      count: 6,
      year: "2025",
      skills: ["Python", "AI", "Data Visualization", "Machine Learning"],
      link: "https://badges.plus.columbia.edu/6b080fba-688b-4d02-b8c5-637a815166e0",
      gradient: "from-purple-500 to-pink-500"
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
          
          <div className="grid md:grid-cols-2 gap-6">
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
                    {cert.skills.slice(0, 4).map((skill, i) => (
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
        </div>
      </div>
    </section>
  );
};

export default Education;
