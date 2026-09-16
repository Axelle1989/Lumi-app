import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initialization of Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const LUMI_BASE_SYSTEM_INSTRUCTION = `
Tu es Lumi, une intelligence artificielle bienveillante, chaleureuse, encourageante et inspirante.
Devise de la plateforme : "Lumi - Grandir, Créer, Guérir et Réussir Ensemble".

Ta mission est d'offrir un espace sûr où les utilisateurs peuvent parler de leurs émotions, de leurs doutes, de leurs complexes, de leur solitude, de leur tristesse ou de leurs difficultés du quotidien, mais aussi grandir, développer leurs projets, réussir leurs études et leurs objectifs personnels.

Règles absolues que tu respectes avec dévouement :
1. Réponds toujours avec respect, douceur et bienveillance.
2. Valorise les qualités et les efforts de l'utilisateur.
3. Encourage l'estime de soi, la confiance et l'acceptation de soi.
4. N'humilie jamais l'utilisateur.
5. Ne juge jamais son apparence physique, son origine, sa situation ou ses émotions.
6. N'encourage jamais la violence, l'automutilation, la haine ou les comportements dangereux.
7. Si une personne exprime une grande détresse, parle de se faire du mal ou d'idées noires :
   - Réponds avec une immense compassion et sans jugement.
   - Fournis immédiatement les ressources d'aide :
     * 🇧🇯 Pour le Bénin : Appeler le 01 47 81 67 78, contacter un proche de confiance, ou se rendre dans un centre de santé qualifié.
     * 🇫🇷 En France : Appeler le 3114 (numéro national de prévention du suicide, 24/7) ou SOS Amitié au 09 72 39 40 50.
     * 🌍 International : Joindre les services d'urgence locaux (112, 15, 911).
   - Encourage toujours avec délicatesse la recherche d'aide humaine et médicale.
8. Propose des activités positives adaptées : gratitude, écriture, respiration consciente (cohérence cardiaque), dessin, musique, repos ou développement personnel.
9. Utilise un ton profondément humain, chaleureux, poétique et naturel. Tu parles en français doux et apaisant.
10. Tu peux être amusante, légère et souriante lorsque le contexte s'y prête.
11. Mets en avant l'espoir, la résilience et les possibilités d'amélioration.
12. Respecte les émotions de l'utilisateur sans les minimiser ni les rejeter ("Je t'écoute", "Ce que tu ressens est légitime").
13. Aide l'utilisateur à trouver des solutions constructives, douces et réalistes pas à pas.
14. Ne fais JAMAIS croire que tu es un médecin ou un psychologue. Rappelle délicatement si besoin que tu es une compagne d'écoute et de croissance.
15. Lorsque l'utilisateur partage un poème, une chanson, un dessin, un projet ou un objectif, réagis avec une grande sensibilité et des encouragements sincères.
16. Encourage les utilisateurs à exprimer leurs émotions, leurs progrès, leurs espoirs et leurs victoires du quotidien.
17. N'hésite pas à faire des phrases réconfortantes, claires et aérées, avec quelques émojis doux (✨, 💛, 🌸, 🌱, 🎯, 🕊️).

MÉMOIRE ET CONTINUITÉ RELATIONNELLE :
Tu possèdes une mémoire personnelle pour chaque utilisateur (objectifs, habitudes, projets, difficultés déjà évoquées, préférences).
Lorsque l'utilisateur revient ou discute, n'hésite pas à faire référence avec bienveillance à ses projets (ex: "Tu travaillais ton anglais ces temps-ci. Comment te sens-tu avec ça aujourd'hui ?" ou "Où en es-tu de ton objectif d'épargne ?"). Montre-lui qu'il a de l'importance et que ses progrès comptent pour toi.

Ton objectif absolu est que chaque utilisateur quitte la conversation avec plus d'espoir, de clarté, de confiance et de sérénité qu'à son arrivée.
`;

// Helper to generate content with fallback
async function generateWithModelFallback(params: {
  contents: any;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
}): Promise<string> {
  const ai = getAI();
  const models = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];

  for (const model of models) {
    try {
      const config: any = {};
      if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
      if (params.temperature !== undefined) config.temperature = params.temperature;
      if (params.responseMimeType) config.responseMimeType = params.responseMimeType;

      const response = await ai.models.generateContent({
        model: model,
        contents: params.contents,
        config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} unavailable: ${err.message}`);
    }
  }

  throw new Error("Tous les modèles sont momentanément occupés.");
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Private Chat endpoint with Lumi & Memory Context
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userMemory, userGoals, username } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      return res.json({
        reply: "Je suis là, avec toi. Même si ma connexion aux étoiles est momentanément limitée, sache que ta présence compte et que tes émotions sont précieuses. Respire doucement, tu n'es pas seul(e). ✨💛",
      });
    }

    let systemInstruction = LUMI_BASE_SYSTEM_INSTRUCTION;
    if (username) {
      systemInstruction += `\nL'utilisateur s'appelle : ${username}.`;
    }
    if (userMemory && Array.isArray(userMemory) && userMemory.length > 0) {
      systemInstruction += `\n\nÉLÉMENTS DE MÉMOIRE PERSONNELLE QUE TU TE RAPPELES SUR ${username || "L'UTILISATEUR"} :\n` +
        userMemory.map((item: string) => `- ${item}`).join("\n") +
        `\nFais référence avec naturel et délicatesse à ces souvenirs quand c'est pertinent.`;
    }
    if (userGoals && Array.isArray(userGoals) && userGoals.length > 0) {
      systemInstruction += `\n\nOBJECTIFS ACTIFS DE L'UTILISATEUR :\n` +
        userGoals.map((g: any) => `- [${g.category}] ${g.title} (Progression: ${g.currentProgress || 0}%)`).join("\n") +
        `\nSi approprié, encourage-le ou prends des nouvelles de ses objectifs avec tendresse.`;
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const replyText = await generateWithModelFallback({
      contents: contents,
      systemInstruction,
      temperature: 0.7,
    });

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.json({
      reply: "Je suis là à tes côtés. Même dans les moments de silence ou de doute, prends une grande inspiration et rappelle-toi que chaque pas que tu fais est précieux. Comment te sens-tu en ce moment ? 🌸✨",
    });
  }
});

// AI Personal Coach Endpoint
app.post("/api/coach-chat", async (req, res) => {
  try {
    const { mode, messages, username, userGoals, userMemories } = req.body;
    const coachMode = mode || "motivation";

    const COACH_PROFILES: Record<string, string> = {
      motivation: "Tu es le Coach Motivation de Lumi. Ton rôle : redonner du souffle, raviver l'étincelle intérieure, briser la procrastination avec bienveillance et célébrer les micro-victoires.",
      etudes: "Tu es le Coach Études de Lumi. Ton rôle : accompagner dans la préparation des examens, les révisions méthodiques (Feynman, blocs de temps), la concentration et la gestion du trac.",
      organisation: "Tu es le Coach Organisation de Lumi. Ton rôle : aider à structurer l'emploi du temps, prioriser l'essentiel, éviter la surcharge mentale et installer des routines saines.",
      creativite: "Tu es le Coach Créativité de Lumi. Ton rôle : débloquer l'imaginaire, dépasser la peur du jugement, proposer des pistes poétiques, artistiques et d'écriture.",
      confiance: "Tu es le Coach Confiance en Soi de Lumi. Ton rôle : apaiser le syndrome de l'imposteur, valoriser les forces uniques de la personne, préparer aux prises de parole et cultiver l'auto-compassion."
    };

    let coachSystem = (COACH_PROFILES[coachMode] || COACH_PROFILES.motivation) +
      `\n\nAdopte un style structuré mais extrêmement chaleureux et encourageant. Propose à la fin de tes réponses 2 ou 3 actions concrètes et douces (puces "Action pas à pas").`;

    if (username) coachSystem += `\nL'utilisateur s'appelle : ${username}.`;
    if (userGoals && Array.isArray(userGoals) && userGoals.length > 0) {
      coachSystem += `\nObjectifs de l'utilisateur : ` + userGoals.map((g: any) => g.title).join(", ");
    }
    if (userMemories && Array.isArray(userMemories) && userMemories.length > 0) {
      coachSystem += `\nContexte mémorisé : ` + userMemories.join(" ; ");
    }

    const contents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const replyText = await generateWithModelFallback({
      contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: "Bonjour Coach Lumi !" }] }],
      systemInstruction: coachSystem,
      temperature: 0.7,
    });

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Coach error:", error);
    res.json({
      reply: "Je suis à tes côtés pour t'aider à progresser à ton rythme. Quelle est la première petite étape que nous pourrions franchir ensemble aujourd'hui ? 🎯✨",
    });
  }
});

// Image Generation Endpoint with Gemini Imagen / Model
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
      try {
        const ai = getAI();
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1",
            },
          },
        });

        if (response && response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || "image/png";
              return res.json({
                imageUrl: `data:${mime};base64,${part.inlineData.data}`,
                caption: `Création Lumi inspirée de : "${prompt}"`,
                source: "gemini",
              });
            }
          }
        }
      } catch (err: any) {
        console.warn("Gemini image generation fallback triggered:", err.message);
      }
    }

    // High quality curated thematic images based on prompt keywords
    const p = prompt.toLowerCase();
    let curatedUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"; // Sunset hope
    if (p.includes("coucher") || p.includes("soleil") || p.includes("sunset") || p.includes("espoir")) {
      curatedUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80";
    } else if (p.includes("nuit") || p.includes("etoile") || p.includes("lune") || p.includes("cosmos")) {
      curatedUrl = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80";
    } else if (p.includes("foret") || p.includes("arbre") || p.includes("nature") || p.includes("fleur")) {
      curatedUrl = "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80";
    } else if (p.includes("ocean") || p.includes("mer") || p.includes("eau") || p.includes("vague")) {
      curatedUrl = "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80";
    } else if (p.includes("etude") || p.includes("livre") || p.includes("succes") || p.includes("projet")) {
      curatedUrl = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80";
    } else {
      curatedUrl = "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80";
    }

    res.json({
      imageUrl: curatedUrl,
      caption: `Illustration générée avec bienveillance pour : "${prompt}"`,
      source: "curated",
    });
  } catch (error: any) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: "Impossible de générer l'image." });
  }
});

// Creative Studio Endpoint (Poem, Song, Story, Affirmations, Project Ideas, Illustrated Quote)
app.post("/api/generate-creative", async (req, res) => {
  try {
    const { type, prompt, theme, tone } = req.body;

    const instructions: Record<string, string> = {
      poem: "Compose un poème touchant, profond et inspirant (3 à 4 strophes bien rimées ou libres). Donne-lui un titre lumineux.",
      song: "Écris les paroles d'une chanson entraînante et réconfortante avec : [Couplet 1], [Refrain], [Couplet 2], [Pont], [Refrain final]. Indique le tempo suggéré et l'émotion.",
      story: "Raconte un conte ou une courte histoire inspirante (environ 300 mots) métaphorique qui donne de la force et montre comment surmonter une épreuve.",
      affirmations: "Génère 6 affirmations positives puissantes, faciles à réciter chaque matin pour ancrer la confiance, la gratitude et la paix.",
      project_ideas: "Propose 3 idées de projets innovants, réalistes et bienveillants (artistique, scolaire/étudiant, ou communautaire). Décris l'impact et la première étape concrète pour chacun.",
      quote_card: "Formule une citation inspirante originale, percutante et poétique, avec son explication philosophique bienveillante."
    };

    const task = instructions[type] || instructions.poem;
    const fullPrompt = `${task}
Thème ou demande de l'utilisateur : "${prompt || theme || "Espoir et renouveau"}"
Ton souhaité : ${tone || "Chaleureux, poétique et motivant"}

Rédige en français avec élégance et sensibilité.`;

    const text = await generateWithModelFallback({
      contents: fullPrompt,
      systemInstruction: LUMI_BASE_SYSTEM_INSTRUCTION,
      temperature: 0.8,
    });

    res.json({ content: text });
  } catch (error: any) {
    console.error("Creative generation error:", error);
    res.json({
      content: `Sous chaque nuit se prépare l'aurore,\nChaque bourgeon attend son heure pour éclore.\nNe doute jamais du chemin parcouru,\nLa plus belle clarté est celle qui a cru. ✨🌱`,
    });
  }
});

// Smart Planner & Goal Breakdown Endpoint
app.post("/api/generate-plan", async (req, res) => {
  try {
    const { title, category, targetValue, deadline, timeframe, currentSituation } = req.body;

    const prompt = `L'utilisateur souhaite accomplir cet objectif :
Titre : "${title}"
Catégorie : ${category} (personnel, scolaire, financier, sport, ou projet)
Objectif chiffré ou résultat visé : "${targetValue || "Non spécifié"}"
Échéance souhaitée : "${deadline || timeframe || "Dans les prochains mois"}"
Situation de départ : "${currentSituation || "Débutant motivé"}"

Tu es Lumi, assistante et planificatrice intelligente bienveillante.
Génère un plan d'action réaliste, motivant et adapté au format JSON STRICT suivant :
{
  "summary": "Résumé bienveillant et analyse de la faisabilité (2-3 phrases)",
  "financialBreakdown": "Si objectif financier (ex: FCFA), précise l'effort hebdomadaire et mensuel requis. Sinon laisser vide.",
  "milestones": [
    { "title": "Étape 1 concrète", "targetDate": "Semaine 1" },
    { "title": "Étape 2 concrète", "targetDate": "Semaine 2-3" },
    { "title": "Étape 3 concrète", "targetDate": "Mois 1" },
    { "title": "Étape 4 d'accomplissement", "targetDate": "Final" }
  ],
  "schedule": [
    { "day": "Lundi", "time": "30 min", "activity": "Action précise" },
    { "day": "Mercredi", "time": "45 min", "activity": "Action précise" },
    { "day": "Vendredi", "time": "30 min", "activity": "Action précise" },
    { "day": "Dimanche", "time": "15 min", "activity": "Bilan de la semaine et repos" }
  ],
  "lumiEncouragement": "Message d'encouragement personnalisé et chaleureux de Lumi."
}`;

    const textOutput = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: LUMI_BASE_SYSTEM_INSTRUCTION,
      temperature: 0.6,
      responseMimeType: "application/json",
    });

    let parsed;
    try {
      parsed = JSON.parse(textOutput);
    } catch {
      parsed = {
        summary: `Un magnifique projet qui mérite d'être réalisé pas à pas. Tu en es tout à fait capable !`,
        financialBreakdown: category === "financier" ? "Épargne recommandée : un montant fixe régulier chaque semaine." : "",
        milestones: [
          { title: "Clarifier et poser les bases du plan", targetDate: "Semaine 1" },
          { title: "Mettre en place la première routine d'action", targetDate: "Semaine 2" },
          { title: "Évaluer à mi-parcours et ajuster le rythme", targetDate: "Mois 1" },
          { title: "Célébrer l'accomplissement", targetDate: "Objectif atteint" },
        ],
        schedule: [
          { day: "Lundi", time: "30 min", activity: "Mise en route de la semaine" },
          { day: "Mercredi", time: "30 min", activity: "Progression active" },
          { day: "Vendredi", time: "30 min", activity: "Consolidation" },
          { day: "Samedi", time: "15 min", activity: "Bilan et auto-félicitation" },
        ],
        lumiEncouragement: "Chaque pas, même le plus discret, te rapproche de ta victoire. Je crois en toi ! ✨",
      };
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("Plan generator error:", error);
    res.json({
      summary: "Voici un premier plan d'action pour te guider.",
      milestones: [
        { title: "Définir la première action", targetDate: "Aujourd'hui" },
        { title: "Maintenir l'élan", targetDate: "Cette semaine" },
      ],
      schedule: [{ day: "Quotidien", time: "20 min", activity: "Action régulière" }],
      lumiEncouragement: "Respire et avance pas à pas. Tu as tout le potentiel nécessaire. 💛",
    });
  }
});

// Memory extraction endpoint: extracts key user facts to store in personal profile
app.post("/api/extract-memory", async (req, res) => {
  try {
    const { userMessage } = req.body;
    if (!userMessage || typeof userMessage !== "string" || userMessage.length < 15) {
      return res.json({ memoryFact: null });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      return res.json({ memoryFact: null });
    }

    const prompt = `Analyse ce message envoyé par l'utilisateur à son IA de soutien émotionnel et de développement personnel.
Si ce message contient une information personnelle importante et récurrente sur sa vie (ex: "veut améliorer son anglais", "économise 300 000 FCFA", "prépare son examen de médecine", "vit au Bénin", "se sent souvent stressé le soir", "passionné de poésie"), résume ce fait marquant en 1 phrase courte au style direct (ex: "Travaille activement pour améliorer son anglais").
Si le message est juste un bonjour, une question générale ou ne contient pas d'information marquante, réponds "AUCUN".

Message : "${userMessage}"
Réponse (factuel et court ou AUCUN) :`;

    const fact = await generateWithModelFallback({
      contents: prompt,
      temperature: 0.3,
    });

    const clean = fact.trim();
    if (!clean || clean.toUpperCase().includes("AUCUN") || clean.length < 4) {
      return res.json({ memoryFact: null });
    }

    res.json({ memoryFact: clean });
  } catch {
    res.json({ memoryFact: null });
  }
});

// Endpoint for Lumi's gentle reaction on a community creation
app.post("/api/lumi-react-post", async (req, res) => {
  try {
    const { title, type, content, author } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      return res.json({
        comment: `Merci infiniment pour ce partage si touchant, ${author || "cher voyageur"}. Tes mots résonnent avec sincérité et lumière. ✨💛`,
      });
    }

    const prompt = `Voici une création partagée par un membre de notre communauté bienveillante :
Auteur : ${author || "Anonyme"}
Type : ${type}
Titre : ${title}
Contenu :
"${content}"

En tant que Lumi, écris un mot bienveillant, chaleureux, sensible et valorisant pour cette création (3 à 4 phrases douces). Souligne la beauté, le courage, la sincérité ou l'expression artistique de ce geste.`;

    const comment = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: LUMI_BASE_SYSTEM_INSTRUCTION,
      temperature: 0.8,
    });

    res.json({ comment });
  } catch (error: any) {
    console.error("Lumi react error:", error);
    res.json({
      comment: "Merci du fond du cœur pour cette offrande d'émotions et de sincérité. Ta sensibilité illumine notre espace. 💛✨",
    });
  }
});

// Future letter blessing endpoint
app.post("/api/bless-future-letter", async (req, res) => {
  try {
    const { title, content, unlockDate, username } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      return res.json({
        blessing: `Que cette lettre scellée pour le ${unlockDate} soit une boussole bienveillante pour ton futur moi. Tu es plus fort(e) que tu ne le crois. ✨💛`,
      });
    }

    const prompt = `Un utilisateur nommé ${username || "un ami"} a écrit une "Lettre à mon futur moi", scellée pour être ouverte le ${unlockDate}.
Titre : "${title}"
Contenu de sa lettre : "${content}"

En tant que Lumi, rédige une courte bénédiction bienveillante et poétique (2 à 3 phrases) pour accompagner cette capsule temporelle.`;

    const blessing = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: LUMI_BASE_SYSTEM_INSTRUCTION,
      temperature: 0.8,
    });

    res.json({ blessing });
  } catch {
    res.json({
      blessing: `Que cette capsule temporelle conserve précieusement tes espoirs d'aujourd'hui et illumine le chemin de ton futur moi. ✨🌱`,
    });
  }
});

// Community moderation verification endpoint
app.post("/api/moderate", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.json({ safe: true });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      return res.json({ safe: true });
    }

    const prompt = `Vérifie si ce texte respecte les règles de bienveillance d'une communauté d'entraide (aucun harcèlement, insulte, humiliation, incitation à la haine ou à la violence) :
Texte : "${text}"

Réponds uniquement sous forme de JSON strict:
{"safe": true, "reason": ""} OU {"safe": false, "reason": "explication brève"}`;

    const textOutput = await generateWithModelFallback({
      contents: prompt,
      responseMimeType: "application/json",
    });

    const parsed = JSON.parse(textOutput || '{"safe": true}');
    res.json(parsed);
  } catch (error) {
    console.error("Moderation error:", error);
    res.json({ safe: true });
  }
});

// 🎓 Endpoint: Study Sheet Generator (Fiches de révision structurées)
app.post("/api/generate-study-sheet", async (req, res) => {
  try {
    const { subject, topic, level } = req.body;
    const prompt = `Tu es Lumi, mentor scolaire bienveillant et expert en neurosciences de l'apprentissage.
Génère une fiche de révision ultra-claire et pédagogique pour :
Matière : "${subject || "Général"}"
Sujet / Chapitre : "${topic || "Sujet clé"}"
Niveau : "${level || "Lycée / Université"}"

Format JSON STRICT :
{
  "title": "Titre clair de la fiche",
  "feynmanSummary": "Résumé simple en 2 phrases comme si on l'expliquait à un ami",
  "keyConcepts": [
    { "term": "Concept 1", "definition": "Définition limpide" },
    { "term": "Concept 2", "definition": "Définition limpide" },
    { "term": "Concept 3", "definition": "Définition limpide" }
  ],
  "essentialPoints": [
    "Point clé incontournable 1",
    "Point clé incontournable 2",
    "Point clé incontournable 3",
    "Point clé incontournable 4"
  ],
  "memoryHook": "Moyen mnémotechnique amusant ou astuce visuelle pour retenir facilement",
  "examTip": "Conseil stratégique pour le jour de l'épreuve",
  "encouragement": "Mot bienveillant de Lumi pour encourager l'étudiant"
}`;

    const output = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: LUMI_BASE_SYSTEM_INSTRUCTION,
      temperature: 0.6,
      responseMimeType: "application/json",
    });

    let sheet;
    try {
      sheet = JSON.parse(output);
    } catch {
      sheet = {
        title: `Fiche de révision : ${topic || subject}`,
        feynmanSummary: "Comprendre les principes fondamentaux et les relier à des exemples concrets du quotidien.",
        keyConcepts: [
          { term: "Principe central", definition: "La base théorique essentielle à maîtriser." },
          { term: "Application pratique", definition: "Comment ce concept se traduit concrètement dans les exercices." }
        ],
        essentialPoints: [
          "Bien structurer la réponse avec une introduction claire",
          "Illustrer chaque argument par une formule ou un exemple précis",
          "Prendre 5 minutes pour relire sans précipitation"
        ],
        memoryHook: "Associe chaque mot-clé à une image mentale marquante !",
        examTip: "Commence toujours par les questions que tu maîtrises le mieux pour engranger des points et de la confiance.",
        encouragement: "Tu as la capacité de retenir et de briller. Fais-toi confiance ! ✨🎓"
      };
    }

    res.json(sheet);
  } catch (error: any) {
    console.error("Study sheet error:", error);
    res.status(500).json({ error: "Erreur lors de la génération de la fiche." });
  }
});

// 🎓 Endpoint: Automated Interactive Quiz Generator (Quiz automatiques)
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { subject, topic, questionCount } = req.body;
    const count = questionCount || 4;
    const prompt = `Tu es Lumi. Génère un quiz d'entraînement interactif et stimulant de ${count} questions pour :
Matière : "${subject || "Culture générale / Études"}"
Sujet : "${topic || "Révision d'examen"}"

Format JSON STRICT :
{
  "title": "Titre du quiz",
  "questions": [
    {
      "id": 1,
      "question": "Question claire et précise ?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Explication pédagogique et bienveillante de la bonne réponse."
    }
  ],
  "lumiBonusTip": "Astuce de mémorisation de Lumi sur ce sujet"
}`;

    const output = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: LUMI_BASE_SYSTEM_INSTRUCTION,
      temperature: 0.6,
      responseMimeType: "application/json",
    });

    let quiz;
    try {
      quiz = JSON.parse(output);
    } catch {
      quiz = {
        title: `Quiz d'entraînement : ${topic || subject}`,
        questions: [
          {
            id: 1,
            question: `Quel est l'élément clé à retenir concernant ${topic || "ce chapitre"} ?`,
            options: [
              "La régularité et la méthode de répétition espacée",
              "Le bachotage intensif la veille au soir sans dormir",
              "L'apprentissage passif sans prise de notes",
              "L'absence totale de révision"
            ],
            correctIndex: 0,
            explanation: "La répétition espacée permet d'ancrer les savoirs dans la mémoire à long terme sans épuisement."
          }
        ],
        lumiBonusTip: "Relis les explications avec curiosité, chaque erreur est une marche vers la maîtrise ! ✨"
      };
    }

    res.json(quiz);
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: "Erreur lors de la génération du quiz." });
  }
});

// 🧭 Endpoint: Trouver sa voie (Ikigai & Orientation professionnelle)
app.post("/api/orientation-analysis", async (req, res) => {
  try {
    const { loves, skills, values, dreamProjects, preferredEnvironment } = req.body;
    const prompt = `Tu es Lumi, conseillère en orientation bienveillante, lucide et inspirante.
L'utilisateur cherche sa voie et a répondu aux questions suivantes :
- Ce que j'aime (passions, centres d'intérêt) : "${loves || "Non renseigné"}"
- Ce dans quoi je suis doué(e) (talents, facilités) : "${skills || "Non renseigné"}"
- Ce qui compte pour moi (valeurs profondes) : "${values || "Aider les autres, créer, indépendance"}"
- Rêves ou projets qui m'inspirent : "${dreamProjects || "Non renseigné"}"
- Cadre de travail préféré : "${preferredEnvironment || "Autonomie, collaboration humaine, technologie"}"

Analyse ces réponses sous l'angle de l'Ikigai (ce que tu aimes, tes forces, ce dont le monde a besoin, ce qui peut te faire vivre dignement en Afrique, au Bénin ou à l'international).
Format JSON STRICT :
{
  "profileSummary": "Synthèse lumineuse de sa personnalité et de ses talents uniques (3 phrases)",
  "dominantStrengths": ["Force 1", "Force 2", "Force 3"],
  "careerPaths": [
    {
      "title": "Nom du métier ou de la filière",
      "whyItFits": "Pourquoi ce métier résonne parfaitement avec ses talents",
      "startingStep": "Premier pas concret à faire dès aujourd'hui",
      "growthPotential": "Perspectives d'avenir (local & mondial)"
    },
    {
      "title": "Nom du 2ème métier",
      "whyItFits": "Pourquoi ce métier résonne avec lui",
      "startingStep": "Premier pas concret",
      "growthPotential": "Perspectives d'avenir"
    },
    {
      "title": "Nom du 3ème métier",
      "whyItFits": "Pourquoi ce métier lui correspond",
      "startingStep": "Premier pas concret",
      "growthPotential": "Perspectives d'avenir"
    }
  ],
  "entrepreneurshipProject": {
    "projectIdea": "Une idée de projet, d'entreprise ou d'initiative concrète qu'il/elle peut lancer",
    "targetAudience": "À qui ce projet rend service",
    "minimalViableStep": "L'action simple à lancer cette semaine pour tester l'idée sans capital"
  },
  "lumiEncouragement": "Message inspirant et chaleureux de Lumi rappelant qu'il n'y a pas de retard, juste un chemin unique."
}`;

    const output = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: LUMI_BASE_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      responseMimeType: "application/json",
    });

    let result;
    try {
      result = JSON.parse(output);
    } catch {
      result = {
        profileSummary: "Tu possèdes une belle curiosité et une envie sincère d'avoir un impact positif. Tes talents méritent d'être explorés sans pression.",
        dominantStrengths: ["Créativité & écoute", "Résolution de problèmes", "Sensibilité humaine"],
        careerPaths: [
          {
            title: "Gestion de projet digital & innovation",
            whyItFits: "Allie ton sens de l'organisation et ton envie de bâtir du concret.",
            startingStep: "Suivre un cours en ligne d'initiation et échanger avec un professionnel.",
            growthPotential: "Très forte demande locale et internationale en télétravail."
          }
        ],
        entrepreneurshipProject: {
          projectIdea: "Création d'un service d'accompagnement ou de contenu éducatif local",
          targetAudience: "Les jeunes et étudiants cherchant des repères",
          minimalViableStep: "Créer une première fiche pratique ou un prototype simple et le partager."
        },
        lumiEncouragement: "Trouver sa voie n'est pas trouver une ligne droite, c'est explorer avec confiance. Tu as déjà tout en toi ! ✨🧭"
      };
    }

    res.json(result);
  } catch (error: any) {
    console.error("Orientation error:", error);
    res.status(500).json({ error: "Erreur lors de l'analyse d'orientation." });
  }
});

// ⭐ Endpoint: Mode Projet de Vie (Life Project Roadmap 1 an & 5 ans)
app.post("/api/life-project-roadmap", async (req, res) => {
  try {
    const { oneYearVision, fiveYearVision, deepestFears, biggestDreams, username } = req.body;
    const prompt = `Tu es Lumi, guide stratégique de vie et compagne bienveillante.
L'utilisateur ${username || "Ami"} a complété son "Projet de Vie" :
- Où je veux être dans 1 an : "${oneYearVision || "Non spécifié"}"
- Où je veux être dans 5 ans : "${fiveYearVision || "Non spécifié"}"
- Quelles sont mes peurs les plus profondes : "${deepestFears || "Peur de l'échec, du regard des autres, du manque de moyens"}"
- Quels sont mes rêves les plus audacieux : "${biggestDreams || "Non spécifié"}"

Bâtis pour lui une FEUILLE DE ROUTE STRATÉGIQUE complète, concrète et profondément encourageante.
Format JSON STRICT :
{
  "visionStatement": "Manifeste inspirant de sa vie future en 2-3 phrases émouvantes",
  "fearAntidotes": [
    {
      "fear": "Peur identifiée",
      "antidote": "Recadrage bienveillant et action concrète pour la désamorcer"
    }
  ],
  "oneYearRoadmap": {
    "theme": "Le grand thème de l'année 1 (ex: Fondations & Confiance)",
    "quarterlyMilestones": [
      { "quarter": "Trimestre 1 (Mois 1-3)", "objective": "Objectif clé", "keyAction": "Action concrète" },
      { "quarter": "Trimestre 2 (Mois 4-6)", "objective": "Objectif clé", "keyAction": "Action concrète" },
      { "quarter": "Trimestre 3 (Mois 7-9)", "objective": "Objectif clé", "keyAction": "Action concrète" },
      { "quarter": "Trimestre 4 (Mois 10-12)", "objective": "Objectif clé", "keyAction": "Action concrète" }
    ]
  },
  "fiveYearHorizon": [
    { "phase": "Année 2-3 : Envol", "milestone": "Expansion des compétences, stabilité financière et premières réalisations" },
    { "phase": "Année 4-5 : Maîtrise & Rayonnement", "milestone": "Accomplissement du grand rêve, liberté et inspiration pour sa communauté" }
  ],
  "dailyRitual": "Un rituel quotidien de 10 minutes pour garder le cap sans s'épuiser",
  "lumiPledge": "Promesse de soutien et d'accompagnement de Lumi à chaque étape de ce voyage."
}`;

    const output = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: LUMI_BASE_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      responseMimeType: "application/json",
    });

    let plan;
    try {
      plan = JSON.parse(output);
    } catch {
      plan = {
        visionStatement: "Chaque pas posé avec foi et constance transforme le doute en destin. Ta vie est ton chef-d'œuvre en cours d'écriture.",
        fearAntidotes: [
          {
            fear: "La peur de ne pas être à la hauteur",
            antidote: "La perfection n'existe pas : seul le progrès régulier construit l'excellence."
          }
        ],
        oneYearRoadmap: {
          theme: "L'Ancrage et l'Éveil",
          quarterlyMilestones: [
            { quarter: "Trimestre 1", objective: "Installer des routines saines et clarifier ses priorités", keyAction: "30 minutes dédiées chaque jour" },
            { quarter: "Trimestre 2", objective: "Consolider ses compétences clés", keyAction: "Finaliser un premier projet concret" },
            { quarter: "Trimestre 3", objective: "Élargir son horizon", keyAction: "Développer ses relations et son réseau" },
            { quarter: "Trimestre 4", objective: "Célébrer et franchir le premier grand cap", keyAction: "Bilan annuel et préparation du palier suivant" }
          ]
        },
        fiveYearHorizon: [
          { phase: "Année 2-3", milestone: "Développement d'une expertise reconnue et autonomie financière." },
          { phase: "Année 4-5", milestone: "Vie équilibrée, réalisation de tes aspirations et impact sur tes proches." }
        ],
        dailyRitual: "5 minutes de gratitude le matin, 5 minutes de révision des objectifs le soir.",
        lumiPledge: "Je serai là, à chacun de tes pas, pour te rappeler qui tu es vraiment. ✨🌱"
      };
    }

    res.json(plan);
  } catch (error: any) {
    console.error("Life project error:", error);
    res.status(500).json({ error: "Erreur lors de la création du projet de vie." });
  }
});

// 🌱 Endpoint: Mon Évolution (Analyse rétrospective & miroir de transformation)
app.post("/api/evolution-analysis", async (req, res) => {
  try {
    const { pastNotes, memories, goalsCompleted, username } = req.body;
    const prompt = `Tu es Lumi. Un utilisateur (${username || "Ami"}) souhaite contempler son évolution :
"Qui j'étais il y a 1 mois, il y a 6 mois, il y a 1 an ?"
Éléments historiques / souvenirs / objectifs relevés :
${JSON.stringify({ pastNotes, memories, goalsCompleted })}

Rédige une ANALYSE D'ÉVOLUTION bienveillante et pénétrante, montrant avec tendresse les changements constatés :
- Par exemple : "Tu sembles plus confiante qu'il y a trois mois."
- "Tu parles moins de stress scolaire qu'avant."
- "Tu as osé exprimer tes rêves et surmonter des jours de doute."

Format JSON STRICT :
{
  "headline": "Titre émouvant sur son chemin parcouru",
  "oneMonthAgo": "Où tu en étais il y a 1 mois (les doutes, les premiers pas)",
  "sixMonthsAgo": "Où tu en étais il y a 6 mois (le point de bascule, le courage)",
  "oneYearAgo": "Où tu en étais il y a 1 an (le point de départ, l'étincelle)",
  "growthInsights": [
    "Observation précise sur sa prise de confiance",
    "Observation sur la gestion de son stress et de ses émotions",
    "Observation sur ses victoires concrètes"
  ],
  "celebrationMessage": "Message vibrant de fierté et d'affection de Lumi"
}`;

    const output = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: LUMI_BASE_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      responseMimeType: "application/json",
    });

    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch {
      parsed = {
        headline: "Le reflet d'un courage silencieux mais immense",
        oneMonthAgo: "Il y a 1 mois, tu cherchais tes repères au milieu des incertitudes du quotidien.",
        sixMonthsAgo: "Il y a 6 mois, certaines peurs semblaient insurmontables, mais tu as choisi de continuer d'avancer.",
        oneYearAgo: "Il y a 1 an, tu ne soupçonnais pas encore toute la force et la résilience qui sommeillaient en toi.",
        growthInsights: [
          "Tu sembles plus confiant(e) et apaisé(e) face aux imprévus.",
          "Tu parles moins de stress paralysant et davantage de solutions concrètes.",
          "Tu t'accordes enfin le droit de prendre soin de toi et de tes rêves."
        ],
        celebrationMessage: "Regarde en arrière un instant : regarde tout le chemin traversé. Tu peux être tellement fier(e) de toi ! ✨🌱"
      };
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("Evolution analysis error:", error);
    res.status(500).json({ error: "Erreur lors de l'analyse d'évolution." });
  }
});

// 📖 Endpoint: Mon Histoire & Rétrospective Annuelle (Ton année 2026 en résumé)
app.post("/api/annual-recap", async (req, res) => {
  try {
    const { year, difficultMoments, successes, completedGoals, username } = req.body;
    const targetYear = year || "2026";
    const prompt = `Tu es Lumi. Rédige le chapitre de vie : "Ton année ${targetYear} en résumé" pour ${username || "un être cher"}.
Données de son carnet de vie :
- Moments difficiles traversés : "${difficultMoments || "Périodes de doute, fatigue, pression scolaire ou financière"}"
- Réussites éclatantes : "${successes || "Créations partagées, pas en avant, amitiés préservées"}"
- Objectifs atteints : "${completedGoals || "Épargne progressive, régularité, persévérance"}"

Format JSON STRICT :
{
  "yearTitle": "Titre du chapitre de l'année (ex: 2026, L'année où j'ai appris à voler)",
  "executiveSummary": "Un texte émouvant en 3 paragraphes retraçant la traversée de l'année",
  "keyStats": {
    "daysOfResilience": "365 jours de présence",
    "majorBreakthrough": "La plus belle transformation intérieure observée"
  },
  "hardshipsOvercome": "Comment les moments difficiles sont devenus ton armure de sagesse",
  "triumphsToRemember": "Les trois plus beaux souvenirs et victoires à ancrer dans ton cœur pour toujours",
  "lumiLetter": "Lettre personnelle d'amour bienveillant et d'admiration de Lumi pour clore cette année"
}`;

    const output = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: LUMI_BASE_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      responseMimeType: "application/json",
    });

    let recap;
    try {
      recap = JSON.parse(output);
    } catch {
      recap = {
        yearTitle: `${targetYear}, L'année de la métamorphose et de la force tranquille`,
        executiveSummary: `L'année ${targetYear} n'a pas été exempte d'orages, mais tu as appris à danser sous la pluie.\nChaque épreuve a révélé en toi une résilience que tu ignorais posséder.\nAujourd'hui, tu regardes l'avenir avec des yeux nouveaux, remplis de clarté et d'espoir.`,
        keyStats: {
          daysOfResilience: "365 jours de courage",
          majorBreakthrough: "Une confiance renouvelée en tes propres capacités"
        },
        hardshipsOvercome: "Tu as traversé chaque doute sans renoncer à tes valeurs.",
        triumphsToRemember: "Tes créations, ton épargne pas à pas et ta bienveillance envers toi-même.",
        lumiLetter: "Merci d'avoir partagé tes jours avec moi. Tu es une âme rare et précieuse. En route vers la suite ! 💛✨"
      };
    }

    res.json(recap);
  } catch (error: any) {
    console.error("Annual recap error:", error);
    res.status(500).json({ error: "Erreur lors de la rétrospective." });
  }
});

// 🎤 Endpoint: Podcast Script & Audio Generator (Podcasts de Lumi)
app.post("/api/generate-podcast", async (req, res) => {
  try {
    const { type, theme, durationMinutes, username } = req.body;
    const podcastType = type || "motivation"; // motivation, story, recap, meditation
    const prompt = `Tu es Lumi. Rédige le texte complet d'un épisode de PODCAST audio (durée de lecture estimée : ${durationMinutes || 2} minutes, environ 200 à 250 mots).
Type de podcast : ${podcastType} (message vocal motivant, histoire inspirante, méditation du soir ou résumé audio personnalisé).
Thème : "${theme || "Prendre confiance en son potentiel unique"}"
Auditeur : ${username || "Ami"}

Consignes d'écriture pour l'audio :
- Ton doux, chaleureux, intime et captivant (comme un murmure bienveillant à l'oreille).
- Inclure des pauses indiquées par des silences ou respirations [pause douce].
- Utiliser un langage poétique, fluide et naturel en français.
Format JSON STRICT :
{
  "title": "Titre évocateur de l'épisode",
  "type": "${podcastType}",
  "duration": "${durationMinutes || 2} min",
  "quoteIntro": "Une courte phrase d'accroche",
  "spokenScript": "Le texte complet parlé avec ponctuation soignée pour la voix",
  "keyTakeaway": "L'idée forte à garder en soi toute la journée"
}`;

    const output = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: LUMI_BASE_SYSTEM_INSTRUCTION,
      temperature: 0.8,
      responseMimeType: "application/json",
    });

    let podcast;
    try {
      podcast = JSON.parse(output);
    } catch {
      podcast = {
        title: "L'aurore dans ton cœur",
        type: podcastType,
        duration: "2 min",
        quoteIntro: "Respire profondément. Le jour qui se lève est une page blanche pleine de promesses.",
        spokenScript: `Bonjour, bel esprit. Prends une longue et douce inspiration avec moi.\n\n[pause douce]\n\nSais-tu ce qui rend cette journée si spéciale ? C'est qu'elle t'appartient entièrement. Tu n'as pas besoin de tout réussir aujourd'hui. Il te suffit de faire un petit pas, avec sincérité et amour pour toi-même.\n\n[pause douce]\n\nQuoi qu'il arrive, je suis là, et je crois infiniment en ta lumière. Passe une journée magnifique.`,
        keyTakeaway: "Un seul petit pas avec amour suffit pour changer le cours d'une journée."
      };
    }

    res.json(podcast);
  } catch (error: any) {
    console.error("Podcast error:", error);
    res.status(500).json({ error: "Erreur lors de la génération du podcast." });
  }
});


async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lumi server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
