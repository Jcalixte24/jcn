import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowRight, Code, BarChart, Globe, Cpu, Leaf, Cloud, Plane, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Project {
  title: string;
  description: { fr: string; en: string };
  previewUrl?: string;
  icon: React.ElementType;
  gradient: string;
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
      fr: "Planificateur de transport intelligent pour Abidjan avec itinéraires SOTRA, bus et taxis. Interface interactive avec GeoJSON et intégration API Maps pour navigation en temps réel.",
      en: "Smart transport planner for Abidjan with SOTRA, bus and taxi routes. Interactive interface with GeoJSON and Maps API integration for real-time navigation."
    },
    previewUrl: "https://babitransports.netlify.app/",
    icon: Globe,
    gradient: "from-emerald-500 to-teal-600",
    tags: ["JavaScript", "React", "GeoJSON", "API Maps", "Transport"],
    github: "https://github.com/Jcalixte24/BabiTransport",
    demo: "https://babitransports.netlify.app/",
    featured: true,
    type: 'web'
  },
  {
    title: "Évaluateur D&I",
    description: {
      fr: "Outil professionnel d'évaluation du score de Diversité & Inclusion des entreprises. Interface Streamlit interactive avec analyse de données issues de data.gouv.fr.",
      en: "Professional D&I score assessment tool for companies. Interactive Streamlit interface with data analysis from data.gouv.fr."
    },
    previewUrl: "https://evaluateurdi.streamlit.app/",
    icon: BarChart,
    gradient: "from-violet-500 to-purple-600",
    tags: ["Python", "Streamlit", "PowerBI", "Data Analysis"],
    github: "https://github.com/Jcalixte24/Evaluation-D-I",
    demo: "https://evaluateurdi.streamlit.app/",
    featured: true,
    type: 'app'
  },
  {
    title: "Spotify Analytics",
    description: {
      fr: "Analyse approfondie des facteurs de popularité musicale via les données Spotify. Visualisations avec Python, Pandas et Seaborn pour identifier les tendances.",
      en: "In-depth analysis of music popularity factors using Spotify data. Visualizations with Python, Pandas and Seaborn to identify trends."
    },
    icon: BarChart,
    gradient: "from-green-500 to-emerald-600",
    tags: ["Python", "Pandas", "Seaborn", "Data Viz", "Jupyter"],
    github: "https://github.com/Jcalixte24/spotify-analytics",
    featured: true,
    type: 'notebook'
  },
  {
    title: "Sauver Gaia",
    description: {
      fr: "Projet environnemental avec analyse de données pour sensibiliser à la protection de la planète. Impact social et visualisations engageantes.",
      en: "Environmental project with data analysis to raise awareness about planet protection. Social impact and engaging visualizations."
    },
    icon: Leaf,
    gradient: "from-lime-500 to-green-600",
    tags: ["Python", "Environment", "Data", "Social Impact"],
    github: "https://github.com/Jcalixte24/sauver-gaia",
    featured: true,
    type: 'notebook'
  },
  {
    title: "Cloud Kafka Project",
    description: {
      fr: "Streaming de données en temps réel avec Apache Kafka. Architecture cloud-native pour le traitement de données massives et pipeline ETL.",
      en: "Real-time data streaming with Apache Kafka. Cloud-native architecture for massive data processing and ETL pipeline."
    },
    icon: Cloud,
    gradient: "from-sky-500 to-blue-600",
    tags: ["Kafka", "Cloud", "Data Streaming", "Python", "ETL"],
    github: "https://github.com/Jcalixte24/projet-cloud-kafka",
    type: 'notebook'
  },
  {
    title: "Web Analytics Dashboard",
    description: {
      fr: "Dashboard d'analyse web avec visualisations en temps réel. Métriques de performance et insights utilisateurs interactifs.",
      en: "Web analytics dashboard with real-time visualizations. Performance metrics and interactive user insights."
    },
    previewUrl: "https://jcalixte24.github.io/projet-web-analytics-1/",
    icon: Code,
    gradient: "from-orange-500 to-red-500",
    tags: ["HTML", "CSS", "JavaScript", "Analytics", "Charts"],
    github: "https://github.com/Jcalixte24/projet-web-analytics-1",
    demo: "https://jcalixte24.github.io/projet-web-analytics-1/",
    type: 'web'
  },
  {
    title: "Flight Prediction ML",
    description: {
      fr: "Modèle ML pour prédire les retards de vols. Feature engineering avancé, analyse de données historiques et optimisation de modèles.",
      en: "ML model to predict flight delays. Advanced feature engineering, historical data analysis and model optimization."
    },
    icon: Plane,
    gradient: "from-blue-500 to-indigo-600",
    tags: ["Machine Learning", "Python", "Scikit-learn", "Prediction"],
    github: "https://github.com/Jcalixte24/Flight-prediction",
    type: 'notebook'
  },
  {
    title: "Object Detection",
    description: {
      fr: "Système de détection d'objets avec Computer Vision et Deep Learning. Implémentation de modèles YOLO pour détection en temps réel.",
      en: "Object detection system with Computer Vision and Deep Learning. YOLO model implementation for real-time detection."
    },
    icon: Eye,
    gradient: "from-pink-500 to-rose-600",
    tags: ["Computer Vision", "YOLO", "Deep Learning", "Python"],
    github: "https://github.com/Jcalixte24/objet-detection",
    type: 'app'
  },
];

// Animated project card with iframe preview
const ProjectCard = ({ project, index, isFeatured }: { project: Project; index: number; isFeatured: boolean }) => {
  const { language, t } = useLanguage();
  const Icon = project.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group"
    >
      <Card className={`overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card ${isFeatured ? 'h-full' : ''}`}>
        {/* Preview Section */}
        <div className={`relative ${isFeatured ? 'h-64' : 'h-48'} overflow-hidden bg-gradient-to-br ${project.gradient}`}>
          {project.previewUrl ? (
            <>
              {/* Iframe preview */}
              <iframe
                src={project.previewUrl}
                className="absolute inset-0 w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
                title={project.title}
                loading="lazy"
              />
              {/* Overlay on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500"
              />
              
              {/* Preview link overlay */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              >
                <Button 
                  size="lg" 
                  className="gap-2 shadow-xl"
                  asChild
                >
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5" />
                    {t('projects.viewDemo')}
                  </a>
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              {/* Gradient placeholder with icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm"
                >
                  <Icon className="w-16 h-16 text-white/80" />
                </motion.div>
              </div>
              {/* Animated shapes */}
              <motion.div
                className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-8 left-8 w-12 h-12 rounded-full bg-white/10"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </>
          )}
          
          {/* Type badge */}
          <div className="absolute top-4 left-4 z-10">
            <Badge className="backdrop-blur-md bg-white/90 text-foreground shadow-lg">
              {project.type === 'notebook' ? '📓 Notebook' : project.type === 'web' ? '🌐 Web App' : '📱 Application'}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${project.gradient} flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold group-hover:text-primary transition-colors">
              {project.title}
            </h4>
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {project.description[language]}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">+{project.tags.length - 4}</Badge>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            {project.github && (
              <Button size="sm" variant="outline" className="gap-2 flex-1" asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  {t('projects.viewCode')}
                </a>
              </Button>
            )}
            {project.demo && (
              <Button size="sm" className={`gap-2 flex-1 bg-gradient-to-r ${project.gradient} hover:opacity-90`} asChild>
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
  );
};

const Projects = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-24 relative overflow-hidden" ref={containerRef}>
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
        style={{ y, opacity }}
      />
      <motion.div 
        className="absolute bottom-20 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]), opacity }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              Portfolio
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              {t('projects.title')}
            </h2>
            <motion.div 
              className="w-24 h-1.5 bg-gradient-to-r from-primary via-accent to-primary mx-auto mb-6 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t('projects.subtitle')}
            </p>
          </motion.div>

          {/* Featured Projects - Large Grid */}
          <div className="mb-20">
            <motion.h3 
              className="text-2xl font-bold mb-10 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="w-10 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
              {t('projects.featured')}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({featuredProjects.length} projets)
              </span>
            </motion.h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.title} 
                  project={project} 
                  index={index}
                  isFeatured={true}
                />
              ))}
            </div>
          </div>

          {/* Other Projects - Smaller Grid */}
          <div>
            <motion.h3 
              className="text-2xl font-bold mb-10 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="w-10 h-1 bg-gradient-to-r from-accent to-primary rounded-full" />
              {t('projects.notebooks')}
            </motion.h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard 
                  key={project.title} 
                  project={project} 
                  index={index}
                  isFeatured={false}
                />
              ))}
            </div>
          </div>

          {/* GitHub CTA */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="gap-3 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group"
              asChild
            >
              <a href="https://github.com/Jcalixte24" target="_blank" rel="noopener noreferrer">
                <Github className="w-6 h-6" />
                {t('projects.viewAll')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
