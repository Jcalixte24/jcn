import { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Github, Linkedin, Send, CheckCircle2, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut dépasser 100 caractères"),
  email: z.string().trim().email("Email invalide").max(255, "L'email ne peut dépasser 255 caractères"),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères").max(2000, "Le message ne peut dépasser 2000 caractères"),
});

// Generate a cryptographic challenge token
const generateSecurityToken = (timestamp: number, nonce: string): string => {
  const data = `${timestamp}-${nonce}-portfolio-jcn`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Add some complexity
  const complexHash = Math.abs(hash).toString(36) + 
    timestamp.toString(36) + 
    nonce.split('').reverse().join('');
  return btoa(complexHash);
};

// Generate random nonce
const generateNonce = (): string => {
  return Array.from({ length: 16 }, () => 
    Math.random().toString(36).charAt(2)
  ).join('');
};

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formLoadTime, setFormLoadTime] = useState<number>(Date.now());
  const [nonce, setNonce] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [mouseMovements, setMouseMovements] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  
  // Honeypot fields (multiple for better detection)
  const [honeypot1, setHoneypot1] = useState("");
  const [honeypot2, setHoneypot2] = useState("");
  const [honeypot3, setHoneypot3] = useState("");
  
  const { toast } = useToast();
  const { t, language } = useLanguage();

  // Initialize security on mount
  useEffect(() => {
    const timestamp = Date.now();
    const newNonce = generateNonce();
    setFormLoadTime(timestamp);
    setNonce(newNonce);
    
    // Track mouse movements for human verification
    const handleMouseMove = () => {
      setMouseMovements(prev => prev + 1);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track keystrokes
  const handleKeyDown = useCallback(() => {
    setKeystrokes(prev => prev + 1);
  }, []);

  // Check if user behavior is human-like
  useEffect(() => {
    const timeSinceLoad = Date.now() - formLoadTime;
    const hasEnoughInteraction = mouseMovements > 5 || keystrokes > 3;
    const hasWaitedEnough = timeSinceLoad > 3000; // 3 seconds minimum
    
    if (hasEnoughInteraction && hasWaitedEnough && (name.length > 0 || email.length > 0 || message.length > 0)) {
      setIsVerified(true);
    }
  }, [mouseMovements, keystrokes, formLoadTime, name, email, message]);

  // Generate security token
  const securityToken = useMemo(() => {
    if (nonce && formLoadTime) {
      return generateSecurityToken(formLoadTime, nonce);
    }
    return null;
  }, [nonce, formLoadTime]);

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setMessage("");
    setHoneypot1("");
    setHoneypot2("");
    setHoneypot3("");
    const newTimestamp = Date.now();
    const newNonce = generateNonce();
    setFormLoadTime(newTimestamp);
    setNonce(newNonce);
    setIsVerified(false);
    setMouseMovements(0);
    setKeystrokes(0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      contactSchema.parse({ name, email, message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: language === 'fr' ? "Erreur de validation" : "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    if (!isVerified) {
      toast({
        title: language === 'fr' ? "Vérification en cours" : "Verification in progress",
        description: language === 'fr' ? "Veuillez patienter quelques secondes" : "Please wait a few seconds",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { 
          name, 
          email, 
          message,
          // Anti-spam data
          honeypot1,
          honeypot2,
          honeypot3,
          timestamp: formLoadTime,
          nonce,
          securityToken,
          mouseMovements,
          keystrokes,
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
      });

      if (error) {
        if (error.message?.includes('429') || error.message?.includes('Limite')) {
          toast({
            title: language === 'fr' ? "Limite atteinte" : "Limit reached",
            description: language === 'fr' ? "Vous avez envoyé trop de messages. Réessayez dans 1 heure." : "You've sent too many messages. Try again in 1 hour.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (data && !data.success && data.error) {
        toast({
          title: language === 'fr' ? "Erreur" : "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setIsSuccess(true);
      toast({
        title: language === 'fr' ? "Message envoyé !" : "Message sent!",
        description: language === 'fr' ? "Merci pour votre message. Je vous répondrai bientôt." : "Thank you for your message. I'll reply soon.",
      });

      resetForm();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      console.error("Error sending email:", error);
      
      if (error?.status === 429) {
        toast({
          title: language === 'fr' ? "Limite atteinte" : "Limit reached",
          description: language === 'fr' ? "Vous avez envoyé trop de messages. Réessayez dans 1 heure." : "You've sent too many messages. Try again in 1 hour.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: language === 'fr' ? "Erreur d'envoi" : "Send Error",
        description: language === 'fr' ? "Une erreur est survenue. Veuillez réessayer." : "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    { 
      icon: Mail, 
      label: "Email", 
      value: "japhetndri15@gmail.com",
      href: "mailto:japhetndri15@gmail.com"
    },
    { 
      icon: MapPin, 
      label: t('contact.location'), 
      value: "Vitry-sur-Seine, France",
      href: null
    },
  ];
  
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-muted/30" />
      <motion.div 
        className="absolute top-1/4 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/4 -left-40 w-60 h-60 bg-accent/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span 
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              Contact
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('contact.subtitle')}</p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Info - 2 columns */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/20">
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-5 h-5 text-primary" />
                        </motion.div>
                        <div>
                          <h3 className="font-semibold mb-1">{info.label}</h3>
                          {info.href ? (
                            <a 
                              href={info.href}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">{info.value}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}

              {/* Social Links */}
              <motion.div 
                className="flex gap-4 pt-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {[
                  { icon: Github, href: "https://github.com/Jcalixte24", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/japhet-calixte-n'dri-0b73832a0", label: "LinkedIn" },
                ].map((social) => (
                  <motion.div key={social.label} className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full gap-2 hover:bg-primary/10 hover:border-primary transition-all"
                      asChild
                    >
                      <a href={social.href} target="_blank" rel="noopener noreferrer">
                        <social.icon className="w-5 h-5" />
                        {social.label}
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        {language === 'fr' ? 'Protection anti-spam' : 'Anti-spam protection'}
                      </p>
                      <p className="text-xs text-green-600/70 dark:text-green-500/70">
                        {language === 'fr' ? 'Vos données sont sécurisées' : 'Your data is secure'}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Contact Form - 3 columns */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 shadow-xl border-2 hover:border-primary/10 transition-colors">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                      </motion.div>
                      <motion.h3 
                        className="text-2xl font-bold mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {language === 'fr' ? 'Message envoyé !' : 'Message sent!'}
                      </motion.h3>
                      <motion.p 
                        className="text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {language === 'fr' ? 'Je vous répondrai dans les plus brefs délais.' : 'I will reply as soon as possible.'}
                      </motion.p>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      onSubmit={handleSubmit} 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onKeyDown={handleKeyDown}
                    >
                      {/* Honeypot fields - hidden from users but bots will fill them */}
                      <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
                        <Input 
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot1}
                          onChange={(e) => setHoneypot1(e.target.value)}
                        />
                        <Input 
                          type="text"
                          name="url"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot2}
                          onChange={(e) => setHoneypot2(e.target.value)}
                        />
                        <Input 
                          type="email"
                          name="contact_email"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot3}
                          onChange={(e) => setHoneypot3(e.target.value)}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label htmlFor="name" className="text-sm font-medium">{t('contact.name')}</label>
                          <Input 
                            id="name"
                            placeholder={language === 'fr' ? "Votre nom" : "Your name"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength={2}
                            maxLength={100}
                            className="h-12 transition-all focus:scale-[1.01]"
                          />
                        </motion.div>

                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <label htmlFor="email" className="text-sm font-medium">{t('contact.email')}</label>
                          <Input 
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            maxLength={255}
                            className="h-12 transition-all focus:scale-[1.01]"
                          />
                        </motion.div>
                      </div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex justify-between items-center">
                          <label htmlFor="message" className="text-sm font-medium">{t('contact.message')}</label>
                          <span className={`text-xs transition-colors ${message.length > 1800 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                            {message.length}/2000
                          </span>
                        </div>
                        <Textarea 
                          id="message"
                          placeholder={language === 'fr' ? "Votre message..." : "Your message..."}
                          rows={6}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          minLength={10}
                          maxLength={2000}
                          className="resize-none transition-all focus:scale-[1.005]"
                        />
                      </motion.div>

                      {/* Security Status */}
                      <motion.div 
                        className="flex items-center gap-2 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                      >
                        {isVerified ? (
                          <motion.div 
                            className="flex items-center gap-2 text-green-600"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{language === 'fr' ? 'Vérification réussie' : 'Verification successful'}</span>
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{language === 'fr' ? 'Vérification en cours...' : 'Verifying...'}</span>
                          </div>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Button 
                          type="submit" 
                          size="lg" 
                          className="w-full gap-2 h-14 text-lg font-semibold relative overflow-hidden group"
                          disabled={isLoading || !isVerified}
                        >
                          <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                          />
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {t('contact.sending')}
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              {t('contact.send')}
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
