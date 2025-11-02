import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, ExternalLink } from "lucide-react";

const education = [
  {
    degree: "Programme Grande École - IA & Data Science",
    institution: "IA Institut Paris by EPITA & ISG",
    location: "Kremlin-Bicêtre, France",
    year: "2024 - Présent (2ème année)",
    description: "Formation d'excellence en intelligence artificielle, data science et data engineering.",
    highlights: [
      "Data Science, Data Analyse et Data Engineering",
      "Éthique, programmation avancée, mathématiques et économie",
      "Python, Bash, R, JavaScript",
      "Machine Learning et Data Visualisation",
      "Projets de datavisualisation appliqués"
    ],
    icon: GraduationCap
  },
  {
    degree: "Certificat Professionnel en Analyse Avancée de Données",
    institution: "Google (via Coursera)",
    location: "En ligne",
    year: "2025",
    description: "Formation en 9 modules axée sur la maîtrise de l'analyse de données avancée.",
    highlights: [
      "9 certifications Google obtenues",
      "Statistiques et Python avancés",
      "Visualisation avec Tableau",
      "Modélisation prédictive",
      "Machine Learning",
      "Communication d'insights"
    ],
    icon: Award
  },
  {
    degree: "Baccalauréat Général Français",
    institution: "Lycée International Jules Verne",
    location: "Abidjan, Côte d'Ivoire",
    year: "2024",
    description: "Diplôme avec mention Bien, spécialités Mathématiques et NSI.",
    highlights: [
      "Mention Bien",
      "Spécialité Mathématiques",
      "Spécialité Numérique et Sciences de l'Informatique (NSI)",
      "Expertise en programmation et algorithmique"
    ],
    icon: GraduationCap
  }
];

const certifications = [
  {
    title: "Learning AI Through Visualization",
    organization: "Columbia+",
    count: 6,
    year: "Juillet 2025",
    description: "Série complète de certifications en intelligence artificielle et visualisation de données.",
    skills: ["Python", "IA", "Data Visualization", "Machine Learning"],
    link: "https://badges.plus.columbia.edu/6b080fba-688b-4d02-b8c5-637a815166e0#acc.DpFOTCJ8"
  },
  {
    title: "Google Data Analytics Professional Certificate",
    organization: "Google (via Coursera)",
    count: 8,
    year: "Juin 2025",
    description: "Certification professionnelle complète en analyse de données avec Google.",
    skills: [
      "Présentation de données",
      "Business Analytics",
      "Data Cleaning",
      "Database Management",
      "R Programming",
      "tidyverse",
      "ggplot",
      "Data Ethics",
      "Interactive Data Visualization"
    ],
    link: "https://www.coursera.org/account/accomplishments/verify/RDXBALWLY24C"
  }
];

const additionalTraining = [
  {
    title: "Formation en Art Oratoire",
    organization: "AUDECA GROUP",
    year: "2023",
    description: "Formation avancée en communication persuasive et développement d'une éloquence impactante."
  }
];

const Education = () => {
  return (
    <section id="education" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Formation & Certifications
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
          </div>

          {/* Main Education */}
          <div className="space-y-8 mb-12">
            {education.map((edu, index) => {
              const Icon = edu.icon;
              return (
                <Card 
                  key={index} 
                  className="p-6 md:p-8 hover-lift glass-card animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-2xl font-semibold">{edu.degree}</h3>
                          <Badge className="flex-shrink-0">{edu.year}</Badge>
                        </div>
                        <p className="text-xl text-primary font-medium mb-1">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground mb-4">{edu.location}</p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {edu.description}
                        </p>

                        <ul className="space-y-2">
                          {edu.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                              <span className="text-primary mt-1">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Certifications */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Certifications Professionnelles</h3>
            <div className="grid gap-6">
              {certifications.map((cert, index) => (
                <Card 
                  key={index} 
                  className="p-6 hover-lift glass-card animate-fade-in"
                  style={{ animationDelay: `${(education.length + index) * 0.1}s` }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Award className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-xl font-semibold mb-2">
                            {cert.title}
                            {cert.count && <Badge variant="secondary" className="ml-2">{cert.count} certifications</Badge>}
                          </h4>
                          <p className="text-lg text-primary font-medium mb-1">{cert.organization}</p>
                          <p className="text-sm text-muted-foreground mb-3">{cert.year}</p>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {cert.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      {cert.link && (
                        <a 
                          href={cert.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:underline mt-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Voir la certification</span>
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Training */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Formations Complémentaires</h3>
            <div className="grid md:grid-cols-1 gap-4">
              {additionalTraining.map((training, index) => (
                <Card key={index} className="p-6 hover:shadow-card transition-smooth">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{training.title}</h4>
                      <p className="text-primary font-medium mb-2">{training.organization} - {training.year}</p>
                      <p className="text-muted-foreground text-sm">{training.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;