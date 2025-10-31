import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4">
                JC<span className="text-primary">.</span>
              </h3>
              <p className="text-muted-foreground">
                Junior Data Analyst passionné par l'IA et la transformation numérique.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                {["Accueil", "À Propos", "Expériences", "Formation", "Projets", "Compétences", "Contact"].map((item) => (
                  <li key={item}>
                    <a 
                      href={`#${item.toLowerCase().replace(/\s/g, '-').replace(/à/g, 'a')}`}
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold mb-4">Réseaux Sociaux</h4>
              <div className="flex gap-4">
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
          </div>

          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>© {currentYear} Japhet Calixte. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;