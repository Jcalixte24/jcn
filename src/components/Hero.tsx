import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Download, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import profileImg from "@/assets/profile-placeholder.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 gradient-mesh"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <p className="text-primary font-semibold text-lg">Bonjour, je suis</p>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Japhet Calixte
                </h1>
                <h2 className="text-2xl md:text-3xl text-muted-foreground">
                  Junior Data Analyst
                </h2>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Passionné par l'intelligence artificielle et la data science, 
                étudiant au Programme Grande École de l'IA Institut Paris by EPITA. 
                Mon ambition : devenir un expert reconnu et contribuer à la 
                transformation numérique de la Côte d'Ivoire et au-delà.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="gap-2 shadow-glow-strong animate-pulse-glow">
                  <a href="#contact" className="flex items-center gap-2">
                    Me Contacter
                    <Mail className="w-4 h-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 hover-lift">
                  <Download className="w-4 h-4" />
                  Télécharger CV
                </Button>
              </div>

              <div className="flex gap-4 pt-6">
                <a 
                  href="https://github.com/Jcalixte24" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-smooth"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/japhet-calixte-n'dri-0b73832a0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-smooth"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:japhetndri15@gmail.com"
                  className="p-3 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-smooth"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right: Profile Image */}
            <div className="flex justify-center animate-slide-in-right">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-smooth animate-pulse-glow"></div>
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-smooth"></div>
                <img 
                  src={profileImg} 
                  alt="Japhet Calixte" 
                  className="relative w-80 h-80 rounded-full object-cover border-4 border-primary/20 shadow-xl group-hover:border-primary/40 group-hover:scale-105 transition-bounce"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a 
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce"
      >
        <ChevronDown className="w-8 h-8 text-primary" />
      </a>
    </section>
  );
};

export default Hero;