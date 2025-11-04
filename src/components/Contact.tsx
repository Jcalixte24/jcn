import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Github, Linkedin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(100, "Le nom ne peut dépasser 100 caractères"),
  email: z.string().trim().email("Email invalide").max(255, "L'email ne peut dépasser 255 caractères"),
  message: z.string().trim().min(1, "Le message est requis").max(1000, "Le message ne peut dépasser 1000 caractères"),
});

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    try {
      contactSchema.parse({ name, email, message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erreur de validation",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, message }
      });

      if (error) throw error;

      toast({
        title: "Message envoyé !",
        description: "Merci pour votre message. Je vous répondrai bientôt.",
      });

      // Reset form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Me Contacter
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              N'hésitez pas à me contacter pour discuter de projets, 
              d'opportunités ou simplement échanger sur la data science et l'IA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 hover:shadow-card transition-smooth">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a 
                      href="mailto:japhetndri15@gmail.com"
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      japhetndri15@gmail.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-card transition-smooth">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Téléphone</h3>
                    <a 
                      href="tel:+33745446404"
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      +33 7 45 44 64 04
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-card transition-smooth">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Localisation</h3>
                    <p className="text-muted-foreground">
                      Vitry-sur-Seine, France
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-4 pt-4">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1 gap-2"
                  asChild
                >
                  <a 
                    href="https://github.com/Jcalixte24" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1 gap-2"
                  asChild
                >
                  <a 
                    href="https://www.linkedin.com/in/japhet-calixte-n'dri-0b73832a0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </a>
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nom
                  </label>
                  <Input 
                    id="name"
                    placeholder="Votre nom"
                    className="w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={255}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea 
                    id="message"
                    placeholder="Votre message..."
                    rows={6}
                    className="w-full"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    maxLength={1000}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  <Send className="w-4 h-4" />
                  {isLoading ? "Envoi en cours..." : "Envoyer le Message"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;