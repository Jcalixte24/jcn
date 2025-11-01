import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FolderGit2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const projects = [
  {
    title: "Sokoban CLI",
    description: "Jeu de Sokoban complet jouable dans la console, développé en Python. Implémentation d'algorithmes de pathfinding et logique de jeu avec interface en ligne de commande.",
    period: "Septembre 2024",
    tags: ["Python", "Game Dev", "Algorithmes", "CLI"],
    link: null,
    github: "https://github.com/Jcalixte24/sokoban-CLI"
  },
  {
    title: "Flight Prediction ML",
    description: "Modèle de machine learning pour prédire les retards de vols. Analyse de données historiques avec feature engineering avancé et optimisation des performances.",
    period: "Avril 2025",
    tags: ["Machine Learning", "Python", "Jupyter", "Data Science", "Prédiction"],
    link: null,
    github: "https://github.com/Jcalixte24/Flight-prediction"
  },
  {
    title: "Abidjan Route Finder",
    description: "Application web de recherche d'itinéraires optimaux à Abidjan. Implémentation d'algorithmes de graphes pour trouver les meilleurs chemins dans la ville.",
    period: "Octobre 2025",
    tags: ["Algorithmes", "Web", "CSS", "Graphes", "Optimisation"],
    link: null,
    github: "https://github.com/Jcalixte24/abidjan-route-finder"
  },
  {
    title: "Titanic Data Exploration",
    description: "Analyse exploratoire complète du dataset Titanic. Visualisations de données, feature engineering et prédiction de survie avec différents modèles ML.",
    period: "Janvier 2025",
    tags: ["Data Science", "Python", "Jupyter", "EDA", "Visualisation"],
    link: null,
    github: "https://github.com/Jcalixte24/titanic-data-exploration"
  },
  {
    title: "Netflix Data Analysis",
    description: "Analyse approfondie des données Netflix : tendances de contenu, patterns de visionnage et insights sur le catalogue. Visualisations interactives et statistiques.",
    period: "Janvier 2025",
    tags: ["Python", "Data Analysis", "Pandas", "Visualization"],
    link: null,
    github: "https://github.com/Jcalixte24/netflix"
  },
  {
    title: "Objet Detection",
    description: "Système de détection d'objets utilisant des techniques de computer vision et deep learning. Application pratique de modèles pré-entraînés.",
    period: "Janvier 2025",
    tags: ["Computer Vision", "Deep Learning", "Python", "AI"],
    link: null,
    github: "https://github.com/Jcalixte24/objet-detection"
  },
  {
    title: "Évaluateur Diversité & Inclusion",
    description: "Outil d'évaluation pour calculer le score de diversité et d'inclusion des entreprises. Analyse de données issues de data.gouv.fr avec dashboards PowerBI.",
    period: "Mai 2025",
    tags: ["Python", "PowerBI", "Data Analysis", "Streamlit"],
    link: null,
    github: "https://github.com/Jcalixte24/Evaluation-D-I"
  },
  {
    title: "Sauver Gaia",
    description: "Projet récent axé sur l'environnement et la durabilité. Application Python pour sensibiliser et agir pour la planète.",
    period: "Octobre 2025",
    tags: ["Python", "Environnement", "Data", "Impact Social"],
    link: null,
    github: "https://github.com/Jcalixte24/sauver-gaia"
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