import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Sun, 
  BookHeart, 
  Sparkles, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  ArrowRight, 
  Heart,
  Smile,
  Zap,
  Flame,
  CheckCircle2,
  Calendar,
  Feather
} from 'lucide-react';
import { playBreathCue, playGentleChime } from '../utils/soundAndBreathing';
import { COMFORT_AFFIRMATIONS, INITIAL_POSITIVE_CHALLENGES } from '../data/initialData';
import { GratitudeEntry, EmotionalJournalEntry, PositiveChallenge } from '../types';

interface WellnessSpaceProps {
  onGoToChat: (initialMessage?: string) => void;
  onGoToCommunity: () => void;
}

export const WellnessSpace: React.FC<WellnessSpaceProps> = ({ onGoToChat, onGoToCommunity }) => {
  // Breathing state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathSeconds, setBreathSeconds] = useState(5);
  const [breathCycleCount, setBreathCycleCount] = useState(0);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Emotional Journal State
  const [selectedMood, setSelectedMood] = useState<'rayonnant' | 'paisible' | 'melancolique' | 'anxieux' | 'epuise'>('paisible');
  const [energyLevel, setEnergyLevel] = useState(7);
  const [stressLevel, setStressLevel] = useState(3);
  const [journalNote, setJournalNote] = useState('');
  const [journalEntries, setJournalEntries] = useState<EmotionalJournalEntry[]>(() => {
    try {
      const stored = localStorage.getItem('lumi_journal_entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [journalSavedFeedback, setJournalSavedFeedback] = useState<string | null>(null);

  // Positive Challenges State
  const [challenges, setChallenges] = useState<PositiveChallenge[]>(() => {
    try {
      const stored = localStorage.getItem('lumi_challenges');
      return stored ? JSON.parse(stored) : INITIAL_POSITIVE_CHALLENGES;
    } catch {
      return INITIAL_POSITIVE_CHALLENGES;
    }
  });

  // Gratitude state
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [savedGratitudes, setSavedGratitudes] = useState<GratitudeEntry[]>(() => {
    try {
      const stored = localStorage.getItem('lumi_gratitudes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [gratitudeFeedback, setGratitudeFeedback] = useState<string | null>(null);

  // Affirmation state
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  // Persist challenges & journal
  useEffect(() => {
    try {
      localStorage.setItem('lumi_challenges', JSON.stringify(challenges));
    } catch {}
  }, [challenges]);

  useEffect(() => {
    try {
      localStorage.setItem('lumi_journal_entries', JSON.stringify(journalEntries));
    } catch {}
  }, [journalEntries]);

  // Breathing interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'inhale') {
              setBreathPhase('exhale');
              if (!isSoundMuted) playBreathCue('exhale');
              return 5;
            } else {
              setBreathPhase('inhale');
              setBreathCycleCount((c) => c + 1);
              if (!isSoundMuted) playBreathCue('inhale');
              return 5;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBreathingActive, breathPhase, isSoundMuted]);

  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathPhase('inhale');
    setBreathSeconds(5);
    setBreathCycleCount(0);
    if (!isSoundMuted) playBreathCue('inhale');
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    playGentleChime(432);
  };

  // Toggle Challenge
  const handleToggleChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, isCompleted: !c.isCompleted } : c))
    );
    playGentleChime(528);
  };

  // Save Journal Entry
  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const praises: Record<string, string> = {
      rayonnant: "Quel bonheur de te voir rayonner ! Garde précieusement cette belle lumière.",
      paisible: "Ce calme intérieur est un trésor. Savoure chaque souffle de cette sérénité.",
      melancolique: "La mélancolie est une pluie douce qui nourrit ton âme. Prends soin de toi.",
      anxieux: "Respire profondément. Ce moment d'anxiété va passer, tu es en sécurité.",
      epuise: "Ton corps réclame du repos. Accorde-toi cette pause sans aucune culpabilité.",
    };

    const newEntry: EmotionalJournalEntry = {
      id: 'journal-' + Date.now(),
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      mood: selectedMood,
      energyLevel,
      stressLevel,
      note: journalNote.trim() || undefined,
      lumiAdvice: praises[selectedMood] || "Merci de prendre soin de ton monde intérieur.",
    };

    setJournalEntries([newEntry, ...journalEntries]);
    setJournalSavedFeedback(newEntry.lumiAdvice);
    setJournalNote('');
    playGentleChime(528);
  };

  // Submit Gratitude
  const handleSaveGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitude1.trim() && !gratitude2.trim() && !gratitude3.trim()) return;

    const praises = [
      "Quelle magnifique récolte de petites lumières ! Reconnaître ces instants simples tisse un doux bouclier de sérénité dans ton cœur. Bravo pour ce moment d'attention. ✨💛",
      "Ces trois douceurs sont précieuses. Même dans les journées les plus fraîches, tu as su trouver ces étincelles de chaleur. Prends le temps de les savourer. 🌸",
      "Merci de célébrer la vie avec autant de sincérité. Chaque gratitude est un pas vers une paix profonde et bien méritée. 🌱",
    ];
    const praise = praises[Math.floor(Math.random() * praises.length)];

    const newEntry: GratitudeEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }),
      items: [
        gratitude1 || "Une bouffée d'air frais",
        gratitude2 || "Un moment de repos bienfaisant",
        gratitude3 || "Prendre soin de moi aujourd'hui",
      ],
      lumiPraise: praise,
    };

    const updated = [newEntry, ...savedGratitudes].slice(0, 10);
    setSavedGratitudes(updated);
    try {
      localStorage.setItem('lumi_gratitudes', JSON.stringify(updated));
    } catch {}

    setGratitudeFeedback(praise);
    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    playGentleChime(528);
  };

  const handleNextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % COMFORT_AFFIRMATIONS.length);
  };

  const MOOD_OPTIONS: { id: 'rayonnant' | 'paisible' | 'melancolique' | 'anxieux' | 'epuise'; label: string; emoji: string }[] = [
    { id: 'rayonnant', label: 'Rayonnant', emoji: '🌟' },
    { id: 'paisible', label: 'Paisible', emoji: '🌸' },
    { id: 'melancolique', label: 'Mélancolique', emoji: '☁️' },
    { id: 'anxieux', label: 'Anxieux / Stressé', emoji: '⚡' },
    { id: 'epuise', label: 'Épuisé', emoji: '🍂' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fadeIn">
      {/* Top Intro */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          L'Espace Sérénité & Journal Intime
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Prends une pause hors du tumulte. Respire, sonde ta météo intérieure, relève un défi positif et laisse ton esprit retrouver son calme.
        </p>
      </div>

      {/* 1. Emotional Journaling Section (Météo intérieure) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <BookHeart className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Journal Émotionnel & Météo Intérieure</h2>
            <p className="text-xs text-slate-500">Un regard doux et sans jugement sur ton état d'esprit du jour</p>
          </div>
        </div>

        <form onSubmit={handleSaveJournal} className="space-y-4">
          {/* Mood selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Comment te sens-tu en ce moment ?</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMood(m.id)}
                  className={`p-3 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    selectedMood === m.id
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-2xs scale-102'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy & Stress Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  Niveau d'énergie
                </span>
                <span className="font-bold text-amber-800">{energyLevel} / 10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  Niveau de stress / charge mentale
                </span>
                <span className="font-bold text-amber-800">{stressLevel} / 10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Personal reflection note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Une pensée ou une note intime pour aujourd'hui (optionnelle)
            </label>
            <textarea
              rows={2}
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="Ce qui pèse sur mon esprit, ou ce qui m'a fait du bien aujourd'hui..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 text-xs font-serif leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">Enregistré localement sur ton appareil</span>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm transition-transform active:scale-98 shadow-xs flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4" />
              <span>Enregistrer ma météo</span>
            </button>
          </div>
        </form>

        {journalSavedFeedback && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs text-amber-900 uppercase tracking-wider mb-0.5">Le mot doux de Lumi</p>
              <p className="italic">{journalSavedFeedback}</p>
            </div>
          </div>
        )}
      </section>

      {/* 2. Positive Challenges of the Day */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Défis Positifs du Quotidien</h2>
              <p className="text-xs text-slate-500">De petites actions douces pour nourrir l'estime de soi</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {challenges.filter((c) => c.isCompleted).length} / {challenges.length} accomplis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => handleToggleChallenge(challenge.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                challenge.isCompleted
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/20 border-amber-200/80 hover:bg-amber-50/50'
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                  challenge.isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {challenge.isCompleted && <CheckCircle className="w-3.5 h-3.5" />}
              </button>
              <div className="flex-1">
                <div className={`text-xs font-bold ${challenge.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                  {challenge.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {challenge.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Guided Breathing Section (Cohérence Cardiaque) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Wind className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cohérence Cardiaque & Respiration Apaisante</h2>
              <p className="text-xs text-slate-500">5 secondes d'inspiration douce, 5 secondes d'expiration profonde</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              title={isSoundMuted ? "Activer les sons de transition" : "Couper le son"}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
            </button>
            {!isBreathingActive ? (
              <button
                onClick={startBreathing}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm transition-transform active:scale-98 shadow-xs"
              >
                Commencer l'exercice
              </button>
            ) : (
              <button
                onClick={stopBreathing}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs sm:text-sm transition-colors"
              >
                Terminer
              </button>
            )}
          </div>
        </div>

        {/* Visual Breathing Bubble */}
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Outer ambient glow */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                isBreathingActive
                  ? breathPhase === 'inhale'
                    ? 'scale-110 bg-amber-200/40 blur-xl'
                    : 'scale-90 bg-amber-100/30 blur-md'
                  : 'bg-amber-100/30 blur-md'
              }`}
            />

            {/* Pulsing Breathing Circle */}
            <div
              className={`w-44 h-44 sm:w-48 sm:h-48 rounded-full border-2 border-amber-300 flex flex-col items-center justify-center text-center p-4 transition-all duration-1000 shadow-md ${
                isBreathingActive
                  ? breathPhase === 'inhale'
                    ? 'scale-110 bg-linear-to-tr from-amber-200 via-amber-100 to-white text-amber-950 ring-8 ring-amber-200/40'
                    : 'scale-85 bg-linear-to-tr from-amber-100/60 to-white text-amber-900 ring-2 ring-amber-200/20'
                  : 'bg-amber-50 text-slate-600'
              }`}
            >
              {isBreathingActive ? (
                <>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
                    {breathPhase === 'inhale' ? 'Inspiration' : 'Expiration'}
                  </span>
                  <span className="text-3xl font-extrabold text-amber-900 mb-1">{breathSeconds}s</span>
                  <span className="text-xs text-amber-800/80 max-w-[130px]">
                    {breathPhase === 'inhale' ? 'Accueille l’air frais et la paix...' : 'Relâche toutes les tensions...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="text-sm font-semibold text-slate-800 mb-1">Prêt(e) à souffler ?</span>
                  <span className="text-xs text-slate-500">Clique pour débuter 2 minutes de paix</span>
                </>
              )}
            </div>
          </div>

          {isBreathingActive && (
            <div className="mt-4 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Cycles complétés : <strong>{breathCycleCount}</strong></span>
            </div>
          )}
        </div>
      </section>

      {/* 4. Gratitude Journaling Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <BookHeart className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">La Boîte à Gratitude du Jour</h2>
            <p className="text-xs text-slate-500">Nommer 3 petites choses positives transforme notre regard sur le monde</p>
          </div>
        </div>

        <form onSubmit={handleSaveGratitude} className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">1</span>
              <input
                type="text"
                value={gratitude1}
                onChange={(e) => setGratitude1(e.target.value)}
                placeholder="Ex: Le parfum d'un thé chaud ce matin..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-amber-50/40 border border-amber-200 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">2</span>
              <input
                type="text"
                value={gratitude2}
                onChange={(e) => setGratitude2(e.target.value)}
                placeholder="Ex: Le sourire ou le message d'un proche..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-amber-50/40 border border-amber-200 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">3</span>
              <input
                type="text"
                value={gratitude3}
                onChange={(e) => setGratitude3(e.target.value)}
                placeholder="Ex: Avoir pris quelques minutes pour respirer..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-amber-50/40 border border-amber-200 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">Rien n'est trop petit pour être célébré.</span>
            <button
              type="submit"
              disabled={!gratitude1.trim() && !gratitude2.trim() && !gratitude3.trim()}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-medium text-xs sm:text-sm transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4" />
              <span>Déposer mes 3 gratitudes</span>
            </button>
          </div>
        </form>

        {gratitudeFeedback && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm leading-relaxed flex items-start gap-3 animate-fadeIn">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs text-amber-800 uppercase tracking-wider mb-0.5">Le mot de Lumi</p>
              <p>{gratitudeFeedback}</p>
            </div>
          </div>
        )}

        {/* Saved gratitudes history */}
        {savedGratitudes.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tes précédentes étincelles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedGratitudes.slice(0, 4).map((entry) => (
                <div key={entry.id} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs text-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between text-amber-800/80 font-medium text-[11px]">
                    <span>{entry.date}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside">
                    {entry.items.map((item, idx) => (
                      <li key={idx} className="truncate">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 5. Daily Comfort Affirmations Card Deck */}
      <section className="p-6 sm:p-8 rounded-3xl bg-linear-to-tr from-amber-100/50 via-amber-50/80 to-white border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/70 text-amber-900 text-xs font-semibold">
            <Sun className="w-3.5 h-3.5 text-amber-700" />
            <span>Pensée réconfortante</span>
          </div>
          <p className="font-serif italic text-lg sm:text-xl text-slate-800 leading-snug">
            « {COMFORT_AFFIRMATIONS[affirmationIndex]} »
          </p>
          <p className="text-xs text-amber-800/70">— Murmure bienveillant de Lumi</p>
        </div>

        <button
          onClick={handleNextAffirmation}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 border border-amber-200 text-amber-900 font-medium text-xs sm:text-sm shadow-2xs transition-colors shrink-0"
        >
          <RefreshCw className="w-4 h-4 text-amber-600" />
          <span>Autre pensée</span>
        </button>
      </section>

      {/* 6. Creative Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => onGoToChat("J'ai écrit un poème ou un texte, j'aimerais beaucoup avoir ton regard bienveillant...")}
          className="p-5 rounded-3xl bg-white border border-amber-200/70 hover:border-amber-400/80 shadow-xs cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">Écriture créative</span>
            <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Partager un texte ou poème à Lumi</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Lumi adore écouter la poésie, les chansons et les pensées intimes sans aucun jugement.
          </p>
        </div>

        <div
          onClick={onGoToCommunity}
          className="p-5 rounded-3xl bg-white border border-amber-200/70 hover:border-amber-400/80 shadow-xs cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">Le Mur Bienveillant</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Lire les partages de la communauté</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Découvre les poèmes, musiques, dessins et messages d'espoir déposés par d'autres membres bienveillants.
          </p>
        </div>
      </div>
    </div>
  );
};
