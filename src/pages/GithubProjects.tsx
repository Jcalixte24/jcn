import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github, GitFork, Star, Code2, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const githubProjects = [
  {
    id: 1,
    name: "Évaluateur D&I",
    description: "Outil d'évaluation de la diversité et de l'inclusion des entreprises avec analyse de données et visualisations interactives.",
    longDescription: "Application complète d'analyse de données pour évaluer le score de diversité et d'inclusion des entreprises françaises. Utilise des données gouvernementales (data.gouv.fr) pour générer des rapports détaillés avec visualisations PowerBI et Python.",
    technologies: ["Python", "Pandas", "PowerBI", "NumPy", "Matplotlib"],
    stats: {
      stars: 12,
      forks: 3,
      language: "Python",
      size: "2.4 MB"
    },
    highlights: [
      "Analyse de +50,000 lignes de données",
      "Dashboard interactif PowerBI",
      "Algorithme de scoring personnalisé",
      "Export PDF automatisé"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    name: "Dashboard QuantCube",
    description: "Dashboard de suivi des données de marchés financiers pour analystes et économistes.",
    longDescription: "Solution de visualisation professionnelle développée lors de mon stage chez QuantCube Technology. Permet aux data analystes et économistes de suivre en temps réel les données de marchés avec des indicateurs personnalisables.",
    technologies: ["PowerBI", "SQL", "Excel", "DAX"],
    stats: {
      stars: 8,
      forks: 2,
      language: "SQL",
      size: "1.8 MB"
    },
    highlights: [
      "Intégration multi-sources de données",
      "Requêtes SQL optimisées",
      "Visualisations temps réel",
      "Interface utilisateur intuitive"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    name: "Nuit du Code 2024",
    description: "Projet de compétition de programmation réalisé en 6h en équipe lors d'un concours prestigieux.",
    longDescription: "Solution complète développée lors de la Nuit du Code 2024, un concours de programmation intensif. Travail d'équipe sous pression pour résoudre des problèmes algorithmiques complexes avec Python.",
    technologies: ["Python", "Algorithmes", "NumPy", "TkInter"],
    stats: {
      stars: 15,
      forks: 5,
      language: "Python",
      size: "980 KB"
    },
    highlights: [
      "Développement sous pression (6h)",
      "Algorithmes optimisés",
      "Interface graphique complète",
      "Travail d'équipe efficace"
    ],
    color: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    name: "Voiture Autonome Arduino",
    description: "Prototype de voiture autonome avec reconnaissance de feux tricolores utilisant Arduino et C++.",
    longDescription: "Projet IoT innovant combinant hardware et software. Voiture autonome équipée de capteurs ultrasoniques, module de reconnaissance de couleurs pour les feux tricolores, et système de navigation basique.",
    technologies: ["Arduino", "C++", "IoT", "Capteurs"],
    stats: {
      stars: 20,
      forks: 7,
      language: "C++",
      size: "540 KB"
    },
    highlights: [
      "Reconnaissance de feux tricolores",
      "Navigation autonome",
      "Intégration de multiples capteurs",
      "Code C++ optimisé pour microcontrôleur"
    ],
    color: "from-green-500 to-teal-500"
  },
  {
    id: 5,
    name: "Astronometrica Research",
    description: "Contribution à des projets de recherche astronomique panafricains avec analyse de données spatiales.",
    longDescription: "Participation active à l'Association Ivoirienne d'Astronomie (AIA) avec contribution à des projets de recherche internationale. Certifié par l'IASC pour contribution significative à la recherche astronomique.",
    technologies: ["Python", "Data Analysis", "Astronomie", "Research"],
    stats: {
      stars: 18,
      forks: 4,
      language: "Python",
      size: "3.2 MB"
    },
    highlights: [
      "Certification IASC obtenue",
      "Analyse de données astronomiques",
      "Collaboration internationale",
      "Publications scientifiques"
    ],
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: 6,
    name: "Machine Learning Portfolio",
    description: "Collection de modèles de machine learning développés durant ma formation à l'IA Institut.",
    longDescription: "Portfolio de projets ML incluant classification, régression, clustering et réseaux de neurones. Utilisation de scikit-learn, TensorFlow et visualisations avec Matplotlib.",
    technologies: ["Python", "TensorFlow", "Scikit-learn", "Jupyter"],
    stats: {
      stars: 25,
      forks: 10,
      language: "Python",
      size: "4.1 MB"
    },
    highlights: [
      "Modèles de classification avancés",
      "Réseaux de neurones profonds",
      "Notebooks Jupyter documentés",
      "Datasets personnalisés"
    ],
    color: "from-yellow-500 to-orange-500"
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
              Explorez mes projets de data science, machine learning et développement
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