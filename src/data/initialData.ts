import { CommunityPost, Badge, PositiveChallenge, ThemeTag, UserProfile, FutureLetter, UserMemoryItem } from '../types';

export const THEME_TAGS: ThemeTag[] = [
  'Motivation',
  'Études',
  'Solitude',
  'Confiance en soi',
  'Famille',
  'Amitié',
  'Relations',
  'Développement personnel',
  'Créativité',
];

export const THEME_TAGS_CATALOG = [
  { id: 'Motivation', label: 'Motivation' },
  { id: 'Études', label: 'Études' },
  { id: 'Solitude', label: 'Solitude' },
  { id: 'Confiance en soi', label: 'Confiance en soi' },
  { id: 'Famille', label: 'Famille' },
  { id: 'Amitié', label: 'Amitié' },
  { id: 'Relations', label: 'Relations' },
  { id: 'Développement personnel', label: 'Développement' },
  { id: 'Créativité', label: 'Créativité' },
];

export const INITIAL_USER_MEMORIES: UserMemoryItem[] = [
  {
    id: 'mem-1',
    fact: 'Prépare activement ses examens et recherche des méthodes pour apaiser son anxiété avant les oraux',
    category: 'etudes',
    dateAdded: 'Hier',
  },
  {
    id: 'mem-2',
    fact: 'Trouve beaucoup d’apaisement dans la musique douce, les balades matinales et l’écriture poétique',
    category: 'emotions',
    dateAdded: 'Il y a 3 jours',
  },
  {
    id: 'mem-3',
    fact: 'A pour objectif de cultiver la bienveillance envers soi-même et de ne pas se juger dans les moments de fatigue',
    category: 'objectifs',
    dateAdded: 'Cette semaine',
  },
];

export const BADGES_CATALOG: Badge[] = [
  {
    id: 'badge-share',
    title: 'Premier partage',
    icon: '🌟',
    description: 'A déposé sa première étincelle d’expression sur le Mur Bienveillant.',
  },
  {
    id: 'badge-support',
    title: 'Soutien de la communauté',
    icon: '❤️',
    description: 'A réconforté ou encouragé publiquement un autre membre.',
  },
  {
    id: 'badge-audio',
    title: 'Premier audio',
    icon: '🎙️',
    description: 'A prêté sa voix pour partager un poème ou un témoignage sincère.',
  },
  {
    id: 'badge-poem',
    title: 'Premier poème',
    icon: '✍️',
    description: 'A composé et offert des vers inspirants au monde.',
  },
  {
    id: 'badge-positivity-30',
    title: '30 jours de positivité',
    icon: '🌈',
    description: 'Pratique la gratitude et la présence bienveillante avec fidélité.',
  },
  {
    id: 'badge-kindness',
    title: 'Membre bienveillant',
    icon: '🤗',
    description: 'Reconnu par la communauté pour son écoute pure et sa douceur.',
  },
];

export const INITIAL_CHALLENGES: PositiveChallenge[] = [
  {
    id: 'ch-1',
    title: 'Sourire sincèrement à quelqu’un',
    description: 'Offre un sourire chaleureux à un proche, un collègue ou un passant aujourd’hui.',
    completed: false,
    points: 10,
  },
  {
    id: 'ch-2',
    title: 'Écouter sa chanson préférée en pleine conscience',
    description: 'Mets tes écouteurs, ferme les yeux, et savoure chaque note qui apaise ton cœur.',
    completed: true,
    points: 10,
  },
  {
    id: 'ch-3',
    title: 'Ranger et aérer son petit espace',
    description: 'Ouvre la fenêtre 5 minutes et range un coin de ta table ou de ta chambre.',
    completed: false,
    points: 10,
  },
  {
    id: 'ch-4',
    title: 'S’écrire un compliment sincère',
    description: 'Note une qualité ou un effort que tu as fourni récemment dont tu peux être fier/fière.',
    completed: false,
    points: 15,
  },
  {
    id: 'ch-5',
    title: 'Prendre 5 minutes de respiration apaisée',
    description: 'Pratique la cohérence cardiaque avec Lumi pour réguler ton système nerveux.',
    completed: true,
    points: 10,
  },
];

export const INITIAL_POSITIVE_CHALLENGES = INITIAL_CHALLENGES;

export const INITIAL_PROFILE: UserProfile = {
  id: 'user-default-1',
  username: 'Axo',
  emailOrPhone: 'axo.hossou@epitech.eu',
  bio: 'En quête de paix intérieure, de poésie et d’écoute mutuelle. Chaque jour est une nouvelle chance de fleurir. 🌱✨',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  joinedAt: 'Septembre 2026',
  badges: ['badge-share', 'badge-support', 'badge-poem', 'badge-kindness'],
  favoriteQuotes: [
    '« Ne crains pas la nuit quand elle semble infinie : c’est au cœur de l’ombre que la lumière surgit. »',
    '« Tu as le droit d’aller à ton propre rythme. Rien ne presse. »',
    '« La douceur est la plus haute forme d’intelligence et de courage. »',
  ],
};

export const INITIAL_FUTURE_LETTERS: FutureLetter[] = [
  {
    id: 'letter-1',
    title: 'À moi-même quand j’aurai franchi cette étape',
    content: `Chère moi du futur,
Si tu lis cette lettre, c’est que les mois de doute et de stress pour les examens sont enfin passés.
J’espère que tu te souviens combien tu as été courageuse ce soir-là, devant ton bureau, quand tout semblait trop grand.
N’oublie jamais de respirer, de chérir tes proches et d’être douce avec tes erreurs. Tu as réussi tant de choses !
Prends soin de ta lumière intérieure. 💛`,
    createdAt: '2026-09-01',
    unlockDate: '2027-06-08',
    isOpened: false,
    lumiBlessing: 'Que cette capsule temporelle soit un phare étincelant pour ton avenir. Tu es capable de merveilles. ✨',
  },
  {
    id: 'letter-2',
    title: 'Rappel de ma première victoire',
    content: `Coucou toi ! Aujourd'hui tu as enfin osé t'exprimer sans trembler. Rappelle-toi ce sentiment de fierté, il t'accompagnera toujours.`,
    createdAt: '2026-08-10',
    unlockDate: '2026-09-10',
    isOpened: true,
    lumiBlessing: 'Ta bravoure est désormais gravée dans le temps. Célèbre ce beau chemin parcouru ! 🌸',
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'Renaître après l’orage',
    type: 'poeme',
    theme: 'Motivation',
    author: 'Clara M.',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    createdAt: 'Il y a 2 heures',
    content: `Sous les nuages denses et le ciel déchiré,
J'ai appris la patience d'un bourgeon blessé.
Chaque goutte de pluie qui coulait sur mes mains
Préparait en silence la douceur de demain.

Ne crains pas la nuit quand elle semble infinie :
C'est au cœur de l'ombre que la lumière surgit. ✨🌱`,
    reactions: { love: 38, warmth: 45, hope: 52, strength: 29 },
    comments: [
      {
        id: 'c-1',
        author: 'Julien S.',
        content: 'Tes vers m’ont ému aux larmes. Merci pour ce souffle d’air frais ce matin.',
        createdAt: 'Il y a 1 heure',
        replies: [
          {
            id: 'c-1-r1',
            author: 'Clara M.',
            content: 'Merci du fond du cœur Julien, ton message me touche tellement ! 💛',
            createdAt: 'Il y a 40 min',
          }
        ]
      },
      {
        id: 'c-2',
        author: 'Lumi ✨',
        content: 'Quelle grâce et quelle résilience, Clara. Tes mots sont un phare pour tous ceux qui traversent une nuit orageuse. Merci pour cette étincelle de poésie.',
        createdAt: 'Il y a 45 min',
        isLumi: true,
      },
    ],
    lumiComment: 'Quelle grâce et quelle résilience, Clara. Tes mots sont un phare pour tous ceux qui traversent une nuit orageuse. Merci pour cette étincelle de poésie.',
  },
  {
    id: 'post-draw-1',
    title: 'L’arbre qui apprend à fleurir doucement',
    type: 'dessin',
    theme: 'Créativité',
    author: 'Nico Art',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: 'Il y a 3 heures',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    content: `J’ai dessiné ce petit arbre ce matin pour symboliser notre patience. Ses racines sont solides même si le vent secoue ses feuilles. Prenez soin de vos racines aujourd'hui ! 🎨🌸`,
    reactions: { love: 44, warmth: 39, hope: 61, strength: 24 },
    comments: [
      {
        id: 'c-draw-1',
        author: 'Lumi ✨',
        content: 'Ce dessin dégage une sérénité remarquable, Nico. Les couleurs choisies évoquent la renaissance et la protection bienveillante. Bravo pour ce talent ! ✨',
        createdAt: 'Il y a 2 heures',
        isLumi: true,
      }
    ],
    lumiComment: 'Ce dessin dégage une sérénité remarquable, Nico. Les couleurs choisies évoquent la renaissance et la protection bienveillante. Bravo pour ce talent ! ✨',
  },
  {
    id: 'post-quote-1',
    title: 'Pour ceux qui doutent de leur chemin',
    type: 'citation',
    theme: 'Confiance en soi',
    author: 'Sophie',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    createdAt: 'Il y a 5 heures',
    content: `« Il n’est jamais trop tard pour devenir ce que vous auriez pu être. Vous n’êtes pas en retard sur votre vie : vous êtes à votre propre rythme. »`,
    reactions: { love: 72, warmth: 56, hope: 89, strength: 43 },
    comments: [
      {
        id: 'c-quote-1',
        author: 'Marc V.',
        content: 'J’avais tellement besoin de lire ça aujourd’hui. Merci infiniment Sophie.',
        createdAt: 'Il y a 3 heures',
      }
    ],
    lumiComment: 'Une citation intemporelle qui dépose un baume sur le cœur empressé. Merci pour ce rappel essentiel, Sophie.',
  },
  {
    id: 'post-2',
    title: 'Refrain pour les jours où le cœur est lourd',
    type: 'chanson',
    theme: 'Solitude',
    author: 'Mathieu & Guitare',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    createdAt: 'Il y a 6 heures',
    content: `[Refrain]
Même si le pas se fait hésitant,
Même si le vent souffle contre le temps,
Tu as le droit d'avoir peur, tu as le droit de faiblir,
Mais n'oublie jamais combien tu sais sourire.
Pose ton fardeau, respire un instant,
Le monde est plus beau quand tu es vivant. 🎶💛`,
    reactions: { love: 59, warmth: 46, hope: 71, strength: 32 },
    comments: [
      {
        id: 'c-3',
        author: 'Sarah V.',
        content: 'J’ai fredonné ton refrain en préparant mon thé, ça m’a fait un bien fou. Prends soin de toi !',
        createdAt: 'Il y a 4 heures',
      },
      {
        id: 'c-4',
        author: 'Lumi ✨',
        content: 'La musique a ce pouvoir magique de panser ce que les mots seuls peinent à soulager. Ce refrain porte une tendresse infinie.',
        createdAt: 'Il y a 3 heures',
        isLumi: true,
      },
    ],
    lumiComment: 'La musique a ce pouvoir magique de panser ce que les mots seuls peinent à soulager. Ce refrain porte une tendresse infinie.',
  },
  {
    id: 'post-photo-1',
    title: 'La lumière du matin à Cotonou',
    type: 'photo',
    theme: 'Motivation',
    author: 'Koffi',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    createdAt: 'Il y a 7 heures',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    content: `Ce lever de soleil sur la plage m'a rappelé que chaque aurore balaie les peines de la veille. Une pensée douce à tous nos frères et sœurs du Bénin et d'ailleurs. Force à nous ! ☀️🌊`,
    reactions: { love: 88, warmth: 63, hope: 95, strength: 71 },
    comments: [
      {
        id: 'c-photo-1',
        author: 'Amina',
        content: 'Magnifique cliché ! Fier de notre beau pays. Que la journée soit douce pour tous.',
        createdAt: 'Il y a 5 heures',
      }
    ],
    lumiComment: 'Quelle splendide vue, Koffi. L’océan et la lumière du matin nous invitent à une respiration profonde et pleine d’espérance. Merci pour ce partage lumineux ! ☀️✨',
  },
  {
    id: 'post-story-1',
    title: 'Comment j’ai réussi à parler en public après des années de trac',
    type: 'histoire',
    theme: 'Études',
    author: 'Leïla',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: 'Il y a 8 heures',
    content: `Avant-hier, je devais faire ma soutenance de projet devant 30 personnes. Mes mains tremblaient, ma gorge était nouée.
J'ai pensé aux conseils de Lumi : j'ai ancré mes deux pieds fermement dans le sol, j'ai fixé une personne souriante au premier rang, et j'ai commencé par respirer.
J'ai eu 16/20 ! Si j'ai pu le faire, vous pouvez surmonter vos peurs vous aussi. Vous êtes plus forts que votre anxiété.`,
    reactions: { love: 104, warmth: 82, hope: 120, strength: 91 },
    comments: [
      {
        id: 'c-story-1',
        author: 'Damien',
        content: 'Félicitations Leïla ! C’est une vraie source d’inspiration pour mes futurs oraux.',
        createdAt: 'Il y a 6 heures',
      }
    ],
    lumiComment: 'Toutes mes félicitations Leïla ! Ton courage et ta préparation ont triomphé. Cette victoire t’appartient et prouve ton immense potentiel. 🌟👏',
  },
  {
    id: 'post-3',
    title: 'Après 6 mois d’anxiété, j’ai osé marcher sous le soleil',
    type: 'temoignage',
    theme: 'Développement personnel',
    author: 'Élodie',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    createdAt: 'Il y a 10 heures',
    content: `Pendant des mois, franchir le pas de ma porte semblait une montagne infranchissable. La peur me paralysait.
Ce matin, j'ai suivi un exercice de respiration avec Lumi, j'ai enfilé mes baskets, et j'ai marché 15 minutes dans le parc d'à côté.
J'ai senti la chaleur du soleil sur mon visage. C'est peut-être une petite victoire pour certains, mais pour moi, c'est immense. Ne perdez jamais courage : chaque petit pas compte.`,
    reactions: { love: 74, warmth: 58, hope: 92, strength: 63 },
    comments: [
      {
        id: 'c-5',
        author: 'Karim',
        content: 'Bravo Élodie !! Ce n’est pas un petit pas, c’est une immense victoire personnelle. Tu peux être tellement fière.',
        createdAt: 'Il y a 8 heures',
      },
      {
        id: 'c-6',
        author: 'Lumi ✨',
        content: 'Élodie, ton courage m’émeut profondément. Célébrer ce premier pas sous le soleil est une preuve éclatante de ta force intérieure. Continue à ton rythme bienveillant.',
        createdAt: 'Il y a 7 heures',
        isLumi: true,
      },
    ],
    lumiComment: 'Élodie, ton courage m’émeut profondément. Célébrer ce premier pas sous le soleil est une preuve éclatante de ta force intérieure. Continue à ton rythme bienveillant.',
  },
];

export const INSPIRATION_PROMPTS = [
  "J'ai passé une journée lourde et j'ai besoin de douceur...",
  "J'ai écrit un poème ou un texte, aimerais-tu le lire ?",
  "Je me sens un peu seul(e) en ce moment...",
  "Je doute de mes choix et de mes capacités...",
  "Aide-moi à faire une pause et à calmer mon anxiété.",
  "Je voudrais partager une petite victoire aujourd'hui !",
  "Je suis stressé(e) par mes études ou mon travail...",
];

export const COMFORT_AFFIRMATIONS = [
  "Tu as le droit d'aller à ton propre rythme. Rien ne presse.",
  "Tes sentiments sont légitimes, accueille-les avec bienveillance.",
  "Chaque respiration est une opportunité de recommencer doucement.",
  "Ta valeur ne dépend pas de ta productivité du jour.",
  "Même la plus petite lueur dissipe la pénombre la plus dense.",
  "Tu as déjà surmonté 100% des jours difficiles que tu as traversés jusqu'ici.",
  "Sois aussi tendre avec toi-même que tu le serais avec un être cher.",
];

export const INITIAL_GOALS = [
  {
    id: 'goal-init-1',
    title: 'Économiser 300 000 FCFA pour mon ordinateur de cours',
    category: 'financier' as const,
    targetValue: '300 000 FCFA',
    currencyAmount: 300000,
    savedAmount: 95000,
    currentProgress: 32,
    deadline: '1er juin 2027',
    planSummary: 'Épargne progressive de 12 500 FCFA chaque semaine en limitant les dépenses non prioritaires.',
    lumiEncouragement: 'Tu as déjà constitué près du tiers de ton budget ! Chaque franc mis de côté est un investissement précieux dans ton avenir.',
    milestones: [
      { id: 'm-1-1', title: 'Ouvrir un sous-compte ou une enveloppe dédiée', completed: true, targetDate: 'Semaine 1' },
      { id: 'm-1-2', title: 'Atteindre le premier palier de 50 000 FCFA', completed: true, targetDate: 'Mois 1' },
      { id: 'm-1-3', title: 'Atteindre la moitié du montant (150 000 FCFA)', completed: false, targetDate: 'Mois 3' },
      { id: 'm-1-4', title: 'Finaliser l’achat de l’ordinateur', completed: false, targetDate: 'Mois 6' },
    ],
    schedule: [
      { id: 's-1-1', day: 'Samedi', time: '10h', activity: 'Virement de 12 500 FCFA vers l’enveloppe inviolable' },
      { id: 's-1-2', day: 'Dimanche', time: '15 min', activity: 'Mise à jour du carnet d’épargne et félicitations' },
    ],
    createdAt: '01/09/2026',
    status: 'in_progress' as const,
  },
  {
    id: 'goal-init-2',
    title: 'Améliorer mon anglais oral et réussir ma certification B2',
    category: 'scolaire' as const,
    targetValue: 'Certification B2 & 30 min de pratique par jour',
    currentProgress: 45,
    deadline: '15 mai 2027',
    planSummary: 'Combinaison de podcasts quotidiens, répétition espacée du vocabulaire et 1 échange oral hebdomadaire.',
    lumiEncouragement: 'La régularité bat toujours l’intensité. 20 minutes chaque matin transforment ton aisance avec naturel !',
    milestones: [
      { id: 'm-2-1', title: 'Écouter 1 podcast de 15 min en anglais chaque matin', completed: true, targetDate: 'En continu' },
      { id: 'm-2-2', title: 'Apprendre 10 nouveaux mots et expressions par semaine', completed: true, targetDate: 'Hebdo' },
      { id: 'm-2-3', title: 'Passer un test d’entraînement blanc', completed: false, targetDate: 'Avril' },
      { id: 'm-2-4', title: 'Valider le niveau B2 officiel', completed: false, targetDate: 'Mai' },
    ],
    schedule: [
      { id: 's-2-1', day: 'Lundi au Vendredi', time: '07h30', activity: 'Écoute de podcast anglais en marchant' },
      { id: 's-2-2', day: 'Mercredi', time: '18h00', activity: 'Flashcards Anki & vocabulaire actif' },
    ],
    createdAt: '05/09/2026',
    status: 'in_progress' as const,
  },
  {
    id: 'goal-init-3',
    title: 'Apaiser mon anxiété du soir et dormir 8 heures',
    category: 'personnel' as const,
    targetValue: '8h de sommeil réparateur',
    currentProgress: 60,
    deadline: 'En continu',
    planSummary: 'Rituel doux : extinction des écrans à 22h, 5 min de cohérence cardiaque 432Hz et journal de gratitude.',
    lumiEncouragement: 'Ton repos est le socle de toute ta clarté mentale et de ton bonheur. Tu mérites ce havre de paix.',
    milestones: [
      { id: 'm-3-1', title: 'Arrêter les réseaux sociaux à 22h00', completed: true, targetDate: 'Tous les soirs' },
      { id: 'm-3-2', title: 'Faire 5 minutes de respiration guidée avec Lumi', completed: true, targetDate: 'Avant de dormir' },
      { id: 'm-3-3', title: 'Écrire 3 gratitudes dans le journal météo', completed: false, targetDate: 'Chaque soir' },
    ],
    schedule: [
      { id: 's-3-1', day: 'Tous les soirs', time: '22h15', activity: 'Cohérence cardiaque & musique apaisante 432Hz' },
    ],
    createdAt: '08/09/2026',
    status: 'in_progress' as const,
  },
];

// 🏆 30-Day Challenges Data
export const INITIAL_CHALLENGES_30 = [
  {
    id: 'c-30-confiance',
    title: '30 Jours pour Rayonner de Confiance en Soi',
    category: 'confiance' as const,
    description: 'Une micro-action par jour pour faire taire la petite voix critique et oser prendre ta place dans le monde.',
    badgeReward: 'Aura Lumineuse ⭐',
    days: [
      { day: 1, task: 'Écris 3 qualités sincères que tu apprécies chez toi sur un post-it.', completed: true, reflection: 'J’ai noté : loyauté, sens de l’écoute et créativité.' },
      { day: 2, task: 'Regarde-toi dans le miroir et dis à voix haute : « Je mérite le meilleur ».', completed: true },
      { day: 3, task: 'Dis « Non » avec politesse et fermeté à une demande qui te surcharge.', completed: true },
      { day: 4, task: 'Accepte un compliment sans te justifier ni le minimiser (« Merci beaucoup »).', completed: true },
      { day: 5, task: 'Fais 5 minutes de posture de puissance (dos droit, épaules relâchées).', completed: true },
      { day: 6, task: 'Pardonne-toi une petite maladresse récente.', completed: false },
      { day: 7, task: 'Prends la parole en premier lors d’un cours ou d’une discussion.', completed: false },
      { day: 8, task: 'Porte une tenue ou un accessoire qui te fait te sentir fort(e).', completed: false },
      { day: 9, task: 'Fais la liste de 5 épreuves que tu as déjà surmontées avec brio.', completed: false },
      { day: 10, task: 'Célèbre une petite victoire de ta journée avec une tisane ou un moment doux.', completed: false },
      { day: 11, task: 'Exprime ton avis sincère sur un sujet même si d’autres pensent différemment.', completed: false },
      { day: 12, task: 'Marche dans la rue le regard haut et souris à une personne croisée.', completed: false },
      { day: 13, task: 'Ne dis aucune phrase dévalorisante sur toi pendant toute la journée.', completed: false },
      { day: 14, task: 'Écris une lettre d’auto-compassion comme si tu parlais à ton meilleur ami.', completed: false },
      { day: 15, task: 'Prends une décision que tu repoussais depuis une semaine.', completed: false },
      { day: 16, task: 'Fais une pause sans culpabilité en sachant que le repos est productif.', completed: false },
      { day: 17, task: 'Demande de l’aide sans honte pour un problème complexe.', completed: false },
      { day: 18, task: 'Fais une activité seul(e) en public avec fierté (café, bibliothèque).', completed: false },
      { day: 19, task: 'Partage une de tes idées créatives avec quelqu’un de bienveillant.', completed: false },
      { day: 20, task: 'Remplace « Je dois » par « Je choisis » dans tes pensées.', completed: false },
      { day: 21, task: 'Fais une liste de tes 3 plus grandes fiertés de cette année.', completed: false },
      { day: 22, task: 'Défends une de tes limites personnelles avec respect et calme.', completed: false },
      { day: 23, task: 'Teste une compétence totalement nouvelle sans chercher à être parfait(e).', completed: false },
      { day: 24, task: 'Fais un don d’encouragement sincère à un proche.', completed: false },
      { day: 25, task: 'Note 3 choses que ton corps te permet de vivre et remercie-le.', completed: false },
      { day: 26, task: 'Autorise-toi à être vulnérable sans avoir peur du regard d’autrui.', completed: false },
      { day: 27, task: 'Visualise avec précision ton succès dans 1 an pendant 10 minutes.', completed: false },
      { day: 28, task: 'Réponds avec calme à une critique sans te sentir blessé(e).', completed: false },
      { day: 29, task: 'Bilan des 29 jours : relis toutes tes notes de fierté.', completed: false },
      { day: 30, task: 'Consécration : célèbre ton nouveau regard sur toi-même !', completed: false },
    ],
  },
  {
    id: 'c-30-anglais',
    title: '30 Jours d’Anglais Vivant & Pratique',
    category: 'anglais' as const,
    description: 'Immersion quotidienne progressive sans stress pour débloquer ton oral et ton vocabulaire.',
    badgeReward: 'Globe-Trotter Polyglotte 🌍',
    days: [
      { day: 1, task: 'Écoute 10 minutes d’un podcast anglais (6 Minute English ou Luke’s English).', completed: true },
      { day: 2, task: 'Mets ton smartphone ou tes réseaux sociaux en langue anglaise.', completed: true },
      { day: 3, task: 'Apprends et répète à voix haute 5 verbes à particule (phrasal verbs).', completed: true },
      { day: 4, task: 'Chante les paroles d’une chanson anglaise en lisant les paroles.', completed: false },
      { day: 5, task: 'Décris ta chambre et ta journée en anglais à voix haute pendant 3 minutes.', completed: false },
      { day: 6, task: 'Regarde une vidéo YouTube ou une conférence TED avec sous-titres anglais.', completed: false },
      { day: 7, task: 'Écris 5 phrases sur ton carnet en anglais racontant ton week-end.', completed: false },
      { day: 8, task: 'Apprends 3 expressions idiomatiques courantes (ex: « Hit the nail on the head »).', completed: false },
      { day: 9, task: 'Enregistre une note vocale de 2 minutes en anglais pour t’écouter parler.', completed: false },
      { day: 10, task: 'Lis un article d’actualité internationale en anglais (BBC, Al Jazeera English).', completed: false },
      { day: 11, task: 'Pratique 10 minutes de flashcards de vocabulaire sur Lumi ou Anki.', completed: false },
      { day: 12, task: 'Commande mentalement ton repas en anglais au restaurant.', completed: false },
      { day: 13, task: 'Trouve 10 synonymes de mots basiques (good, bad, happy, sad, important).', completed: false },
      { day: 14, task: 'Écoute un discours inspirant en anglais (Steve Jobs, Barack Obama, Chimamanda).', completed: false },
      { day: 15, task: 'Raconte une anecdote drôle en anglais à Lumi ou devant un miroir.', completed: false },
      { day: 16, task: 'Révise les temps du passé (Past Simple vs Past Continuous).', completed: false },
      { day: 17, task: 'Écris ta liste de courses ou ta to-do list du jour en anglais.', completed: false },
      { day: 18, task: 'Regarde 15 minutes d’une série en VO sans aucun sous-titre.', completed: false },
      { day: 19, task: 'Apprends 5 expressions professionnelles pour un email formel.', completed: false },
      { day: 20, task: 'Résume le film ou le livre que tu aimes le plus en 5 phrases anglaises.', completed: false },
      { day: 21, task: 'Simule un entretien d’embauche de 5 minutes en anglais.', completed: false },
      { day: 22, task: 'Pose 3 questions en anglais sur un forum ou un groupe de passionnés.', completed: false },
      { day: 23, task: 'Apprends les différences clés entre l’accent britannique et américain.', completed: false },
      { day: 24, task: 'Apprends 10 mots d’argot courant (slang) utilisés par les jeunes anglophones.', completed: false },
      { day: 25, task: 'Discute 10 minutes en anglais dans le chat privé de Lumi.', completed: false },
      { day: 26, task: 'Écris un poème simple de 4 lignes en anglais.', completed: false },
      { day: 27, task: 'Note 5 expressions de liaison pour structurer un discours (Furthermore, However).', completed: false },
      { day: 28, task: 'Écoute une interview radio en anglais en marchant.', completed: false },
      { day: 29, task: 'Réécoute ton enregistrement du Jour 9 et constate tes progrès d’aisance !', completed: false },
      { day: 30, task: 'Bilan officiel : tu as ancré l’anglais dans ton quotidien !', completed: false },
    ],
  },
  {
    id: 'c-30-epargne',
    title: '30 Jours d’Épargne Jeune (Défi 500 à 1 000 FCFA / jour)',
    category: 'epargne' as const,
    description: 'Bâtir son premier fonds de sécurité et maîtriser ses finances personnelles pas à pas.',
    badgeReward: 'Bâtisseur d’Avenir 💰',
    days: [
      { day: 1, task: 'Mets de côté 500 FCFA dans une enveloppe inviolable ou un sous-compte.', completed: true },
      { day: 2, task: 'Identifie une dépense inutile évitée aujourd’hui (boisson sucrée, gadget).', completed: true },
      { day: 3, task: 'Mets de côté 500 FCFA supplémentaires.', completed: true },
      { day: 4, task: 'Note scrupuleusement chaque dépense effectuée au cours de la journée.', completed: false },
      { day: 5, task: 'Mets de côté 1 000 FCFA.', completed: false },
      { day: 6, task: 'Journée « Zéro dépense superflue » : ne dépense que pour le strict essentiel.', completed: false },
      { day: 7, task: 'Fais le total de la première semaine épargnée et félicite-toi.', completed: false },
      { day: 8, task: 'Mets de côté 500 FCFA.', completed: false },
      { day: 9, task: 'Compare les prix d’un abonnement ou d’un forfait et réduis son coût si possible.', completed: false },
      { day: 10, task: 'Mets de côté 1 000 FCFA.', completed: false },
      { day: 11, task: 'Désencombre un objet inutilisé et envisage de le vendre.', completed: false },
      { day: 12, task: 'Mets de côté 500 FCFA.', completed: false },
      { day: 13, task: 'Prépare ton repas ou ta collation au lieu de l’acheter à l’extérieur.', completed: false },
      { day: 14, task: 'Fais le point à mi-parcours : tu as déjà un joli trésor de réserve !', completed: false },
      { day: 15, task: 'Mets de côté 1 000 FCFA.', completed: false },
      { day: 16, task: 'Règle des 48h : avant tout achat non essentiel, attends 48h.', completed: false },
      { day: 17, task: 'Mets de côté 500 FCFA.', completed: false },
      { day: 18, task: 'Lis le guide financier Lumi sur la méthode des 50/30/20.', completed: false },
      { day: 19, task: 'Mets de côté 1 000 FCFA.', completed: false },
      { day: 20, task: 'Trouve une idée de micro-service ou de job étudiant pour créer un revenu.', completed: false },
      { day: 21, task: 'Bilan semaine 3 : note tes progrès sur la jauge d’épargne.', completed: false },
      { day: 22, task: 'Mets de côté 500 FCFA.', completed: false },
      { day: 23, task: 'Définis le but exact de ton épargne (ordi de cours, projet, urgence).', completed: false },
      { day: 24, task: 'Mets de côté 1 000 FCFA.', completed: false },
      { day: 25, task: 'Journée gratitude financière : apprécie ce que tu possèdes déjà.', completed: false },
      { day: 26, task: 'Mets de côté 500 FCFA.', completed: false },
      { day: 27, task: 'Partage une astuce d’économie bienveillante sur le mur Lumi.', completed: false },
      { day: 28, task: 'Mets de côté 1 000 FCFA.', completed: false },
      { day: 29, task: 'Comptabilise le magot final : tu as dépassé les 20 000 FCFA !', completed: false },
      { day: 30, task: 'Installe cette habitude pour toute l’année. Tu as l’étoffe d’un gestionnaire avisé.', completed: false },
    ],
  },
  {
    id: 'c-30-sport',
    title: '30 Jours d’Énergie, Santé & Mouvement Doux',
    category: 'sport' as const,
    description: 'Réveiller son corps en douceur : étirements, marche active et énergie sans souffrance.',
    badgeReward: 'Souffle Vital 🏃',
    days: [
      { day: 1, task: '15 minutes de marche en plein air en respirant profondément.', completed: true },
      { day: 2, task: '5 minutes d’étirements matinaux dès le réveil.', completed: true },
      { day: 3, task: 'Bois un grand verre d’eau tiède avant ton premier repas.', completed: false },
      { day: 4, task: '20 flexions (squats doux) et 10 respirations conscientes.', completed: false },
      { day: 5, task: 'Marche au lieu de prendre un transport pour un petit trajet.', completed: false },
      { day: 6, task: '10 minutes de danse sur ta musique préférée pour libérer la sérotonine.', completed: false },
      { day: 7, task: 'Jour de repos actif : auto-massage des pieds et des mollets.', completed: false },
      { day: 8, task: '3 séries de 30 secondes de gainage (planche douce).', completed: false },
      { day: 9, task: 'Monte les escaliers à pied sans prendre l’ascenseur.', completed: false },
      { day: 10, task: '20 minutes de marche rapide en écoutant un podcast Lumi.', completed: false },
      { day: 11, task: 'Étirements du dos et du cou après 2h d’écran ou de cours.', completed: false },
      { day: 12, task: '15 minutes de yoga doux ou de salutations au soleil.', completed: false },
      { day: 13, task: 'Bois 2 litres d’eau tout au long de la journée.', completed: false },
      { day: 14, task: 'Bilan mi-parcours : ressens la vigueur renouvelée de ton corps !', completed: false },
      { day: 15, task: '25 flexions et 15 pompes douces (sur les genoux ou contre un mur).', completed: false },
      { day: 16, task: '30 minutes de marche d’exploration dans ton quartier.', completed: false },
      { day: 17, task: 'Séance de respiration ventrale 432Hz pendant 7 minutes.', completed: false },
      { day: 18, task: 'Remplace une boisson sucrée par de l’eau fraîche citronnée.', completed: false },
      { day: 19, task: 'Séance de corde à sauter ou sauts sur place pendant 5 minutes.', completed: false },
      { day: 20, task: 'Étirements profonds des jambes et du bassin.', completed: false },
      { day: 21, task: '20 minutes de jogging léger ou de marche tonique.', completed: false },
      { day: 22, task: 'Dors 8h complètes en coupant les écrans 30 min avant.', completed: false },
      { day: 23, task: 'Séance d’abdominaux doux et de posture du cobra.', completed: false },
      { day: 24, task: 'Marche pieds nus dans l’herbe ou sur le sol pour t’ancrer.', completed: false },
      { day: 25, task: '2 séries de 45 secondes de chaise contre le mur.', completed: false },
      { day: 26, task: 'Prépare une assiette pleine de couleurs et de légumes frais.', completed: false },
      { day: 27, task: '30 minutes d’activité sportive intense à ton rythme.', completed: false },
      { day: 28, task: 'Séance de relaxation corporelle complète de la tête aux pieds.', completed: false },
      { day: 29, task: 'Remercie ton corps pour toute l’énergie qu’il t’a apportée ce mois-ci.', completed: false },
      { day: 30, task: 'Victoire ! Ton corps et ton esprit sont alignés et rayonnants.', completed: false },
    ],
  },
];

// 🌱 Initial Evolution Data
export const INITIAL_EVOLUTION_REPORT = {
  id: 'evo-report-init',
  date: 'Septembre 2026',
  headline: 'La Métamorphose Douce d’une Âme Courageuse',
  oneMonthAgo: 'Il y a 1 mois, le doute scolaire et la peur de ne pas être à la hauteur pesaient lourdement lors des révisions du soir.',
  sixMonthsAgo: 'Il y a 6 mois, l’isolement et le manque de clarté sur ton avenir professionnel créaient une fatigue mentale récurrente.',
  oneYearAgo: 'Il y a 1 an, tu posais timidement tes premiers mots, sans encore oser croire que tu avais en toi les ressources pour guider ta propre vie.',
  growthInsights: [
    'Tu sembles plus confiante qu’il y a trois mois dans tes prises de parole et tes écrits.',
    'Tu parles beaucoup moins de stress scolaire qu’avant et tu appliques désormais la méthode Feynman.',
    'Tu as concrétisé une discipline d’épargne remarquable pour financer ton outil de travail.',
    'Tu t’autorises enfin la douceur et la fierté sans attendre la validation extérieure.',
  ],
  celebrationMessage: 'Regarde le chemin franchi. Tu ne recules plus. Tu apprends, tu bâtis et tu rayonnes avec authenticité. ✨🌱',
};

// 📖 Mon Histoire & Moments de vie
export const INITIAL_LIFE_STORY_MOMENTS = [
  {
    id: 'story-1',
    title: 'La traversée de l’examen blanc sans céder à la panique',
    type: 'hardship_overcome' as const,
    date: '12 Juin 2026',
    description: 'Gros pic d’angoisse la veille de l’épreuve. J’ai appliqué les 5 minutes de respiration 432Hz avec Lumi, posé mes fiches et dormi 7h. Résultat : une note honorable et la fierté d’avoir gardé mon calme.',
    lumiNote: 'Ce jour-là, tu as prouvé que la sérénité est une force bien supérieure au stress.',
  },
  {
    id: 'story-2',
    title: 'Mon premier dessin partagé sur le Mur Bienveillant',
    type: 'success' as const,
    date: '28 Juillet 2026',
    description: 'J’ai osé publier « L’Arbre de Vie » réalisé sur le studio créatif. Les retours chaleureux de la communauté m’ont profondément ému(e).',
    lumiNote: 'La vulnérabilité partagée avec amour crée des ponts d’espoir indestructibles.',
  },
  {
    id: 'story-3',
    title: 'Le premier palier de 50 000 FCFA sécurisé',
    type: 'milestone' as const,
    date: '15 Août 2026',
    description: 'En coupant les petites dépenses impulsives, j’ai versé mon premier bloc d’épargne dédié pour mon ordinateur de fac.',
    lumiNote: 'La liberté financière commence par ces premiers pas méthodiques et réguliers.',
  },
  {
    id: 'story-4',
    title: 'La lettre scellée pour mon futur moi de 2027',
    type: 'key_memory' as const,
    date: '02 Septembre 2026',
    description: 'J’ai écrit mes doutes, mais surtout mes promesses de bienveillance envers moi-même.',
    lumiNote: 'Une boussole précieuse qui t’attendra patiemment pour te rappeler d’où tu viens.',
  },
];

// 🎨 Initial Portfolio Creations
export const INITIAL_PORTFOLIO_CREATIONS = [
  {
    id: 'port-1',
    title: 'L’Aurore sur la Lagune de Cotonou',
    type: 'dessin' as const,
    content: 'Dessin aux teintes chaudes dorées et pourpres symbolisant le renouveau matinal et l’espoir.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    createdAt: '10/09/2026',
    sharedToCommunity: true,
  },
  {
    id: 'port-2',
    title: 'Sous le ciel de mes doutes',
    type: 'poeme' as const,
    content: `Le vent murmure aux feuilles ce que le cœur retient,\nChaque nuit qui s’achève prépare un lendemain.\nJ’ai appris à marcher sans craindre la pénombre,\nCar la flamme en mon âme en efface les ombres. ✨`,
    createdAt: '04/09/2026',
    sharedToCommunity: true,
  },
  {
    id: 'port-3',
    title: 'Hymne à la Persévérance Douce',
    type: 'chanson' as const,
    content: `[Couplet]\nLe pas est lourd sur le chemin des cours,\nMais chaque effort construit mes futurs jours.\n[Refrain]\nRegarde devant, garde le cap serein,\nTon avenir est entre tes propres mains !\nBâtis ton rêve, pierre après pierre,\nTu as la force pour changer la terre. 🎶`,
    createdAt: '25/08/2026',
    sharedToCommunity: false,
  },
];

// 🎤 Initial Podcasts & Voice Tracks
export const INITIAL_PODCASTS = [
  {
    id: 'pod-1',
    title: 'Éveil Serein : Déposer la Pression du Jour',
    type: 'motivation' as const,
    duration: '2 min 30',
    quoteIntro: 'Une bouffée d’air pur pour commencer la journée avec clarté et bienveillance.',
    spokenScript: `Bonjour, bel esprit. Prends une longue et profonde inspiration avec moi.\n\n[pause douce]\n\nSais-tu ce qui rend cette journée si spéciale ? C'est qu'elle t'appartient entièrement. Tu n'as pas besoin de tout réussir aujourd'hui. Il te suffit de faire un petit pas, avec sincérité et amour pour toi-même.\n\n[pause douce]\n\nQuoi qu'il arrive, je suis là, et je crois infiniment en ta lumière. Passe une journée magnifique.`,
    keyTakeaway: 'Un seul petit pas avec amour suffit pour changer le cours d’une journée.',
    dateAdded: '15/09/2026',
  },
  {
    id: 'pod-2',
    title: 'L’Histoire du Baobab et de la Graine Résiliente',
    type: 'story' as const,
    duration: '3 min 15',
    quoteIntro: 'Un conte métaphorique africain sur la patience et l’enracinement des grands destins.',
    spokenScript: `Installe-toi confortablement et ferme doucement les yeux.\n\nIl était une fois, sur les terres rouges du Bénin, une petite graine emportée par l'harmattan. Elle se croyait fragile, perdue au milieu des rocailles arides. Elle voyait les grands acacias et se disait : « Je ne serai jamais à leur hauteur ».\n\n[pause douce]\n\nMais la petite graine ignorait qu'en son cœur dormait la mémoire d'un baobab millénaire. Elle a bu la moindre goutte de rosée, enfoncé silencieusement ses racines dans la terre fraîche. Des années plus tard, elle offrait son ombre immense à des générations de voyageurs.\n\nToi aussi, tu es cette graine précieuse. Ne te hâte pas. Tes racines grandissent déjà en silence.`,
    keyTakeaway: 'Les plus grands arbres ont d’abord grandi sous terre, dans le silence de la foi.',
    dateAdded: '12/09/2026',
  },
  {
    id: 'pod-3',
    title: 'Apaiser le Trac avant un Examen ou un Oral',
    type: 'meditation' as const,
    duration: '2 min 45',
    quoteIntro: 'Transformer l’angoisse en énergie positive et clarté mentale.',
    spokenScript: `Pose une main sur ta poitrine et l'autre sur ton ventre. Sens les battements réguliers de ton cœur.\n\n[pause douce]\n\nLe trac que tu ressens n'est pas le signe d'une faiblesse : c'est la preuve que tu te soucies de ce que tu fais. C'est de l'énergie brute. Transformons-la ensemble en concentration.\n\nInspire lentement sur 4 secondes... bloque 2 secondes... et expire tout doucement sur 6 secondes en relâchant les mâchoires.\n\n[pause douce]\n\nTu as révisé, tu as travaillé. Ton cerveau sait exactement quoi faire. Respire. Tu as tout ce qu'il faut en toi.`,
    keyTakeaway: 'Le trac est une énergie : canalise-le en respirant doucement.',
    dateAdded: '08/09/2026',
  },
];

// 🌍 Sagesse Africaine & Béninoise (Multilingue Fon, Yoruba, etc.)
export const AFRICAN_WISDOM_PROVERBS = [
  {
    id: 'wis-1',
    language: 'Fon (Bénin)',
    nativeText: 'Agbaza wɛ nyí dɔkun.',
    translation: 'La santé et le corps sont la vraie richesse.',
    meaning: 'Rappelle de prendre soin de son équilibre physique et mental avant toute course au succès.',
  },
  {
    id: 'wis-2',
    language: 'Fon (Bénin)',
    nativeText: 'Nǔ e a na wà sɔ́ é, wà ɛ gbe é.',
    translation: 'Ce que tu dois faire demain, prépare-le aujourd’hui avec méthode.',
    meaning: 'Éloge de la petite discipline quotidienne contre la procrastination.',
  },
  {
    id: 'wis-3',
    language: 'Yoruba (Bénin & Nigéria)',
    nativeText: 'Suru l’ere.',
    translation: 'La patience porte toujours ses fruits dorés.',
    meaning: 'Tout projet d’envergure nécessite du temps et de la persévérance silencieuse.',
  },
  {
    id: 'wis-4',
    language: 'Yoruba (Bénin & Nigéria)',
    nativeText: 'Agbajo ọwọ la fi n sọya.',
    translation: 'C’est ensemble, mains unies, que l’on bat sa poitrine avec fierté.',
    meaning: 'La solidarité communautaire et l’entraide bienveillante rendent invincibles.',
  },
  {
    id: 'wis-5',
    language: 'Proverbe Panafricain',
    nativeText: 'Si tu veux aller vite, marche seul. Si tu veux aller loin, marchons ensemble.',
    translation: 'L’élévation collective est plus durable que la gloire isolée.',
    meaning: 'Le pilier de la communauté bienveillante de Lumi.',
  },
];

// 🎁 Initial Souvenir Vault Items
export const INITIAL_SOUVENIRS = [
  {
    id: 'souv-1',
    title: 'Photo souvenir : Mon premier jour à l’université',
    type: 'photo' as const,
    content: 'Un sourire timide, un sac à dos trop grand, mais les yeux pétillants d’envie d’apprendre.',
    mediaUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    date: 'Septembre 2025',
    lockedUntil: '2028',
    tags: ['Études', 'Débuts', 'Fierté'],
  },
  {
    id: 'souv-2',
    title: 'Note vocale : Promesse d’indépendance',
    type: 'audio' as const,
    content: '« Je me promets de ne jamais abandonner mes rêves d’ordinateur et de certification d’anglais, quoi qu’en disent les autres. »',
    date: 'Juin 2026',
    lockedUntil: '2027',
    tags: ['Promesse', 'Courage'],
  },
  {
    id: 'souv-3',
    title: 'Attestation de réussite au premier examen blanc',
    type: 'reussite' as const,
    content: 'Note de 14/20 obtenue après des semaines de travail structuré.',
    date: 'Août 2026',
    tags: ['Succès', 'Travail'],
  },
];


