import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github, GitFork, Star, Code2, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const githubProjects = [
  {
    id: 1,
    name: "Sokoban CLI",
    description: "Jeu de Sokoban complet jouable dans la console, développé en Python avec algorithmes de pathfinding.",
    longDescription: "Implémentation complète du jeu Sokoban jouable directement dans la console. Développement d'algorithmes de pathfinding pour résoudre les niveaux, gestion des collisions et logique de jeu robuste. Interface en ligne de commande interactive avec système de niveaux progressifs.",
    technologies: ["Python", "Game Dev", "Algorithmes", "CLI", "Logique"],
    stats: {
      stars: 0,
      forks: 0,
      language: "Python",
      size: "125 KB"
    },
    highlights: [
      "Logique de jeu complète et robuste",
      "Interface console interactive",
      "Algorithmes de pathfinding optimisés",
      "Système de niveaux progressifs"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    name: "Flight Prediction ML",
    description: "Modèle de machine learning pour prédire les retards de vols avec feature engineering avancé.",
    longDescription: "Modèle sophistiqué de machine learning utilisant des données historiques de vols pour prédire les retards. Feature engineering avancé incluant variables temporelles, météorologiques et opérationnelles. Optimisation des hyperparamètres et comparaison de plusieurs algorithmes ML.",
    technologies: ["Machine Learning", "Python", "Scikit-learn", "Pandas", "Jupyter"],
    stats: {
      stars: 0,
      forks: 0,
      language: "Jupyter Notebook",
      size: "2.4 MB"
    },
    highlights: [
      "Feature engineering avancé",
      "Optimisation d'hyperparamètres",
      "Analyse temporelle des retards",
      "Visualisations interactives complètes"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    name: "Abidjan Route Finder",
    description: "Application web pour trouver les itinéraires optimaux à Abidjan avec algorithmes de graphes.",
    longDescription: "Application web innovante dédiée à la navigation dans Abidjan. Implémentation d'algorithmes de graphes (Dijkstra, A*) pour calculer les chemins les plus courts. Interface utilisateur intuitive permettant de visualiser les itinéraires et d'optimiser les trajets dans la ville.",
    technologies: ["Algorithmes", "Graphes", "CSS", "JavaScript", "Web"],
    stats: {
      stars: 0,
      forks: 0,
      language: "CSS",
      size: "890 KB"
    },
    highlights: [
      "Algorithmes Dijkstra et A*",
      "Interface utilisateur moderne",
      "Optimisation de parcours urbains",
      "Application locale pour Abidjan"
    ],
    color: "from-green-500 to-teal-500"
  },
  {
    id: 4,
    name: "Titanic Data Exploration",
    description: "Analyse exploratoire approfondie du dataset Titanic avec visualisations et prédictions ML.",
    longDescription: "Analyse exploratoire complète du célèbre dataset Titanic. Nettoyage de données, feature engineering créatif et visualisations professionnelles. Développement de modèles de classification pour prédire la survie des passagers avec comparaison de différents algorithmes ML.",
    technologies: ["Data Science", "Python", "Pandas", "Matplotlib", "Seaborn"],
    stats: {
      stars: 0,
      forks: 0,
      language: "Jupyter Notebook",
      size: "1.85 MB"
    },
    highlights: [
      "Exploration de données détaillée",
      "Visualisations professionnelles",
      "Feature engineering créatif",
      "Comparaison de modèles ML"
    ],
    color: "from-orange-500 to-red-500"
  },
  {
    id: 5,
    name: "Netflix Data Analysis",
    description: "Analyse complète des données Netflix : tendances, patterns de visionnage et insights sur le catalogue.",
    longDescription: "Analyse approfondie des données Netflix explorant les tendances de contenu, patterns de visionnage et évolution du catalogue. Génération d'insights sur les types de contenu populaires, distribution géographique et temporelle. Visualisations interactives avec statistiques descriptives avancées.",
    technologies: ["Python", "Data Analysis", "Pandas", "Visualization", "EDA"],
    stats: {
      stars: 0,
      forks: 0,
      language: "Python",
      size: "1.52 MB"
    },
    highlights: [
      "Analyse de tendances temporelles",
      "Insights sur le catalogue global",
      "Visualisations interactives élaborées",
      "Statistiques descriptives complètes"
    ],
    color: "from-red-500 to-rose-500"
  },
  {
    id: 6,
    name: "Object Detection",
    description: "Système de détection d'objets utilisant computer vision et deep learning avec modèles pré-entraînés.",
    longDescription: "Système de détection d'objets exploitant des techniques avancées de computer vision et deep learning. Application pratique de modèles pré-entraînés (YOLO, SSD) sur des cas réels. Implémentation de pipelines de traitement d'images et détection en temps réel.",
    technologies: ["Computer Vision", "Deep Learning", "Python", "TensorFlow", "AI"],
    stats: {
      stars: 0,
      forks: 0,
      language: "Python",
      size: "980 KB"
    },
    highlights: [
      "Détection d'objets en temps réel",
      "Deep learning appliqué",
      "Utilisation de modèles pré-entraînés",
      "Pipeline de computer vision complet"
    ],
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: 7,
    name: "Évaluation D&I",
    description: "Outil d'évaluation de diversité et inclusion avec analyse de données publiques et dashboards PowerBI.",
    longDescription: "Outil professionnel d'évaluation pour calculer le score de diversité et d'inclusion des entreprises. Exploitation de données issues de data.gouv.fr avec pipeline ETL complet. Création de dashboards PowerBI interactifs et interface Streamlit pour l'analyse.",
    technologies: ["Python", "PowerBI", "Data Analysis", "Streamlit", "ETL"],
    stats: {
      stars: 0,
      forks: 1,
      language: "Python",
      size: "3.2 MB"
    },
    highlights: [
      "Dashboard PowerBI professionnel",
      "Analyse de données publiques françaises",
      "Métriques D&I automatisées",
      "Interface Streamlit interactive"
    ],
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: 8,
    name: "Sauver Gaia",
    description: "Projet environnemental de sensibilisation aux enjeux écologiques avec analyse de données.",
    longDescription: "Projet récent axé sur l'environnement et la durabilité. Application Python pour sensibiliser aux enjeux écologiques et promouvoir des actions concrètes. Analyse de données environnementales et visualisations pour communiquer l'urgence climatique.",
    technologies: ["Python", "Environnement", "Data", "Impact Social", "Visualisation"],
    stats: {
      stars: 0,
      forks: 0,
      language: "Python",
      size: "450 KB"
    },
    highlights: [
      "Sensibilisation environnementale",
      "Analyse de données écologiques",
      "Impact social positif",
      "Projet communautaire engagé"
    ],
    color: "from-lime-500 to-green-500"
  }
];

const GithubProjects = () => {
  const [selectedProject, setSelectedProject] = useState(githubProjects[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-mesh fixed inset-0 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-8 hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4" />
              Retour au Portfolio
            </Button>
          </Link>

          {/* Title Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Visualisation Projets
              <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                GitHub
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explorez mes vrais projets GitHub : data science, machine learning, algorithmes et applications web
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Projects List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-primary" />
                Mes Projets
              </h2>
              {githubProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className={`p-4 cursor-pointer transition-smooth hover-lift ${
                    selectedProject.id === project.id
                      ? "border-2 border-primary shadow-glow-strong"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedProject(project)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.color} flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{project.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {project.stats.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          {project.stats.forks}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Selected Project Details */}
            <div className="lg:col-span-2">
              <Card className="p-8 glass-card animate-fade-in">
                {/* Project Header */}
                <div className="mb-8">
                  <div className={`h-32 rounded-lg bg-gradient-to-br ${selectedProject.color} mb-6 flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <Github className="w-20 h-20 text-white relative z-10" />
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-3">{selectedProject.name}</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    {selectedProject.longDescription}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-primary/10 text-center">
                      <Star className="w-5 h-5 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{selectedProject.stats.stars}</div>
                      <div className="text-xs text-muted-foreground">Stars</div>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 text-center">
                      <GitFork className="w-5 h-5 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold">{selectedProject.stats.forks}</div>
                      <div className="text-xs text-muted-foreground">Forks</div>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10 text-center">
                      <Code2 className="w-5 h-5 text-primary mx-auto mb-2" />
                      <div className="text-sm font-bold">{selectedProject.stats.language}</div>
                      <div className="text-xs text-muted-foreground">Language</div>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 text-center">
                      <Activity className="w-5 h-5 text-accent mx-auto mb-2" />
                      <div className="text-sm font-bold">{selectedProject.stats.size}</div>
                      <div className="text-xs text-muted-foreground">Taille</div>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">TECHNOLOGIES</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">POINTS FORTS</h3>
                    <ul className="space-y-2">
                      {selectedProject.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button className="flex-1 gap-2" asChild>
                      <a href="https://github.com/Jcalixte24" target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        Voir sur GitHub
                      </a>
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2" asChild>
                      <a href="https://github.com/Jcalixte24" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Demo Live
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Quick Stats Overview */}
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <Card className="p-6 glass-card text-center hover-lift">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {githubProjects.reduce((acc, p) => acc + p.stats.stars, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Stars</div>
                </Card>
                <Card className="p-6 glass-card text-center hover-lift">
                  <div className="text-4xl font-bold text-accent mb-2">
                    {githubProjects.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Projets</div>
                </Card>
                <Card className="p-6 glass-card text-center hover-lift">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {githubProjects.reduce((acc, p) => acc + p.stats.forks, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Forks</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubProjects;