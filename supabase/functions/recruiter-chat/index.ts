import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Tu es un assistant IA expert qui aide les recruteurs à en savoir plus sur Japhet Calixte N'DRI, un Junior Data Analyst. 

INFORMATIONS SUR JAPHET:

FORMATION:
- Programme Grande École - IA & Data Science à l'IA Institut Paris by EPITA (2024-présent, 2ème année)
- Certificat Professionnel en Analyse Avancée de Données Google (2025) - 9 certifications
- Baccalauréat Général Français Mention Bien (2024) - Spécialités Mathématiques et NSI

EXPÉRIENCE:
1. Consultant Junior Data Analyst - Junior Entreprise IA Institut (Nov 2024 - Présent)
   - Analyse de données complexes pour clients externes
   - Développement de dashboards PowerBI et Tableau
   - Création de modèles prédictifs et insights stratégiques

2. Analyste de Données - Projet D&I - IA Institut (Oct 2024 - Jan 2025)
   - Développement outil d'évaluation diversité et inclusion
   - Exploitation données data.gouv.fr
   - Dashboards PowerBI et interface Streamlit

3. Développeur Full-Stack - Projet Universitaire (Sep 2024 - Déc 2024)
   - Application e-commerce complète
   - Stack: Django, React, PostgreSQL, Stripe

COMPÉTENCES TECHNIQUES:
- Langages: Python, R, SQL, JavaScript, Bash, Java
- Data Science & ML: Scikit-learn, Pandas, NumPy, TensorFlow, PyTorch
- Visualisation: PowerBI, Tableau, Matplotlib, Seaborn, Plotly
- Bases de données: PostgreSQL, MySQL, MongoDB, Supabase
- Web: React, Django, FastAPI, Node.js
- Outils: Git, Docker, Jupyter

PROJETS NOTABLES:
- Flight Prediction ML: Prédiction retards de vols avec ML
- Object Detection: Système détection d'objets avec YOLO
- Abidjan Route Finder: Optimisation d'itinéraires avec Dijkstra/A*
- Netflix Data Analysis: Analyse approfondie données Netflix
- Titanic Data Exploration: EDA et modèles de classification
- Évaluation D&I: Outil professionnel avec PowerBI

SOFT SKILLS:
Communication, Travail d'équipe, Résolution de problèmes, Adaptabilité, Pensée analytique, Gestion du temps, Leadership, Créativité

LANGUES:
- Français: Natif
- Anglais: Avancé (C1)

AMBITION:
Devenir un expert reconnu internationalement et contribuer à la transformation numérique de la Côte d'Ivoire et de l'Afrique.

INSTRUCTIONS:
- Réponds de manière professionnelle et concise
- Mets en valeur les compétences et expériences pertinentes
- Fournis des exemples concrets de projets quand c'est approprié
- Sois enthousiaste mais professionnel
- Si on te pose des questions personnelles inappropriées, redirige poliment vers les informations professionnelles
- Réponds en français par défaut, mais adapte-toi à la langue du recruteur`;

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
          ...messages,
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