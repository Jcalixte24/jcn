import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowRight, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface Project {
  title: string;
  description: { fr: string; en: string };
  image?: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  type: 'app' | 'notebook' | 'web';
}

const projects: Project[] = [
  {
    title: "BabiTransport",
    description: {
      fr: "Planificateur de transport intelligent pour Abidjan avec itinéraires SOTRA et taxis. Interface interactive avec GeoJSON et API Maps.",
      en: "Smart transport planner for Abidjan with SOTRA and taxi routes. Interactive interface with GeoJSON and Maps API."
    },
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60",
    tags: ["JavaScript", "React", "GeoJSON", "API Maps"],
    github: "https://github.com/Jcalixte24/BabiTransport",
    demo: "https://babitransports.netlify.app/",
    featured: true,
    type: 'web'
  },
  {
    title: "Évaluateur Diversité & Inclusion",
    description: {
      fr: "Outil professionnel d'évaluation du score D&I des entreprises. Dashboards PowerBI et interface Streamlit avec données data.gouv.fr.",
      en: "Professional D&I score assessment tool for companies. PowerBI dashboards and Streamlit interface with data.gouv.fr data."
    },
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60",
    tags: ["Python", "Streamlit", "PowerBI", "Data Analysis"],
    github: "https://github.com/Jcalixte24/Evaluation-D-I",
    demo: "https://evaluateurdi.streamlit.app/",
    featured: true,
    type: 'app'
  },
  {
    title: "Spotify Analytics",
    description: {
      fr: "Étude approfondie des facteurs de popularité musicale au fil du temps via les données Spotify. Analyse avec Python, Pandas et Seaborn.",
      en: "In-depth study of music popularity factors over time using Spotify data. Analysis with Python, Pandas and Seaborn."
    },
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&auto=format&fit=crop&q=60",
    tags: ["Python", "Pandas", "Seaborn", "Data Visualization"],
    github: "https://github.com/Jcalixte24/spotify-analytics",
    featured: true,
    type: 'notebook'
  },
  {
    title: "Sauver Gaia",
    description: {
      fr: "Projet environnemental interactif pour sensibiliser à la protection de notre planète. Application Python avec impact social.",
      en: "Interactive environmental project to raise awareness about protecting our planet. Python application with social impact."
    },
    image: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&auto=format&fit=crop&q=60",
    tags: ["Python", "Environment", "Data", "Social Impact"],
    github: "https://github.com/Jcalixte24/sauver-gaia",
    featured: true,
    type: 'app'
  },
  {
    title: "Cloud Kafka Project",
    description: {
      fr: "Projet de streaming de données en temps réel avec Apache Kafka. Architecture cloud-native pour le traitement de données massives.",
      en: "Real-time data streaming project with Apache Kafka. Cloud-native architecture for massive data processing."
    },
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    tags: ["Kafka", "Cloud", "Data Streaming", "Python"],
    github: "https://github.com/Jcalixte24/projet-cloud-kafka",
    type: 'notebook'
  },
  {
    title: "Web Analytics Dashboard",
    description: {
      fr: "Dashboard d'analyse web interactif avec visualisations en temps réel. Métriques de performance et insights utilisateurs.",
      en: "Interactive web analytics dashboard with real-time visualizations. Performance metrics and user insights."
    },
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    tags: ["HTML", "CSS", "JavaScript", "Analytics"],
    github: "https://github.com/Jcalixte24/projet-web-analytics-1",
    demo: "https://jcalixte24.github.io/projet-web-analytics-1/",
    type: 'web'
  },
  {
    title: "Flight Prediction ML",
    description: {
      fr: "Modèle de machine learning pour prédire les retards de vols. Feature engineering avancé et optimisation des performances.",
      en: "Machine learning model to predict flight delays. Advanced feature engineering and performance optimization."
    },
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=60",
    tags: ["Machine Learning", "Python", "Jupyter", "Prediction"],
    github: "https://github.com/Jcalixte24/Flight-prediction",
    type: 'notebook'
  },
  {
    title: "Object Detection",
    description: {
      fr: "Système de détection d'objets utilisant computer vision et deep learning. Application pratique avec modèles YOLO.",
      en: "Object detection system using computer vision and deep learning. Practical application with YOLO models."
    },
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=60",
    tags: ["Computer Vision", "Deep Learning", "YOLO", "Python"],
    github: "https://github.com/Jcalixte24/objet-detection",
    type: 'app'
  },
];

const Projects = () => {
  const { language, t } = useLanguage();

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('projects.title')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t('projects.subtitle')}
            </p>
          </motion.div>

          {/* Featured Projects */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full" />
              {t('projects.featured')}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-card">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      
                      {/* Type badge */}
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="backdrop-blur-md bg-background/80">
                          {project.type === 'notebook' ? '📓 Notebook' : project.type === 'web' ? '🌐 Web' : '📱 App'}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <h4 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.description[language]}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-3 pt-2">
                        {project.github && (
                          <Button size="sm" variant="outline" className="gap-2" asChild>
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4" />
                              {t('projects.viewCode')}
                            </a>
                          </Button>
                        )}
                        {project.demo && (
                          <Button size="sm" className="gap-2" asChild>
                            <a href={project.demo} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                              {t('projects.viewDemo')}
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Other Projects Grid */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-accent rounded-full" />
              {t('projects.notebooks')}
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group p-5 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {project.type === 'notebook' ? '📓' : project.type === 'web' ? '🌐' : '📱'}
                        </Badge>
                        <div className="flex gap-2">
                          {project.github && (
                            <a 
                              href={project.github} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {project.demo && (
                            <a 
                              href={project.demo} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description[language]}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 pt-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* View All Button */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Button size="lg" variant="outline" className="gap-2 group" asChild>
              <a href="https://github.com/Jcalixte24" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5" />
                {t('projects.viewAll')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
