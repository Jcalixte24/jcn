import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Github, Linkedin, Send, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

// Turnstile script loader
declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback': () => void;
        theme?: 'light' | 'dark' | 'auto';
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut dépasser 100 caractères"),
  email: z.string().trim().email("Email invalide").max(255, "L'email ne peut dépasser 255 caractères"),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères").max(2000, "Le message ne peut dépasser 2000 caractères"),
});

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formLoadTime, setFormLoadTime] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaWidgetId, setCaptchaWidgetId] = useState<string | null>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  // Load Turnstile script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Initialize Turnstile widget
  useEffect(() => {
    const initTurnstile = () => {
      if (window.turnstile && !captchaWidgetId) {
        const container = document.getElementById('turnstile-container');
        if (container) {
          const widgetId = window.turnstile.render(container, {
            sitekey: '0x4AAAAAABBBBBBccccccDDDDD', // Placeholder - user needs to add their key
            callback: (token: string) => {
              setCaptchaToken(token);
            },
            'error-callback': () => {
              setCaptchaToken(null);
              toast({
                title: language === 'fr' ? "Erreur CAPTCHA" : "CAPTCHA Error",
                description: language === 'fr' ? "Veuillez réessayer" : "Please try again",
                variant: "destructive",
              });
            },
            theme: 'auto',
          });
          setCaptchaWidgetId(widgetId);
        }
      }
    };

    const timeout = setTimeout(initTurnstile, 500);
    return () => clearTimeout(timeout);
  }, [captchaWidgetId, language, toast]);

  useEffect(() => {
    setFormLoadTime(Date.now());
  }, []);

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setMessage("");
    setHoneypot("");
    setFormLoadTime(Date.now());
    setCaptchaToken(null);
    if (captchaWidgetId && window.turnstile) {
      window.turnstile.reset(captchaWidgetId);
    }
  }, [captchaWidgetId]);

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

    // Note: In production, you should verify the captcha token server-side
    // For now, we just check it exists
    if (!captchaToken) {
      toast({
        title: language === 'fr' ? "CAPTCHA requis" : "CAPTCHA required",
        description: language === 'fr' ? "Veuillez compléter la vérification CAPTCHA" : "Please complete the CAPTCHA verification",
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
          honeypot,
          timestamp: formLoadTime,
          captchaToken
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
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
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
                  <Button 
                    key={social.label}
                    size="lg" 
                    variant="outline" 
                    className="flex-1 gap-2 hover:bg-primary/10 hover:border-primary transition-all"
                    asChild
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <social.icon className="w-5 h-5" />
                      {social.label}
                    </a>
                  </Button>
                ))}
              </motion.div>
            </motion.div>

            {/* Contact Form - 3 columns */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 shadow-xl">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-12"
                    >
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">
                        {language === 'fr' ? 'Message envoyé !' : 'Message sent!'}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'fr' ? 'Je vous répondrai dans les plus brefs délais.' : 'I will reply as soon as possible.'}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      onSubmit={handleSubmit} 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Honeypot */}
                      <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                        <Input 
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">{t('contact.name')}</label>
                          <Input 
                            id="name"
                            placeholder={language === 'fr' ? "Votre nom" : "Your name"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength={2}
                            maxLength={100}
                            className="h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">{t('contact.email')}</label>
                          <Input 
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            maxLength={255}
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label htmlFor="message" className="text-sm font-medium">{t('contact.message')}</label>
                          <span className="text-xs text-muted-foreground">{message.length}/2000</span>
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
                          className="resize-none"
                        />
                      </div>

                      {/* Turnstile CAPTCHA Container */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Shield className="w-4 h-4" />
                          <span>{language === 'fr' ? 'Vérification de sécurité' : 'Security verification'}</span>
                        </div>
                        <div id="turnstile-container" className="flex justify-center py-2" />
                        {captchaToken && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{language === 'fr' ? 'Vérifié' : 'Verified'}</span>
                          </div>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full gap-2 h-12 text-lg"
                        disabled={isLoading || !captchaToken}
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            {t('contact.sending')}
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            {t('contact.send')}
                          </>
                        )}
                      </Button>
                      
                      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                        <AlertCircle className="w-3 h-3" />
                        {t('contact.rateLimit')}
                      </p>
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
