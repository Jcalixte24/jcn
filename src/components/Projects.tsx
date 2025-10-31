import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FolderGit2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const projects = [
  {
    title: "Évaluateur Diversité & Inclusion",
    description: "Réalisation d'un outil d'évaluation pour calculer le score de diversité et d'inclusion des entreprises. Analyse de données issues de data.gouv.fr avec visualisations interactives.",
    period: "Septembre 2024 - Mai 2025",
    tags: ["Python", "Data Analysis", "PowerBI", "Pandas", "Datavisualisation"],
    link: null,
    github: "https://github.com/Jcalixte24"
  },
  {
    title: "Dashboard QuantCube Technology",
    description: "Création d'un dashboard interactif de suivi des données de marchés et données QuantCube pour Data Analystes et économistes. Transformation de besoins métiers en visualisations percutantes.",
    period: "Mai 2025 - Juin 2025",
    tags: ["PowerBI", "SQL", "Excel", "Dashboard", "Data Viz"],
    link: null,
    github: null
  },
  {
    title: "Nuit du Code 2024",
    description: "Projet de programmation réalisé lors d'un concours prestigieux en terminale. Développement d'une solution complète sous pression temporelle (6h) en équipe.",
    period: "Septembre 2023 - Mai 2024",
    tags: ["Python", "Team Work", "Compétition", "Problem Solving"],
    link: null,
    github: "https://github.com/Jcalixte24"
  },
  {
    title: "Voiture Autonome Arduino",
    description: "Conception innovante d'un prototype de voiture autonome utilisant Arduino et programmation C++. Intégration de capteurs et système de reconnaissance de feux tricolores.",
    period: "Juillet 2022",
    tags: ["Arduino", "C++", "IoT", "Robotique", "Computer Vision"],
    link: null,
    github: null
  },
  {
    title: "Recherche Astronomique - Astronometrica",
    description: "Contribution active à des projets de recherche panafricains en astronomie. Certification IASC pour contribution significative à la recherche astronomique internationale.",
    period: "Janvier 2024 - Présent",
    tags: ["Recherche", "Astronomie", "Data Analysis", "Collaboration"],
    link: null,
    github: null
  }
];

const Projects = () => {
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Projets & Réalisations
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une sélection de mes projets académiques et personnels démontrant 
              mes compétences en data science, programmation et innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Card 
                key={index} 
                className="p-6 hover-lift glass-card animate-fade-in flex flex-col group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <FolderGit2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{project.period}</p>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {project.github && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="gap-2"
                        asChild
                      >
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.link && (
                      <Button 
                        size="sm" 
                        className="gap-2"
                        asChild
                      >
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Voir
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* GitHub Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button size="lg" className="gap-2 shadow-glow-strong" asChild>
              <Link to="/github-projects">
                <Sparkles className="w-5 h-5" />
                Visualisation Interactive
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 hover-lift" asChild>
              <a 
                href="https://github.com/Jcalixte24" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
                Voir sur GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;