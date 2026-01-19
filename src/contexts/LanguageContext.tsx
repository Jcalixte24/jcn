import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À Propos',
    'nav.experience': 'Expériences',
    'nav.education': 'Formation',
    'nav.projects': 'Projets',
    'nav.skills': 'Compétences',
    'nav.contact': 'Contact',
    'nav.cv': 'Mon CV',
    
    // Hero
    'hero.greeting': 'Bonjour, je suis',
    'hero.title': 'Junior Data Analyst',
    'hero.subtitle': 'Data Science & IA Enthusiast',
    'hero.bio': 'Passionné par l\'intelligence artificielle et la data science, étudiant en 2ème année au Programme Grande École de l\'IA Institut Paris by EPITA. Mon ambition : devenir un expert reconnu internationalement et contribuer à la transformation numérique du continent africain.',
    'hero.contact': 'Me Contacter',
    'hero.cv': 'Voir mon CV',
    'hero.scroll': 'Défiler',
    
    // About
    'about.title': 'À Propos',
    'about.description1': 'Je suis actuellement étudiant en deuxième année au sein du prestigieux Programme Grande École de l\'IA Institut Paris by EPITA & ISG. Mon parcours est marqué par une passion profonde pour l\'intelligence artificielle et la science des données.',
    'about.description2': 'Originaire de Côte d\'Ivoire, je conjugue une expertise technique pointue avec une riche expérience multiculturelle. Fort d\'une première expérience chez QuantCube Technology et certifié Google Data Analytics, je maîtrise Python, SQL et Power BI.',
    'about.description3': 'Mon ambition est claire : devenir un expert de renommée internationale en Data Science et Intelligence Artificielle, tout en étant un moteur clé de la transformation numérique de la Côte d\'Ivoire et de l\'ensemble du continent africain.',
    'about.ambition': 'Ambition',
    'about.ambition.desc': 'Devenir un expert reconnu internationalement en IA et data science, avec une expertise technique de haut niveau.',
    'about.vision': 'Vision Mondiale',
    'about.vision.desc': 'Contribuer à la transformation numérique de la Côte d\'Ivoire et de tout le continent africain, avec un impact positif mondial.',
    'about.innovation': 'Innovation',
    'about.innovation.desc': 'Polyvalence et sens prononcé de l\'innovation, enrichis par une expérience multiculturelle unique.',
    'about.availability': 'Disponibilité Stage',
    'about.availability.date': '28 Avril – 29 Juin 2026',
    
    // Experience
    'experience.title': 'Expériences Professionnelles',
    
    // Education
    'education.title': 'Formation & Certifications',
    'education.certifications': 'Certifications Professionnelles',
    'education.additional': 'Formations Complémentaires',
    
    // Projects
    'projects.title': 'Projets & Réalisations',
    'projects.subtitle': 'Une sélection de mes projets académiques et personnels démontrant mes compétences en data science, programmation et innovation.',
    'projects.featured': 'Projets Phares',
    'projects.notebooks': 'Notebooks & Analyses',
    'projects.viewCode': 'Code',
    'projects.viewDemo': 'Démo',
    'projects.viewAll': 'Voir tous les projets',
    
    // Skills
    'skills.title': 'Compétences',
    'skills.technical': 'Compétences Techniques',
    'skills.soft': 'Soft Skills',
    'skills.languages': 'Langues',
    
    // Contact
    'contact.title': 'Me Contacter',
    'contact.subtitle': 'N\'hésitez pas à me contacter pour discuter de projets, d\'opportunités ou simplement échanger sur la data science et l\'IA.',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Envoyer le Message',
    'contact.sending': 'Envoi en cours...',
    'contact.location': 'Localisation',
    'contact.rateLimit': 'Maximum 3 messages par heure pour éviter les abus.',
    
    // CV Page
    'cv.title': 'Mon CV',
    'cv.download': 'Télécharger',
    'cv.back': 'Retour',
    
    // Chatbot
    'chatbot.title': 'Assistant Japhet',
    'chatbot.subtitle': 'Posez vos questions',
    'chatbot.greeting': 'Bonjour ! Je suis l\'assistant virtuel de Japhet. Posez-moi des questions sur son parcours, ses compétences ou ses projets !',
    'chatbot.placeholder': 'Posez votre question...',
    
    // Hobbies
    'hobbies.title': 'Passions & Activités',
    'hobbies.subtitle': 'Au-delà de l\'informatique, je cultive mes passions qui façonnent ma personnalité et enrichissent mon approche des défis.',
    
    // Footer
    'footer.rights': 'Tous droits réservés.',
    'footer.made': 'Fait avec',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.education': 'Education',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    'nav.cv': 'My CV',
    
    // Hero
    'hero.greeting': 'Hello, I am',
    'hero.title': 'Junior Data Analyst',
    'hero.subtitle': 'Data Science & AI Enthusiast',
    'hero.bio': 'Passionate about artificial intelligence and data science, 2nd year student at the Grande École Program of IA Institut Paris by EPITA. My ambition: become an internationally recognized expert and contribute to the digital transformation of the African continent.',
    'hero.contact': 'Contact Me',
    'hero.cv': 'View my CV',
    'hero.scroll': 'Scroll',
    
    // About
    'about.title': 'About Me',
    'about.description1': 'I am currently a second-year student in the prestigious Grande École Program at IA Institut Paris by EPITA & ISG. My journey is marked by a deep passion for artificial intelligence and data science.',
    'about.description2': 'Originally from Ivory Coast, I combine sharp technical expertise with rich multicultural experience. With initial experience at QuantCube Technology and Google Data Analytics certified, I master Python, SQL and Power BI.',
    'about.description3': 'My ambition is clear: become an internationally renowned expert in Data Science and Artificial Intelligence, while being a key driver of digital transformation in Ivory Coast and across the African continent.',
    'about.ambition': 'Ambition',
    'about.ambition.desc': 'Become an internationally recognized expert in AI and data science, with high-level technical expertise.',
    'about.vision': 'Global Vision',
    'about.vision.desc': 'Contribute to the digital transformation of Ivory Coast and the entire African continent, with a positive global impact.',
    'about.innovation': 'Innovation',
    'about.innovation.desc': 'Versatility and a strong sense of innovation, enriched by a unique multicultural experience.',
    'about.availability': 'Internship Availability',
    'about.availability.date': 'April 28 – June 29, 2026',
    
    // Experience
    'experience.title': 'Professional Experience',
    
    // Education
    'education.title': 'Education & Certifications',
    'education.certifications': 'Professional Certifications',
    'education.additional': 'Additional Training',
    
    // Projects
    'projects.title': 'Projects & Achievements',
    'projects.subtitle': 'A selection of my academic and personal projects demonstrating my skills in data science, programming and innovation.',
    'projects.featured': 'Featured Projects',
    'projects.notebooks': 'Notebooks & Analyses',
    'projects.viewCode': 'Code',
    'projects.viewDemo': 'Demo',
    'projects.viewAll': 'View all projects',
    
    // Skills
    'skills.title': 'Skills',
    'skills.technical': 'Technical Skills',
    'skills.soft': 'Soft Skills',
    'skills.languages': 'Languages',
    
    // Contact
    'contact.title': 'Contact Me',
    'contact.subtitle': 'Feel free to contact me to discuss projects, opportunities or simply exchange about data science and AI.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.location': 'Location',
    'contact.rateLimit': 'Maximum 3 messages per hour to prevent abuse.',
    
    // CV Page
    'cv.title': 'My CV',
    'cv.download': 'Download',
    'cv.back': 'Back',
    
    // Chatbot
    'chatbot.title': 'Japhet Assistant',
    'chatbot.subtitle': 'Ask your questions',
    'chatbot.greeting': 'Hello! I am Japhet\'s virtual assistant. Ask me questions about his background, skills or projects!',
    'chatbot.placeholder': 'Ask your question...',
    
    // Hobbies
    'hobbies.title': 'Passions & Activities',
    'hobbies.subtitle': 'Beyond computer science, I cultivate my passions that shape my personality and enrich my approach to challenges.',
    
    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.made': 'Made with',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
