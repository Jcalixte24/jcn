import { Github, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { language, t } = useLanguage();

  const links = {
    fr: ["Accueil", "À Propos", "Expériences", "Formation", "Projets", "Compétences", "Contact"],
    en: ["Home", "About", "Experience", "Education", "Projects", "Skills", "Contact"]
  };

  const hrefs = ["home", "about", "experience", "education", "projects", "skills", "contact"];

  const socials = [
    { icon: Github, href: "https://github.com/Jcalixte24", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/japhet-calixte-n'dri-0b73832a0", label: "LinkedIn" },
    { icon: Mail, href: "mailto:japhetndri15@gmail.com", label: "Email" },
  ];

  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="text-2xl font-bold inline-block mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                  Japhet Calixte N'DRI
                </span>
                <span className="text-primary">.</span>
              </Link>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'fr' 
                  ? "Junior Data Analyst passionné par l'IA et la transformation numérique de l'Afrique."
                  : "Junior Data Analyst passionate about AI and digital transformation of Africa."}
              </p>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-bold mb-6 text-lg">Navigation</h4>
              <ul className="space-y-3">
                {links[language].map((item, index) => (
                  <li key={item}>
                    <a 
                      href={`#${hrefs[index]}`}
                      className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-primary group-hover:w-4 transition-all" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Social */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-bold mb-6 text-lg">
                {language === 'fr' ? 'Réseaux Sociaux' : 'Social Networks'}
              </h4>
              <div className="flex gap-3">
                {socials.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? "_blank" : undefined}
                    rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                    className="p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/10 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -5 }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom */}
          <motion.div 
            className="border-t border-border pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
              <span>© {currentYear} Japhet Calixte N'DRI.</span>
              <span>{t('footer.rights')}</span>
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
