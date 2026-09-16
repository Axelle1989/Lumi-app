export type Role = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  audioUrl?: string;
  isCrisisResponse?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  isArchived?: boolean;
}

export interface UserMemoryItem {
  id: string;
  fact: string;
  category: 'etudes' | 'emotions' | 'relations' | 'objectifs' | 'personnel';
  dateAdded: string;
}

export type PostType = 
  | 'texte' 
  | 'poeme' 
  | 'audio' 
  | 'citation' 
  | 'histoire' 
  | 'temoignage' 
  | 'chanson' 
  | 'dessin' 
  | 'photo'
  | 'encouragement';

export type ThemeTag = 
  | 'Motivation'
  | 'Études'
  | 'Solitude'
  | 'Confiance en soi'
  | 'Famille'
  | 'Amitié'
  | 'Relations'
  | 'Développement personnel'
  | 'Créativité'
  | 'poeme'
  | 'dessin';

export interface ReactionCounts {
  love: number;     // 💛 Soutien
  warmth: number;   // 🌸 Douceur
  hope: number;     // ✨ Espoir
  strength: number; // 💪 Force
}

export interface CommunityComment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  isLumi?: boolean;
  parentId?: string;
  replies?: CommunityComment[];
  isReported?: boolean;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  type: PostType;
  theme?: ThemeTag;
  themeTag?: ThemeTag | string;
  author: string;
  authorId?: string;
  authorAvatar?: string;
  createdAt: string;
  audioUrl?: string;
  imageUrl?: string;
  drawingData?: string;
  reactions: ReactionCounts;
  comments: CommunityComment[];
  lumiComment?: string;
  isReported?: boolean;
  savedByUsers?: string[];
  groupSlug?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  emailOrPhone: string;
  bio?: string;
  avatarUrl: string;
  joinedAt: string;
  badges: string[]; // Badge IDs
  favoriteQuotes: string[];
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface EmotionalJournalEntry {
  id: string;
  date: string;
  mood: 'radieuse' | 'sereine' | 'neutre' | 'triste' | 'anxieuse' | 'rayonnant' | 'paisible' | 'melancolique' | 'anxieux' | 'epuise';
  energy?: number; // 1 to 10
  energyLevel?: number;
  stress?: number; // 1 to 10
  stressLevel?: number;
  note?: string;
  lumiAdvice?: string;
}

export interface VictoryEntry {
  id: string;
  title: string;
  date: string;
  celebrated: boolean;
}

export interface PositiveChallenge {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  points: number;
}

export interface GratitudeEntry {
  id: string;
  date: string;
  items: [string, string, string];
  lumiPraise?: string;
}

export interface FutureLetter {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  unlockDate: string; // "YYYY-MM-DD"
  isOpened: boolean;
  lumiBlessing?: string;
}

// Goals & Smart Planner
export type GoalCategory = 'personnel' | 'scolaire' | 'financier' | 'sport' | 'projet';

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate?: string;
}

export interface ScheduleItem {
  id: string;
  day: string; // e.g. "Lundi", "Quotidien"
  time?: string;
  activity: string;
}

export interface GoalItem {
  id: string;
  title: string;
  category: GoalCategory;
  targetValue?: string; // e.g. "300 000 FCFA avant juin", "16/20", "7h de sommeil"
  currentProgress: number; // 0 to 100%
  deadline?: string;
  currencyAmount?: number; // e.g. 100000 or 300000 FCFA
  savedAmount?: number;
  planSummary?: string;
  milestones: GoalMilestone[];
  schedule?: ScheduleItem[];
  lumiEncouragement?: string;
  createdAt: string;
  status: 'in_progress' | 'completed' | 'paused';
}

// AI Personal Coach Modes
export type CoachMode = 'motivation' | 'etudes' | 'organisation' | 'creativite' | 'confiance';

export interface CoachSessionMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  actionSteps?: string[];
}

// Creative Studio
export type CreativeToolType = 
  | 'image' 
  | 'poem' 
  | 'song' 
  | 'story' 
  | 'affirmations' 
  | 'drawing' 
  | 'quote_card' 
  | 'project_ideas' 
  | 'journal';

export interface GeneratedImageItem {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  caption?: string;
}

export interface CreativePiece {
  id: string;
  type: CreativeToolType;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  lumiAnalysis?: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  note?: string;
  energy?: number;
}

// Advanced Knowledge Center
export type KnowledgeTopic = 
  | 'confiance' 
  | 'stress' 
  | 'organisation' 
  | 'etudes' 
  | 'relations' 
  | 'motivation' 
  | 'finance'
  | 'finances';

export interface KnowledgeArticle {
  id: string;
  topic?: KnowledgeTopic;
  category?: string;
  title: string;
  readTime?: string;
  readTimeMinutes?: number;
  summary: string;
  content: string | string[];
  actionTakeaways?: string[];
  authorOrSource?: string;
  verifiedBy?: string;
  tags?: string[];
}

// Community challenges & Public Groups
export interface CommunityChallenge {
  id: string;
  title: string;
  theme: string;
  duration: string;
  participantsCount: number;
  description: string;
  dailyPrompt: string;
  active: boolean;
}

export interface PublicInterestGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  memberCount: number;
  rules: string;
}

export type AmbianceMode = 
  | 'calme' 
  | 'motivation' 
  | 'concentration' 
  | 'creativite' 
  | 'nuit' 
  | 'pluie' 
  | 'ocean' 
  | 'foret' 
  | 'vent' 
  | 'off';

export type ActiveTab = 
  | 'home' 
  | 'chat' 
  | 'coach' 
  | 'creativity' 
  | 'goals' 
  | 'wellness' 
  | 'knowledge' 
  | 'community' 
  | 'progress' 
  | 'dashboard' 
  | 'evolution'
  | 'portfolio'
  | 'podcasts'
  | 'letters' 
  | 'charter' 
  | 'profile';

// 🎓 Coach Études Types
export interface StudySheet {
  id: string;
  title: string;
  subject: string;
  topic: string;
  createdAt: string;
  feynmanSummary: string;
  keyConcepts: { term: string; definition: string }[];
  essentialPoints: string[];
  memoryHook: string;
  examTip: string;
  encouragement: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  title: string;
  subject?: string;
  questions: QuizQuestion[];
  lumiBonusTip?: string;
}

export interface ExamCountdown {
  id: string;
  subject: string;
  examDate: string;
  totalDays: number;
  remainingDays: number;
  keyPriority: string;
}

// 💰 Coach Finances Types
export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'logement' | 'nourriture' | 'etudes' | 'transport' | 'loisirs' | 'imprevus';
  date: string;
}

export interface SavingsChallenge {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  dailyOrWeeklyTarget: string;
  daysRemaining: number;
  icon: string;
  tips: string;
}

// 🧭 Trouver sa voie & Projet de vie Types
export interface OrientationResult {
  profileSummary: string;
  dominantStrengths: string[];
  careerPaths: {
    title: string;
    whyItFits: string;
    startingStep: string;
    growthPotential: string;
  }[];
  entrepreneurshipProject: {
    projectIdea: string;
    targetAudience: string;
    minimalViableStep: string;
  };
  lumiEncouragement: string;
}

export interface LifeProjectPlan {
  id: string;
  updatedAt: string;
  oneYearVision: string;
  fiveYearVision: string;
  deepestFears: string;
  biggestDreams: string;
  visionStatement: string;
  fearAntidotes: { fear: string; antidote: string }[];
  oneYearRoadmap: {
    theme: string;
    quarterlyMilestones: { quarter: string; objective: string; keyAction: string }[];
  };
  fiveYearHorizon: { phase: string; milestone: string }[];
  dailyRitual: string;
  lumiPledge: string;
}

// 🌱 Mon Évolution & Rétrospective Types
export interface EvolutionReport {
  id: string;
  date: string;
  headline: string;
  oneMonthAgo: string;
  sixMonthsAgo: string;
  oneYearAgo: string;
  growthInsights: string[];
  celebrationMessage: string;
}

// 🏆 Défis Personnels 30 Jours
export interface DayChallengeItem {
  day: number;
  task: string;
  completed: boolean;
  reflection?: string;
}

export interface Challenge30 {
  id: string;
  title: string;
  category: 'confiance' | 'anglais' | 'epargne' | 'sport' | 'creativite';
  description: string;
  badgeReward: string;
  days: DayChallengeItem[];
}

// 📖 Mon Histoire & Année en Résumé
export interface LifeStoryMoment {
  id: string;
  title: string;
  type: 'hardship_overcome' | 'success' | 'milestone' | 'key_memory';
  date: string;
  description: string;
  lumiNote?: string;
}

export interface AnnualRecapData {
  year: string;
  yearTitle: string;
  executiveSummary: string;
  keyStats: {
    daysOfResilience: string;
    majorBreakthrough: string;
  };
  hardshipsOvercome: string;
  triumphsToRemember: string;
  lumiLetter: string;
}

// 🎨 Portfolio Personnel
export interface PortfolioCreation {
  id: string;
  title: string;
  type: 'dessin' | 'poeme' | 'chanson' | 'histoire' | 'affirmation' | 'citation' | 'image_ia';
  content: string;
  imageUrl?: string;
  createdAt: string;
  sharedToCommunity?: boolean;
}

export type PortfolioItem = PortfolioCreation;

// 🎤 Podcasts Lumi
export interface PodcastEpisode {
  id: string;
  title: string;
  type: 'motivation' | 'story' | 'meditation' | 'recap';
  duration: string;
  quoteIntro: string;
  spokenScript: string;
  keyTakeaway: string;
  dateAdded: string;
}

// 🎁 Coffre à Souvenirs
export interface SouvenirItem {
  id: string;
  title: string;
  type: 'photo' | 'audio' | 'message' | 'reussite';
  content: string;
  mediaUrl?: string;
  audioBlobUrl?: string;
  date: string;
  lockedUntil?: string;
  tags: string[];
}

