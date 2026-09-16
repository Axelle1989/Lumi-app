import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  UserProfile, 
  UserMemoryItem, 
  AmbianceMode, 
  CommunityPost, 
  GoalItem, 
  MoodEntry,
  Badge
} from './types';
import { 
  INITIAL_PROFILE, 
  INITIAL_USER_MEMORIES, 
  INITIAL_POSTS, 
  INITIAL_GOALS,
  BADGES_CATALOG 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { PublicHome } from './components/PublicHome';
import { PrivateChat } from './components/PrivateChat';
import { CoachView } from './components/CoachView';
import { CreativitySpace } from './components/CreativitySpace';
import { GoalsPlannerSpace } from './components/GoalsPlannerSpace';
import { KnowledgeCenter } from './components/KnowledgeCenter';
import { ProgressDashboard } from './components/ProgressDashboard';
import { CommunityWall } from './components/CommunityWall';
import { WellnessSpace } from './components/WellnessSpace';
import { FutureLetterView } from './components/FutureLetterView';
import { SafetyCharter } from './components/SafetyCharter';
import { HelpCenterModal } from './components/HelpCenterModal';
import { AuthModal } from './components/AuthModal';
import { ProfileView } from './components/ProfileView';
import { EvolutionSpace } from './components/EvolutionSpace';
import { PersonalPortfolioSpace } from './components/PersonalPortfolioSpace';
import { PodcastsSpace } from './components/PodcastsSpace';
import { StudyCoachSpace } from './components/StudyCoachSpace';
import { FinanceCoachSpace } from './components/FinanceCoachSpace';
import { FindYourPathSpace } from './components/FindYourPathSpace';
import { LifeProjectSpace } from './components/LifeProjectSpace';
import { getCurrentAmbianceMode, playGentleChime } from './utils/soundAndBreathing';

export default function App() {
  // Current User Profile state (logged-in vs guest)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('lumi_user_profile');
      return stored ? JSON.parse(stored) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return currentUser ? 'home' : 'home';
  });

  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'register'>('login');
  const [chatSeedPrompt, setChatSeedPrompt] = useState<string | undefined>(undefined);
  const [ambianceMode, setAmbianceMode] = useState<AmbianceMode>(() => getCurrentAmbianceMode());

  // User Goals state
  const [goals, setGoals] = useState<GoalItem[]>(() => {
    try {
      const stored = localStorage.getItem('lumi_user_goals');
      return stored ? JSON.parse(stored) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  // User Memory state
  const [userMemories, setUserMemories] = useState<UserMemoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('lumi_user_memories');
      return stored ? JSON.parse(stored) : INITIAL_USER_MEMORIES;
    } catch {
      return INITIAL_USER_MEMORIES;
    }
  });

  // Mood history state
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
    try {
      const stored = localStorage.getItem('lumi_mood_history');
      if (stored) return JSON.parse(stored);
      return [
        { id: 'm-1', date: 'Hier', mood: 'bien', note: 'Bonne avancée sur mes révisions d’anglais' },
        { id: 'm-2', date: 'Il y a 2 jours', mood: 'tres_bien', note: 'Respiration 432Hz et calme profond' },
        { id: 'm-3', date: 'Il y a 4 jours', mood: 'moyen', note: 'Un peu fatigué par la semaine' },
      ];
    } catch {
      return [];
    }
  });

  // Community posts state
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    try {
      const stored = localStorage.getItem('lumi_community_posts');
      return stored ? JSON.parse(stored) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  // Badges state
  const [badges, setBadges] = useState<Badge[]>(() => {
    const userBadgeIds = currentUser?.badges || [];
    return BADGES_CATALOG.map((b) => ({
      ...b,
      unlocked: userBadgeIds.includes(b.id),
    }));
  });

  // Persist user profile
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lumi_user_profile', JSON.stringify(currentUser));
      // update badges
      setBadges(
        BADGES_CATALOG.map((b) => ({
          ...b,
          unlocked: (currentUser.badges || []).includes(b.id),
        }))
      );
    } else {
      localStorage.removeItem('lumi_user_profile');
      setActiveTab('home');
    }
  }, [currentUser]);

  // Persist goals
  useEffect(() => {
    localStorage.setItem('lumi_user_goals', JSON.stringify(goals));
  }, [goals]);

  // Persist memories
  useEffect(() => {
    localStorage.setItem('lumi_user_memories', JSON.stringify(userMemories));
  }, [userMemories]);

  // Persist mood history
  useEffect(() => {
    localStorage.setItem('lumi_mood_history', JSON.stringify(moodHistory));
  }, [moodHistory]);

  // Sync community posts across tabs
  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem('lumi_community_posts');
        if (stored) setCommunityPosts(JSON.parse(stored));
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleOpenLogin = () => {
    setAuthDefaultMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthDefaultMode('register');
    setIsAuthModalOpen(true);
  };

  const handleGoToChatWithPrompt = (prompt?: string) => {
    setChatSeedPrompt(prompt);
    setActiveTab('chat');
  };

  const handleGoToBreathingFromCrisis = () => {
    setIsCrisisModalOpen(false);
    setActiveTab('wellness');
  };

  // Goals handlers
  const handleAddGoal = (goal: GoalItem) => {
    setGoals((prev) => [goal, ...prev]);
  };

  const handleUpdateGoal = (updated: GoalItem) => {
    setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Memory handlers
  const handleAddMemory = (fact: string) => {
    const newMem: UserMemoryItem = {
      id: 'mem-' + Date.now(),
      fact,
      category: 'personnel',
      dateAdded: 'Aujourd’hui',
    };
    setUserMemories((prev) => [newMem, ...prev]);
  };

  const handleRemoveMemory = (id: string) => {
    setUserMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // Profile update & logout
  const handleUpdateProfile = (updated: UserProfile) => {
    setCurrentUser(updated);
    playGentleChime(528);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    playGentleChime(432);
  };

  // Share from Creative Studio directly into Community Wall
  const handleShareCreativePieceToCommunity = (
    content: string, 
    type: string, 
    title: string, 
    imageUrl?: string
  ) => {
    const typeMapping: Record<string, any> = {
      poem: 'poeme',
      song: 'chanson',
      story: 'histoire',
      affirmations: 'affirmation',
      project_ideas: 'projet',
      quote_card: 'citation',
      dessin: 'dessin',
    };

    const newPost: CommunityPost = {
      id: 'post-' + Date.now(),
      title: title || 'Création partagée avec Lumi',
      type: typeMapping[type] || 'creation',
      theme: 'Créativité',
      author: currentUser?.username || 'Axo',
      authorAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      createdAt: 'À l’instant',
      content,
      imageUrl,
      reactions: { love: 1, warmth: 2, hope: 3, strength: 1 },
      comments: [
        {
          id: 'c-lumi-' + Date.now(),
          author: 'Lumi ✨',
          content: 'Merci infiniment pour ce partage si lumineux et sincère. Chaque création apporte une touche de douceur dans notre espace. 💛✨',
          createdAt: 'À l’instant',
          isLumi: true,
        }
      ],
      lumiComment: 'Merci infiniment pour ce partage si lumineux et sincère. 💛✨',
    };

    const updated = [newPost, ...communityPosts];
    setCommunityPosts(updated);
    localStorage.setItem('lumi_community_posts', JSON.stringify(updated));
    setActiveTab('community');
    playGentleChime(528);
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          // If logged out and clicking on user-specific tabs, prompt login or route to public home
          if (!currentUser && tab !== 'home' && tab !== 'charter') {
            handleOpenLogin();
            return;
          }
          setChatSeedPrompt(undefined);
          setActiveTab(tab);
        }}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenLogin}
        ambianceMode={ambianceMode}
        onAmbianceChange={setAmbianceMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {/* PUBLIC HOME SCREEN */}
        {activeTab === 'home' && (
          <PublicHome
            onOpenLogin={handleOpenLogin}
            onOpenRegister={handleOpenRegister}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
            onOpenCharter={() => setActiveTab('charter')}
          />
        )}

        {/* 1. AI COACH VIEW */}
        {activeTab === 'coach' && (
          currentUser ? (
            <CoachView
              userGoals={goals}
              userMemories={userMemories.map((m) => m.fact)}
              username={currentUser.username}
            />
          ) : (
            <PublicHome
              onOpenLogin={handleOpenLogin}
              onOpenRegister={handleOpenRegister}
              onOpenCrisis={() => setIsCrisisModalOpen(true)}
              onOpenCharter={() => setActiveTab('charter')}
            />
          )
        )}

        {/* 2. CREATIVE STUDIO */}
        {activeTab === 'creativity' && (
          <CreativitySpace
            onShareToCommunity={handleShareCreativePieceToCommunity}
            username={currentUser?.username}
          />
        )}

        {/* 3. GOALS & SMART PLANNER */}
        {activeTab === 'goals' && (
          currentUser ? (
            <GoalsPlannerSpace
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
              username={currentUser.username}
            />
          ) : (
            <PublicHome
              onOpenLogin={handleOpenLogin}
              onOpenRegister={handleOpenRegister}
              onOpenCrisis={() => setIsCrisisModalOpen(true)}
              onOpenCharter={() => setActiveTab('charter')}
            />
          )
        )}

        {/* 4. KNOWLEDGE CENTER */}
        {activeTab === 'knowledge' && (
          <KnowledgeCenter />
        )}

        {/* 5. PROGRESS DASHBOARD */}
        {activeTab === 'dashboard' && (
          currentUser ? (
            <ProgressDashboard
              goals={goals}
              moodHistory={moodHistory}
              badges={badges}
              streakDays={7}
              onOpenGoals={() => setActiveTab('goals')}
              onOpenWellness={() => setActiveTab('wellness')}
            />
          ) : (
            <PublicHome
              onOpenLogin={handleOpenLogin}
              onOpenRegister={handleOpenRegister}
              onOpenCrisis={() => setIsCrisisModalOpen(true)}
              onOpenCharter={() => setActiveTab('charter')}
            />
          )
        )}

        {/* 6. PRIVATE CHAT WITH LUMI */}
        {activeTab === 'chat' && (
          currentUser ? (
            <PrivateChat
              onOpenCrisis={() => setIsCrisisModalOpen(true)}
              onOpenBreathing={() => setActiveTab('wellness')}
              externalSeedPrompt={chatSeedPrompt}
              username={currentUser.username}
              userMemories={userMemories}
              userGoals={goals}
              onAddMemory={handleAddMemory}
            />
          ) : (
            <PublicHome
              onOpenLogin={handleOpenLogin}
              onOpenRegister={handleOpenRegister}
              onOpenCrisis={() => setIsCrisisModalOpen(true)}
              onOpenCharter={() => setActiveTab('charter')}
            />
          )
        )}

        {/* 7. COMMUNITY WALL (100% PUBLIC, ZERO PRIVATE MESSAGING) */}
        {activeTab === 'community' && (
          <CommunityWall 
            onOpenPrivateChat={() => currentUser ? setActiveTab('chat') : handleOpenLogin()} 
            currentUser={currentUser}
          />
        )}

        {/* 8. WELLNESS & SERENITY */}
        {activeTab === 'wellness' && (
          <WellnessSpace
            onGoToChat={handleGoToChatWithPrompt}
            onGoToCommunity={() => setActiveTab('community')}
          />
        )}

        {/* 9. TIME CAPSULE (LETTERS TO FUTURE SELF) */}
        {activeTab === 'letters' && (
          <FutureLetterView
            username={currentUser?.username}
            onOpenPrivateChat={() => currentUser ? setActiveTab('chat') : handleOpenLogin()}
          />
        )}

        {/* 10. CHARTER */}
        {activeTab === 'charter' && (
          <SafetyCharter onStartChat={() => currentUser ? setActiveTab('chat') : handleOpenLogin()} />
        )}

        {/* 11. USER PROFILE */}
        {activeTab === 'profile' && (
          currentUser ? (
            <ProfileView
              profile={currentUser}
              posts={communityPosts}
              userMemories={userMemories}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
              onOpenCreatePost={() => setActiveTab('community')}
              onRemoveMemory={handleRemoveMemory}
            />
          ) : (
            <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-amber-200 text-center space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Espace Profil</h2>
              <p className="text-xs text-slate-600">Connecte-toi ou crée ton compte pour retrouver tes badges, tes créations et tes souvenirs.</p>
              <button
                onClick={handleOpenLogin}
                className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-transform active:scale-98 shadow-xs"
              >
                Rejoindre ou se connecter
              </button>
            </div>
          )
        )}

        {/* 12. EVOLUTION & 30-DAY CHALLENGES */}
        {activeTab === 'evolution' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
            <EvolutionSpace
              username={currentUser?.username}
              onOpenGoals={() => setActiveTab('goals')}
              onOpenCreativity={() => setActiveTab('creativity')}
            />
          </div>
        )}

        {/* 13. PERSONAL PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
            <PersonalPortfolioSpace
              username={currentUser?.username}
              onShareToCommunity={(item) =>
                handleShareCreativePieceToCommunity(item.content, item.type, item.title, item.imageUrl)
              }
            />
          </div>
        )}

        {/* 14. PODCASTS LUMI & SOUVENIR VAULT */}
        {activeTab === 'podcasts' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
            <PodcastsSpace username={currentUser?.username} />
          </div>
        )}

        {/* 15. DIRECT COACH ROUTINGS */}
        {activeTab === 'study' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
            <StudyCoachSpace username={currentUser?.username} />
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
            <FinanceCoachSpace username={currentUser?.username} />
          </div>
        )}

        {activeTab === 'orientation' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
            <FindYourPathSpace username={currentUser?.username} />
          </div>
        )}

        {activeTab === 'life-project' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
            <LifeProjectSpace username={currentUser?.username} />
          </div>
        )}
      </main>

      {/* Full Help Center & Crisis Hotline Modal (Benin & France) */}
      <HelpCenterModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
        onStartBreathing={handleGoToBreathingFromCrisis}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authDefaultMode}
        onSuccess={(profile) => {
          setCurrentUser(profile);
          setIsAuthModalOpen(false);
          setActiveTab('home');
          playGentleChime(528);
        }}
      />
    </div>
  );
}
