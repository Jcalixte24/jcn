import StarField from "@/components/StarField";
import SpaceParticles from "@/components/SpaceParticles";
import ConstellationMap from "@/components/ConstellationMap";
import LanguageSwitch from "@/components/LanguageSwitch";
import { RecruiterChatbot } from "@/components/RecruiterChatbot";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background relative">
      <StarField />
      <SpaceParticles />
      <ConstellationMap />

      {/* Floating controls */}
      <motion.div
        className="fixed top-4 right-4 z-40 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Link
          to="/cv"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-exo text-muted-foreground hover:text-primary transition-colors"
        >
          <FileText className="w-3 h-3" />
          {t("nav.cv")}
        </Link>
        <div className="glass-card rounded-full px-2 py-1">
          <LanguageSwitch />
        </div>
      </motion.div>

      <RecruiterChatbot />
    </div>
  );
};

export default Index;
