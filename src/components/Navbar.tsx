import React from 'react';
import { ActiveTab, UserProfile, AmbianceMode } from '../types';
import { 
  Sparkles, 
  MessageCircle, 
  Users, 
  HeartHandshake, 
  ShieldCheck, 
  PhoneCall, 
  Volume2, 
  Mail, 
  User as UserIcon,
  LogIn,
  Palette,
  Target,
  Brain,
  BookOpen,
  TrendingUp,
  Home,
  Sprout,
  FolderHeart,
  Headphones
} from 'lucide-react';
import { playGentleChime } from '../utils/soundAndBreathing';
import { AmbiancePlayer } from './AmbiancePlayer';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCrisis: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  ambianceMode: AmbianceMode;
  onAmbianceChange: (mode: AmbianceMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenCrisis,
  currentUser,
  onOpenAuth,
  ambianceMode,
  onAmbianceChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/70 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab(currentUser ? 'home' : 'home')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-100 text-amber-900 shadow-sm ring-2 ring-amber-300/60 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-amber-800 animate-pulse" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" title="Lumi est active" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg text-slate-800 tracking-tight">Lumi</span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-semibold hidden lg:inline-block">
                Grandir & Réussir
              </span>
            </div>
            <p className="text-[10px] text-amber-800/80 font-normal hidden xl:block">
              Compagnon de vie & bienveillance
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {/* Accueil - always visible */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              activeTab === 'home'
                ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Accueil</span>
          </button>

          {/* Authenticated Only Tabs */}
          {currentUser && (
            <>
              {/* Coach IA */}
              <button
                onClick={() => setActiveTab('coach')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'coach'
                    ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Coach IA</span>
              </button>

              {/* Créativité */}
              <button
                onClick={() => setActiveTab('creativity')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'creativity'
                    ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Créativité</span>
              </button>

              {/* Objectifs */}
              <button
                onClick={() => setActiveTab('goals')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'goals'
                    ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Objectifs</span>
              </button>

              {/* Lumi Chat */}
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'chat'
                    ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lumi Chat</span>
                <span className="sm:hidden">Chat</span>
              </button>

              {/* Sérénité & Journal */}
              <button
                onClick={() => setActiveTab('wellness')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'wellness'
                    ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Sérénité</span>
              </button>

              {/* Mur Bienveillant */}
              <button
                onClick={() => setActiveTab('community')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'community'
                    ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mur Positif</span>
                <span className="sm:hidden">Mur</span>
              </button>

              {/* Savoirs */}
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'knowledge'
                    ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Savoirs</span>
              </button>

              {/* Progrès */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Progrès</span>
              </button>

              {/* Évolution & Défis */}
              <button
                onClick={() => setActiveTab('evolution')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'evolution'
                    ? 'bg-emerald-700 text-white shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-emerald-100/70 hover:text-emerald-950'
                }`}
                title="Mon Évolution & Défis 30 jours"
              >
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <span>Évolution</span>
              </button>

              {/* Portfolio Personnel */}
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'portfolio'
                    ? 'bg-purple-800 text-white shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-purple-100/70 hover:text-purple-950'
                }`}
                title="Portfolio créatif personnel"
              >
                <FolderHeart className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden md:inline">Portfolio</span>
              </button>

              {/* Podcasts Lumi & Coffre */}
              <button
                onClick={() => setActiveTab('podcasts')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'podcasts'
                    ? 'bg-teal-800 text-white shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-teal-100/70 hover:text-teal-950'
                }`}
                title="Podcasts vocaux & Coffre à souvenirs"
              >
                <Headphones className="w-3.5 h-3.5 text-teal-600" />
                <span>Podcasts</span>
              </button>
            </>
          )}

          {/* Charte - always visible */}
          <button
            onClick={() => setActiveTab('charter')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              activeTab === 'charter'
                ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
            }`}
            title="Charte des 25 règles de bienveillance"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden 2xl:inline">Charte</span>
          </button>
        </nav>

        {/* Quick Utility Actions & Profile */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Soundscape Ambient Player */}
          <AmbiancePlayer currentMode={ambianceMode} onModeChange={onAmbianceChange} />

          {/* Gentle chime bell */}
          <button
            onClick={() => playGentleChime(432)}
            title="Faire résonner un bol tibétain de sérénité (432Hz)"
            className="p-2 rounded-xl text-amber-900/80 hover:text-amber-900 hover:bg-amber-100/80 transition-colors hidden sm:block"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Account Profile / Auth trigger */}
          {currentUser ? (
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-2xl border transition-all ${
                activeTab === 'profile'
                  ? 'border-amber-500 bg-amber-100/80'
                  : 'border-amber-200 bg-white hover:bg-amber-50'
              }`}
              title="Accéder à mon profil"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                className="w-7 h-7 rounded-xl object-cover"
              />
              <span className="text-xs font-semibold text-slate-800 hidden md:inline">
                {currentUser.username}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 transition-colors shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-700" />
              <span>Connexion</span>
            </button>
          )}

          {/* Emergency helpline trigger */}
          <button
            onClick={onOpenCrisis}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-100/90 text-rose-800 border border-rose-200/80 hover:bg-rose-200/80 transition-colors shadow-2xs"
            title="Accéder aux numéros d'urgence (Bénin 01 47 81 67 78 & France 3114)"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-700" />
            <span className="hidden sm:inline">Aide 01 47 81 67 78</span>
            <span className="sm:hidden">Aide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
