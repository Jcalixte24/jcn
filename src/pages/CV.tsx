import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";

const CV = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" className="gap-2" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4" />
                {t('cv.back')}
              </Link>
            </Button>
            
            <Button className="gap-2" asChild>
              <a href="https://cv-jcn.lovable.app/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                {t('cv.download')}
              </a>
            </Button>
          </div>

          {/* CV Iframe */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
            <iframe
              src="https://cv-jcn.lovable.app/"
              className="w-full h-[85vh] border-0"
              title="CV Japhet Calixte N'DRI"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CV;
