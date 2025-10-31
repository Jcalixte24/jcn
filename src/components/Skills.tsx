import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Database, BarChart3, Brain, Globe2, Wrench } from "lucide-react";

const skillCategories = [
  {
    title: "Langages de Programmation",
    icon: Code2,
    color: "primary",
    skills: ["Python", "JavaScript", "R", "Bash", "C++", "SQL"]
  },
  {
    title: "Data Analysis & Visualisation",
    icon: BarChart3,
    color: "accent",
    skills: ["PowerBI", "Tableau", "Excel", "Pandas", "NumPy", "Matplotlib", "Seaborn"]
  },
  {
    title: "Machine Learning & IA",
    icon: Brain,
    color: "primary",
    skills: ["Scikit-learn", "TensorFlow", "Modélisation Prédictive", "Statistiques"]
  },
  {
    title: "Bases de Données",
    icon: Database,
    color: "accent",
    skills: ["SQL", "PostgreSQL", "Data Engineering", "ETL"]
  },
  {
    title: "Outils & Technologies",
    icon: Wrench,
    color: "primary",
    skills: ["Git", "GitHub", "Arduino", "IoT", "Linux"]
  },
  {
    title: "Langues",
    icon: Globe2,
    color: "accent",
    skills: ["Français (Natif)", "Anglais (Courant)", "Espagnol (Intermédiaire)"]
  }
];

const softSkills = [
  "Communication Persuasive",
  "Travail d'Équipe",
  "Résolution de Problèmes",
  "Créativité & Innovation",
  "Gestion du Temps",
  "Adaptabilité Multiculturelle",
  "Leadership",
  "Art Oratoire"
];

const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Compétences
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
          </div>

          {/* Technical Skills */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-8">Compétences Techniques</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card 
                    key={index}
                    className="p-6 hover:shadow-glow transition-smooth animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg bg-${category.color}/10`}>
                        <Icon className={`w-5 h-5 text-${category.color}`} />
                      </div>
                      <h4 className="font-semibold">{category.title}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <h3 className="text-2xl font-bold mb-8">Soft Skills</h3>
            <Card className="p-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {softSkills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-sm py-2 px-4 hover:bg-primary hover:text-primary-foreground transition-smooth"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;