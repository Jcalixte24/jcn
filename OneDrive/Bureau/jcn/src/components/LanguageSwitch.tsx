import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitch = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 font-medium hover:bg-primary/10 transition-smooth"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-bold">{language === 'fr' ? 'EN' : 'FR'}</span>
    </Button>
  );
};

export default LanguageSwitch;
