import React from 'react';
import { 
  TrendingUp, 
  Smile, 
  Target, 
  Award, 
  Calendar, 
  Coins, 
  Heart, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import { GoalItem, MoodEntry, Badge } from '../types';

interface ProgressDashboardProps {
  goals: GoalItem[];
  moodHistory: MoodEntry[];
  badges: Badge[];
  streakDays?: number;
  onOpenGoals: () => void;
  onOpenWellness: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  goals,
  moodHistory,
  badges,
  streakDays = 5,
  onOpenGoals,
  onOpenWellness,
}) => {
  const completedGoals = goals.filter((g) => g.status === 'completed' || g.currentProgress === 100);
  const activeGoals = goals.filter((g) => g.status !== 'completed' && g.currentProgress < 100);

  // Financial calculation in FCFA
  const financialGoals = goals.filter((g) => g.category === 'financier');
  const totalSaved = financialGoals.reduce((acc, g) => acc + (g.savedAmount || 0), 0);
  const totalTarget = financialGoals.reduce((acc, g) => acc + (g.currencyAmount || 0), 0);

  // Mood score average (1 to 5)
  const MOOD_SCORES: Record<string, number> = {
    tres_bien: 5,
    bien: 4,
    moyen: 3,
    triste: 2,
    anxieux: 1,
    colere: 1,
  };

  const avgMood = moodHistory.length > 0
    ? (moodHistory.reduce((acc, m) => acc + (MOOD_SCORES[m.mood] || 3), 0) / moodHistory.length).toFixed(1)
    : '4.2';

  const unlockedBadges = badges.filter((b) => b.unlocked);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-100/90 via-orange-50 to-amber-100 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-2xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
            <span>Évolution & Célébration des Progrès</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ton Tableau de Progression
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Chaque pas vers la sérénité et la réussite compte. Visualise l’harmonie de ton humeur, tes objectifs atteints et tes habitudes bienveillantes.
          </p>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Série de Bienveillance */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Série de jours actifs</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 flex items-baseline gap-1.5">
            <span>{streakDays}</span>
            <span className="text-xs font-semibold text-slate-600">jours consécutifs</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            ✨ Constance remarquable !
          </p>
        </div>

        {/* Metric 2: Objectifs Terminés */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Objectifs en route</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 flex items-baseline gap-1.5">
            <span>{activeGoals.length}</span>
            <span className="text-xs font-semibold text-slate-600">actifs ({completedGoals.length} atteints)</span>
          </div>
          <button
            onClick={onOpenGoals}
            className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
          >
            <span>Voir les détails</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 3: Épargne Cumulée (FCFA) */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Épargne sécurisée</span>
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
            {totalSaved.toLocaleString('fr-FR')} FCFA
          </div>
          <p className="text-[11px] text-slate-600">
            sur {totalTarget > 0 ? totalTarget.toLocaleString('fr-FR') : '300 000'} FCFA visés
          </p>
        </div>

        {/* Metric 4: Baromètre Intérieur */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Harmonie émotionnelle</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 flex items-baseline gap-1.5">
            <span>{avgMood} / 5</span>
            <span className="text-xs font-semibold text-emerald-700">Serein(e)</span>
          </div>
          <p className="text-[11px] text-slate-600">
            {moodHistory.length} entrées au journal météo
          </p>
        </div>
      </div>

      {/* Two Column Section: Mood History Chart & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Mood Log & Barometer */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smile className="w-4 h-4 text-amber-600" />
              <span>Historique Récent de ton Humeur</span>
            </h2>
            <button
              onClick={onOpenWellness}
              className="text-xs text-amber-800 font-bold hover:underline"
            >
              Ajouter une entrée
            </button>
          </div>

          {moodHistory.length === 0 ? (
            <p className="text-xs text-slate-600 py-6 text-center">
              Tu n’as pas encore enregistré d’humeur cette semaine. Prends un instant pour faire le point dans l’espace Bien-être !
            </p>
          ) : (
            <div className="space-y-2.5">
              {moodHistory.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {entry.mood === 'tres_bien' ? '☀️' : entry.mood === 'bien' ? '🌤️' : entry.mood === 'moyen' ? '⛅' : '🌧️'}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 capitalize">{entry.mood.replace('_', ' ')}</div>
                      {entry.note && (
                        <div className="text-[11px] text-slate-600 italic line-clamp-1">{entry.note}</div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600 font-medium">{entry.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Badges & Trophee */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Badges de Bienveillance & Réussite ({unlockedBadges.length}/{badges.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  b.unlocked
                    ? 'bg-amber-50/70 border-amber-200 text-slate-900'
                    : 'bg-slate-50 border-slate-200/80 text-slate-400 opacity-60'
                }`}
              >
                <span className="text-2xl shrink-0">{b.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{b.title}</div>
                  <div className="text-[10px] text-slate-600 line-clamp-2 mt-0.5">{b.description}</div>
                  {b.unlocked && (
                    <span className="inline-block mt-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded-sm">
                      Débloqué
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
