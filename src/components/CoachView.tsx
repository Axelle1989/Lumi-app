import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Flame, 
  GraduationCap, 
  CalendarCheck, 
  Palette, 
  Smile, 
  Send, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  User, 
  RefreshCw,
  Coins,
  Compass,
  Milestone,
  MessageSquare
} from 'lucide-react';
import { CoachMode, CoachSessionMessage, GoalItem } from '../types';
import { playGentleChime } from '../utils/soundAndBreathing';
import { StudyCoachSpace } from './StudyCoachSpace';
import { FinanceCoachSpace } from './FinanceCoachSpace';
import { FindYourPathSpace } from './FindYourPathSpace';
import { LifeProjectSpace } from './LifeProjectSpace';

interface CoachViewProps {
  userGoals?: GoalItem[];
  userMemories?: string[];
  username?: string;
}

const COACH_MODES: {
  id: CoachMode;
  name: string;
  tagline: string;
  desc: string;
  icon: React.ReactNode;
  themeColor: string;
  accentBg: string;
  starterPrompt: string;
}[] = [
  {
    id: 'motivation',
    name: 'Coach Motivation',
    tagline: 'Élan, souffle & dépassement de la procrastination',
    desc: 'Pour quand l’énergie faiblit ou que tu repousses au lendemain ce qui compte pour toi.',
    icon: <Flame className="w-5 h-5" />,
    themeColor: 'text-amber-700 bg-amber-100 border-amber-300',
    accentBg: 'bg-amber-600',
    starterPrompt: 'J’ai du mal à me motiver aujourd’hui et je procrastine...',
  },
  {
    id: 'etudes',
    name: 'Coach Études & Examens',
    tagline: 'Méthodes de révision, Feynman & mémoire active',
    desc: 'Pour préparer sereinement tes devoirs, examens universitaires et concours sans paniquer.',
    icon: <GraduationCap className="w-5 h-5" />,
    themeColor: 'text-teal-700 bg-teal-100 border-teal-300',
    accentBg: 'bg-teal-700',
    starterPrompt: 'Comment puis-je réviser efficacement mes examens sans m’épuiser ?',
  },
  {
    id: 'organisation',
    name: 'Coach Organisation & Temps',
    tagline: 'Priorisation, blocs de focus & équilibre de vie',
    desc: 'Pour clarifier tes journées, poser des routines saines et éviter la surcharge mentale.',
    icon: <CalendarCheck className="w-5 h-5" />,
    themeColor: 'text-sky-700 bg-sky-100 border-sky-300',
    accentBg: 'bg-sky-700',
    starterPrompt: 'Aide-moi à organiser ma semaine pour avoir du temps pour mes cours et mon repos.',
  },
  {
    id: 'creativite',
    name: 'Coach Créativité & Projets',
    tagline: 'Libérer l’imaginaire & dépasser la peur du jugement',
    desc: 'Pour débloquer une page blanche, inventer un projet ou trouver des idées originales.',
    icon: <Palette className="w-5 h-5" />,
    themeColor: 'text-purple-700 bg-purple-100 border-purple-300',
    accentBg: 'bg-purple-700',
    starterPrompt: 'J’ai une idée de projet artistique mais j’ai peur de ne pas être à la hauteur.',
  },
  {
    id: 'confiance',
    name: 'Coach Confiance en Soi',
    tagline: 'Auto-compassion, force intérieure & audace',
    desc: 'Pour apaiser le syndrome de l’imposteur, préparer une prise de parole et croire en ta valeur.',
    icon: <Smile className="w-5 h-5" />,
    themeColor: 'text-rose-700 bg-rose-100 border-rose-300',
    accentBg: 'bg-rose-700',
    starterPrompt: 'Je doute souvent de moi et j’ai peur du jugement des autres.',
  },
];

export const CoachView: React.FC<CoachViewProps> = ({
  userGoals = [],
  userMemories = [],
  username,
}) => {
  const [coachMainTab, setCoachMainTab] = useState<'etudes' | 'finances' | 'orientation' | 'life_project' | 'chat'>('etudes');
  const [activeMode, setActiveMode] = useState<CoachMode>('motivation');
  const [messages, setMessages] = useState<CoachSessionMessage[]>([
    {
      id: 'msg-start',
      role: 'assistant',
      content: `Bonjour ${username || 'cher voyageur'} ! Je suis ton Coach Lumi spécialisé en Motivation. 🌟\n\nQu’aimerais-tu accomplir ou débloquer aujourd’hui ? Je suis là pour t’accompagner avec méthode et bienveillance.`,
      timestamp: 'À l’instant',
      actions: [
        'Identifier la plus petite action de 5 minutes',
        'Célébrer ce qui a déjà été accompli',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeModeConfig = COACH_MODES.find((m) => m.id === activeMode) || COACH_MODES[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectMode = (mode: CoachMode) => {
    setActiveMode(mode);
    const modeConfig = COACH_MODES.find((m) => m.id === mode);
    playGentleChime(480);
    setMessages([
      {
        id: 'msg-switch-' + Date.now(),
        role: 'assistant',
        content: `Mode activé : **${modeConfig?.name}** ✨\n${modeConfig?.desc}\n\nEn quoi puis-je t'aider précisément en ce moment ?`,
        timestamp: 'À l’instant',
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: CoachSessionMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: 'À l’instant',
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: activeMode,
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          username,
          userGoals,
          userMemories,
        }),
      });

      const data = await res.json();
      const assistantMsg: CoachSessionMessage = {
        id: 'coach-' + Date.now(),
        role: 'assistant',
        content: data.reply || 'Je suis à tes côtés. Faisons le prochain pas ensemble.',
        timestamp: 'À l’instant',
      };
      setMessages([...newHistory, assistantMsg]);
      playGentleChime(528);
    } catch (err) {
      console.error('Coach API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Top Coach Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-amber-100/70 border border-amber-200/80">
        <button
          onClick={() => { setCoachMainTab('etudes'); playGentleChime(528); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            coachMainTab === 'etudes'
              ? 'bg-teal-800 text-white shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-teal-300" />
          <span>🎓 Coach Études & Examens</span>
        </button>

        <button
          onClick={() => { setCoachMainTab('finances'); playGentleChime(528); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            coachMainTab === 'finances'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Coins className="w-4 h-4 text-emerald-300" />
          <span>💰 Coach Finances (FCFA)</span>
        </button>

        <button
          onClick={() => { setCoachMainTab('orientation'); playGentleChime(528); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            coachMainTab === 'orientation'
              ? 'bg-indigo-900 text-white shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Compass className="w-4 h-4 text-indigo-300" />
          <span>🧭 Trouver sa Voie</span>
        </button>

        <button
          onClick={() => { setCoachMainTab('life_project'); playGentleChime(528); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            coachMainTab === 'life_project'
              ? 'bg-amber-700 text-white shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Milestone className="w-4 h-4 text-amber-200" />
          <span>⭐ Mode Projet de Vie</span>
        </button>

        <button
          onClick={() => { setCoachMainTab('chat'); playGentleChime(528); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            coachMainTab === 'chat'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-200" />
          <span>💬 Dialoguer avec Lumi Coach</span>
        </button>
      </div>

      {/* Conditionally Render Coach Modules */}
      {coachMainTab === 'etudes' && <StudyCoachSpace username={username} />}
      {coachMainTab === 'finances' && <FinanceCoachSpace username={username} />}
      {coachMainTab === 'orientation' && <FindYourPathSpace username={username} />}
      {coachMainTab === 'life_project' && <LifeProjectSpace username={username} />}

      {coachMainTab === 'chat' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-100/90 via-orange-50 to-amber-100 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-2xs">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-semibold">
                <Brain className="w-3.5 h-3.5 text-amber-700" />
                <span>Accompagnement Personnalisé & Stratégique</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Coach Personnel IA Spécialisé
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Choisis ton mode d’accompagnement selon ton besoin du moment. Lumi adapte sa posture pour t’aider à progresser avec méthode et chaleur humaine.
              </p>
            </div>

            {/* 5 Coach Mode Selector Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-4 border-t border-amber-200/60">
              {COACH_MODES.map((mode) => {
                const active = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleSelectMode(mode.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                      active
                        ? 'bg-white border-amber-500 shadow-sm ring-2 ring-amber-500/20 scale-102'
                        : 'bg-white/80 hover:bg-white border-amber-200/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${mode.themeColor}`}>
                        {mode.icon}
                      </div>
                      {active && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">{mode.name}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5 line-clamp-2">{mode.tagline}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

      {/* Main Conversation & Goals Context Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Active Goals & Memories Sidebar */}
        <div className="space-y-4 lg:col-span-1">
          {/* Active Goals Context */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Tes Objectifs Suivis</span>
            </h3>
            {userGoals.length > 0 ? (
              <div className="space-y-2">
                {userGoals.slice(0, 4).map((g) => (
                  <div key={g.id} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                    <div className="font-bold text-slate-900 truncate">{g.title}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-600 mt-1">
                      <span>Progression</span>
                      <span className="font-bold text-amber-800">{g.currentProgress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-600">Aucun objectif actif pour l'instant.</p>
            )}
          </div>

          {/* Quick Starters */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-2xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Suggestions de questions
            </h3>
            <div className="space-y-1.5">
              {[
                activeModeConfig.starterPrompt,
                'Par quoi devrais-je commencer aujourd’hui ?',
                'Aide-moi à décomposer ce problème pas à pas.',
              ].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sug)}
                  className="w-full text-left p-2 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-100 text-[11px] text-amber-950 font-medium transition-colors"
                >
                  « {sug} »
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat Interface */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-amber-200 shadow-2xs flex flex-col h-[650px] overflow-hidden">
          {/* Coach Chat Header */}
          <div className="p-4 px-6 border-b border-amber-100 flex items-center justify-between bg-amber-50/40">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${activeModeConfig.themeColor}`}>
                {activeModeConfig.icon}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{activeModeConfig.name}</h2>
                <p className="text-[11px] text-slate-600">{activeModeConfig.tagline}</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
              Session Active
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div
                      className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                        isUser
                          ? 'bg-amber-600 text-white rounded-tr-none'
                          : 'bg-amber-50/70 text-slate-800 border border-amber-200/80 rounded-tl-none font-medium'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Action steps if provided */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 space-y-1.5">
                        <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Actions concrètes recommandées
                        </span>
                        <div className="space-y-1">
                          {msg.actions.map((act, i) => (
                            <div key={i} className="text-xs text-emerald-950 flex items-center gap-1.5 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] text-slate-600 px-1">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 max-w-md">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 text-xs text-slate-600 flex items-center gap-2 border border-amber-200">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>Lumi formule son conseil bienveillant...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 border-t border-amber-100 bg-amber-50/20">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Pose ta question à ton ${activeModeConfig.name}...`}
                className="flex-1 px-4 py-3 rounded-2xl bg-white border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="p-3 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold transition-all shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
      )}
    </div>
  );
};
