import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Calendar } from "lucide-react";

const experiences = [
  {
    title: "Stage Junior Data Analyst",
    company: "QuantCube Technology",
    location: "Paris, France",
    period: "Mai 2025 - Juin 2025",
    description: "Création d'un dashboard de suivi des données de marchés et de données QuantCube à destination des Data Analystes et économistes.",
    highlights: [
      "Première expérience au sein d'une équipe",
      "Immersion dans la datavisualisation (PowerBI, Excel, SQL)",
      "Transformation des besoins métiers en visuels analytiques"
    ],
    tags: ["PowerBI", "Excel", "SQL", "Data Visualisation"]
  },
  {
    title: "Développeur Web",
    company: "Myll Production",
    location: "Abidjan, Côte d'Ivoire · À distance",
    period: "Février 2023 - Février 2025",
    description: "En tant que Développeur Web freelance pour Myll Production, je conçois et développe des solutions web adaptées à leurs besoins spécifiques.",
    highlights: [
      "Création de sites web responsives",
      "Intégration d'outils d'analyse (Google Analytics)",
      "Amélioration des performances web",
      "Accompagnement musical et communication digitale"
    ],
    tags: ["Développement web", "Web analytique", "Responsive Design", "Google Analytics"]
  },
  {
    title: "Membre Actif",
    company: "Association Ivoirienne d'Astronomie (AIA)",
    location: "Abidjan, Côte d'Ivoire",
    period: "Janvier 2024 - Septembre 2025",
    description: "Participation active à des projets de recherche panafricains sur Astronometrica.",
    highlights: [
      "Certifié par The International Astronomical Search Collaboration (IASC)",
      "Contribution significative à la recherche astronomique",
      "Collaboration internationale sur des projets scientifiques"
    ],
    tags: ["Recherche", "Astronomie", "Collaboration Internationale"]
  },
  {
    title: "Participant",
    company: "Happy Coders Academy",
    location: "Abidjan, Côte d'Ivoire",
    period: "Juillet 2022",
    description: "Conception innovante d'un prototype de voiture autonome via Arduino.",
    highlights: [
      "Programmation en C++ pour systèmes embarqués",
      "Design et intégration de capteurs",
      "Développement de systèmes de reconnaissance de feux tricolores"
    ],
    tags: ["Arduino", "C++", "IoT", "Robotique"]
  }
];

const Experience = () => {
  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Expériences Professionnelles
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
          </div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card 
                key={index} 
                className="p-6 md:p-8 hover-lift glass-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">{exp.title}</h3>
                      <p className="text-xl text-primary font-medium mb-3">{exp.company}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.period}</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {exp.description}
                      </p>

                      <ul className="space-y-2 mb-4">
                        {exp.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-primary mt-1">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;