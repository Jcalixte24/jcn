import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const CV = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
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
      </div>

      {/* Full Page CV Iframe */}
      <div className="flex-1 pt-16">
        <iframe
          src="https://cv-jcn.lovable.app/"
          className="w-full h-[calc(100vh-64px)] border-0"
          title="CV Japhet Calixte N'DRI"
        />
      </div>
    </div>
  );
};

export default CV;
