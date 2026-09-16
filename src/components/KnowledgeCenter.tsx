import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Sparkles, 
  Heart, 
  Brain, 
  GraduationCap, 
  ShieldCheck, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  Share2 
} from 'lucide-react';
import { KnowledgeArticle, KnowledgeTopic } from '../types';
import { playGentleChime } from '../utils/soundAndBreathing';

interface KnowledgeCenterProps {
  onSelectArticle?: (article: KnowledgeArticle) => void;
}

const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-1',
    title: 'La méthode Feynman : Comprendre profondément plutôt que mémoriser bêtement',
    category: 'etudes',
    summary: 'Comment réviser n’importe quel cours universitaire ou scolaire en expliquant simplement chaque notion comme à un enfant.',
    content: `La méthode du physicien Richard Feynman repose sur une vérité fondamentale : si tu ne peux pas expliquer un concept avec des mots simples à quelqu’un d’autre, c’est que tu ne le maîtrises pas encore.

### Les 4 étapes fondamentales :
1. **Choisis le concept :** Prends une feuille blanche et écris le titre du chapitre ou de la notion au sommet.
2. **Explique-le par écrit comme à un enfant de 12 ans :** Utilise un langage simple, des analogies du quotidien et bannis le jargon technique inutile.
3. **Identifie tes zones d'ombre :** Dès que tu bloques, que ton explication devient confuse ou que tu hésites, retourne dans ton cours pour clarifier ce point précis.
4. **Simplifie et crée une métaphore :** Relis ton texte à voix haute. Si une phrase sonne compliquée, remplace-la par un exemple imagé.

En pratiquant cette méthode 20 minutes par jour, ta mémoire à long terme s’ancre sans fatigue inutile.`,
    readTimeMinutes: 4,
    tags: ['études', 'feynman', 'révisions', 'mémoire'],
    verifiedBy: 'Équipe Pédagogique Lumi',
  },
  {
    id: 'art-2',
    title: 'Apaiser le stress et l’angoisse en 3 minutes grâce à la cohérence cardiaque',
    category: 'stress',
    summary: 'La physiologie de la respiration 5-5 : synchroniser le rythme cardiaque pour faire chuter immédiatement le cortisol.',
    content: `Lorsque nous sommes stressés, notre système nerveux sympathique s'emballe, augmentant le rythme cardiaque et la tension musculaire. La cohérence cardiaque est le frein d'urgence naturel de ton corps.

### La formule 365 :
- **3 fois par jour** (au réveil, avant le repas de midi, et au retour chez soi ou avant de dormir)
- **6 respirations par minute** (5 secondes d’inspiration par le nez, 5 secondes d’expiration par la bouche)
- **Pendant 5 minutes**

### Ce qui se passe dans ton corps :
Au bout de 3 minutes, la production de cortisol (l’hormone du stress) diminue drastiquement pendant 4 à 6 heures. La DHEA (hormone de régénération) augmente, et les ondes cérébrales alpha s'activent pour offrir clarté mentale et sérénité.`,
    readTimeMinutes: 3,
    tags: ['stress', 'respiration', 'cohérence cardiaque', 'calme'],
    verifiedBy: 'Pôle Bien-être Lumi',
  },
  {
    id: 'art-3',
    title: 'Gérer son budget et épargner en FCFA sans frustration : La méthode des enveloppes',
    category: 'finances',
    summary: 'Un système simple pour concrétiser des projets (acheter un ordinateur, préparer des cours) même avec des revenus modestes.',
    content: `L’épargne n’est pas une punition, c’est un acte de respect envers ton avenir. Beaucoup pensent qu’il faut être riche pour épargner, alors que c’est précisément l’habitude d’épargner qui crée la sécurité financière.

### La répartition 50 / 30 / 20 adaptée :
- **50% : Besoins vitaux** (logement, nourriture, transport, santé).
- **30% : Dépenses de vie et petits plaisirs** (sorties raisonnables, communication, loisirs).
- **20% : Épargne inviolable** (projet d'ordinateur, fonds d’urgence, formation).

### Le principe des enveloppes (ou sous-comptes) :
Dès que tu reçois une rentrée d’argent (bourse, salaire, aide, vente), prélève immédiatement ta part d’épargne avant de dépenser le reste.
Si ton objectif est d’économiser 300 000 FCFA en 6 mois, cela représente 50 000 FCFA par mois, soit environ 12 500 FCFA par semaine. En le découpant ainsi, l’obstacle devient une succession de petites victoires accessibles.`,
    readTimeMinutes: 5,
    tags: ['finances', 'épargne', 'FCFA', 'budget', 'projets'],
    verifiedBy: 'Conseil Financier Bienveillant',
  },
  {
    id: 'art-4',
    title: 'Vaincre le syndrome de l’imposteur : Pourquoi ta voix a toute sa légitimité',
    category: 'confiance',
    summary: 'Comprendre d’où vient cette voix intérieure qui te dit « tu n’es pas à la hauteur » et comment la désarmer avec douceur.',
    content: `Le syndrome de l'imposteur touche paradoxalement les personnes les plus consciencieuses et empathiques. C'est l'impression persistante que nos succès sont dus à la chance et qu'on va bientôt « nous démasquer ».

### 3 antidotes essentiels :
1. **La chance sourit à ceux qui se préparent :** La chance ne passe pas les examens à ta place et n'écrit pas tes devoirs. Reconnais le travail fourni.
2. **Ne confonds pas humilité et autodénigrement :** L'humilité consiste à dire « j'ai encore des choses à apprendre ». L'autodénigrement consiste à dire « je ne vaux rien ».
3. **Le cahier des victoires :** Note chaque semaine 3 choses que tu as réussies ou surmontées. Relis-le quand le doute t'envahit.`,
    readTimeMinutes: 4,
    tags: ['confiance', 'estime de soi', 'imposteur', 'audace'],
    verifiedBy: 'Psychologie Positive Lumi',
  },
  {
    id: 'art-5',
    title: 'Savoir dire « Non » avec bienveillance sans ressentir de culpabilité',
    category: 'relations',
    summary: 'Comment poser des limites saines avec ses amis et sa famille pour préserver son énergie et ses études.',
    content: `Dire oui aux autres alors que l'on pense non, c'est se dire non à soi-même. Les relations saines ne sont pas celles où l'on s'épuise pour plaire, mais celles où chacun respecte les limites de l'autre.

### La formule du "Non bienveillant" en 3 phrases :
1. **Remercier ou valider :** « Merci beaucoup d’avoir pensé à moi pour cela. »
2. **Poser la limite clairement sans justification excessive :** « Malheureusement, je dois consacrer cette soirée à mes révisions / à mon repos. »
3. **Offrir une alternative chaleureuse si souhaité :** « On se prendra un thé le week-end prochain avec grand plaisir ! »`,
    readTimeMinutes: 4,
    tags: ['relations', 'limites', 'communication', 'respect'],
    verifiedBy: 'Médiation Relationnelle',
  },
  {
    id: 'art-6',
    title: 'La règle des 2 minutes pour vaincre la procrastination au quotidien',
    category: 'organisation',
    summary: 'La physique du premier pas : comment tromper notre cerveau pour démarrer sans résistance.',
    content: `La procrastination n’est pas un problème de paresse, c’est une difficulté à réguler une émotion d’appréhension ou de fatigue face à une tâche perçue comme immense.

### Le principe :
Si une action prend moins de 2 minutes, fais-la immédiatement (ranger ses cours, répondre à un message important, ouvrir son cahier).
Si une tâche est monumentale (rédiger un mémoire, réviser 5 chapitres), réduis-la à sa version de 2 minutes : « Ouvrir mon fichier et écrire 1 seule phrase ». Une fois l'inertie brisée, le cerveau entre naturellement dans l'action.`,
    readTimeMinutes: 3,
    tags: ['organisation', 'procrastination', 'habitudes', 'temps'],
    verifiedBy: 'Pôle Organisation Lumi',
  },
];

export const KnowledgeCenter: React.FC<KnowledgeCenterProps> = ({ onSelectArticle }) => {
  const [selectedTopic, setSelectedTopic] = useState<KnowledgeTopic | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(KNOWLEDGE_ARTICLES[0]);

  const TOPIC_BADGES: { id: KnowledgeTopic | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Tous les guides', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'confiance', label: 'Confiance en soi', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'stress', label: 'Gestion du stress', icon: <Brain className="w-3.5 h-3.5" /> },
    { id: 'etudes', label: 'Études & Examens', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'finances', label: 'Budget & Épargne (FCFA)', icon: <Coins className="w-3.5 h-3.5" /> },
    { id: 'organisation', label: 'Organisation du temps', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'relations', label: 'Relations saines', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  const filteredArticles = KNOWLEDGE_ARTICLES.filter((art) => {
    const matchesTopic = selectedTopic === 'all' || art.category === selectedTopic || art.topic === selectedTopic;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-100/90 via-amber-50 to-emerald-100/70 rounded-3xl p-6 sm:p-8 border border-teal-200/80 shadow-2xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-200/80 text-teal-900 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
            <span>Bibliothèque de Savoirs Vérifiés</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Centre de Connaissances & Guides Pratiques
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Des fiches claires, fondées sur les neurosciences, la psychologie positive et la gestion pragmatique du quotidien pour t’aider à grandir en toute sérénité.
          </p>
        </div>

        {/* Search & Topic Filters */}
        <div className="mt-6 pt-4 border-t border-teal-200/60 space-y-3">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un thème, mot-clé (ex: feynman, stress, épargne, non)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-teal-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
            {TOPIC_BADGES.map((b) => {
              const active = selectedTopic === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedTopic(b.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    active
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'bg-white/80 hover:bg-white text-slate-700 border border-teal-200/60'
                  }`}
                >
                  {b.icon}
                  <span>{b.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Layout: List & Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Article List */}
        <div className="space-y-3 lg:col-span-1">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Guides disponibles ({filteredArticles.length})
          </h2>

          <div className="space-y-2.5">
            {filteredArticles.map((art) => {
              const isSelected = activeArticle?.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => {
                    setActiveArticle(art);
                    playGentleChime(432);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-white border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                      : 'bg-white hover:bg-teal-50/40 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-bold text-teal-800 uppercase px-2 py-0.5 rounded-md bg-teal-50">
                      {art.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3" />
                      {art.readTimeMinutes} min de lecture
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Article View */}
        <div className="lg:col-span-2">
          {activeArticle ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-2xs space-y-6">
              {/* Meta header */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-900 uppercase">
                    {activeArticle.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{activeArticle.readTimeMinutes} min de lecture</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{activeArticle.verifiedBy}</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {activeArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 italic bg-teal-50/50 p-3.5 rounded-2xl border border-teal-100">
                  « {activeArticle.summary} »
                </p>
              </div>

              {/* Body */}
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 whitespace-pre-line font-normal">
                {activeArticle.content}
              </div>

              {/* Tags & Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {(activeArticle.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${activeArticle.title}\n\n${activeArticle.content}`);
                    alert('Guide copié dans le presse-papier !');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Partager ce guide</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Sélectionne un guide</h3>
              <p className="text-xs text-slate-600">Choisis une fiche pratique pour commencer ta lecture.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
