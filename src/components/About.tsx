import { Card } from "@/components/ui/card";
import { Target, Globe, Lightbulb } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              À Propos de Moi
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Description */}
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Je suis actuellement étudiant en deuxième année au sein du prestigieux 
                <span className="text-foreground font-semibold"> Programme Grande École de l'IA Institut Paris by EPITA</span>. 
                Mon parcours est marqué par une passion profonde pour l'intelligence artificielle 
                et la science des données.
              </p>
              
              <p className="text-lg leading-relaxed text-muted-foreground">
                Originaire de Côte d'Ivoire, je conjugue une expertise technique pointue 
                avec une riche expérience multiculturelle. Ma polyvalence et mon sens prononcé 
                pour l'innovation constituent le socle de ma vision.
              </p>

              <p className="text-lg leading-relaxed text-muted-foreground">
                Mon ambition est claire : devenir un expert de renommée internationale en IA 
                et data science, tout en étant un moteur clé de la transformation numérique 
                de la Côte d'Ivoire et de l'ensemble du continent africain, et en générant 
                un impact positif à l'échelle mondiale.
              </p>
            </div>

            {/* Right: Key Points */}
            <div className="space-y-4">
              <Card className="p-6 hover-lift glass-card group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Ambition</h3>
                    <p className="text-muted-foreground">
                      Devenir un expert reconnu internationalement en IA et data science, 
                      avec une expertise technique de haut niveau.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover-lift glass-card group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-smooth">
                    <Globe className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Vision Mondiale</h3>
                    <p className="text-muted-foreground">
                      Contribuer à la transformation numérique de la Côte d'Ivoire 
                      et de tout le continent africain, avec un impact positif mondial.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover-lift glass-card group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Innovation</h3>
                    <p className="text-muted-foreground">
                      Polyvalence et sens prononcé de l'innovation, enrichis par 
                      une expérience multiculturelle unique.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;