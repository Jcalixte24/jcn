import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Download, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import profileImg from "@/assets/japhet-profile-pro.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="" 
          className="w-full h-full object-cover opacity-20"
        />
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 gradient-mesh animate-gradient-shift"></div>
        {/* Multiple gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/90 to-accent/10"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-accent/20 animate-pulse-glow"></div>
        {/* Animated dots pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <p className="text-primary font-semibold text-lg animate-fade-in flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse-glow"></span>
                  Bonjour, je suis
                </p>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-shift">
                  Japhet Calixte N'DRI
                </h1>
                <h2 className="text-2xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-muted-foreground to-primary">
                  Junior Data Analyst
                </h2>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Passionné par l'intelligence artificielle et la data science, 
                étudiant en 2ème année au Programme Grande École de l'IA Institut Paris by EPITA. 
                Mon ambition : devenir un expert reconnu internationalement et contribuer à la 
                transformation numérique de la Côte d'Ivoire et de l'ensemble du continent africain.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="gap-2 shadow-glow-strong animate-pulse-glow group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-smooth"></div>
                  <a href="#contact" className="flex items-center gap-2 relative z-10">
                    Me Contacter
                    <Mail className="w-4 h-4 group-hover:rotate-12 transition-smooth" />
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 hover-lift group border-2 border-primary/30 hover:border-primary"
                  asChild
                >
                  <a href="https://cv-jcn.lovable.app/" target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 group-hover:translate-y-1 transition-smooth" />
                    Télécharger CV
                  </a>
                </Button>
              </div>

              <div className="flex gap-4 pt-6">
                <a 
                  href="https://github.com/Jcalixte24" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-3 rounded-full border-2 border-border hover:border-primary bg-background/50 backdrop-blur-sm hover:bg-primary/10 transition-smooth hover:scale-110 hover:shadow-glow"
                >
                  <Github className="w-5 h-5 group-hover:rotate-12 transition-smooth" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/japhet-calixte-n'dri-0b73832a0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-3 rounded-full border-2 border-border hover:border-primary bg-background/50 backdrop-blur-sm hover:bg-primary/10 transition-smooth hover:scale-110 hover:shadow-glow"
                >
                  <Linkedin className="w-5 h-5 group-hover:rotate-12 transition-smooth" />
                </a>
                <a 
                  href="mailto:japhetndri15@gmail.com"
                  className="group p-3 rounded-full border-2 border-border hover:border-primary bg-background/50 backdrop-blur-sm hover:bg-primary/10 transition-smooth hover:scale-110 hover:shadow-glow"
                >
                  <Mail className="w-5 h-5 group-hover:rotate-12 transition-smooth" />
                </a>
              </div>
            </div>

              <div className="flex justify-center animate-slide-in-right">
              <div className="relative group animate-float">
                {/* Glow effects */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary via-accent to-primary rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-smooth animate-pulse-glow"></div>
                <div className="absolute -inset-6 bg-gradient-to-br from-primary/30 via-accent/30 to-primary/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-smooth animate-gradient-shift"></div>
                
                {/* Rotating ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-[spin_20s_linear_infinite]"></div>
                
                {/* Main image container */}
                <div className="relative">
                  <img 
                    src={profileImg} 
                    alt="Japhet Calixte N'DRI" 
                    className="relative w-80 h-80 rounded-full object-cover border-4 border-primary/30 shadow-glow-strong group-hover:border-accent/50 group-hover:scale-[1.05] transition-bounce"
                  />
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  
                  {/* Badge JCN */}
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-primary to-accent p-4 rounded-2xl shadow-glow-strong border-4 border-background animate-float">
                    <span className="text-2xl font-bold text-background">JCN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator with enhanced animation */}
      <a 
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-smooth"></div>
          <ChevronDown className="relative w-8 h-8 text-primary group-hover:text-accent transition-smooth" />
        </div>
      </a>
    </section>
  );
};

export default Hero;