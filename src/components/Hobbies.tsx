import { Card } from "@/components/ui/card";
import { Dumbbell, Trophy, Mic, Music } from "lucide-react";

const hobbies = [
  {
    title: "Basketball",
    description: "Pratique régulière du basketball, développant l'esprit d'équipe, la stratégie et l'endurance physique.",
    icon: Trophy,
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Baby-foot",
    description: "Passionné de baby-foot, un sport qui allie réflexes, coordination et convivialité.",
    icon: Dumbbell,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Art Oratoire",
    description: "Formé en art oratoire chez AUDECA GROUP. Passion pour la prise de parole en public, le débat et la communication persuasive.",
    icon: Mic,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Projets Créatifs",
    description: "Intérêt marqué pour les projets artistiques et créatifs alliant technologie et expression personnelle.",
    icon: Music,
    color: "from-green-500 to-emerald-500"
  }
];

const Hobbies = () => {
  return (
    <section id="hobbies" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Passions & Activités
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Au-delà de l'informatique, je cultive mes passions qui façonnent 
              ma personnalité et enrichissent mon approche des défis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {hobbies.map((hobby, index) => {
              const Icon = hobby.icon;
              return (
                <Card 
                  key={index} 
                  className="p-6 hover-lift glass-card animate-fade-in group relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${hobby.color} opacity-0 group-hover:opacity-10 transition-smooth`}></div>
                  
                  <div className="relative flex items-start gap-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${hobby.color} flex-shrink-0 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">{hobby.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {hobby.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Inspirational Quote */}
          <div className="mt-16 text-center">
            <Card className="p-8 glass-card border-2 border-primary/20 max-w-3xl mx-auto">
              <blockquote className="text-xl md:text-2xl italic text-muted-foreground">
                "L'équilibre entre passion technologique et activités extra-scolaires 
                forge un esprit créatif et résilient."
              </blockquote>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hobbies;
