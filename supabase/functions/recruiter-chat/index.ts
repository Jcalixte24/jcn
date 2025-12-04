import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting for chatbot
const chatRateLimitMap = new Map<string, { count: number; firstRequest: number }>();
const CHAT_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_CHAT_REQUESTS_PER_WINDOW = 10; // Max 10 messages per minute

// Validation constants
const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES_IN_HISTORY = 20;
const VALID_ROLES = ['user', 'assistant'];

interface ChatMessage {
  role: string;
  content: string;
}

// Validate a single message
function isValidMessage(msg: unknown): msg is ChatMessage {
  if (!msg || typeof msg !== 'object') return false;
  const m = msg as Record<string, unknown>;
  
  if (typeof m.role !== 'string' || !VALID_ROLES.includes(m.role)) return false;
  if (typeof m.content !== 'string') return false;
  if (m.content.length > MAX_MESSAGE_LENGTH) return false;
  if (m.content.trim().length === 0) return false;
  
  return true;
}

// Validate messages array
function validateMessages(messages: unknown): { valid: boolean; error?: string; sanitized?: ChatMessage[] } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: "Format de messages invalide" };
  }
  
  if (messages.length === 0) {
    return { valid: false, error: "Aucun message fourni" };
  }
  
  if (messages.length > MAX_MESSAGES_IN_HISTORY) {
    return { valid: false, error: `Trop de messages (max: ${MAX_MESSAGES_IN_HISTORY})` };
  }
  
  const sanitized: ChatMessage[] = [];
  for (const msg of messages) {
    if (!isValidMessage(msg)) {
      return { valid: false, error: "Message mal formaté ou trop long" };
    }
    // Sanitize content - remove potential injection attempts
    sanitized.push({
      role: msg.role,
      content: msg.content.trim().slice(0, MAX_MESSAGE_LENGTH)
    });
  }
  
  return { valid: true, sanitized };
}

// Rate limit check
function checkChatRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = chatRateLimitMap.get(identifier);
  
  if (!record) {
    chatRateLimitMap.set(identifier, { count: 1, firstRequest: now });
    return true;
  }
  
  if (now - record.firstRequest > CHAT_RATE_LIMIT_WINDOW) {
    chatRateLimitMap.set(identifier, { count: 1, firstRequest: now });
    return true;
  }
  
  if (record.count >= MAX_CHAT_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  record.count++;
  return true;
}

// Get client identifier from request
function getClientIdentifier(req: Request): string {
  // Try to get IP from various headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfIp = req.headers.get('cf-connecting-ip');
  
  return cfIp || realIp || forwarded?.split(',')[0] || 'unknown';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientId = getClientIdentifier(req);
    if (!checkChatRateLimit(clientId)) {
      console.log(`Chat rate limit exceeded for: ${clientId}`);
      return new Response(
        JSON.stringify({ error: "Trop de messages. Attendez un moment avant de réessayer." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { messages } = body;
    
    // Validate messages
    const validation = validateMessages(messages);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Tu es l'assistant virtuel de Japhet Calixte N'DRI. Tu représentes Japhet auprès des recruteurs et tu réponds à leurs questions sur son profil professionnel.

INFORMATIONS SUR JAPHET CALIXTE N'DRI:

FORMATION:
- Programme Grande École - IA & Data Science à l'IA Institut Paris by EPITA (2024-présent, 2ème année)
- Certificat Professionnel en Analyse Avancée de Données Google (2025) - 9 certifications complètes
- Baccalauréat Général Français Mention Bien (2024) - Spécialités Mathématiques et NSI

EXPÉRIENCE PROFESSIONNELLE:
1. Développeur Web Freelance - Myll Production (Février 2023 - Février 2025, 2 ans 1 mois)
   - Conception et développement de solutions web responsives
   - Intégration d'outils d'analyse (Google Analytics) pour améliorer les performances
   - Travail en télétravail depuis Abidjan

2. Consultant Junior Data Analyst - Junior Entreprise IA Institut (Nov 2024 - Présent)
   - Analyse de données complexes pour clients externes
   - Développement de dashboards PowerBI et Tableau
   - Création de modèles prédictifs et insights stratégiques

3. Analyste de Données - Projet D&I - IA Institut (Oct 2024 - Jan 2025)
   - Développement outil d'évaluation diversité et inclusion
   - Exploitation données data.gouv.fr
   - Dashboards PowerBI et interface Streamlit

4. Développeur Full-Stack - Projet Universitaire (Sep 2024 - Déc 2024)
   - Application e-commerce complète
   - Stack: Django, React, PostgreSQL, Stripe

COMPÉTENCES TECHNIQUES:
- Langages de programmation: Python, R, SQL, JavaScript, TypeScript, Bash, Java
- Data Science & ML: Scikit-learn, Pandas, NumPy, TensorFlow, PyTorch, Keras
- Visualisation de données: PowerBI, Tableau, Matplotlib, Seaborn, Plotly
- Bases de données: PostgreSQL, MySQL, MongoDB, Supabase
- Développement Web: React, Django, FastAPI, Node.js, HTML/CSS
- Outils DevOps: Git, Docker, Jupyter

PROJETS NOTABLES (sur GitHub):
- Flight Prediction ML: Prédiction des retards de vols avec Machine Learning
- Object Detection: Système de détection d'objets avec YOLO
- Abidjan Route Finder: Optimisation d'itinéraires avec algorithmes Dijkstra/A*
- Netflix Data Analysis: Analyse approfondie des données Netflix
- Titanic Data Exploration: Analyse exploratoire et modèles de classification
- Évaluateur Diversité & Inclusion: Outil professionnel avec PowerBI

CERTIFICATIONS RÉCENTES:
- 6 certificats Columbia+ "Learning AI Through Visualization" (juillet 2025)
- 8 certifications Google Analytics via Coursera (juin 2025): Data Analytics, Data Cleaning, Data Visualization, Databases, etc.

SOFT SKILLS:
Communication efficace, Travail d'équipe, Résolution de problèmes, Adaptabilité, Pensée analytique, Gestion du temps, Leadership, Créativité

LANGUES:
- Français: Langue maternelle
- Anglais: Niveau avancé (C1)

AMBITION ET VISION:
Devenir un expert reconnu internationalement en Data Science et Intelligence Artificielle, et contribuer activement à la transformation numérique de la Côte d'Ivoire et de l'ensemble du continent africain.

CONTACT:
- Email: japhetndri15@gmail.com
- LinkedIn: linkedin.com/in/japhet-calixte-n'dri-0b73832a0
- GitHub: github.com/Jcalixte24

INSTRUCTIONS IMPORTANTES:
- RÉPONDS TOUJOURS DIRECTEMENT aux questions posées, ne repose JAMAIS de questions
- Parle au nom de Japhet en utilisant la première personne ("J'ai travaillé", "Mes compétences incluent", etc.)
- Sois concis, professionnel et enthousiaste
- Mets en valeur les compétences et expériences les plus pertinentes par rapport à la question
- Fournis des exemples concrets de projets quand c'est approprié
- Si une question est trop personnelle ou hors sujet professionnel, redirige poliment vers les informations professionnelles
- Réponds en français par défaut, mais adapte-toi à la langue du recruteur
- NE POSE JAMAIS de questions au recruteur, contente-toi de répondre à ses questions
- NE DIVULGUE PAS d'informations personnelles sensibles au-delà de ce qui est fourni ici`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...validation.sanitized!,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, réessayez plus tard." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erreur du service IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
